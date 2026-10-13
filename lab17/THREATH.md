## Circuitos observados para torproject.org

- Circuito 1: Suiza (guard) → Estados Unidos (middle) → Alemania (exit)
- Circuito 2 (tras "New Tor Circuit for this Site"): Suiza (guard) → Finlandia (middle) → Austria (exit)

Qué cambió y qué no: cambiaron el middle y el exit. El guard se mantuvo (Suiza), porque Tor conserva el mismo guard.

## Quién ve qué

| Actor | Circuito 1 | Circuito 2 | Qué ve |
| --- | --- | --- | --- |
| ISP / red local | Red de mi casa | Red de mi casa | Que hablan con el Guard, o sea que usan Tor. |
| Guard | Suiza | Suiza | IP del cliente; siguiente = Middle. No ve el destino final. |
| Middle | Estados Unidos | Finlandia | Solo hops vecinos. Ni la IP del cliente ni el destino final. |
| Exit | Alemania | Austria | Destino clearnet (torproject.org), ve el payload si no es HTTPS. |
| Sitio | torproject.org | torproject.org | La IP del Exit, no la del cliente. |


## Contraste con el navegador normal

| Actor | Navegador normal (HTTPS) | Tor Browser (HTTPS) |
| --- | --- | --- |
| ISP / red local | Ve el dominio destino (DNS/SNI), tiempos y volumen, no el contenido | Ve que te conectas a Tor (Guard), tiempos y volumen, no el destino |
| Sitio | Mi IP real | La IP del Exit (Alemania / Austria, según el circuito) |

Si el exit fuera malicioso, con este sitio HTTPS podría ver que me conecto a torproject.org, cuándo y cuánto tráfico, y no podría ver mi IP real ni el contenido (rutas, contraseñas, JSON) bajo TLS válido.

---

## Data flow analizado: login del estudiante

Un estudiante abre la app de venture, inicia sesión con su carnet y contraseña, y ve su saldo de puntos para canjearlos (parqueo, comercios, servicios). Es el flow más sensible del venture porque une **identidad**, **cuenta** y **saldo** en una sola sesión.

## Solo HTTPS vs Tor vs I2P

| Pregunta | Solo HTTPS | Tor (clearnet vía exit) | I2P (in-net) |
| --- | --- | --- | --- |
| ¿Quién aprende la IP del usuario? | La red local/ISP y el venture (el servidor ve la IP real) | La red local/ISP (ve que se conecta a Tor) y el guard. El venture solo ve la IP del exit | La red local/ISP (ve uso de I2P) y los routers vecinos de su túnel. El servicio ve un identificador criptográfico, no la IP |
| ¿Quién aprende el destino? | La red local/ISP (dominio vía DNS/SNI) y el venture | El exit (dominio/IP de venture) y el venture. No el ISP, el guard ni el middle | Solo el servicio, porque el destino vive dentro de I2P. Los relays no ven el destino final |
| ¿Quién puede leer el payload? | Solo el usuario y el servidor del venture (TLS) | Igual bajo HTTPS válido. Si fuera HTTP, el exit lo leería | Solo el usuario y el servicio (cifrado extremo a extremo dentro de la red) |
| ¿Qué se rompe si el exit / un relay es malicioso? | No aplica (no hay relays). El riesgo es una red local hostil o un certificado falso | Un exit malicioso ve destino, tiempos y volumen; con HTTPS válido no ve rutas, contraseñas ni JSON. Si el usuario ignora una alerta de certificado, sí | No hay exit en el uso in-net. Un router malicioso solo ve tráfico cifrado y vecinos. Si se saliera a clearnet por un outproxy, el riesgo sería como el del exit de Tor |
| ¿Qué se rompe si el usuario inicia sesión? | Nada nuevo: ya se asumía que el venture lo identifica | El anonimato frente al venture se pierde: ve carnet, cuenta y sesión aunque no vea la IP. Las cookies lo ligan entre visitas | Igual: el servicio identifica la cuenta por carnet, aunque no vea la IP |
| Costo para el usuario | Mínimo: latencia normal, nada que instalar | Más latencia, captchas o bloqueos de exits, y usar Tor Browser | Alto: instalar un router I2P, esperar a que integre, y solo funciona con servicios in-net |
| ¿Qué sigue viendo el venture (y debe ver si es Persona Obligada)? | IP real, carnet, cuenta, saldo, canjes, dispositivo y tiempos. Todo lo que necesitaría registrar | IP del exit, carnet, cuenta, saldo, canjes y tiempos. Pierde la IP real, pero conserva la identidad y las transacciones | Identificador I2P, carnet, cuenta, saldo, canjes y tiempos. Igual: conserva identidad y transacciones |


## Adversarios

- **ISP y red local:** el HTTPS les oculta el contenido pero no el dominio. Tor les oculta el destino, aunque ven que se usa Tor. I2P también oculta el destino, aunque ven que se usa I2P.
- **El sitio:** HTTPS no le oculta nada. Tor le oculta la IP real, pero en el login conoce la identidad. I2P hace lo mismo con la IP.
- **Gobierno con visibilidad parcial:** puede ver tráfico en un extremo. Tor e I2P le ocultan el destino frente al ISP, pero no lo protegen si observa ambos extremos.
- **Correlación end-to-end:** un adversario que ve tanto la entrada como la salida de la red puede comparar tiempos y volumen y emparejar al usuario con su tráfico. Ni Tor ni I2P defienden de eso.

## Cosas que Tor NO protege en este flow

1. **El login.** Tor oculta la IP, no la identidad: con carnet y contraseña, el venture sabe quién es el usuario.
2. **El exit malicioso.** Ve el destino, los tiempos y el volumen. Con HTTPS válido no lee el contenido, pero con HTTP o ignorando una alerta de certificado sí.
3. **El fingerprinting y el comportamiento.** Cookies, patrones de uso y horarios pueden ligar las sesiones de un mismo usuario aunque cambie de circuito, sobre todo si no usa Tor Browser con su configuración por defecto.

## I2P

I2P es una red superpuesta pensada sobre todo para servicios que viven dentro de la propia red. Usa túneles de entrada y de salida separados y cifrado por capas, y todos los participantes enrutan tráfico de otros. En vez de IPs, los servicios tienen identificadores criptográficos. Para el venture, eso daría buen anonimato de red, pero exigiría que los estudiantes instalaran un router I2P y que el servicio viviera dentro de I2P, un costo de adopción muy alto para una app universitaria.