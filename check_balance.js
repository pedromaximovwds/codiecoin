const bs58 = require('bs58');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');

// === CONFIG ===
const secret = '3JHeHBdcxYJ5RKvS14h4uUYPDe5EpXYvm4c1YrutyktaWgYAYrtQJQT4LvHZP9NBpmgSWPLvQ9R4aw6Scr3pZUYs'; // <- replace with your Phantom private key
const mintAddress = '65nTZns2kpnnBkQf2TTrDND24ABuPoDcWUdchdVNzted'; // <- the mint address of your SPL token

// === INIT ===
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(secret));
const wallet = keypair.publicKey;

// === MAIN ===
(async () => {
  try {
    console.log(`🔍 Checking balance for wallet: ${wallet.toBase58()}`);

    // Get SOL balance
    const solBalanceLamports = await connection.getBalance(wallet);
    const solBalance = solBalanceLamports / 1e9;
    console.log(`💎 SOL balance: ${solBalance} SOL`);

    // Find ATA (Associated Token Account) for the given mint
    const mint = new PublicKey(mintAddress);
    const ata = await getAssociatedTokenAddress(mint, wallet);

    // Get the account data
    const account = await getAccount(connection, ata);

    console.log(`💰 Token balance: ${Number(account.amount)} tokens`);
    console.log(`📦 Token account: ${ata.toBase58()}`);
  } catch (err) {
    if (err.message.includes("could not find account")) {
      console.error("🚫 No token account found for this mint. You might not own this token.");
    } else {
      console.error("❌ Error:", err);
    }
  }
})();
