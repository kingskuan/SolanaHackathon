#!/usr/bin/env node
const fs = require('fs');
console.log('Relayer starting (prototype)');
setInterval(()=>{
  try{
    if(fs.existsSync('job_queue.json')){
      const job = JSON.parse(fs.readFileSync('job_queue.json','utf8'));
      console.log('Found job',job);
      // In real system: submit tx to Solana to call finalizeExecution
      fs.unlinkSync('job_queue.json');
      console.log('Job executed (simulated)');
    }
  }catch(e){console.error(e)}
},2000);
