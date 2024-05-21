import { ApiPromise, WsProvider } from '@polkadot/api';

let api: ApiPromise;

export const initPolkadotApi = async () => {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  api = await ApiPromise.create({ provider: wsProvider });
};

export const getApi = () => api;
