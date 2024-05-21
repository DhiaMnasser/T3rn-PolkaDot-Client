import { getApi } from './polkadotClient';
import { createMerkleTree } from './merkleTreeService';
import { getMerkleTrees } from './merkleTreeService';

let headers: any[] = [];

let headerMap: Map<string, any> = new Map(); 
const BATCH_SIZE = 5; 

export const listenToHeaders = async () => {
  const api = getApi();

  api.rpc.chain.subscribeNewHeads(async (header) => {
    const hash = header.hash.toHex();
    const blockNumber = header.number.toNumber();
    if (!headers.some(h => h.number === blockNumber)) {
      headers.push(header);
      headerMap.set(`hash_${hash}`, header);
      headerMap.set(`block_${blockNumber}`, header);
      console.log(`Stored header with hash: ${hash} and block number: ${blockNumber}`);
    }

    if (headers.length >= BATCH_SIZE) {
      const tree = createMerkleTree(headers);
      getMerkleTrees().push(tree);
      headers = [];
      console.log('Created and stored a new Merkle tree', tree.toString());
    }
  });
};

export const queryHeaderByHash = (hash: string) => {
  return headerMap.get(`hash_${hash}`) || null;
};

export const queryHeaderByBlockNumber = (blockNumber: number) => {
  return headerMap.get(`block_${blockNumber}`) || null;
};



export const getAllHeaderHashes = () => {
  return Array.from(headerMap.keys())
    .filter(key => key.startsWith('hash_'))
    .map(key => key.replace('hash_', ''));
};

export const getHeaderMap = () => {
  return headerMap;
};
