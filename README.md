Chain Will — Agent-based On-chain Inheritance

Purpose
- Reference implementation for the Solana Agent Economy Hackathon "Agent 星光秀" entry: a Chain‑Will agent + A2A relayer market that automatically transfers funds to a beneficiary after an inactivity window, with a challenge period and relayer payment.

What I will deliver (MVP + submission assets)
- contracts/: Solana program interface + anchor-style contract scaffold (devnet-ready guidance)
- agents/: Monitor agent (Node.js) + Relayer prototype (Node.js) that together demonstrate detection -> job -> on‑chain execution flow on devnet
- ui/: simple static demo UI (HTML + JS) showing how an owner creates a will and deposits devnet SOL
- scripts/: devnet helper scripts (deploy, fund, demo run)
- docs/: architecture, security notes, X Article draft + Tweet/Quote RT text

How to run (dev quickstart)
1. Set up Solana devnet and install prerequisites (solana-cli, node >=18, npm)
2. Edit scripts/.env.dev with your devnet keypair path
3. Run scripts/devnet_setup.sh to create dev accounts and (optionally) deploy a mock program
4. Start monitor: node agents/monitor.js
5. Create a will via UI or scripts, deposit small devnet SOL, then simulate inactivity (or run monitor with --force)
6. Start relayer: node agents/relayer.js

Notes
- This is an initial scaffold and demo. The core security recommendations and a suggested roadmap are in docs/CONTRACT.md and docs/ROADMAP.md.  
- Do NOT use real funds or mainnet credentials in this workspace; devnet only.
