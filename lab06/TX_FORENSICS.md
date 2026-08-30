# Lab 06: Forense Taproot vs Ethereum

## 1. Ethereum

Contrato: `EtherSwap`

Dirección: `0x9f6fea1c76fc1961eed97c00124ef7d7a7b3d9ea`

### TX principal — Claim

| Campo                  | Valor                                                                              |
|------------------------|------------------------------------------------------------------------------------|
| Hash                   | `0x7ec4aac5fd922aa914a2c40093e515103539f151b02d98cea23cec98ecc555ef`               |
| Selector               | `0xc3c37fbc`                                                                       |
| Tamaño del calldata    | 132 bytes                                                                          |
| Función                | `claim(bytes32 preimage, uint256 amount, address refundAddress, uint256 timelock)` |

**Calldata crudo:**

```text
0xc3c37fbcbd512a8b7207d4d04ee7ddc7224961cfeb55f06641b2446fa8a86a3b115ee78b000000000000000000000000000000000000000000000000004e9fdabca44400000000000000000000000000b34817a34a965e426bbcbbffad085aa7b6a094260000000000000000000000000000000000000000000000000000000000b815b7
```

### Parámetros

| Elemento        | Valor                                                                |
|-----------------|----------------------------------------------------------------------|
| `preimage`      | `0xbd512a8b7207d4d04ee7ddc7224961cfeb55f06641b2446fa8a86a3b115ee78b` |
| `amount`        | `22130810000000000 Wei` (`0.02213081 ETH`)                           |
| `refundAddress` | `0xB34817A34E965E426BBcbBFFaD085Aa7B6a09426`                         |
| `timelock`      | `12064183`                                                           |
| `preimageHash`  | `0x712071d518bf6c5407f5e606c32cfe654541c72a3879dbc5edf293e8934aad54` |

### Todas las funciones del contrato

| Selector               | Función                                                                                | Mutabilidad  |
|------------------------|----------------------------------------------------------------------------------------|--------------|
| `0x0899146b`           | `lock(bytes32 preimageHash, address claimAddress, uint256 timelock)`                   | `payable`    |
| `0x35cd4ccb`           | `refund(bytes32 preimageHash, uint256 amount, address claimAddress, uint256 timelock)` | `nonpayable` |
| `0x54fd4d50`           | `version() returns (uint8)`                                                            | `view`       |
| `0xc3c37fbc`           | `claim(bytes32 preimage, uint256 amount, address refundAddress, uint256 timelock)`     | `nonpayable` |
| `0xeb84e7f2`           | `swaps(bytes32) returns (bool)`                                                        | `view`       |

### TX de verificación — Lock

| Campo                  | Valor                                                                |
|------------------------|----------------------------------------------------------------------|
| Hash                   | `0x3061cd37ce12acbaa816a6ce1e8779ecbf26e27c5980d5d3b9acf40d517c3748` |
| Selector               | `0x0899146b`                                                         |
| Tamaño del calldata    | 100 bytes                                                            |
| Función                | `lock(bytes32 preimageHash, address claimAddress, uint256 timelock)` |
| `preimageHash`         | `0x712071d518bf6c5407f5e606c32cfe654541c72a3879dbc5edf293e8934aad54` |
| `claimAddress`         | `0x89aDC1d19ccF3e5E74550CDB831594013CFDD83c`                         |
| `timelock`             | `12064183`                                                           |
| Value                  | `0.02213081 ETH`                                                     |

---

## 2. Bitcoin

**TX principal — Sweep**

TXID:

```text
1dcbeb24cbdbd60befed91d8ecbf2a067dad3dcc5b1b8d179bb16dfab481e994
```

| Campo                  | Valor                       |
|------------------------|-----------------------------|
| Tipo de gasto          | Taproot `script-path` spend |
| Network                | Bitcoin mainnet             |
| vbytes                 | 142 vbytes                  |
| Input witness elements | 4                           |

### Script de la hoja utilizada

```text
OP_SHA256 <payment_hash> OP_EQUALVERIFY <buyer_xonly_pubkey> OP_CHECKSIG
```

**Script:**

```text
a82002f87182ea2b8072ac76ff44a863583601753b95de696a7775b43fcbc6ead960882086f4c588a351207179ac1b2311b9f7fc7260b7541fa7166997b2d7eca95e0d29ac
```

### Árbol Taproot

```text
             TapBranch
             /       \\
        Hashlock    Timelock
          claim       refund
```

Hojas documentadas:

```text
Claim:
OP_SHA256 <payment_hash> OP_EQUALVERIFY <buyer_pubkey> OP_CHECKSIG

Refund:
<locktime> OP_CHECKLOCKTIMEVERIFY OP_DROP <seller_pubkey> OP_CHECKSIG
```

El control block contiene un hash hermano, por lo que para esta hoja se muestra una hoja alternativa en el árbol. Con los datos del control block de esta TX se puede identificar esa relación, pero no se puede determinar que existan más hojas aparte de las documentadas.

### TX de verificación — Funding / Lock

TXID:

```text
7739c731252bff34b35a7f4ba6b3f7f46494e67564c0fc8a50a2e5d11c2955b4
```

| Campo | Valor |
|---|---|
| Tipo | Funding / Lock TX |
| Network | Bitcoin mainnet |
| vbytes | 154 vbytes |
| Swap output | `vout 0` |
| Swap output value | `15,000 sats` |
| Swap output script | `5120b9289ef4e1e27a5a1470b905ff438bc2b9ce8a1754bb816fccfa50261e6a3516` |

---

## 3. Comparación: cuatro dimensiones

### 1. Visible antes del gasto

**Ethereum:** el contrato, sus funciones y el calldata de cada interacción son públicos. En el `claim` analizado se publican el selector y los cuatro parámetros.

**Taproot:** el output de funding muestra un P2TR (`OP_1` + clave de salida de 32 bytes). El árbol de scripts no aparece en el `scriptPubKey`.

### 2. Visible después del gasto

**Ethereum:** el `claim` publica la preimagen en el calldata y el contrato registra el claim.

**Taproot script-path:** el gasto publica la firma, la preimagen, la hoja usada y el control block. La hoja alternativa de refund no aparece como parte de este witness.

### 3. Costo de agregar una condición

**Ethereum:** una condición nueva que requiera lógica adicional implica modificar el código del contrato o desplegar una nueva versión.

**Taproot:** una condición alternativa puede añadirse como otra hoja del árbol; al gastar una hoja por `script-path`, las demás no se incluyen en el witness de ese gasto.

### 4. Superficie de auditoría

**Ethereum:** ABI, bytecode, funciones, eventos y estado del contrato.

**Taproot:** clave de salida, hojas Tapscript, raíz de Merkle y control blocks necesarios para demostrar la hoja gastada.

---

## 4. Conclusión: ¿Taproot o EVM es "mejor"?

**Privacidad:** Taproot tiene ventaja cuando se usa `key-path`, porque el gasto puede no revelar las hojas del árbol. En la TX BTC analizada se usó `script-path`, por lo que sí se revela la hoja de claim y el control block.

**Costo:** en el caso observado, la TX Bitcoin de `script-path` fue de 142 vbytes. El tamaño de un gasto EVM depende del calldata y del gas consumido por el contrato; en el `claim` analizado el calldata fue de 132 bytes.

**Auditoría:** EVM ofrece una superficie de auditoría explícita a nivel de contrato: funciones, ABI, bytecode y estado. Taproot requiere revisar la salida, las hojas, la raíz y las pruebas de inclusión del árbol.

**Flexibilidad:** EVM es más flexible para lógica de contrato, múltiples funciones y estado persistente. Taproot separa condiciones en hojas y limita la lógica a las capacidades del script.

Para un HTLC donde se priorizan privacidad y menor exposición de condiciones no utilizadas, Taproot tiene ventaja. Para lógica programable compleja y estado persistente, EVM tiene ventaja. Por tanto, no hay un ganador absoluto: el criterio determina cuál es mejor.
