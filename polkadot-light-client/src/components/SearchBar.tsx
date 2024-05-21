import React, { useState } from 'react';

interface SearchBarProps {
  onSearchResult: (result: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResult }) => {
  const [searchParam, setSearchParam] = useState('');

  const handleSearch = () => {
    fetch(`/api/headers/${searchParam}`)
      .then(response => response.json())
      .then(data => onSearchResult(data))
      .catch(error => {
        console.error('Error:', error);
        onSearchResult(null);
      });
  };

  return (
    <div className="bg-gray-200 p-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Enter block hash or number"
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
      />
      <button className="bg-blue-600 text-white p-2 mt-2" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
