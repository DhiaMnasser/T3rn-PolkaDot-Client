import express from 'express';
import { queryHeaderByHash } from '../services/headerService';
import { generateProof, verifyProof, getMerkleTrees } from '../services/merkleTreeService';

const router = express.Router();

router.get('/proof/generate/:hash', (req, res) => {
  const { hash } = req.params;
  const treeIndex = Number(req.query.treeIndex);

  const header = queryHeaderByHash(hash);
  if (!header) {
    return res.status(404).send({ error: 'Header not found' });
  }

  const trees = getMerkleTrees();
  if (!trees[treeIndex]) {
    return res.status(400).send({ error: 'Invalid tree index' });
  }

  const proof = generateProof(trees[treeIndex], header);

  if (proof.length == 0) {
    return res.status(400).send({ error: 'Invalid Header for this tree' });
  }
  const root = trees[treeIndex].getRoot().toString('hex');
  res.json({ proof,root });
});

router.post('/proof/verify/:hash', (req, res) => {
  const { hash } = req.params;
  const { treeIndex, proof, root } = req.body;

  const header = queryHeaderByHash(hash);
  if (!header) {
    return res.status(404).send({ error: 'Header not found' });
  }

  const trees = getMerkleTrees();
  if (!trees[treeIndex]) {
    return res.status(400).send({ error: 'Invalid tree index' });
  }

  const isValid = verifyProof(trees[treeIndex], proof, Buffer.from(root, 'hex'), header);
  res.json({ isValid });
});


router.get('/', (req, res) => {
  const trees = getMerkleTrees();
  if (trees && trees.length > 0) {
    const treeDetails = trees.map(tree => ({
      root: tree.getRoot().toString('hex'),
      leaves: tree.getLeaves().map(leaf => leaf.toString('hex')),
      layers: tree.getLayersFlat().map(layer => layer.toString('hex')),
    }));
    res.json({ trees: treeDetails });
  } else {
    res.status(404).send('Trees not found');
  }
});

export default router;
