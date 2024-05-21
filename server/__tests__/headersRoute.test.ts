import request from 'supertest';
import express from 'express';
import headersRouter from '../routes/headersRoute';
import { listenToHeaders } from '../services/headerService';
import { getApi } from '../services/polkadotClient';

jest.mock('../services/polkadotClient', () => ({
  getApi: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/headers', headersRouter);

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

describe('Headers Route', () => {
  it('should return header by hash', async () => {
    const res = await request(app).get('/api/headers/0x123');
    expect(res.status).toBe(200);
    expect(res.body.header).toBeDefined();
  });

  it('should return header by block number', async () => {
    const res = await request(app).get('/api/headers/1');
    expect(res.status).toBe(200);
    expect(res.body.header).toBeDefined();
  });

  it('should return all header hashes', async () => {
    const res = await request(app).get('/api/headers');
    expect(res.status).toBe(200);
    expect(res.body.headers.length).toBeGreaterThan(0);
  });
});
