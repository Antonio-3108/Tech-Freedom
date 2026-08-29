"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

type ReceiveInvoice = {
  invoiceId: string;
  bolt11: string;
  status: string;
  amountSats: number;
  memo: string | null;
};

type ApiError = {
  error?: string;
};

export default function Home() {
  const [mode, setMode] = useState<"receive" | "pay">("receive");

  // Receive
  const [amountSats, setAmountSats] = useState("100");
  const [memo, setMemo] = useState("Lab 05");
  const [invoice, setInvoice] = useState<ReceiveInvoice | null>(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pay
  const [bolt11Input, setBolt11Input] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    requestId?: string;
    status?: string;
    error?: string;
  } | null>(null);

  // General
  const [error, setError] = useState("");

  useEffect(() => {
    if (!invoice?.invoiceId) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(
          `/api/check/${encodeURIComponent(invoice.invoiceId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setInvoice((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            status: data.status,
          };
        });
      } catch {
        // Ignore temporary polling errors.
      }
    }, 2000);

    return () => {
      window.clearInterval(interval);
    };
  }, [invoice?.invoiceId]);

  async function createInvoice() {
    setError("");
    setCopied(false);
    setInvoice(null);

    const parsedAmount = Number(amountSats);

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      setError("La cantidad debe ser un número entero mayor que 0.");
      return;
    }

    setCreatingInvoice(true);

    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountSats: parsedAmount,
          memo: memo.trim() || undefined,
        }),
      });

      const data: ReceiveInvoice | ApiError = await response.json();

      if (!response.ok) {
        setError(
          "error" in data && data.error
            ? data.error
            : "No se pudo crear la factura."
        );
        return;
      }

      setInvoice(data as ReceiveInvoice);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCreatingInvoice(false);
    }
  }

  async function copyInvoice() {
    if (!invoice?.bolt11) {
      return;
    }

    try {
      await navigator.clipboard.writeText(invoice.bolt11);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("No se pudo copiar la factura.");
    }
  }

  async function payInvoice() {
    setError("");
    setPaymentResult(null);

    const bolt11 = bolt11Input.trim();

    if (!bolt11) {
      setError("Pega una factura BOLT11.");
      return;
    }

    setPaying(true);

    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bolt11,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPaymentResult({
          error: data.error || "El pago falló.",
        });
        return;
      }

      setPaymentResult({
        requestId: data.requestId,
        status: data.status,
      });
    } catch {
      setPaymentResult({
        error: "No se pudo conectar con el servidor.",
      });
    } finally {
      setPaying(false);
    }
  }

  const isSettled =
    invoice?.status?.toUpperCase().includes("SETTLED") ||
    invoice?.status?.toUpperCase().includes("COMPLETED");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-cyan-400">
            Technologies and Freedom
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            WDK Lightning Wallet
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Billetera Lightning con WDK y Spark.
          </p>
        </header>

        <div className="mb-8 flex rounded-xl border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => {
              setMode("receive");
              setError("");
            }}
            className={`flex-1 rounded-lg px-4 py-3 font-medium transition ${
              mode === "receive"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Recibir
          </button>

          <button
            onClick={() => {
              setMode("pay");
              setError("");
            }}
            className={`flex-1 rounded-lg px-4 py-3 font-medium transition ${
              mode === "pay"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Pagar
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {mode === "receive" ? (
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-2xl font-semibold">Recibir Lightning</h2>

              <p className="mt-2 text-sm text-zinc-400">
                Crea una factura BOLT11 real desde tu wallet WDK.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Cantidad (sats)
                  </label>

                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="1"
                    value={amountSats}
                    onChange={(event) => setAmountSats(event.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="memo"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Memo
                  </label>

                  <input
                    id="memo"
                    type="text"
                    value={memo}
                    onChange={(event) => setMemo(event.target.value)}
                    placeholder="Ej. Pago del laboratorio"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <button
                  onClick={createInvoice}
                  disabled={creatingInvoice}
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingInvoice
                    ? "Creando factura..."
                    : "Crear factura"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-2xl font-semibold">Factura</h2>

              {!invoice ? (
                <div className="mt-8 rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
                  Tu QR y BOLT11 aparecerán aquí.
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  <div className="flex justify-center rounded-xl bg-white p-6">
                    <QRCodeCanvas
                      value={invoice.bolt11}
                      size={240}
                      includeMargin
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-zinc-400">
                      BOLT11
                    </p>

                    <div className="break-all rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-300">
                      {invoice.bolt11}
                    </div>

                    <button
                      onClick={copyInvoice}
                      className="mt-3 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:border-zinc-500"
                    >
                      {copied ? "Copiado ✓" : "Copiar invoice"}
                    </button>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-sm text-zinc-400">
                      Estado
                    </p>

                    <p
                      className={`mt-1 text-lg font-semibold ${
                        isSettled
                          ? "text-emerald-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {invoice.status}
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      La página comprueba el estado automáticamente.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl border border-zinc-800 p-4">
                      <p className="text-zinc-500">Amount</p>
                      <p className="mt-1 font-semibold">
                        {invoice.amountSats} sats
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 p-4">
                      <p className="text-zinc-500">Memo</p>
                      <p className="mt-1 font-semibold">
                        {invoice.memo || "Sin memo"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold">Pagar Lightning</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Pega una factura BOLT11 de otra wallet.
            </p>

            <div className="mt-6">
              <label
                htmlFor="bolt11"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                BOLT11 invoice
              </label>

              <textarea
                id="bolt11"
                value={bolt11Input}
                onChange={(event) => setBolt11Input(event.target.value)}
                placeholder="lnbcrt1..."
                rows={7}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <button
              onClick={payInvoice}
              disabled={paying}
              className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? "Procesando pago..." : "Pagar invoice"}
            </button>

            {paymentResult && (
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                {paymentResult.error ? (
                  <>
                    <p className="font-semibold text-red-400">
                      El pago falló
                    </p>

                    <p className="mt-2 break-words text-sm text-zinc-400">
                      {paymentResult.error}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-emerald-400">
                      Pago enviado
                    </p>

                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <p className="text-zinc-500">Request ID</p>
                        <p className="mt-1 break-all font-mono text-zinc-300">
                          {paymentResult.requestId}
                        </p>
                      </div>

                      <div>
                        <p className="text-zinc-500">Estado</p>
                        <p className="mt-1 font-semibold text-emerald-400">
                          {paymentResult.status}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        <footer className="mt-10 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
          WDK Spark • Regtest • Lab 05
        </footer>
      </div>
    </main>
  );
}