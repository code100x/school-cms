import { TSSCli } from 'solana-mpc-tss-lib/mpc';

const DESTINATION_ADDRESS = '5hNsLxJZEsnDjwjpApsLBiFcoVTX7Z3xufG1DiNSMT4V';

const cli = new TSSCli('devnet');

// Generate participant keypairs
const participant1 = await cli.generate();
const participant2 = await cli.generate();
const participant3 = await cli.generate();

// Create 2-of-3 multisig
const aggregated = cli.aggregateKeys([
  participant1.publicKey,
  participant2.publicKey,
  participant3.publicKey
], 2);

// Initiate multi-party signing (Step 1 for each participant)
const recentBlockhash = await cli.recentBlockHash();
const step1P1 = await cli.aggregateSignStepOne(
  participant1.secretKey,
  DESTINATION_ADDRESS,
  1000000,
  'Multi-sig payment', // Optional memo
  recentBlockhash
);

const step1P2 = await cli.aggregateSignStepOne(
  participant2.secretKey,
  DESTINATION_ADDRESS,
  1000000,
  'Multi-sig payment',
  recentBlockhash
);

// Step 2: Create partial signatures
const allPublicNonces = [step1P1.publicNonce, step1P2.publicNonce];
const step2P1 = await cli.aggregateSignStepTwo(
  JSON.stringify(step1P1),
  participant1.secretKey,
  DESTINATION_ADDRESS,
  1000000,
  allPublicNonces,
  'Multi-sig payment',
  recentBlockhash
);

const step2P2 = await cli.aggregateSignStepTwo(
  JSON.stringify(step1P2),
  participant2.secretKey,
  DESTINATION_ADDRESS,
  1000000,
  allPublicNonces,
  'Multi-sig payment',
  recentBlockhash
);

// Step 3: Aggregate signatures and broadcast
const partialSignatures = [step2P1, step2P2];
const transactionDetails = {
  amount: 1000000,
  to: DESTINATION_ADDRESS,
  from: aggregated.aggregatedPublicKey, // Use the aggregated public key
  network: 'devnet',
  memo: 'Multi-sig payment',
  recentBlockhash
};

console.log('signature', JSON.stringify(partialSignatures));
console.log('transactionDetails', JSON.stringify(transactionDetails));
console.log('aggregated', JSON.stringify(aggregated));
console.log('participant1', JSON.stringify(participant1));
console.log('participant2', JSON.stringify(participant2));
console.log('participant3', JSON.stringify(participant3));

console.log(partialSignatures);
const signature = await cli.aggregateSignaturesAndBroadcast(
  JSON.stringify(partialSignatures),
  JSON.stringify(transactionDetails),
  JSON.stringify(aggregated) // Pass the aggregated wallet info here
);