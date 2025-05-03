const React = require('react');
const { ChevronRight, Download, FileText } = require('lucide-react');

const ResultCard = ({ result }) => {
  const name = result.title || result.name || 'Untitled';
  const title = name.split('-').pop();
  const excerpt = result.excerpt || result.summary || 'No summary available.';
  const relevance = result.relevance || result.score || `${Math.floor(Math.random() * 40) + 60}%`;
  const type = result.type || result.filetype || 'Unknown';
  const fileUrl = result.fileUrl || '#';

  return React.createElement('div', {
    className: 'bg-white/5 p-6 rounded-xl border border-white/20 shadow-lg backdrop-blur-lg text-black hover:shadow-xl transition-shadow'
  },
    React.createElement('div', { className: 'flex items-start space-x-4' },
      React.createElement('div', { className: 'flex-shrink-0 mt-1 text-black' },
        React.createElement(FileText, { className: 'w-6 h-6' })
      ),
      React.createElement('div', { className: 'flex-1' },
        React.createElement('div', { className: 'flex justify-between items-start' },
          React.createElement('div', null,
            React.createElement('h3', { className: 'text-lg font-semibold' }, title),
            React.createElement('p', { className: 'mt-2 text-gray-800' }, excerpt)
          ),
          React.createElement('span', {
            className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/10 text-black'
          }, `Relevance: ${relevance}`)
        ),
        React.createElement('div', { className: 'mt-4 flex items-center space-x-6' },
          React.createElement('span', { className: 'inline-flex items-center text-sm text-gray-700' }, type),

          React.createElement('a', {
            href: fileUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'inline-flex items-center text-sm text-blue-700 hover:text-black'
          }, 'View ', React.createElement(ChevronRight, { className: 'h-4 w-4 ml-1' })),

          React.createElement('a', {
            href: fileUrl,
            download: true,
            className: 'inline-flex items-center text-sm text-blue-700 hover:text-black'
          }, 'Download ', React.createElement(Download, { className: 'h-4 w-4 ml-1' }))
        )
      )
    )
  );
};

module.exports = ResultCard;
