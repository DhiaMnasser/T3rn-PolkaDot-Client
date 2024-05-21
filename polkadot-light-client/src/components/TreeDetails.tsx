import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

interface Leaf {
  hash: string;
  headerNumber: string | null;
}

interface TreeData {
  root: string;
  tree: string;
  leaves: Leaf[];
}

interface TreeDetailsProps {
  tree: TreeData | null;
  treeIndex: number | null;
  onSelectLeaf: (headerNumber: string) => void;
  onClearSelection: () => void;
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const buildDynamicMerkleTree = (leaves: Leaf[], rootHash: string): TreeNode => {
  const nodes = leaves.map(leaf => ({ name: leaf.headerNumber || '' }));

  const constructTree = (nodes: TreeNode[]): TreeNode[] => {
    if (nodes.length === 1) return nodes;

    const parentNodes: TreeNode[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const leftChild = nodes[i];
      const rightChild = i + 1 < nodes.length ? nodes[i + 1] : null;
      const parentNode: TreeNode = {
        name: '',
        children: rightChild ? [leftChild, rightChild] : [leftChild],
      };
      parentNodes.push(parentNode);
    }

    return constructTree(parentNodes);
  };

  const root = constructTree(nodes)[0];
  root.name = rootHash

  return root;
};

const TreeDetails: React.FC<TreeDetailsProps> = ({ tree, treeIndex, onSelectLeaf, onClearSelection }) => {
  const [proof, setProof] = useState<any[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [param, setParam] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);

  useEffect(() => {
    if (tree && tree.leaves) {
      try {
        const dynamicTree = buildDynamicMerkleTree(tree.leaves, tree.root);
        setTreeData(dynamicTree);
        console.log('Dynamic Tree:', JSON.stringify(dynamicTree, null, 2));
      } catch (e) {
        console.error('Error constructing dynamic Merkle tree:', e);
      }
    }
  }, [tree]);

  const handleGenerateProof = () => {
    if (tree && treeIndex !== null) {
      fetch(`/api/merkletrees/proof/generate/${param}?treeIndex=${treeIndex}`, {
        method: 'GET',
      })
        .then((response) => response.json().then((data) => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
          if (status === 200 && body.proof && body.proof.length > 0) {
            setProof(body.proof);
            setError(null); 
          } else if (status === 400) {
            setProof([]);
            setError(body.error || 'Proof could not be generated for the given parameter.');
          } else {
            setProof([]);
            setError('An unexpected error occurred.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setError('An error occurred while generating the proof.');
        });
    }
  };

  const handleVerifyProof = () => {
    if (tree && treeIndex !== null) {
      const formattedProof = proof.map((p) => ({
        position: p.position,
        data: p.data,
      }));

      fetch(`/api/merkletrees/proof/verify/${param}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treeIndex: treeIndex,
          proof: formattedProof,
          root: tree.root,
        }),
      })
        .then((response) => response.json().then((data) => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
          if (status === 200) {
            setIsValid(body.isValid);
            setError(null); 
          } else {
            setError(body.error || 'Verification failed.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setError('An error occurred while verifying the proof.');
        });
    }
  };

  if (!tree) {
    return (
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white shadow-md p-4 rounded">
          <p>Select a Merkle tree to view its details.</p>
        </div>
      </main>
    );
  }

  const handleNodeClick = (nodeDatum: any) => {
    console.log('Node clicked:', nodeDatum);
    if (!nodeDatum.children || nodeDatum.children.length === 0) {
      onSelectLeaf(nodeDatum.data.name);
    }
  };

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="mb-4 bg-white shadow-md p-4 rounded">
        <button className="bg-gray-600 text-white p-2 mb-4" onClick={onClearSelection}>
          Back
        </button>
        <h2 className="text-xl mb-4">Tree Details: Tree #{treeIndex! + 1}</h2>
        <p><strong>Root Hash:</strong> {tree.root}</p> 
      </div>

      <div className="mb-4 bg-white shadow-md p-4 rounded">
        <h3 className="text-lg">Generate Merkle Proof</h3>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter block hash or number"
          value={param}
          onChange={(e) => setParam(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white p-2 mt-2"
          onClick={handleGenerateProof}
        >
          Generate Proof
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {proof.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg">Generated Proof:</h4>
            <pre>{JSON.stringify(proof, null, 2)}</pre>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg">Verify Merkle Proof</h3>
          <button
            className="bg-blue-600 text-white p-2 mt-2"
            onClick={handleVerifyProof}
          >
            Verify Proof
          </button>
          {isValid !== null && (
            <div className="mt-4">
              <h4 className="text-lg">Proof Verification Result:</h4>
              <p>{isValid ? 'Valid' : 'Invalid'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg">Tree Visualization</h3>
        {treeData && (
          <div className="tree-container" style={{ width: '100%', height: '500px' }}>
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: 200, y: 100 }}
              pathFunc="straight"
              onNodeClick={handleNodeClick}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default TreeDetails;
