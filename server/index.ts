import express from 'express';
import { createServer } from 'http';
import { Server } from 'ws';
import { initPolkadotApi } from './services/polkadotClient';
import { listenToHeaders, getAllHeaderHashes, getHeaderMap } from './services/headerService';
import { getMerkleTrees } from './services/merkleTreeService';
import headersRouter from './routes/headersRoute';
import merkleTreeRouter from './routes/merkleTreeRoute';
import keccak256 from 'keccak256';

const app = express();
const PORT = 8080;

const server = createServer(app);
const wss = new Server({ server });

app.use(express.json());
app.use('/api/headers', headersRouter);
app.use('/api/merkletrees', merkleTreeRouter);

const startServer = async () => {
  await initPolkadotApi();
  listenToHeaders();
  
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};


const bufferToHexString = (buffer: Buffer): string => {
  return buffer.toString('hex');
};

wss.on('connection', ws => {
  console.log('Client connected');

  const sendTreeData = () => {
    const trees = getMerkleTrees();
    const headers = getAllHeaderHashes();
    const headerMap = getHeaderMap();

    const treeData = trees.map(tree => ({
      root: bufferToHexString(tree.getRoot()),
      tree: JSON.stringify(tree.toString()),
      leaves: tree.getLeaves().map((leaf: any) => {
        const hash = bufferToHexString(leaf);
        const header = Array.from(headerMap.values()).find(h => keccak256(JSON.stringify(h)).toString('hex') === hash);
        return {
          hash,
          headerNumber: header ? header.number.toString() : null
        };
      }),
    }));
    ws.send(JSON.stringify({ trees: treeData, headers }));
  };

  sendTreeData();

  const intervalId = setInterval(sendTreeData, 5000);

  ws.on('close', () => {
    clearInterval(intervalId);
    console.log('Client disconnected');
  });
});

startServer().catch(error => {
  console.error('Error starting server:', error);
});

export default app;