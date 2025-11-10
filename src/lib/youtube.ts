// import { google } from 'googleapis';
// import { YouTubeVideo, YouTubeChannel } from './types';

// const youtube = google.youtube({
//   version: 'v3',
//   auth: process.env.YOUTUBE_API_KEY
// });

// export async function getChannelInfo(): Promise<YouTubeChannel | null> {
//   try {
//     // Get channel by custom URL (@wisdomhousehq)
//     const searchResponse = await youtube.search.list({
//       part: ['snippet'],
//       type: ['channel'],
//       q: 'wisdomhousehq',
//       maxResults: 1
//     });

//     const firstItem = searchResponse.data.items?.[0];
//     if (!firstItem?.id?.channelId) {
//       throw new Error('Channel not found');
//     }

//     const channelId = firstItem.id.channelId;

//     // Get channel details
//     const channelResponse = await youtube.channels.list({
//       part: ['snippet', 'statistics', 'contentDetails'],
//       id: [channelId]
//     });

//     const channel = channelResponse.data.items?.[0];
//     if (!channel) {
//       throw new Error('Channel details not found');
//     }

//     return {
//       id: channelId,
//       title: channel.snippet?.title || 'Wisdom House HQ',
//       description: channel.snippet?.description || '',
//       thumbnail: channel.snippet?.thumbnails?.high?.url || '',
//       subscriberCount: channel.statistics?.subscriberCount || undefined,
//       videoCount: channel.statistics?.videoCount || undefined,
//       viewCount: channel.statistics?.viewCount || undefined
//     };
//   } catch (error) {
//     console.error('Error fetching channel info:', error);
//     return null;
//   }
// }

// export async function getAllChannelVideos(maxResults: number = 50): Promise<YouTubeVideo[]> {
//   try {
//     // Get channel ID first
//     const searchResponse = await youtube.search.list({
//       part: ['snippet'],
//       type: ['channel'],
//       q: 'wisdomhousehq',
//       maxResults: 1
//     });

//     const firstItem = searchResponse.data.items?.[0];
//     const channelId = firstItem?.id?.channelId;
//     if (!channelId) {
//       throw new Error('Channel not found');
//     }

//     // Get uploads playlist ID
//     const channelResponse = await youtube.channels.list({
//       part: ['contentDetails'],
//       id: [channelId]
//     });

//     const channel = channelResponse.data.items?.[0];
//     const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
//     if (!uploadsPlaylistId) {
//       throw new Error('Uploads playlist not found');
//     }

//     // Get all videos from uploads playlist
//     const playlistResponse = await youtube.playlistItems.list({
//       part: ['snippet'],
//       playlistId: uploadsPlaylistId,
//       maxResults: maxResults
//     });

//     if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
//       return [];
//     }

//     // Get video IDs for detailed information
//     const videoIds = playlistResponse.data.items
//       .map(item => item.snippet?.resourceId?.videoId)
//       .filter((videoId): videoId is string => !!videoId);

//     // Get detailed video information
//     const videosResponse = await youtube.videos.list({
//       part: ['snippet', 'contentDetails', 'statistics'],
//       id: videoIds
//     });

//     // Format videos data
//     const videos: YouTubeVideo[] = playlistResponse.data.items.map((playlistItem) => {
//       const videoId = playlistItem.snippet?.resourceId?.videoId;
//       const snippet = playlistItem.snippet;

//       if (!videoId || !snippet) {
//         return null;
//       }

//       const videoDetails = videosResponse.data.items?.find(video => video.id === videoId);
//       const statistics = videoDetails?.statistics;
//       const contentDetails = videoDetails?.contentDetails;

//       return {
//         id: videoId,
//         title: snippet.title || 'Untitled',
//         description: snippet.description || '',
//         thumbnail: snippet.thumbnails?.high?.url ||
//                   snippet.thumbnails?.medium?.url ||
//                   snippet.thumbnails?.default?.url || '',
//         publishedAt: snippet.publishedAt || new Date().toISOString(),
//         duration: formatDuration(contentDetails?.duration) || 'N/A',
//         viewCount: statistics?.viewCount || '0',
//         likeCount: statistics?.likeCount || undefined,
//         commentCount: statistics?.commentCount || undefined,
//         tags: videoDetails?.snippet?.tags || undefined,
//         url: `https://www.youtube.com/watch?v=${videoId}`,
//         embedUrl: `https://www.youtube.com/embed/${videoId}`
//       };
//     }).filter((video): video is YouTubeVideo => video !== null);

//     return videos;
//   } catch (error) {
//     console.error('Error fetching channel videos:', error);
//     return [];
//   }
// }

// function formatDuration(duration: string | undefined | null): string {
//   if (!duration) return 'N/A';

//   const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
//   if (!match) return duration;

//   const hours = match[1] || '0';
//   const minutes = match[2] || '0';
//   const seconds = match[3] || '0';

//   if (parseInt(hours) > 0) {
//     return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
//   }

//   return `${minutes}:${seconds.padStart(2, '0')}`;
// }
