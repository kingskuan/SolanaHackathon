// Minimal JS-only demo runner using @solana/web3.js (simulated flow for demo)
const fs = require('fs');
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } = require('@solana/web3.js');
(async ()=>{
  const out='run_demo_output.txt';
  const conn = new Connection('https://api.devnet.solana.com');
  const owner = Keypair.generate();
  const beneficiary = Keypair.generate();
  const airdrop = await conn.requestAirdrop(owner.publicKey, LAMPORTS_PER_SOL);
  await conn.confirmTransaction(airdrop);
  fs.appendFileSync(out, `Owner: ${owner.publicKey.toBase58()}\n`);
  fs.appendFileSync(out, `Beneficiary: ${beneficiary.publicKey.toBase58()}\n`);
  // Simulate deposit to a 'will account' (just create a new account and transfer)
  const willAccount = Keypair.generate();
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: owner.publicKey,
      newAccountPubkey: willAccount.publicKey,
      lamports: 0.1*LAMPORTS_PER_SOL,
      space: 128,
      programId: SystemProgram.programId,
    })
  );
  await conn.sendTransaction(tx, [owner, willAccount], {skipPreflight:true});
  fs.appendFileSync(out, `Created will account: ${willAccount.publicKey.toBase58()}\n`);
  fs.appendFileSync(out, 'Proposing execution (simulated)\n');
  // simulated propose: write to a job file
  const job={owner: owner.publicKey.toBase58(), will: willAccount.publicKey.toBase58(), when: Date.now()};
  fs.writeFileSync('job_queue.json', JSON.stringify(job));
  fs.appendFileSync(out, 'Job queued\n');
  fs.appendFileSync(out, 'Relayer picks job and simulates finalize (transfer lamports)\n');
  // Relayer sim: transfer lamports to beneficiary
  const relayerTx = new Transaction().add(SystemProgram.transfer({fromPubkey: owner.publicKey, toPubkey: beneficiary.publicKey, lamports: 0.099*LAMPORTS_PER_SOL}));
  await conn.sendTransaction(relayerTx, [owner], {skipPreflight:true});
  fs.appendFileSync(out, 'Relayer simulated transfer executed\n');
  console.log('demo complete, output written to', out);
})();
