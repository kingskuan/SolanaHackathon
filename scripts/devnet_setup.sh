#!/usr/bin/env bash
set -euo pipefail
# dev helper: create keypair and airdrop some SOL for dev testing
KEYPAIR=${1:-~/.config/solana/id.json}
solana-keygen new --no-passphrase -o "$KEYPAIR" >/dev/null 2>&1 || true
solana config set --keypair "$KEYPAIR" >/dev/null 2>&1 || true
solana airdrop 2 >/dev/null 2>&1 || true
echo "devnet setup done; keypair: $KEYPAIR"