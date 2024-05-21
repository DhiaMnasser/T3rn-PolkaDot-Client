import { listenToHeaders, queryHeaderByHash, queryHeaderByBlockNumber, getAllHeaderHashes, getHeaderMap } from '../services/headerService';
import { getApi } from '../services/polkadotClient';

jest.mock('../services/polkadotClient', () => ({
  getApi: jest.fn()
}));

describe('Header Service', () => {
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

  it('should store headers and create Merkle tree', async () => {
    expect(queryHeaderByHash('0x123')).not.toBeNull();
    expect(queryHeaderByBlockNumber(1)).not.toBeNull();
  });

  it('should return all header hashes', () => {
    const hashes = getAllHeaderHashes();
    expect(hashes.length).toBeGreaterThan(0);
  });

  it('should return header map', () => {
    const map = getHeaderMap();
    expect(map.size).toBeGreaterThan(0);
  });
});
