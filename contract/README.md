# Betting Pool Contract

## Project Description
Betting Pool is a decentralized prediction and wagering platform built on Stellar using Soroban.

## Key Features
- **create_pool**: Initialize a betting pool with a ticket price.
- **place_bet**: Join the pool by paying the ticket price.
- **close_pool**: Close the pool for new bets.
- **view_pool_status**: Check the current state of the pool.

## Build Instructions
To build the contract, run the following command from this directory:
```bash
stellar contract build
```

The compiled WASM file will be located in `target/wasm32-unknown-unknown/release/contract.wasm`.
