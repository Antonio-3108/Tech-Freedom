export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAccount } from "@/lib/wallet";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const amountSats = Number(body.amountSats);

    const memo =
      typeof body.memo === "string"
        ? body.memo.trim()
        : undefined;

    if (!Number.isInteger(amountSats) || amountSats <= 0) {
      return NextResponse.json(
        {
          error: "amountSats must be a positive integer",
        },
        { status: 400 }
      );
    }

    const account = await getAccount();

    const invoice = await account.createLightningInvoice({
      amountSats,
      memo,
    });

    return NextResponse.json({
      invoiceId: invoice.id,
      bolt11: invoice.invoice.encodedInvoice,
      status: invoice.status,
      amountSats,
      memo: memo ?? null,
    });
  } catch (error) {
    console.error("Invoice creation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create invoice",
      },
      { status: 500 }
    );
  }
}