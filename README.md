# 🛡️ Sentinel (Demo)

**Sentinel** is a decentralized data security and legacy transfer suite concept. It acts as a sophisticated management layer designed to leverage the **Shelby Protocol** for secure data persistence.

> **⚠️ Simulation Notice:** This is a **purely client-side demo version**. While the architecture is designed for the Aptos Blockchain and Shelby Protocol, all network interactions, vault deployments, and heartbeat executions are currently **simulated** for evaluation and UI/UX demonstration purposes. No real Testnet assets or on-chain transactions are required.

## Two Core Protocols

Sentinel offers two distinct conceptual ways to protect your digital life:

### 1. Vault Protocol (Secure Storage)
A module designed for encrypting and "vaulting" sensitive files.
* **Simulated Shelby Integration:** Demonstrates how data would be fragmented and stored across decentralized nodes using the [Shelby Protocol](https://docs.shelby.xyz/protocol).
* **Local Encryption:** Files are processed client-side to showcase the "Seal to Vault" workflow.
* **Persistence Mockup:** Users can toggle expiration settings (7d to 365d) to see how storage lifecycle management would function.

### 2. Legacy Protocol (Dead Man's Switch)
A conceptual automated transfer system for sensitive info (seed phrases/keys) triggered by owner inactivity.
* **Heartbeat Simulation:** Features a functional countdown timer that resets via a "Heartbeat" button, mimicking on-chain check-ins.
* **Auto-Execution Demo:** Once the timer hits zero, the "Sentinel" triggers a simulated dispatch to a beneficiary address.
* **Protocol History:** Includes a live log that records these simulated system events in real-time.

## 🛠️ Tech Stack
* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide React.
* **Logic:** Simulated Aptos Move VM interactions and client-side AES-256 encryption.
* **Infrastructure Concept:** Built to follow the [Shelby Protocol](https://docs.shelby.xyz/protocol) architecture.

---
*Created for evaluation purposes - 2026*
