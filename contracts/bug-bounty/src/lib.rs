#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Vec};

// ─── Types ────────────────────────────────────────────────────────────

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub enum BountyStatus {
    Open,
    InReview,
    Closed,
    Rewarded,
}

#[derive(Clone)]
#[contracttype]
pub struct Submission {
    pub hunter: Address,
    pub report_hash: String,
    pub description: String,
    pub status: BountyStatus,
    pub submitted_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct Bounty {
    pub id: String,
    pub creator: Address,
    pub contract_address: String,
    pub title: String,
    pub description: String,
    pub reward: i128,
    pub token: Address,
    pub status: BountyStatus,
    pub submissions: Vec<Submission>,
    pub created_at: u64,
    pub updated_at: u64,
}

// ─── Contract ─────────────────────────────────────────────────────────

#[contract]
pub struct BugBounty;

#[contractimpl]
impl BugBounty {
    /// Create a new bug bounty
    pub fn create_bounty(
        env: Env,
        creator: Address,
        contract_address: String,
        title: String,
        description: String,
        reward: i128,
        token: Address,
    ) -> String {
        creator.require_auth();

        let bounty_count_key = symbol_short!("bty_count");
        let mut count: u32 = env
            .storage()
            .persistent()
            .get(&bounty_count_key)
            .unwrap_or(0);

        count += 1;

        // Build bounty ID without format! macro (no_std)
        let mut id = String::from_str(&env, "BTY-");
        let count_str = {
            let s = if count < 10 {
                [b'0', (count as u8 + b'0')]
            } else {
                [(count / 10) as u8 + b'0', (count % 10) as u8 + b'0']
            };
            String::from_bytes(&env, &s)
        };
        id.push_str(&count_str);

        let now = env.ledger().timestamp();

        let bounty = Bounty {
            id: id.clone(),
            creator,
            contract_address,
            title,
            description,
            reward,
            token,
            status: BountyStatus::Open,
            submissions: Vec::new(&env),
            created_at: now,
            updated_at: now,
        };

        env.storage().persistent().set(&id, &bounty);
        env.storage().persistent().set(&bounty_count_key, &count);

        id
    }

    /// Submit a bug report for a bounty
    pub fn submit_report(
        env: Env,
        bounty_id: String,
        hunter: Address,
        report_hash: String,
        description: String,
    ) {
        hunter.require_auth();

        let mut bounty: Bounty = env
            .storage()
            .persistent()
            .get(&bounty_id)
            .expect("Bounty not found");

        assert!(bounty.status == BountyStatus::Open, "Bounty is not open");

        let submission = Submission {
            hunter,
            report_hash,
            description,
            status: BountyStatus::InReview,
            submitted_at: env.ledger().timestamp(),
        };

        bounty.submissions.push_back(submission);
        bounty.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&bounty_id, &bounty);
    }

    /// Approve a report and reward the hunter
    pub fn approve_report(
        env: Env,
        bounty_id: String,
        report_hash: String,
        hunter: Address,
    ) {
        let mut bounty: Bounty = env
            .storage()
            .persistent()
            .get(&bounty_id)
            .expect("Bounty not found");

        bounty.creator.require_auth();

        // Find and update the submission
        for i in 0..bounty.submissions.len() {
            if let Some(sub) = bounty.submissions.get(i) {
                if sub.hunter == hunter && sub.report_hash == report_hash {
                    let approved_sub = Submission {
                        status: BountyStatus::Rewarded,
                        ..sub
                    };
                    bounty.submissions.set(i, approved_sub);
                    break;
                }
            }
        }

        // Transfer reward tokens to hunter using token contract
        let token_client = token::Client::new(&env, &bounty.token);
        token_client.transfer(&bounty.creator, &hunter, &bounty.reward);

        bounty.status = BountyStatus::Rewarded;
        bounty.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&bounty_id, &bounty);
    }

    /// Close a bounty
    pub fn close_bounty(env: Env, bounty_id: String) {
        let mut bounty: Bounty = env
            .storage()
            .persistent()
            .get(&bounty_id)
            .expect("Bounty not found");

        bounty.creator.require_auth();
        bounty.status = BountyStatus::Closed;
        bounty.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&bounty_id, &bounty);
    }

    /// Get bounty details
    pub fn get_bounty(env: Env, bounty_id: String) -> Option<Bounty> {
        env.storage()
            .persistent()
            .get::<String, Bounty>(&bounty_id)
    }
}

// ─── Tests ────────────────────────────────────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{Address, Env, String};

    #[test]
    fn test_create_bounty() {
        let env = Env::default();
        let contract_id = env.register(BugBounty, ());
        let client = BugBountyClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let token = Address::generate(&env);

        let bounty_id = client.create_bounty(
            &creator,
            &String::from_str(&env, "C...ABC"),
            &String::from_str(&env, "Find reentrancy bugs"),
            &String::from_str(&env, "Bug bounty for reentrancy vulnerabilities"),
            &100_000_000,
            &token,
        );

        let bounty = client.get_bounty(&bounty_id);
        assert!(bounty.is_some());
        assert_eq!(bounty.unwrap().status, BountyStatus::Open);
    }
}
