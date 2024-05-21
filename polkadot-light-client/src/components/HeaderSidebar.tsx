import React from 'react';
import { trimHash } from '../utils/utils';
interface HeaderSidebarProps {
  headers: string[];
}

const HeaderSidebar: React.FC<HeaderSidebarProps> = ({ headers }) => {

  const handleHeaderClick = (header: string) => {
    navigator.clipboard.writeText(header).then(() => {
      alert('Header hash copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy header hash:', err);
    });
    // onSelectHeader(header);
  };
  return (
    <div className="w-64 h-full p-4 overflow-y-auto sidebar" style={{ backgroundImage: 'linear-gradient(300deg, #22a5ff, #66ecff 34%, #b0d0f7 55%, #f3b9f1 78%, #9053bf)' }}>
      <h2 className="text-xl font-bold mb-4 text-white">Headers</h2>
      <ul className="space-y-2">
        {headers.map((header, index) => (
          <li
            key={index}
            onClick={() => handleHeaderClick(header)}
            className="bg-blue-400 rounded-lg p-2 hover:bg-blue-700 transition duration-300 ease-in-out text-white"
          >
            {trimHash(header)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderSidebar;