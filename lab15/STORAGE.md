CID: bafkreid7qoywk77r7rj3slobqfekdvs57qwuwh5d2z3sqsw52iabe3mqne
Gateway: bronze-characteristic-camel-14.mypinata.cloud
Fecha: 2026-10-12
Resolve: si

## Qué datos maneja el venture

| Clase de dato | Sensibilidad | Durabilidad | Destino |
| --- | --- | --- | --- |
| Reglamento público de puntos | Baja | Alta | IPFS + pin |
| Catálogo de promociones | Baja | Baja | Location-addressed |
| Saldo y movimientos de puntos | Media | Media | Location-addressed |
| Comprobantes de canje | Media | Baja | Location-addressed |
| Notas académicas | Alta | Media | Never-permanent |
| Pagos de mensualidad | Alta | Media | Never-permanent |
| Identidad del estudiante | Alta | Media | Never-permanent |
| Reglamento final auditado | Baja | Muy alta | Raro permanence candidate |

Si unpinneamos, esperamos que el CID deje de resolver desde nuestro gateway de Pinata y que el contenido sobreviva solo si otro nodo lo conserva; como en IPFS solo hay contenido público de el venture no se deberian de perder ni exponer ningún dato de estudiantes.

## Availability vs. deletion policy

IPFS da integridad ya que el CID es el hash del contenido, así que si el CID resuelve, el contenido es el correcto. Lo que un IPFS no da es disponibilidad, porque esa depende de que alguien tenga el archivo pineado. Por eso mismo, todo lo que de podria necesitar borrar (datos personales, pagos, etc...) nunca se publica en IPFS.

## PSAV / 15-2026

El Decreto 15-2026 de Guatemala convirtió a los Proveedores de Servicios de Activos Virtuales (PSAV) en personas obligadas, supervisadas por la IVE. Si el venture permitiera transferir puntos o canjearlos por valor fuera de la universidad, tendríamos que evaluar si somos un PSAV y cumplir obligaciones como conocer al cliente y reportar operaciones sospechosas. Por eso, en esta etapa, los puntos son cerrados: no transferibles ni convertibles a dinero, y solo canjeables dentro de la universidad.

## Promesas

**Promesas que NO se haran:**
1. No pinnearemos PII, notas ni datos financieros de estudiantes.
2. No diremos que algo es permanente o seguro solo porque está en IPFS o en blockchain.
3. No prometeremos borrado total de algo que ya se publicó en IPFS público.

**Promesa que SI se hara:**
1. Mantendremos pineado el reglamento público de puntos y, cuando cambie, publicaremos un nuevo CID y diremos cuál es el vigente.
