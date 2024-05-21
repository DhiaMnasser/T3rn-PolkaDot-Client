import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

let merkleTrees: MerkleTree[] = [];

export const createMerkleTree = (data: any[]) => {
  const leaves = data.map(item => keccak256(JSON.stringify(item)));
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
};


export const getMerkleTrees = () => {
  return merkleTrees;
};

export const generateProof = (tree: MerkleTree, data: any) => {
  const leaf = keccak256(JSON.stringify(data));
  return tree.getProof(leaf).map(item => ({
    position: item.position,
    data: item.data.toString('hex')
  }));
};

export const verifyProof = (tree: MerkleTree, proof: any[], root: Buffer, data: any) => {
  const leaf = keccak256(JSON.stringify(data));
  const proofBuf = proof.map(p => ({ position: p.position, data: Buffer.from(p.data, 'hex') }));
  return tree.verify(proofBuf, leaf, root);
};
