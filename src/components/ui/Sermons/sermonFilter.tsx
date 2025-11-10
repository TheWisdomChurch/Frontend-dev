interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSeries: string;
  setSelectedSeries: (series: string) => void;
  selectedPreacher: string;
  setSelectedPreacher: (preacher: string) => void;
  seriesOptions: string[];
  preacherOptions: string[];
  totalSermons: number;
}

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedSeries,
  setSelectedSeries,
  selectedPreacher,
  setSelectedPreacher,
  seriesOptions,
  preacherOptions,
  totalSermons,
}: SearchFiltersProps) {
  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Messages
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Series Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Series
            </label>
            <select
              value={selectedSeries}
              onChange={e => setSelectedSeries(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              {seriesOptions.map(series => (
                <option key={series} value={series}>
                  {series === 'all' ? 'All Series' : series}
                </option>
              ))}
            </select>
          </div>

          {/* Preacher Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preacher
            </label>
            <select
              value={selectedPreacher}
              onChange={e => setSelectedPreacher(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              {preacherOptions.map(preacher => (
                <option key={preacher} value={preacher}>
                  {preacher === 'all' ? 'All Preachers' : preacher}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{totalSermons}</span>{' '}
              messages
            </p>
            {(searchTerm ||
              selectedSeries !== 'all' ||
              selectedPreacher !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSeries('all');
                  setSelectedPreacher('all');
                }}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium mt-1"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
