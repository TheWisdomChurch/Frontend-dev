// import { NextApiRequest, NextApiResponse } from 'next';
// import { getChannelVideos } from '@/lib/youtube';
// import { YouTubeVideo } from '@/lib/types';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { search, series, preacher } = req.query;
//     console.log('Fetching sermons with filters:', { search, series, preacher });

//     let videos: YouTubeVideo[] = await getChannelVideos(50);

//     // Apply filters
//     if (search && typeof search === 'string') {
//       videos = videos.filter(video =>
//         video.title.toLowerCase().includes(search.toLowerCase()) ||
//         video.description.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (series && series !== 'all' && typeof series === 'string') {
//       videos = videos.filter(video =>
//         video.series.toLowerCase().includes(series.toLowerCase())
//       );
//     }

//     if (preacher && preacher !== 'all' && typeof preacher === 'string') {
//       videos = videos.filter(video =>
//         video.preacher.toLowerCase().includes(preacher.toLowerCase())
//       );
//     }

//     console.log(`Returning ${videos.length} filtered videos`);
//     res.status(200).json(videos);

//   } catch (error) {
//     console.error('API Error:', error);
//     res.status(500).json({
//       message: 'Error fetching sermons',
//       error: (error as Error).message
//     });
//   }
// }
