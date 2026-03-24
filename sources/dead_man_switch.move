module shelby_addr::shelby_legacy {
    use std::signer;
    use aptos_framework::timestamp;

    // Chybové kódy (pomáhajú pri debugovaní transakcií)
    const E_VAULT_ALREADY_EXISTS: u64 = 1;
    const E_VAULT_DOES_NOT_EXIST: u64 = 2;

    struct Vault has key {
        last_heartbeat: u64,
        timeout: u64,
        beneficiary: address,
        is_active: bool,
    }

    /// Inicializácia trezoru. 
    /// Pridaná kontrola 'assert!', aby sme neprepísali existujúci trezor.
    public entry fun create_vault(owner: &signer, timeout: u64, beneficiary: address) {
        let addr = signer::address_of(owner);
        
        // Kontrola: Ak trezor už existuje, transakcia skončí s chybou 1
        assert!(!exists<Vault>(addr), E_VAULT_ALREADY_EXISTS);

        let vault = Vault {
            last_heartbeat: timestamp::now_seconds(),
            timeout,
            beneficiary,
            is_active: true,
        };
        move_to(owner, vault);
    }

    /// Resetovanie časovača (Heartbeat).
    /// Pridaná kontrola, či používateľ vôbec má vytvorený trezor.
    public entry fun heartbeat(owner: &signer) acquires Vault {
        let addr = signer::address_of(owner);
        
        // Kontrola: Ak trezor neexistuje, transakcia skončí s chybou 2
        assert!(exists<Vault>(addr), E_VAULT_DOES_NOT_EXIST);

        let vault = borrow_global_mut<Vault>(addr);
        vault.last_heartbeat = timestamp::now_seconds();
    }

    /// Kontrola, či môže dedič pristupovať k dátam.
    /// Táto funkcia je 'view', takže sa za jej volanie (mimo transakcie) neplatí.
    #[view]
    public fun is_unlocked(owner_addr: address): bool acquires Vault {
        if (!exists<Vault>(owner_addr)) {
            return false
        };
        
        let vault = borrow_global<Vault>(owner_addr);
        let current_time = timestamp::now_seconds();
        
        // Logika: Ak prešlo viac času ako heartbeat + timeout, vráti true
        current_time > (vault.last_heartbeat + vault.timeout)
    }
}
