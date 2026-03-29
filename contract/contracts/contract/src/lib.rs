#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, symbol_short, Address};

// Structure to store the overall status of the betting pool.
#[contracttype]
#[derive(Clone)]
pub struct PoolStatus {
    pub total_bet_amount: u128, // total amount of tokens in the pool
    pub ticket_price: u128,     // cost to join the pool
    pub participants_count: u64, // total number of participants
    pub is_closed: bool,        // status of the pool
}

// Struct to store individual user bet details.
#[contracttype]
#[derive(Clone)]
pub struct BetInfo {
    pub participant: Address,
    pub amount: u128,
}

// Storage keys
const POOL_STATUS: Symbol = symbol_short!("P_STATUS");
const POOL_DESC: Symbol = symbol_short!("P_DESC");

#[contracttype]
pub enum DataKey {
    Bet(Address),
}

#[contract]
pub struct BettingPoolContract;

#[contractimpl]
impl BettingPoolContract {

    /// This function initializes a new betting pool.
    pub fn create_pool(env: Env, description: String, ticket_price: u128) {
        // Ensure pool hasn't been initialized yet
        if env.storage().instance().has(&POOL_STATUS) {
            panic!("Pool already exists!");
        }

        let status = PoolStatus {
            total_bet_amount: 0,
            ticket_price,
            participants_count: 0,
            is_closed: false,
        };

        env.storage().instance().set(&POOL_STATUS, &status);
        env.storage().instance().set(&POOL_DESC, &description);
        
        log!(&env, "Betting Pool Created. Ticket Price: {}", ticket_price);
    }

    /// This function allows a user to place a bet (join the pool).
    pub fn place_bet(env: Env, participant: Address) {
        let mut status: PoolStatus = env.storage().instance().get(&POOL_STATUS).expect("Pool not initialized");
        
        if status.is_closed {
            panic!("Betting is closed!");
        }

        // Check if user already placed a bet
        let key = DataKey::Bet(participant.clone());
        if env.storage().instance().has(&key) {
            panic!("You have already placed a bet!");
        }

        // Record the bet
        let bet = BetInfo {
            participant: participant.clone(),
            amount: status.ticket_price,
        };
        env.storage().instance().set(&key, &bet);

        // Update pool status
        status.total_bet_amount += status.ticket_price;
        status.participants_count += 1;
        env.storage().instance().set(&POOL_STATUS, &status);

        log!(&env, "Bet placed by: {}. Total Participants: {}", participant, status.participants_count);
    }

    /// This function closes the pool and can be used to declare results.
    pub fn close_pool(env: Env) {
        let mut status: PoolStatus = env.storage().instance().get(&POOL_STATUS).expect("Pool not initialized");
        
        if status.is_closed {
            panic!("Pool is already closed!");
        }

        status.is_closed = true;
        env.storage().instance().set(&POOL_STATUS, &status);

        log!(&env, "Betting Pool is now CLOSED. Total Pool: {}", status.total_bet_amount);
    }

    /// Returns the current status of the betting pool.
    pub fn view_pool_status(env: Env) -> PoolStatus {
        env.storage().instance().get(&POOL_STATUS).unwrap_or(PoolStatus {
            total_bet_amount: 0,
            ticket_price: 0,
            participants_count: 0,
            is_closed: true,
        })
    }
}

mod test;
