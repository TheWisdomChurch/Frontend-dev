/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis';
import { YouTubeVideo, YouTubeChannel } from './types';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

// Enhanced metadata extraction for your specific YouTube pattern
function extractMetadata(
  title: string,
  description: string
): { series: string; preacher: string } {
  // Default values
  let series = 'General';
  let preacher = 'Wisdom House Ministry';

  // Example: "GAINING WISDOM SERVICE | THE WISDOM CHURCH | 9TH OF NOVEMBER 2025"
  const primaryPattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/i;
  const match = title.match(primaryPattern);

  if (match) {
    const extractedSeries = match[1].trim(); // "GAINING WISDOM SERVICE"
    const extractedPreacher = match[2].trim(); // "THE WISDOM CHURCH"
    // match[3] would be the date "9TH OF NOVEMBER 2025" - we don't need it here

    // Validate and assign extracted values
    if (extractedSeries && extractedSeries.length > 3) {
      // Minimum length check
      series = extractedSeries;
    }

    if (extractedPreacher && extractedPreacher.length > 3) {
      preacher = extractedPreacher;
    }
  } else {
    // Alternative pattern: "SERIES - TITLE | PREACHER"
    const altPattern = /^(.+?)\s*-\s*(.+?)\s*\|\s*(.+)$/i;
    const altMatch = title.match(altPattern);

    if (altMatch) {
      series = altMatch[1].trim();
      preacher = altMatch[3].trim();
    } else {
      // Fallback: Extract from description
      extractFromDescription(description, { series, preacher });
    }
  }

  // Clean up the extracted values
  series = cleanSeriesName(series);
  preacher = cleanPreacherName(preacher);

  return { series, preacher };
}

// Helper function to extract metadata from description
function extractFromDescription(
  description: string,
  defaults: { series: string; preacher: string }
): void {
  const seriesPatterns = [
    /SERVICE:\s*(.+?)(?:\n|$)/i,
    /MESSAGE:\s*(.+?)(?:\n|$)/i,
    /SERIES:\s*(.+?)(?:\n|$)/i,
    /TITLE:\s*(.+?)(?:\n|$)/i,
  ];

  for (const pattern of seriesPatterns) {
    const match = description.match(pattern);
    if (match) {
      defaults.series = match[1].trim();
      break;
    }
  }

  const preacherPatterns = [
    /PREACHER:\s*(.+?)(?:\n|$)/i,
    /SPEAKER:\s*(.+?)(?:\n|$)/i,
    /PASTOR:\s*(.+?)(?:\n|$)/i,
    /MINISTER:\s*(.+?)(?:\n|$)/i,
    /BY:\s*(.+?)(?:\n|$)/i,
  ];

  for (const pattern of preacherPatterns) {
    const match = description.match(pattern);
    if (match) {
      defaults.preacher = match[1].trim();
      break;
    }
  }
}

// Clean up series names
function cleanSeriesName(series: string): string {
  return series
    .replace(/\s+/g, ' ')
    .replace(/\s*\|\s*/g, ' - ')
    .trim();
}

// Clean up preacher names
function cleanPreacherName(preacher: string): string {
  return preacher
    .replace(/\s+/g, ' ')
    .replace(/^THE\s+/i, '') // Remove "THE" from beginning
    .replace(/\s*CHURCH$/i, '') // Remove "CHURCH" from end
    .trim();
}

// Helper function to safely convert string | null | undefined to string | undefined
function safeString(value: string | null | undefined): string | undefined {
  return value || undefined;
}

// Helper function to safely convert string array | null | undefined to string[] | undefined
function safeStringArray(
  value: string[] | null | undefined
): string[] | undefined {
  return value && value.length > 0 ? value : undefined;
}

function formatDuration(duration: string | undefined | null): string {
  if (!duration) return 'N/A';

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const hours = match[1] || '0';
  const minutes = match[2] || '0';
  const seconds = match[3] || '0';

  if (parseInt(hours) > 0) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.padStart(2, '0')}`;
}

export async function getChannelInfo(): Promise<YouTubeChannel | null> {
  try {
    // Get channel by custom URL (@wisdomhousehq)
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      type: ['channel'],
      q: 'wisdomhousehq',
      maxResults: 1,
    });

    const firstItem = searchResponse.data.items?.[0];
    if (!firstItem?.id?.channelId) {
      throw new Error('Channel not found');
    }

    const channelId = firstItem.id.channelId;

    // Get channel details
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [channelId],
    });

    const channel = channelResponse.data.items?.[0];
    if (!channel) {
      throw new Error('Channel details not found');
    }

    return {
      id: channelId,
      title: channel.snippet?.title || 'Wisdom House HQ',
      description: channel.snippet?.description || '',
      thumbnail: channel.snippet?.thumbnails?.high?.url || '',
      subscriberCount: safeString(channel.statistics?.subscriberCount),
      videoCount: safeString(channel.statistics?.videoCount),
      viewCount: safeString(channel.statistics?.viewCount),
    };
  } catch (error) {
    console.error('Error fetching channel info:', error);
    return null;
  }
}

export async function getAllChannelVideos(
  maxResults: number = 500
): Promise<YouTubeVideo[]> {
  try {
    // Get channel ID first
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      type: ['channel'],
      q: 'wisdomhousehq',
      maxResults: 1,
    });

    const firstItem = searchResponse.data.items?.[0];
    const channelId = firstItem?.id?.channelId;
    if (!channelId) {
      throw new Error('Channel not found');
    }

    // Get uploads playlist ID
    const channelResponse = await youtube.channels.list({
      part: ['contentDetails'],
      id: [channelId],
    });

    const channel = channelResponse.data.items?.[0];
    const uploadsPlaylistId =
      channel?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error('Uploads playlist not found');
    }

    // Get ALL videos from uploads playlist (no limit)
    const allVideos: any[] = [];
    let nextPageToken: string | undefined;
    let pageCount = 0;

    console.log('📺 Fetching ALL videos from YouTube channel...');

    do {
      pageCount++;
      const playlistResponse = await youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: uploadsPlaylistId,
        maxResults: 50, // YouTube API max per page
        pageToken: nextPageToken,
      });

      if (playlistResponse.data.items) {
        allVideos.push(...playlistResponse.data.items);
        console.log(
          `📄 Page ${pageCount}: Fetched ${playlistResponse.data.items.length} videos (Total: ${allVideos.length})`
        );
      }

      nextPageToken = playlistResponse.data.nextPageToken || undefined;

      // Add small delay to avoid rate limiting
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } while (nextPageToken && allVideos.length < maxResults);

    console.log(
      `✅ Successfully fetched ${allVideos.length} total videos from ${pageCount} pages`
    );

    if (allVideos.length === 0) {
      return [];
    }

    // Get video IDs for detailed information
    const videoIds = allVideos
      .map(item => item.snippet?.resourceId?.videoId)
      .filter((videoId): videoId is string => !!videoId);

    console.log(
      `🔍 Fetching detailed information for ${videoIds.length} videos...`
    );

    // Get detailed video information in batches
    const videoBatches: any[] = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const batchNumber = Math.floor(i / 50) + 1;

      const videosResponse = await youtube.videos.list({
        part: ['snippet', 'contentDetails', 'statistics'],
        id: batch,
      });

      if (videosResponse.data.items) {
        videoBatches.push(...videosResponse.data.items);
        console.log(
          `📊 Batch ${batchNumber}: Processed ${videosResponse.data.items.length} videos`
        );
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Format videos data with proper typing
    const videos: YouTubeVideo[] = allVideos
      .map(playlistItem => {
        const videoId = playlistItem.snippet?.resourceId?.videoId;
        const snippet = playlistItem.snippet;

        if (!videoId || !snippet) {
          return null;
        }

        const videoDetails = videoBatches.find(video => video.id === videoId);
        const statistics = videoDetails?.statistics;
        const contentDetails = videoDetails?.contentDetails;
        const videoSnippet = videoDetails?.snippet;

        const { series, preacher } = extractMetadata(
          snippet.title || '',
          videoSnippet?.description || snippet.description || ''
        );

        // Create properly typed YouTubeVideo object with safe conversion
        const youtubeVideo: YouTubeVideo = {
          id: videoId,
          title: snippet.title || 'Untitled',
          description: videoSnippet?.description || snippet.description || '',
          thumbnail:
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            '',
          publishedAt: snippet.publishedAt || new Date().toISOString(),
          duration: formatDuration(contentDetails?.duration) || 'N/A',
          viewCount: statistics?.viewCount || '0',
          likeCount: safeString(statistics?.likeCount),
          commentCount: safeString(statistics?.commentCount),
          tags: safeStringArray(videoSnippet?.tags),
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          series,
          preacher,
        };

        return youtubeVideo;
      })
      .filter((video): video is YouTubeVideo => video !== null);

    // Sort by published date (newest first)
    const sortedVideos = videos.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    console.log(
      `🎉 Successfully processed ${sortedVideos.length} videos with metadata`
    );

    // Log some statistics about the videos
    const uniqueSeries = new Set(sortedVideos.map(v => v.series));
    const uniquePreachers = new Set(sortedVideos.map(v => v.preacher));

    console.log(`📊 Video Statistics:`);
    console.log(`   - Total videos: ${sortedVideos.length}`);
    console.log(`   - Unique series: ${uniqueSeries.size}`);
    console.log(`   - Unique preachers: ${uniquePreachers.size}`);
    console.log(
      `   - Date range: ${sortedVideos[sortedVideos.length - 1]?.publishedAt} to ${sortedVideos[0]?.publishedAt}`
    );

    return sortedVideos;
  } catch (error) {
    console.error('❌ Error fetching channel videos:', error);
    return [];
  }
}

// Utility function to get video by ID
export async function getVideoById(
  videoId: string
): Promise<YouTubeVideo | null> {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) {
      return null;
    }

    const { series, preacher } = extractMetadata(
      video.snippet?.title || '',
      video.snippet?.description || ''
    );

    return {
      id: videoId,
      title: video.snippet?.title || 'Untitled',
      description: video.snippet?.description || '',
      thumbnail: video.snippet?.thumbnails?.high?.url || '',
      publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
      duration: formatDuration(video.contentDetails?.duration) || 'N/A',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: safeString(video.statistics?.likeCount),
      commentCount: safeString(video.statistics?.commentCount),
      tags: safeStringArray(video.snippet?.tags),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      series,
      preacher,
    };
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
}
