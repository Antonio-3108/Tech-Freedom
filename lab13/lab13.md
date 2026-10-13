# Token due diligence

## 1. Meme token: Peanut the Squirrel (PNUT)

- **Nombre / ticker:** Peanut the Squirrel / PNUT
- **Token mint:** `2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump`
- **Venue:** Pump.fun y Raydium (tras la migración)
- **Fecha de lanzamiento:** 31 oct 2024
- **Market cap:** al graduation $69 mil, en su peak $2.4 mil millones, ahora $47.4 millones
- **Precio:** $0.0477

**Movimientos grandes en las primeras 72 h**:

1. Compra inicial del creador: `HrHJputHcA8mkwrcQB3GkrJ2u1f7Fm4LzAZptSYSsUcf` obtuvo ~63.9 millones PNUT por ~USD 620 en SOL (31-10-2024). Es una compra, no una venta: alimenta el ítem de allocation. [Transacción](https://solscan.io/tx/wnSkKw9Pjim57CLgKk8x3djE6p1ek2SRchg4DLSNBCfLzhChLze5R9iZ3jmsXbPDyNVtK7o2XczDKygFcFRbrHu)
2. **Seller grande:** `J8ZWHVX5CjZWcHb1fqNVSiwjRy21WFj8mxvFDddjbHxv` vendió 15.97 millones PNUT (02-11-2024). [Wallet](https://solscan.io/account/J8ZWHVX5CjZWcHb1fqNVSiwjRy21WFj8mxvFDddjbHxv)

### Scores PNUT

| Criterio | Puntaje | Evidencia |
| --- | :---: | --- |
| 1. Clarity of unit | 2/2 | Token fungible sin derechos ni promesas: la unidad es clara, aunque no represente nada |
| 2. Supply / cap honesty | 2/2 | Supply fijo creado en pump.fun |
| 3. Allocation & unlocks | 1/2 | Sin allocation formal de team, pero el creador compró ~63.9 M en el launch y hubo ventas grandes en 72 h |
| 4. Sinks / spend | 0/2 | No tiene uso ni sinks: solo especulación |
| 5. Emission schedule | 2/2 | No hay emisión: supply fijo, sin inflación |
| 6. Value accrual falsable | 0/2 | Ningún flujo ni activo subyacente al que ligar la demanda |
| 7. Governance / admin keys | 1/2 | No hay gobernanza; falta confirmar las autoridades del token |
| 8. Liquidity & market structure | 1/2 | Liquidez en Raydium tras la migración; ventas grandes tempranas |
| 9. Disclosure & docs | 1/2 | Sin whitepaper ni documentación formal |
| 10. Jurisdiction / distribution risk | 0/2 | Sin regulador ni disclosure |
| **Total** | **10/20 (50 %)** | |

---

## Emisión Tohkn: IBER1

**Estado al 2026-10-13:** Abierta (según [tohkn.com/es/issuances](https://www.tohkn.com/es/issuances)).

### Datos de la emisión

- **Qué es:** bono corporativo tokenizado. Cada token IBER1 (valor de referencia $100) representa un derecho de crédito frente a Iberplastic, S.A. de C.V.; no es propiedad ni acciones.
- **Monto:** hasta $4,000,000 (40,000 tokens). Primer tramo: $2,000,000 (20,000 tokens), 7.00 % fijo anual, intereses mensuales, capital en un solo pago a los 24 meses. Los tramos siguientes tendrán entre 6 % y 11 %.
- **Colocación mínima del primer tramo:** $200,000. Si en 4 meses no se alcanza, se devuelven los fondos.
- **Pagos:** en USDT o USDC desde la app de TOHKN.
- **Chain y estándar:** Polygon, ERC-3643.
- **Registro:** emisor EAD-0047, emisión AD-00253 (CNAD). PSAD: MIO3, S.A. de C.V. (PSAD-0016). Certificador: Armor Analytics (CERT-0005).
- **Uso de fondos:** exclusivamente expansión y remodelación de las plantas de reciclaje de Iberplastic.

### Funcionalidad declarada vs. verificable on-chain

| Aspecto | Declarado en DIR / certificación / términos | Verificado on-chain |
| --- | --- | --- |
| Arquitectura | Modular ERC-3643: Identity Registry, Claim Topics y Trusted Issuers Registry, Modular Compliance y Token Contract | No (sin address) |
| Control de transferencias | Whitelist con KYC/KYB/KYT, listas de Personas Prohibidas, lockups cuando el DIR lo disponga | No |
| Poderes administrativos | ERC-3643 incluye freeze, forced transfer y la función de retiro ("recall") referida en el DIR; el contrato tiene pausa y control de acceso | No |
| Roles | El DIR no permite saber on-chain quién tiene owner / admin / agent. MIO3 concentra los roles de PSAD, agente de pago, custodio de billeteras (MPC), representante común interino y mandatario del emisor | No |
| Supply | Máximo 40,000 tokens; los tramos se aprueban uno a uno por el regulador | No |
| Cambio de reglas | El DIR dice que los contratos son inmutables, aunque ERC-3643 permite funciones de administración (pausa, freeze, forced transfer) | No |

### Claims off-chain vs. realidad on-chain

- **Disclosure sólido:** DIR, certificación, términos y aviso de oferta, con registro en la CNAD.
- **Riesgo financiero señalado por el propio certificador:** las proyecciones del emisor incumplen el covenant de liquidez (razón corriente mínima 1.5x) en todos los años proyectados, entre 1.12x y 1.43x. La cobertura de intereses y el endeudamiento sí cumplen.
- **Deuda quirografaria**, sin garantía real; el codeudor solidario es Escobas El Tucán.
- **Custodia por MIO3:** los titulares no controlan sus claves privadas.

### Scores IBER1

| Criterio | Puntaje | Evidencia |
| --- | :---: | --- |
| 1. Clarity of unit | 2/2 | 1 token = $100 de referencia = derecho de crédito; no es propiedad ni voto (página de la emisión y T&C §3) |
| 2. Supply / cap honesty | 1/2 | Tope claro (40,000 tokens / $4 M), pero sin address no se verifica el mint on-chain |
| 3. Allocation & unlocks | 1/2 | Calendario del primer tramo claro; los tramos posteriores y los lockups se definen aparte |
| 4. Sinks / spend | 1/2 | Fondos destinados a la expansión de plantas, pero el certificador nota que no hay cronograma técnico ni hitos verificables |
| 5. Emission schedule | 2/2 | Tasa fija 7 %, rango 6–11 % para tramos futuros, pagos mensuales y capital al vencimiento |
| 6. Value accrual falsable | 2/2 | Medible por covenants (cobertura de intereses, liquidez, endeudamiento) y por pagos reales en USDT/USDC |
| 7. Governance / admin keys | 1/2 | Roles documentados, pero concentrados en MIO3 y no verificables on-chain; ERC-3643 incluye freeze y forced transfer |
| 8. Liquidity & market structure | 1/2 | Mercado secundario solo en TOHKN, cuando se habilite, con KYC; liquidez no garantizada |
| 9. Disclosure & docs | 1/2 | Documentación completa y certificada, pero con la address sin verificar |
| 10. Jurisdiction / distribution risk | 2/2 | Marco claro: LEAD/CNAD, ley salvadoreña, Personas Prohibidas, KYC/KYB/KYT. |
| **Total** | **14/20 (70 %)** | |

---

## fair-launch vs. emisión regulada

PNUT y IBER1 muestran dos formas opuestas de resolver el mismo problema: qué pasa cuando alguien compra un token.

**El meme quita toda la fricción y todo el compromiso** PNUT se lanzó en segundos, sin regulador, sin disclosure y sin promesa económica. Su supply es fijo y no hay emisión, así que puntúa bien en claridad de unidad y calendario de emisión. Pero no tiene sinks, flujos ni activo subyacente, y por eso saca 0 en value accrual y en jurisdicción. Su precio pasó de $69 mil de market cap al graduarse a $2.4 mil millones en su máximo y luego a $47.4 millones, y esa trayectoria dependió de la atención del mercado y de unos pocos movimientos grandes, como la compra inicial del creador y las ventas tempranas. Cuando se quita el marketing, queda una unidad transparente pero vacía.

**IBER1 hace lo contrario: mucho compromiso, mucha fricción** Es un derecho de crédito con flujos definidos (7 % fijo, intereses mensuales, capital a 24 meses), registrado ante la CNAD, certificado por un tercero y con un DIR. Cuando se quita el marketing, sobrevive un reclamo legal y medible sobre los flujos de una empresa real. Ese reclamo se mide con covenants, y el propio certificador señala que el de liquidez no se cumple en las proyecciones, lo que es un riesgo real, pero también es evidencia de que el sistema permite verlo.

**La diferencia de control es la inversa de la económica** En el meme, el control es abierto y a la vez irrelevante: no hay claves de administración que importen (a confirmar en el explorer), pero tampoco hay nada que reclamar. En IBER1, el control está concentrado: MIO3 es PSAD, agente de pago, custodio con MPC, representante común interino y mandatario del emisor, y el estándar ERC-3643 incluye freeze, forced transfer y recall. El titular tiene un derecho económico, pero no controla sus claves ni las reglas de transferencia. Además, en esta auditoría no se pudo localizar la address del contrato, así que lo que dice la documentación no se puede contrastar on-chain: en transparencia, IBER1 es fuerte off-chain y débil on-chain.

**LEAD/CNAD frente a la fricción cero** La LEAD de El Salvador exige un emisor registrado, un certificador, un DIR, KYC/KYB/KYT y restricciones a Personas Prohibidas. Ese marco da recursos y reglas claras al inversionista a cambio de acceso limitado, verificación de identidad y liquidez no garantizada. El meme no pide nada de eso, y por lo mismo no ofrece ninguna protección. Si cualquiera de los dos se ofreciera a usuarios en Guatemala, habría que revisar si el oferente cae bajo la categoría de PSAV del Decreto 15-2026, que está vigente desde el 17 de septiembre de 2026 y cuyo reglamento sigue pendiente. Esto es una hipótesis, no asesoría legal.
