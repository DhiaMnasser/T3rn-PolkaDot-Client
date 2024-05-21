import request from 'supertest';
import express from 'express';
import merkleTreeRouter from '../routes/merkleTreeRoute';
import { listenToHeaders } from '../services/headerService';
import { getApi } from '../services/polkadotClient';
import { getMerkleTrees, createMerkleTree } from '../services/merkleTreeService';

jest.mock('../services/polkadotClient', () => ({
  getApi: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/merkletrees', merkleTreeRouter);

beforeAll(async () => {
  const mockApi = {
    rpc: {
      chain: {
        subscribeNewHeads: jest.fn((callback) => {
          callback({
            hash: {
              toHex: () => '0x123',
            },
            number: {
              toNumber: () => 1,
            },
          });
        }),
      },
    },
  };

  (getApi as jest.Mock).mockReturnValue(mockApi);
  await listenToHeaders();
});

describe('Merkle Tree Route', () => {
  beforeAll(() => {
    const headers = [
      { hash: { toHex: () => '0x123' }, number: { toNumber: () => 1 } },
      { hash: { toHex: () => '0x124' }, number: { toNumber: () => 2 } },
      { hash: { toHex: () => '0x125' }, number: { toNumber: () => 3 } },
      { hash: { toHex: () => '0x126' }, number: { toNumber: () => 4 } },
      { hash: { toHex: () => '0x127' }, number: { toNumber: () => 5 } },
    ];
    const tree = createMerkleTree(headers);
    getMerkleTrees().push(tree);
  });

  it('should return all Merkle trees', async () => {
    const res = await request(app).get('/api/merkletrees');
    console.log('GET /api/merkletrees response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.trees.length).toBeGreaterThan(0);
  });

  it('should generate a proof for a given header', async () => {
    const res = await request(app).get('/api/merkletrees/proof/generate/0x123?treeIndex=0');
    console.log('GET /api/merkletrees/proof/generate/0x123 response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.proof).toBeDefined();
    expect(res.body.root).toBeDefined(); 
  });

  it('should verify a proof for a given header', async () => {
    const proofRes = await request(app).get('/api/merkletrees/proof/generate/0x123?treeIndex=0');
    const proof = proofRes.body.proof;
    const root = proofRes.body.root;
    console.log('Generated proof:', proof);
    console.log('Root:', root);

    const verifyRes = await request(app)
      .post('/api/merkletrees/proof/verify/0x123')
      .send({
        treeIndex: 0,
        proof,
        root,
      });

    console.log('POST /api/merkletrees/proof/verify/0x123 response:', verifyRes.body);
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.isValid).toBe(true);
  });
});
