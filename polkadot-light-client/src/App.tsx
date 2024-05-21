import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TreeDetails from './components/TreeDetails';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';
import ReconnectingWebSocket from 'reconnecting-websocket';
import HeaderSidebar from './components/HeaderSidebar';

interface Leaf {
  hash: string;
  headerNumber: string | null;
}

interface TreeData {
  root: string;
  tree: string;
  leaves: Leaf[];
}

const App: React.FC = () => {
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [selectedTreeIndex, setSelectedTreeIndex] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedHeader, setSelectedHeader] = useState<any | null>(null);

  useEffect(() => {
    const ws = new ReconnectingWebSocket('ws://localhost:8080');

    ws.onmessage = (message) => {
      // console.log("Received message from WebSocket:", message.data);
      const data = JSON.parse(message.data);
      // console.log("Parsed data:", data);
      setTrees(data.trees);
      if (data.headers) {
        setHeaders(data.headers);
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSelectTree = (index: number) => {
    setSelectedTreeIndex(index);
    setSearchResult(null);
  };

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
    setSelectedTreeIndex(null);
  };

  const handleClearSelection = () => {
    setSelectedTreeIndex(null);
    setSearchResult(null);
    setSelectedHeader(null);
  };

  const handleSelectLeaf = (headerNumber: string) => {
    console.log('handleSelectLeaf called');
    fetch(`/api/headers/${headerNumber}`)
      .then((response) => response.json())
      .then((data) => 
        {
          setSelectedHeader(data);
  })
      .catch((error) => console.error('Error fetching header:', error));
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl">Polkadot Block Header Light Client</h1>
      </header>
      
      <SearchBar onSearchResult={handleSearchResult} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar trees={trees} onSelectTree={handleSelectTree} className="sidebar" />
        
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {searchResult ? (
            <SearchResult result={searchResult} onClearSelection={handleClearSelection} />
          ) : (
            selectedTreeIndex !== null ? (
              <TreeDetails
                tree={trees[selectedTreeIndex]}
                treeIndex={selectedTreeIndex}
                onSelectLeaf={handleSelectLeaf}
                onClearSelection={handleClearSelection}
              />
            ) : (
              <p>Select a Merkle tree to view its details.</p>
            )
          )}
          
          {selectedHeader && 
            <SearchResult result={selectedHeader} onClearSelection={handleClearSelection} />

          }
        </div>

        <HeaderSidebar headers={headers} />
      </div>
    </div>
  );
};

export default App;
