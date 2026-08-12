from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes


NUM_ADDRESSES = 10


def derive_addresses(mnemonic):
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()
    wallet = Bip44.FromSeed(seed_bytes, Bip44Coins.BITCOIN)

    results = []

    for i in range(NUM_ADDRESSES):
        address = (
            wallet
            .Purpose()
            .Coin()
            .Account(0)
            .Change(Bip44Changes.CHAIN_EXT)
            .AddressIndex(i)
        )

        results.append({
            "index": i,
            "path": f"m/44'/0'/0'/0/{i}",
            "address": address.PublicKey().ToAddress()
        })

    return results


def main():
    with open("seeds.txt", "r", encoding="utf-8") as file:
        seeds = [line.strip() for line in file if line.strip()]

    with open("resultados.txt", "w", encoding="utf-8") as output:

        for seed_number, mnemonic in enumerate(seeds, start=1):

            output.write("=" * 70 + "\n")
            output.write(f"SEMILLA #{seed_number}\n")
            output.write("=" * 70 + "\n")

            try:
                addresses = derive_addresses(mnemonic)

                for result in addresses:
                    output.write(
                        f"Index: {result['index']} | "
                        f"Ruta: {result['path']} | "
                        f"Dirección: {result['address']}\n"
                    )

            except Exception as e:
                output.write(f"Error: {e}\n")

            output.write("\n")


if __name__ == "__main__":
    main()