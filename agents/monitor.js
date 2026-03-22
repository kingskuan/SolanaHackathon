#!/usr/bin/env node
// Monitor: checks recent signatures for owner address and triggers job if inactivity > threshold
const fs = require('fs');
const { Connection, PublicKey } = require('@solana/web3.js');

const OWNER = process.env.OWNER_PUBKEY || '';
const THRESHOLD_DAYS = Number(process.env.INACTIVITY_DAYS || 30);
const RPC = process.env.SOLANA_RPC || 'https://api.devnet.solana.com';

async function checkOwner() {
  const out = '/root/.openclaw/workspace/reports/2026-03-22/monitor_run.txt';
  fs.appendFileSync(out, `Monitor start: ${new Date().toISOString()}\n`);
  const conn = new Connection(RPC);
  if (!OWNER) {
    fs.appendFileSync(out, 'No OWNER_PUBKEY configured; exiting.\n');
    return;
  }
  const ownerPub = new PublicKey(OWNER);
  try {
    const sigs = await conn.getSignaturesForAddress(ownerPub, { limit: 1 });
    if (!sigs || sigs.length === 0) {
      fs.appendFileSync(out, `No signatures found for ${OWNER}\n`);
      return false;
    }
    const sig = sigs[0];
    const blockTime = sig.blockTime || 0;
    const last = blockTime * 1000;
    const ageMs = Date.now() - last;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    fs.appendFileSync(out, `Last signature: ${new Date(last).toISOString()} (age ${ageDays.toFixed(2)} days)\n`);
    if (ageDays >= THRESHOLD_DAYS) {
      fs.appendFileSync(out, `Inactivity threshold exceeded (>= ${THRESHOLD_DAYS} days). Queuing job.\n`);
      const job = { owner: OWNER, when: Date.now() };
      fs.writeFileSync('/root/.openclaw/workspace/chain-will-agent/job_queue.json', JSON.stringify(job));
      return true;
    }
    fs.appendFileSync(out, `Owner is active. No job queued.\n`);
    return false;
  } catch (e) {
    fs.appendFileSync(out, `Error checking owner: ${e}\n`);
    return false;
  }
}

(async ()=>{
  const out = '/root/.openclaw/workspace/reports/2026-03-22/monitor_run.txt';
  if (process.argv.includes('--force')) {
    fs.appendFileSync(out, 'Force mode: queuing job regardless of activity.\n');
    const job = { owner: OWNER || 'FORCE_OWNER', when: Date.now() };
    fs.writeFileSync('/root/.openclaw/workspace/chain-will-agent/job_queue.json', JSON.stringify(job));
    fs.appendFileSync(out, 'Job queued (force).\n');
    return;
  }
  await checkOwner();
})();
