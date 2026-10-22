## (a) Forward secrecy y post-compromise security en Signal

Signal usa el Double Ratchet: cada mensaje se cifra con una clave nueva derivada de la anterior, y las claves ya usadas se borran. Gracias a eso, si un dispositivo se compromete a mitad de un chat, el atacante no puede descifrar los mensajes **pasados** que viajaron por la red, porque sus claves ya no existen (forward secrecy).

Para los mensajes **futuros**, Signal ofrece post-compromise security: cuando el atacante pierde el acceso al dispositivo, los intercambios Diffie-Hellman del ratchet generan claves nuevas que él no conoce y la conversación se recupera sola. Mientras el compromiso dura, en cambio, el atacante lee todo lo que llega y todo lo que se envía.

Hay un límite importante: el **historial guardado en el dispositivo** está en texto plano para la app, así que quien controle el dispositivo puede leerlo completo sin romper ninguna criptografía. La forward secrecy protege lo que viaja, no lo que se guarda.

## (b) Acceso excepcional: Signal vs. WireGuard

*Keys Under Doormats* (Abelson et al., 2015) sostiene que exigir acceso excepcional choca con prácticas como la forward secrecy, vuelve los sistemas más complejos y crea objetivos concentrados que atraen a los atacantes. Es el marco para ver qué tendría que cambiar cada mandato.

**Contra Signal.** Existe un proveedor, pero no puede leer el contenido, y según signal.org/bigbrother entrega muy pocos datos. Un mandato tendría que cambiar el cliente y el protocolo: conservar claves o añadir a un destinatario adicional en cada conversación. Eso rompería la forward secrecy y la post-compromise security para **todos** los usuarios, y la obligación recaería sobre quien distribuye la app.

**Contra WireGuard.** No hay proveedor ni servidor intermedio al cual exigirle nada: las llaves viven en cada peer y las claves de sesión son efímeras y se renuevan. Un mandato tendría que modificar el protocolo y sus implementaciones, que además son software libre, o ir contra cada operador de extremo, y en cualquier caso debilitar las claves efímeras.

En ambos casos se rompería el mismo principio: que nadie en el medio tiene las claves.

## (c) Tor vs. Signal vs. WireGuard para Token de la U

Para Token de la U, Tor esconde frente a la red local y al ISP a qué servicio se conecta el estudiante, pero no su identidad una vez que inicia sesión; Signal esconde el contenido de los mensajes frente al servidor y a la red, pero no que la cuenta existe ni cuándo se conecta; y WireGuard cifra el enlace entre dos puntos que controlamos, como un administrador y el backend, frente a la red local y al ISP, pero cada extremo ve todo lo que pasa por el túnel y la red sigue viendo IPs, tiempos y volumen.
