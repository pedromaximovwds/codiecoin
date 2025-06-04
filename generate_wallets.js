const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');

const NUM_WALLETS = 5;
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

(async () => {
  const wallets = [];

  for (let i = 0; i < NUM_WALLETS; i++) {
    const wallet = Keypair.generate();
    const publicKey = wallet.publicKey.toBase58();
    const secretKey = bs58.encode(wallet.secretKey);

    // Airdrop 1 SOL
    try {
      console.log(`🚀 Airdropping 1 SOL to Wallet ${i + 1}: ${publicKey}`);
      const airdropSignature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSignature, 'confirmed');
      console.log(`✅ Airdropped to ${publicKey}`);
    } catch (err) {
      console.error(`❌ Failed to airdrop to ${publicKey}:`, err.message);
    }

    wallets.push({ index: i + 1, publicKey, secretKey });
  }

  fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
  console.log(`✅ Done! Generated ${NUM_WALLETS} wallets and saved to wallets.json`);
})();
