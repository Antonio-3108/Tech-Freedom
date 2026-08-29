import { NextResponse } from "next/server";
import { getAccount } from "@/lib/wallet";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bolt11 =
      typeof body?.bolt11 === "string"
        ? body.bolt11.trim()
        : "";

    if (!bolt11) {
      return NextResponse.json(
        { error: "bolt11 is required" },
        { status: 400 }
      );
    }

    if (!bolt11.toLowerCase().startsWith("lnbcrt")) {
      return NextResponse.json(
        {
          error:
            "Invalid REGTEST BOLT11 invoice. Expected an invoice starting with lnbcrt",
        },
        { status: 400 }
      );
    }

    const account = await getAccount();

    const payment = await account.payLightningInvoice({
      invoice: bolt11,
      maxFeeSats: 10,
      preferSpark: true,
    });

    return NextResponse.json({
      requestId: payment.id,
      status: payment.status,
    });
  } catch (error) {
    console.error("Payment error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Payment failed",
      },
      { status: 500 }
    );
  }
}