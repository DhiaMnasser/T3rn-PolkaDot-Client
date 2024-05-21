
# Polkadot Block Header Light Client

## Project Overview
This project is a Polkadot block header light client that listens to new Polkadot headers, stores them in sequential batches inside a Merkle tree, and provides functionalities to query, generate proofs, and verify proofs.

## Install dependencies for both backend and frontend:

1. cd server
2. npm install
3. cd ../polkadot-light-client
4. npm install

## Usage Instructions

### Start the backend server:
1. cd server
2. npm run dev

### Start the frontend server:
1. cd polkadot-light-client
2. npm start

The frontend should be accessible at http://localhost:3000 and the backend at http://localhost:8080.

## Testing Instructions
1. cd server
2. npm test