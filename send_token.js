const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const bs58 = require('bs58');

const secretKey = bs58.decode('1sJ9HKGhWkXafnDvKnfqTTG7YQNY1zKHwti2MQgi2bV57NEZKpjZmbQdKFBsF4a89wpVLE6PsCeG7a16mByErp4');
const sender = web3.Keypair.fromSecretKey(secretKey);

const recipientPubkey = new web3.PublicKey('phvE9ymUgeco1ntNZ9FdLWUN4CirLKFhzYcHoFdg3sC'); // ← use another wallet

// Token mint address from earlier
const TOKEN_MINT = new web3.PublicKey('65nTZns2kpnnBkQf2TTrDND24ABuPoDcWUdchdVNzted');

(async () => {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  // 1. Find token accounts
  const senderTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection, sender, TOKEN_MINT, sender.publicKey
  );
  const recipientTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection, sender, TOKEN_MINT, recipientPubkey
  );

  // 2. Create a transfer instruction
  const transferIx = splToken.createTransferInstruction(
    senderTokenAccount.address,
    recipientTokenAccount.address,
    sender.publicKey,
    15 // amount
  );

  // 3. Add a memo (kudos message)
  const memoIx = new web3.TransactionInstruction({
    keys: [],
    programId: new web3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    data: Buffer.from('Kudos for the Help on that Ticket 🥳')
  });

  const tx = new web3.Transaction().add(transferIx, memoIx);

  const sig = await web3.sendAndConfirmTransaction(connection, tx, [sender]);
  console.log('📤 Sent tokens with memo. Tx:', sig);
})();
