import "dotenv/config";
import express from "express";
import cors from "cors";
import WalletManagerSpark from "@tetherto/wdk-wallet-spark";

const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());

const mnemonic = process.env.WDK_MNEMONIC;
const network = process.env.WDK_NETWORK || "REGTEST";
const port = Number(process.env.PORT || 3001);

async function startServer() {
  if (!mnemonic) {
    throw new Error("WDK_MNEMONIC is not configured");
  }

  const wallet = new WalletManagerSpark(mnemonic, {
    network: network as "MAINNET" | "TESTNET" | "REGTEST",
  });

  const account = await wallet.getAccount(0);

  app.get("/api/wallet", async (_req, res) => {
    try {
      const address = await account.getAddress();
      const balance = await account.getBalance();
      const identityKey = await account.getIdentityKey();

      res.json({
        address,
        balance: balance.toString(),
        identityKey,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Wallet error",
      });
    }
  });

  app.post("/api/invoice", async (req, res) => {
    try {
      const amountSats = Number(req.body.amountSats);

      const memo =
        typeof req.body.memo === "string"
          ? req.body.memo.trim()
          : undefined;

      if (!Number.isInteger(amountSats) || amountSats <= 0) {
        return res.status(400).json({
          error: "amountSats must be a positive integer",
        });
      }

      const invoice = await account.createLightningInvoice({
        amountSats,
        memo,
      });

      res.json({
        invoiceId: invoice.id,
        bolt11:
          typeof invoice.invoice === "string"
            ? invoice.invoice
            : invoice.invoice?.encodedInvoice,
        status: invoice.status,
        amountSats,
        memo: memo ?? null,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create invoice",
      });
    }
  });

  app.get("/api/check/:invoiceId", async (req, res) => {
    try {
      const invoiceId = req.params.invoiceId;

      const invoice =
        await account.getLightningReceiveRequest(invoiceId);

      if (!invoice) {
        return res.status(404).json({
          error: "Invoice not found",
        });
      }

      res.json({
        invoiceId: invoice.id,
        bolt11:
          typeof invoice.invoice === "string"
            ? invoice.invoice
            : invoice.invoice?.encodedInvoice,
        status: invoice.status,
        amountSats:
          "amountSats" in invoice
            ? invoice.amountSats
            : undefined,
        memo:
          "memo" in invoice
            ? invoice.memo
            : undefined,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to check invoice",
      });
    }
  });

  app.post("/api/pay", async (req, res) => {
    try {
      const bolt11 =
        typeof req.body.bolt11 === "string"
          ? req.body.bolt11.trim()
          : "";

      if (!bolt11) {
        return res.status(400).json({
          error: "bolt11 is required",
        });
      }

      const payment = await account.payLightningInvoice({
        invoice: bolt11,
        maxFeeSats: 10,
        preferSpark: true,
      });

      res.json({
        requestId: payment.id,
        status: payment.status,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Payment failed",
      });
    }
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(
      `WDK backend running on port ${port}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start WDK backend:", error);
  process.exit(1);
});