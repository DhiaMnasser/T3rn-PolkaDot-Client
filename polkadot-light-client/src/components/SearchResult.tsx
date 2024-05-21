import React from 'react';

interface SearchResultProps {
  result: any;
  onClearSelection: () => void;
}

const SearchResult: React.FC<SearchResultProps> = ({ result, onClearSelection }) => {
  const header = result.header;

  return (
    <div className="flex-1 p-4">
      {/* <h2 className="text-xl mb-4">Search Result</h2> */}
      <div className="bg-white shadow-md p-4 rounded">
        <button className="bg-gray-600 text-white p-2 mb-4" onClick={onClearSelection}>
          Back
        </button>
        <h3 className="text-lg">Header</h3>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-bold">Parent Hash:</td>
              <td className="border px-4 py-2">{header.parentHash}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Number:</td>
              <td className="border px-4 py-2">{header.number}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">State Root:</td>
              <td className="border px-4 py-2">{header.stateRoot}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Extrinsics Root:</td>
              <td className="border px-4 py-2">{header.extrinsicsRoot}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Digest:</td>
              <td className="border px-4 py-2">
                <pre>{JSON.stringify(header.digest, null, 2)}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchResult;