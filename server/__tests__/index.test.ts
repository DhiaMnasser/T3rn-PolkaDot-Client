import request from 'supertest';
import express from 'express';
import headersRouter from '../routes/headersRoute';
import merkleTreeRouter from '../routes/merkleTreeRoute';

const app = express();
app.use(express.json());
app.use('/api/headers', headersRouter);
app.use('/api/merkletrees', merkleTreeRouter);

describe('API Endpoints', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
