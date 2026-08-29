import { NextResponse } from "next/server";
import { getAccount } from "@/lib/wallet";

export async function GET(
  _request: Request,
  context: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await context.params;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "invoiceId is required" },
        { status: 400 }
      );
    }

    const account = await getAccount();

    const invoice = await account.getLightningReceiveRequest(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    console.error("Invoice check error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to check invoice",
      },
      { status: 500 }
    );
  }
}