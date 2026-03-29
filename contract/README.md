<<<<<<< HEAD
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
=======
# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:

```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

- New Soroban contracts can be put in `contracts`, each in their own directory. There is already a `hello_world` contract in there to get you started.
- If you initialized this project with any other example contracts via `--with-example`, those contracts will be in the `contracts` directory as well.
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.
- Frontend libraries can be added to the top-level directory as well. If you initialized this project with a frontend template via `--frontend-template` you will have those files already included.
>>>>>>> 3e8771c669e8bb6a62547a91e76354cfe425a9fa
