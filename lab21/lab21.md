### Parte B: análisis de un caso real de ZKP

Caso seleccionado: Zcash

Zcash es una criptomoneda que utiliza pruebas de conocimiento cero (ZKP) para permitir transacciones protegidas. Esto significa que la red puede verificar que una transacción cumple las reglas del protocolo sin conocer la información privada del remitente y del destinatario. El protocolo Orchard utiliza zk-SNARKs mediante Halo 2, permitiendo comprobar transacciones sin revelar sus datos protegidos.

| Fila | Contenido |
| --- | --- |
| Qué se prueba | Que una transacción cumple las reglas del protocolo, como la autorización para gastar fondos y la conservación del valor, sin revelar los datos privados. |
| Dato secreto | Las claves privadas y los datos protegidos de la transacción, como las direcciones y los montos transferidos. |
| Probador y verificador | El probador es la billetera del usuario que genera la prueba. Los verificadores son los nodos de la red Zcash que comprueban su validez. |
| Qué ve el verificador | La prueba criptográfica y los datos públicos necesarios para validarla, como compromisos y nullifiers, pero no las direcciones ni los montos protegidos. |
| Interactiva o no / SNARK o STARK / configuración confiable | Es una prueba no interactiva de tipo zk-SNARK. Orchard utiliza Halo 2 y no requiere una ceremonia de configuración confiable. |
| Qué confianza queda | Se debe confiar en que el circuito criptográfico y su implementación sean correctos, que las claves permanezcan protegidas y que los nodos apliquen correctamente las reglas del protocolo. |
| Fuente | Zcash, ZIP 224: Orchard Shielded Protocol. https://zips.z.cash/zip-0224 |

### Reflexión
a) En la cueva, ¿qué convenció al verificador si nunca oyó la palabra?
El verificador se convenció porque el probador respondió correctamente a los retos aleatorios repetidos, sin necesidad de revelar la palabra secreta.

b) En el caso elegido, ¿cuál es el punto donde, si alguien miente o se equivoca, la ZKP prueba algo falso?
En Zcash, un error en el circuito criptográfico o en su implementación podría permitir validar una transacción incorrecta, aunque la prueba se verifique correctamente.

c) ¿Qué regla de su venture comprobarían así en vez de guardar el dato?
En un venture educativo, utilizaría ZKP para demostrar que un usuario es estudiante y puede acceder a un beneficio, sin necesidad de almacenar su carnet ni otros datos personales.

