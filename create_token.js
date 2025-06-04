const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

// PRIVATE KEY from Phantom mobile (exported as base58)
const bs58 = require('bs58');

// ⚠️ Replace with your base58 private key from Phantom (Devnet)
const secretKey = bs58.decode('1sJ9HKGhWkXafnDvKnfqTTG7YQNY1zKHwti2MQgi2bV57NEZKpjZmbQdKFBsF4a89wpVLE6PsCeG7a16mByErp4');
const payer = web3.Keypair.fromSecretKey(secretKey);

(async () => {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  // 1. Create new token
  const mint = await splToken.createMint(
    connection,
    payer,            // fee payer
    payer.publicKey,  // mint authority
    null,             // freeze authority
    0                 // decimals
  );

  console.log('✅ Token Mint Address:', mint.toBase58());

  // 2. Create a token account for the payer
  const payerTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log('🎒 Token Account:', payerTokenAccount.address.toBase58());

  // 3. Mint some tokens to yourself
  await splToken.mintTo(
    connection,
    payer,
    mint,
    payerTokenAccount.address,
    payer.publicKey,
    1000
  );

  console.log('💸 Minted 1000 tokens to self');
})();
