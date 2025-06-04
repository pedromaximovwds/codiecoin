const bs58 = require('bs58');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

// === CONFIG ===
const secret = '1sJ9HKGhWkXafnDvKnfqTTG7YQNY1zKHwti2MQgi2bV57NEZKpjZmbQdKFBsF4a89wpVLE6PsCeG7a16mByErp4'; // Replace with your base58 private key from Phantom
const mintAddress = '65nTZns2kpnnBkQf2TTrDND24ABuPoDcWUdchdVNzted'; // Replace with your token's mint address
const additionalAmount = 5; // Amount to mint

// === INIT === 
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(secret));

(async () => {
  try {
    console.log(`🔑 Wallet public key: ${keypair.publicKey.toBase58()}`);
    
    const mint = new PublicKey(mintAddress);

    // Get or create token account (ATA)
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Mint new tokens to your own wallet
    const signature = await mintTo(
      connection,
      keypair,            // payer and mint authority
      mint,
      tokenAccount.address,
      keypair.publicKey,  // mint authority
      additionalAmount * (10 ** 0) // assuming 0 decimals; change if yours has more
    );

    console.log(`✅ Minted ${additionalAmount} tokens`);
    console.log(`🔗 Tx Signature: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (err) {
    console.error('❌ Mint failed:', err);
  }
})();
