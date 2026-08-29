import WalletManagerSpark from "@tetherto/wdk-wallet-spark";

let wallet: WalletManagerSpark | null = null;

export async function getAccount() {
  const mnemonic = process.env.WDK_MNEMONIC;

  if (!mnemonic) {
    throw new Error("WDK_MNEMONIC is not configured");
  }

  if (!wallet) {
    wallet = new WalletManagerSpark(mnemonic, {
      network: (process.env.WDK_NETWORK || "TESTNET") as
        | "MAINNET"
        | "TESTNET"
        | "REGTEST",
    });
  }

  return await wallet.getAccount(0);
}