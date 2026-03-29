![Betting Pool Mascot](assets/mascot.png)

# Betting Pool

## Project Description
Betting Pool is a decentralized prediction and wagering platform built on the Stellar network using Soroban. It provides a transparent and trustless environment for users to participate in various betting pools. By leveraging smart contracts, the platform ensures that all rules are executed automatically and immutably, eliminating the need for centralized intermediaries. Users can create permissionless pools, set ticket prices, and join existing ones with confidence, knowing that every transaction is recorded on-chain. This project brings fairness and accessibility to the world of social wagering, empowering participants worldwide through blockchain technology.

## Project Vision
Our vision is to revolutionize social wagering by providing an immutable and open-source foundation for betting pools globally. By eliminating centralized bookmakers, we reduce fees and increase transparency, creating a more equitable landscape for participants. This project aims to impact the financial ecosystem by demonstrating the power of decentralized governance in everyday activities. We envision a future where trustless execution and on-chain clarity become the standard for all prediction-based platforms, fostering a sense of community and shared opportunity across the Stellar network and beyond.

## Software Development Plan

### 1. Smart Contract Core Logic
Develop `BettingPoolContract` with key functions: `create_pool` (initializes state), `place_bet` (records participant data), and `close_pool` (freezes activity). Use `POOL_STATUS` and `BetInfo` structures for data storage.

### 2. Security & Validation
Implement checks to prevent double-betting and ensure pools are only created once. Use Soroban's instance storage for efficient data handling.

### 3. Frontend Interface
Build a responsive UI to display active pools, ticket prices, and participation status.

### 4. Wallet Integration
Integrate Stellar-compatible wallets to allow users to sign transactions and pay for bets securely.

### 5. Testing & Optimization
Conduct unit tests for contract logic and perform end-to-end testing of the user flow on the Stellar Testnet.

### 6. Deployment
Deploy the smart contract to the Stellar Mainnet and host the frontend for public access.

## Contract Deployment Details:
- **Contract ID**: CBN57JBGP325YVQMVOKFOV5MIIVGOESMUEOZ5T6EZYCUHWAJRPDICOH6
- **Contract Screenshot**: <img width="1908" height="883" alt="image" src="https://github.com/user-attachments/assets/e6441cc2-8044-45af-827f-5e624509ae45" />

## About Me
I am a passionate blockchain developer with a background in decentralized systems and a deep interest in the Stellar ecosystem. My goal is to build tools that empower individuals through financial transparency. Having experienced the limitations of traditional wagering systems, I am dedicated to creating open-source solutions that are fair, secure, and accessible to everyone.

## Installation Guide

To get a local copy up and running, follow these simple steps.

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli)
- [Node.js & npm](https://nodejs.org/en/download/)

### Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/RavikantiAkshay/my-stellar-project.git
   ```
2. Navigate to the contract directory:
   ```bash
   cd contract
   ```
3. Build the contract:
   ```bash
   cargo build --target wasm32-unknown-unknown --release
   ```
4. Deploy the contract (to Testnet):
   ```bash
   soroban contract deploy --wasm target/wasm32-unknown-unknown/release/betting_pool.wasm --source-account <YOUR_ACCOUNT> --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
   ```
5. Navigate to the client directory and install dependencies:
   ```bash
   cd ../client
   npm install
   ```
6. Run the client:
   ```bash
   npm start
   ```
