// 'use client';

// import { useState, useEffect } from 'react';
// import { H2 } from '@/components/text';
// import SearchFilters from './sermonFilter';
// import { YouTubeVideo } from '@/lib/types';

// export default function SermonsList() {
//   const [sermons, setSermons] = useState<YouTubeVideo[]>([]);
//   const [filteredSermons, setFilteredSermons] = useState<YouTubeVideo[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedSeries, setSelectedSeries] = useState<string>('all');
//   const [selectedPreacher, setSelectedPreacher] = useState<string>('all');

//   useEffect(() => {
//     fetchSermons();
//   }, []);

//   useEffect(() => {
//     filterSermons();
//   }, [sermons, searchTerm, selectedSeries, selectedPreacher]);

//   const fetchSermons = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/sermons');

//       if (!response.ok) throw new Error('Failed to fetch sermons');

//       const data: YouTubeVideo[] = await response.json();
//       setSermons(data);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterSermons = (): void => {
//     let filtered = sermons;

//     if (searchTerm) {
//       filtered = filtered.filter(sermon =>
//         sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sermon.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (selectedSeries !== 'all') {
//       filtered = filtered.filter(sermon =>
//         sermon.series.toLowerCase().includes(selectedSeries.toLowerCase())
//       );
//     }

//     if (selectedPreacher !== 'all') {
//       filtered = filtered.filter(sermon =>
//         sermon.preacher.toLowerCase().includes(selectedPreacher.toLowerCase())
//       );
//     }

//     setFilteredSermons(filtered);
//   };

//   const getUniqueSeries = (): string[] => {
//     const series = sermons.map(sermon => sermon.series);
//     return ['all', ...new Set(series)];
//   };

//   const getUniquePreachers = (): string[] => {
//     const preachers = sermons.map(sermon => sermon.preacher);
//     return ['all', ...new Set(preachers)];
//   };

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatViewCount = (count: string): string => {
//     return parseInt(count).toLocaleString();
//   };

//   if (loading) {
//     return (
//       <div className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center">
//             <div className="animate-pulse">
//               <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <H2>Recent Messages</H2>
//           <p className="text-xl text-gray-600 mt-4">
//             Biblical teaching from Wisdom House Ministry
//           </p>
//         </div>

//         {/* Search and Filters */}
//         <SearchFilters
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           selectedSeries={selectedSeries}
//           setSelectedSeries={setSelectedSeries}
//           selectedPreacher={selectedPreacher}
//           setSelectedPreacher={setSelectedPreacher}
//           seriesOptions={getUniqueSeries()}
//           preacherOptions={getUniquePreachers()}
//           totalSermons={filteredSermons.length}
//         />

//         {/* Sermons Grid */}
//         <div className="max-w-6xl mx-auto">
//           {filteredSermons.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg">No sermons found matching your criteria.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredSermons.map((sermon) => (
//                 <div
//                   key={sermon.id}
//                   className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   {/* Sermon Thumbnail */}
//                   <div className="h-48 relative overflow-hidden">
//                     <img
//                       src={sermon.thumbnail}
//                       alt={sermon.title}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
//                       <div className="flex gap-2">
//                         <a
//                           href={sermon.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm"
//                         >
//                           Watch Now
//                         </a>
//                         <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm backdrop-blur-sm">
//                           Listen
//                         </button>
//                       </div>
//                     </div>
//                     <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
//                       {formatViewCount(sermon.viewCount)} views
//                     </div>
//                   </div>

//                   {/* Sermon Details */}
//                   <div className="p-6">
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
//                         {sermon.series}
//                       </span>
//                       <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
//                         {sermon.preacher}
//                       </span>
//                     </div>

//                     <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
//                       {sermon.title}
//                     </h3>

//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                       {sermon.description}
//                     </p>

//                     <div className="flex items-center justify-between text-sm text-gray-500">
//                       <span>{formatDate(sermon.publishedAt)}</span>
//                       <span>{sermon.duration}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
