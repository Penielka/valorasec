#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

// ─── Types ────────────────────────────────────────────────────────────

#[derive(Clone)]
#[contracttype]
pub struct Badge {
    pub id: String,
    pub name: String,
    pub description: String,
    pub earned_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct Profile {
    pub address: Address,
    pub name: String,
    pub contribution_score: u32,
    pub audit_score: u32,
    pub badges: Vec<Badge>,
    pub created_at: u64,
    pub updated_at: u64,
}

// ─── Events ───────────────────────────────────────────────────────────

#[contracttype]
pub enum ReputationEvent {
    ProfileCreated(Address),
    PointsAdded(Address, u32, String),
    PointsRemoved(Address, u32, String),
    BadgeEarned(Address, Badge),
}

#[contract]
pub struct Reputation;

#[contractimpl]
impl Reputation {
    /// Create a new reputation profile
    pub fn create_profile(env: Env, address: Address, name: String) -> Profile {
        address.require_auth();

        let now = env.ledger().timestamp();
        let profile = Profile {
            address: address.clone(),
            name,
            contribution_score: 0,
            audit_score: 0,
            badges: Vec::new(&env),
            created_at: now,
            updated_at: now,
        };

        env.storage().persistent().set(&address, &profile);
        env.events()
            .publish((symbol_short!("profile_created"),), profile.clone());

        profile
    }

    /// Add points to a user's contribution score
    pub fn add_points(env: Env, address: Address, points: u32, reason: String) -> Profile {
        address.require_auth();

        let mut profile = Self::get_profile(env.clone(), address.clone())
            .expect("Profile not found");

        profile.contribution_score += points;
        profile.updated_at = env.ledger().timestamp();

        env.storage().persistent().set(&address, &profile);
        env.events()
            .publish((symbol_short!("points_added"),), profile.clone());

        profile
    }

    /// Remove points from a user's contribution score
    pub fn remove_points(env: Env, address: Address, points: u32, reason: String) -> Profile {
        address.require_auth();

        let mut profile = Self::get_profile(env.clone(), address.clone())
            .expect("Profile not found");

        profile.contribution_score = profile.contribution_score.saturating_sub(points);
        profile.updated_at = env.ledger().timestamp();

        env.storage().persistent().set(&address, &profile);
        env.events()
            .publish((symbol_short!("points_removed"),), profile.clone());

        profile
    }

    /// Award a badge to a user
    pub fn award_badge(
        env: Env,
        address: Address,
        badge_id: String,
        badge_name: String,
        description: String,
    ) -> Profile {
        let mut profile = Self::get_profile(env.clone(), address.clone())
            .expect("Profile not found");

        let badge = Badge {
            id: badge_id,
            name: badge_name,
            description,
            earned_at: env.ledger().timestamp(),
        };

        profile.badges.push_back(badge);
        profile.updated_at = env.ledger().timestamp();

        env.storage().persistent().set(&address, &profile);

        profile
    }

    /// Retrieve a user's reputation profile
    pub fn get_profile(env: Env, address: Address) -> Option<Profile> {
        env.storage()
            .persistent()
            .get::<Address, Profile>(&address)
    }
}

// ─── Tests ────────────────────────────────────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{Address, Env, String};

    #[test]
    fn test_create_and_update_profile() {
        let env = Env::default();
        let contract_id = env.register(Reputation, ());
        let client = ReputationClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let name = String::from_str(&env, "SecurityResearcher");

        let profile = client.create_profile(&user, &name);
        assert_eq!(profile.contribution_score, 0);

        let updated = client.add_points(&user, &100, &String::from_str(&env, "Found critical bug"));
        assert_eq!(updated.contribution_score, 100);

        let badge_profile = client.award_badge(
            &user,
            &String::from_str(&env, "first_audit"),
            &String::from_str(&env, "First Audit"),
            &String::from_str(&env, "Completed first security audit"),
        );
        assert_eq!(badge_profile.badges.len(), 1);

        let retrieved = client.get_profile(&user);
        assert!(retrieved.is_some());
    }
}
