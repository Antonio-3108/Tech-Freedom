import argparse
import json
import os
import subprocess
import sys
from decimal import Decimal, InvalidOperation
from pathlib import Path


NETWORK_FLAGS = {
    "mainnet": [],
    "testnet": ["-testnet"],
    "testnet4": ["-testnet4"],
    "signet": ["-signet"],
    "regtest": ["-regtest"],
}


class BitcoinCLIError(RuntimeError):
    pass


def bitcoin_cli(
    network: str,
    wallet: str | None,
    method: str,
    *params: str,
) -> object:
    command = ["bitcoin-cli", *NETWORK_FLAGS[network]]

    if wallet:
        command.append(f"-rpcwallet={wallet}")

    command.extend([method, *params])

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=False,
            timeout=120,
        )
    except FileNotFoundError as exc:
        raise BitcoinCLIError(
            "No se encontró bitcoin-cli. Instala Bitcoin Core y agrega "
            "bitcoin-cli al PATH."
        ) from exc
    except subprocess.TimeoutExpired as exc:
        raise BitcoinCLIError(
            f"Bitcoin Core tardó demasiado al ejecutar {method}."
        ) from exc

    if result.returncode != 0:
        error = result.stderr.strip() or result.stdout.strip()
        raise BitcoinCLIError(f"Error de Bitcoin Core en {method}: {error}")

    output = result.stdout.strip()

    if not output:
        return None

    try:
        return json.loads(output)
    except json.JSONDecodeError:
        return output


def parse_amount(value: str) -> Decimal:
    try:
        amount = Decimal(value)
    except InvalidOperation as exc:
        raise argparse.ArgumentTypeError("Cantidad BTC inválida.") from exc

    if amount <= 0:
        raise argparse.ArgumentTypeError(
            "La cantidad debe ser mayor que cero."
        )

    if amount.as_tuple().exponent < -8:
        raise argparse.ArgumentTypeError(
            "Bitcoin admite como máximo 8 decimales."
        )

    return amount


def save_private_file(path: Path, content: str, overwrite: bool) -> None:
    path = path.expanduser().resolve()

    flags = os.O_WRONLY | os.O_CREAT

    if overwrite:
        flags |= os.O_TRUNC
    else:
        flags |= os.O_EXCL

    try:
        descriptor = os.open(path, flags, 0o600)
    except FileExistsError as exc:
        raise BitcoinCLIError(
            f"El archivo ya existe: {path}. Usa --force para reemplazarlo."
        ) from exc

    with os.fdopen(descriptor, "w", encoding="utf-8") as file:
        file.write(content)
        file.write("\n")


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Genera una PSBT financiada mediante Bitcoin Core. "
            "No firma ni transmite la transacción."
        )
    )

    parser.add_argument(
        "--wallet",
        required=True,
        help="Nombre de la wallet cargada en Bitcoin Core.",
    )
    parser.add_argument(
        "--address",
        required=True,
        help="Dirección Bitcoin destinataria.",
    )
    parser.add_argument(
        "--amount",
        required=True,
        type=parse_amount,
        help="Cantidad en BTC, por ejemplo: 0.001",
    )
    parser.add_argument(
        "--network",
        choices=NETWORK_FLAGS,
        default="mainnet",
        help="Red de Bitcoin. Predeterminado: mainnet.",
    )
    parser.add_argument(
        "--fee-rate",
        type=Decimal,
        help="Comisión opcional en sat/vB, por ejemplo: 2.5",
    )
    parser.add_argument(
        "--confirmations",
        type=int,
        default=1,
        help="Confirmaciones mínimas para los UTXOs. Predeterminado: 1.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("transaction.psbt"),
        help="Archivo de salida. Predeterminado: transaction.psbt.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Permite reemplazar el archivo de salida.",
    )

    args = parser.parse_args()

    if args.confirmations < 0:
        parser.error("--confirmations no puede ser negativo.")

    if args.fee_rate is not None and args.fee_rate <= 0:
        parser.error("--fee-rate debe ser mayor que cero.")

    try:
        blockchain = bitcoin_cli(
            args.network,
            None,
            "getblockchaininfo",
        )

        expected_chain = {
            "mainnet": "main",
            "testnet": "test",
            "testnet4": "testnet4",
            "signet": "signet",
            "regtest": "regtest",
        }[args.network]

        actual_chain = blockchain.get("chain")

        if actual_chain != expected_chain:
            raise BitcoinCLIError(
                f"Red incorrecta: se esperaba {expected_chain}, "
                f"pero Bitcoin Core reportó {actual_chain}."
            )

        bitcoin_cli(
            args.network,
            args.wallet,
            "getwalletinfo",
        )

        validation = bitcoin_cli(
            args.network,
            args.wallet,
            "validateaddress",
            args.address,
        )

        if not validation.get("isvalid", False):
            raise BitcoinCLIError(
                "La dirección no es válida para la red seleccionada."
            )

        outputs = [
            {
                args.address: format(args.amount, "f"),
            }
        ]

        options: dict[str, object] = {
            "add_inputs": True,
            "minconf": args.confirmations,
            "replaceable": True,
            "estimate_mode": "conservative",
        }

        if args.fee_rate is not None:
            options["fee_rate"] = format(args.fee_rate, "f")
        else:
            options["conf_target"] = 6

        result = bitcoin_cli(
            args.network,
            args.wallet,
            "walletcreatefundedpsbt",
            "[]",
            json.dumps(outputs, separators=(",", ":")),
            "0",
            json.dumps(options, separators=(",", ":")),
            "true",
        )

        psbt = result.get("psbt")

        if not isinstance(psbt, str) or not psbt:
            raise BitcoinCLIError(
                "Bitcoin Core no devolvió una PSBT válida."
            )

        # Comprueba que la PSBT pueda decodificarse, sin mostrar su contenido.
        bitcoin_cli(
            args.network,
            args.wallet,
            "decodepsbt",
            psbt,
        )

        save_private_file(args.output, psbt, args.force)

        print("PSBT creada correctamente.")
        print(f"Red: {args.network}")
        print(f"Cantidad: {args.amount} BTC")
        print(f"Comisión estimada: {result.get('fee')} BTC")
        print(f"Posición del cambio: {result.get('changepos')}")
        print(f"Archivo: {args.output.expanduser().resolve()}")
        print("Estado: sin firmar y sin transmitir")

        return 0

    except BitcoinCLIError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())