import { createMerkleTree, generateProof, verifyProof } from '../services/merkleTreeService';

describe('Merkle Tree Service', () => {
  it('should create Merkle tree', () => {
    const headers = [{ hash: '0x123' }, { hash: '0x456' }];
    const tree = createMerkleTree(headers);
    expect(tree.getLeafCount()).toBe(headers.length);
  });

  it('should generate proof', () => {
    const headers = [{ hash: '0x123' }, { hash: '0x456' }];
    const tree = createMerkleTree(headers);
    const proof = generateProof(tree, headers[0]);
    expect(proof.length).toBeGreaterThan(0);
  });

  it('should verify proof', () => {
    const headers = [{ hash: '0x123' }, { hash: '0x456' }];
    const tree = createMerkleTree(headers);
    const proof = generateProof(tree, headers[0]);
    const root = tree.getRoot();
    const isValid = verifyProof(tree, proof, root, headers[0]);
    expect(isValid).toBe(true);
  });
});
