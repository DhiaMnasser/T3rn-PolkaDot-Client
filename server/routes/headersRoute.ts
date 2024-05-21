import express from 'express';
import { getAllHeaderHashes, queryHeaderByBlockNumber, queryHeaderByHash } from '../services/headerService';
const router = express.Router();

router.get('/:param', (req, res) => {
  const { param } = req.params;
  let header;

  if (param.startsWith("0x")) {
    header = queryHeaderByHash(param);
  } else {
    header = queryHeaderByBlockNumber(Number(param));
  }

  if (header) {
    res.json({ header });
  } else {
    res.status(404).send('Header not found');
  }
});

router.get('/', (req, res) => {
  const headerHashes = getAllHeaderHashes();
  res.json({ headers: headerHashes });
});

export default router;
