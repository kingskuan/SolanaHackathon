// JS-only demo runner without airdrop (fallback when devnet faucet fails)
const fs = require('fs');
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } = require('@solana/web3.js');
(async ()=>{
  const out='/root/.openclaw/workspace/reports/2026-03-22/demo_js_run_noairdrop.txt';
  const conn = new Connection('https://api.devnet.solana.com');
  const owner = Keypair.generate();
  const beneficiary = Keypair.generate();
  fs.appendFileSync(out, `Owner: ${owner.publicKey.toBase58()}\n`);
  fs.appendFileSync(out, `Beneficiary: ${beneficiary.publicKey.toBase58()}\n`);
  fs.appendFileSync(out, 'Skipping airdrop (faucet unreliable). Using simulated lamports in will account.\n');
  const willAccount = Keypair.generate();
  // simulate deposit by noting intended lamports
  fs.appendFileSync(out, `Simulated will account: ${willAccount.publicKey.toBase58()} (balance simulated 0.1 SOL)\n`);
  fs.appendFileSync(out, 'Proposing execution (simulated)\n');
  const job={owner: owner.publicKey.toBase58(), will: willAccount.publicKey.toBase58(), when: Date.now()};
  fs.writeFileSync('/root/.openclaw/workspace/chain-will-agent/job_queue.json', JSON.stringify(job));
  fs.appendFileSync(out, 'Job queued\n');
  fs.appendFileSync(out, 'Relayer picks job and simulates finalize (simulated transfer)\n');
  // simulate tx hash
  const fakeTx = 'SIMULATED_TX_HASH_' + Date.now();
  fs.appendFileSync(out, `Simulated relayer tx: ${fakeTx}\n`);
  fs.appendFileSync(out, 'Demo (no-airdrop) complete\n');
  console.log('demo no-airdrop complete, output written to', out);
})();
