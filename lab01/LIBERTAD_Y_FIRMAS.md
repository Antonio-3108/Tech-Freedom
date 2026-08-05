**Pregunta 1: ¿Cómo funcionan las firmas criptográficas?**

Las firmas criptográficas permiten demostrar que una persona posee una clave privada sin necesidad de revelarla. La clave privada se utiliza para firmar datos y debe mantenerse secreta; la clave pública sirve para verificar esas firmas y puede compartirse libremente. Si una firma se modifica la verificación falla porque los hashes comparados dejan de coincidir con el mensaje y la clave pública correspondiente. Esta comparacion garantiza tanto la autenticidad como la integridad de la información. La corrupción puede suceder por una alteración en el documento o un daño en el código de la firma.

Una firma ERC-712 contiene datos estructurados, como el mensaje que se firma, el tipo de datos y un dominio con información como el nombre de la aplicación, la versión y el chainId, que un contrato inteligenteen Ethereum puede validar de manera segura. A diferencia de una firma "bruta", que solo firma un mensaje, ERC-712 agrega contexto para que la firma solo sea válida para una aplicación y una red específicas, reduciendo el riesgo de que pueda reutilizarse en otro lugar.


**Pregunta 2: ¿Por qué esto importa para la libertad?**

Las firmas criptográficas son importantes para la libertad porque permiten demostrar la identidad de una persona sin depender de una autoridad central. En lugar de confiar en un banco, una empresa o un gobierno para validar una transacción, la prueba la proporciona la propia firma generada con la clave privada. Además, ofrecen no repudiación, ya que quien firma no puede negar posteriormente su participación, y son resistentes a la censura, porque la validez de una firma depende únicamente de las reglas criptográficas y no de la decisión de un tercero.

Esto se relaciona con la filosofía de la UFM sobre la confianza minimizada y el poder individual, porque la seguridad se basa en las matemáticas en lugar de la confianza en instituciones. Al final cada persona mantiene el control de su propia identidad y puede interactuar directamente con otros sin intermediarios, promoviendo una mayor autonomía y responsabilidad individual.


**Pregunta 3: Viem vs. ethers.js**

Un desarrollador moderno elegiría Viem porque ofrece una API más clara, un mejor soporte para TypeScript, un menor tamaño de librería y tiene un diseño más modular a comparacion que el de ethers.js. Viem fue diseñado desde cero pensando en el desarrollo actual, cada función se importa de manera independiente lo que permite que el bundle final sea más liviano y que el código sea más fácil de mantener.

Adionalmente, Viem es la base sobre la que está construido Wagmi, una de las bibliotecas más utilizadas para desarrollar aplicaciones Web3 con React. Como ambas herramientas son mantenidas por el mismo equipo, se integran de forma natural. Wagmi usa internamente las funciones de Viem para leer contratos, firmar mensajes y manejar cuentas. Por estas razones, el ecosistema Ethereum se está moviendo cada vez más hacia Viem, y dominarlo ahora prepara a un desarrollador para trabajar con las herramientas más actuales del stack Web3.


**Pregunta 4: Comparación de seguridad**

Si alguien intentara falsificar la firma ERC-712 en una aplicación blockchain no podría generar una firma válida sin conocer la clave privada, ya que hacerlo requeriría resolver el problema de el logaritmo discreto sobre la curva elíptica secp256k1 que es computacionalmente inviable con la tecnología actual. El componente v es importante porque ayuda a recuperar la clave pública correcta durante la verificación, eliminando una ambigüedad matemática que de otra forma dejaría dos posibles claves candidatas.

El dominio EIP-712 vincula la firma a una aplicación y una red específicas, evitando que una firma válida pueda reutilizarse en otra blockchain o en una aplicación diferente. Como el nombre, la versión y el chainId forman parte del hash que se firma, cambiar el contexto produce un hash completamente diferente, y la verificación termina fallando.