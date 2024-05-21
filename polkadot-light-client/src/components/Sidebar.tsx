import React from 'react';

interface Leaf {
  hash: string;
  headerNumber: string | null;
}

interface TreeData {
  root: string;
  tree: string;
  leaves: Leaf[];
}

interface SidebarProps {
  trees: TreeData[];
  onSelectTree: (index: number) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ trees, onSelectTree, className }) => {
  return (
    <div className={`w-64 h-full p-4 overflow-y-auto ${className}`} style={{ backgroundImage: 'linear-gradient(70deg, #22a5ff, #66ecff 34%, #b0d0f7 55%, #f3b9f1 78%, #9053bf)' }}>
      <h2 className="text-xl font-bold mb-4 text-white">Merkle Trees</h2>
      <ul className="space-y-2">
        {trees.map((tree, index) => (
          <li
            key={index}
            onClick={() => onSelectTree(index)}
            className="cursor-pointer bg-blue-400 rounded-lg p-2 hover:bg-blue-700 transition duration-300 ease-in-out text-white"
          >
            Tree {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
