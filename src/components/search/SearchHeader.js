const React = require('react');
const { Search } = require('lucide-react');

const SearchHeader = ({ searchQuery, setSearchQuery, handleSearch, handleKeyDown }) => {
  return React.createElement('div', { className: 'text-center mb-16' },
    React.createElement('h1', { className: 'text-4xl font-bold text-gray-900 mb-6' }, 'What do you want to search?'),
    React.createElement('div', { className: 'max-w-2xl mx-auto relative' },
      React.createElement('input', {
        type: 'text',
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: 'Ask anything about constitutional documents...',
        className: 'w-full px-6 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg',
        autoFocus: true
      }),
      React.createElement('button', {
        onClick: handleSearch,
        className: 'absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none'
      }, React.createElement(Search, { className: 'h-6 w-6' }))
    )
  );
};

module.exports = SearchHeader;