#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, String, Vec, Map};

// ─── Types ────────────────────────────────────────────────────────────

#[derive(Clone)]
#[contracttype]
pub struct AuditRecord {
    pub audit_id: String,
    pub project_id: String,
    pub report_hash: BytesN<32>,
    pub auditor: Address,
    pub timestamp: u64,
    pub metadata: Map<String, String>,
}

// ─── Error ────────────────────────────────────────────────────────────

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
#[contracttype]
pub enum AuditRegistryError {
    AlreadyRegistered = 1,
    NotFound = 2,
}

#[contract]
pub struct AuditRegistry;

#[contractimpl]
impl AuditRegistry {
    /// Register a new audit record on-chain
    pub fn register_audit(
        env: Env,
        project_id: String,
        report_hash: BytesN<32>,
        auditor: Address,
    ) -> Result<String, AuditRegistryError> {
        auditor.require_auth();

        let audit_count_key = symbol_short!("audit_count");
        let mut count: u32 = env
            .storage()
            .persistent()
            .get(&audit_count_key)
            .unwrap_or(0);

        count += 1;

        // Build audit ID without format! macro (no_std)
        let mut audit_id = String::from_str(&env, "AUD-");
        let mut count_bytes = [0u8; 20];
        let count_str = count_to_str(count);
        audit_id.push_str(&String::from_str(&env, &count_str));

        let record = AuditRecord {
            audit_id: audit_id.clone(),
            project_id: project_id.clone(),
            report_hash,
            auditor,
            timestamp: env.ledger().timestamp(),
            metadata: Map::new(&env),
        };

        env.storage()
            .persistent()
            .set(&audit_id, &record);

        // Update project audit list
        let project_key = Self::project_audits_key(&env, &project_id);
        let mut audits: Vec<String> = env
            .storage()
            .persistent()
            .get(&project_key)
            .unwrap_or_else(|| Vec::new(&env));
        audits.push_back(audit_id.clone());
        env.storage().persistent().set(&project_key, &audits);

        env.storage().persistent().set(&audit_count_key, &count);

        Ok(audit_id)
    }

    /// Verify that an audit record exists with the given hash
    pub fn verify_audit(env: Env, audit_id: String, report_hash: BytesN<32>) -> bool {
        if let Some(record) = env
            .storage()
            .persistent()
            .get::<String, AuditRecord>(&audit_id)
        {
            return record.report_hash == report_hash;
        }
        false
    }

    /// Retrieve a specific audit record
    pub fn get_audit(env: Env, audit_id: String) -> Option<AuditRecord> {
        env.storage()
            .persistent()
            .get::<String, AuditRecord>(&audit_id)
    }

    /// List all audit IDs for a project
    pub fn list_project_audits(env: Env, project_id: String) -> Vec<String> {
        let key = Self::project_audits_key(&env, &project_id);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Vec::new(&env))
    }

    // ─── Helpers ──────────────────────────────────────────────────

    fn project_audits_key(env: &Env, project_id: &String) -> String {
        let mut key = String::from_str(env, "project_audits:");
        key.push_str(project_id);
        key
    }
}

fn count_to_str(mut n: u32) -> [u8; 20] {
    let mut buf = [0u8; 20];
    if n == 0 {
        buf[0] = b'0';
        return buf;
    }
    let mut i = 19;
    while n > 0 && i > 0 {
        buf[i] = (n % 10) as u8 + b'0';
        n /= 10;
        i -= 1;
    }
    buf[(i + 1)..].as_ref(); // return the slice starting from i+1
    buf
}

// ─── Tests ────────────────────────────────────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{Address, Env, BytesN, String};

    #[test]
    fn test_register_and_verify_audit() {
        let env = Env::default();
        let contract_id = env.register(AuditRegistry, ());
        let client = AuditRegistryClient::new(&env, &contract_id);

        let auditor = Address::generate(&env);
        let project_id = String::from_str(&env, "proj-123");
        let report_hash = BytesN::from_array(&env, &[1u8; 32]);

        let audit_id = client.register_audit(&project_id, &report_hash, &auditor);
        assert!(audit_id.is_ok());

        let audit_id = audit_id.unwrap();
        let verified = client.verify_audit(&audit_id, &report_hash);
        assert!(verified);

        let record = client.get_audit(&audit_id);
        assert!(record.is_some());

        let audits = client.list_project_audits(&project_id);
        assert_eq!(audits.len(), 1);
    }
}
