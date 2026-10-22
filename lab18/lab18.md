## Qué sabe y qué no lee el servidor de Signal

| Dato | ¿El servidor lo lee o lo sabe? | Qué puede entregar si se lo exigen |
| --- | --- | --- |
| Texto del mensaje | **No lo lee** (cifrado de extremo a extremo) | Nada |
| Que la cuenta existe | **Sabe** (la cuenta está registrada con un número) | Fecha y hora de creación de la cuenta |
| Cuándo se conectó el dispositivo | **Sabe** (ve las conexiones) | Fecha y hora de la última conexión |
| Tamaño aproximado del mensaje | **Lo ve en tránsito** (tamaño del mensaje cifrado, aproximado) | No figura entre lo que Signal ha entregado |
| Quién envió | **Con sealed sender, no lo ve** en el envoltorio del mensaje; sí sabe a quién va dirigido para poder entregarlo | Nada |
| IP mientras está conectado | **La ve** mientras dura la conexión; sealed sender no oculta la IP | No figura entre lo que Signal ha entregado |
| Lista de contactos / grupos | **No la conoce** | Nada |

### Contraste con signal.org/bigbrother

- Lo que el servidor ve en tránsito: lo mínimo para entregar mensajes, como el destinatario, la IP de la conexión, los tiempos y el tamaño aproximado.
- Lo que guarda y puede entregar: solo cuándo se creó la cuenta y cuándo fue la última conexión.

El servidor no puede leer el texto de los mensajes ni los contactos y grupos, pero sí sabe que la cuenta existe y cuándo se conectó.


# Evidencia del túnel WireGuard

## 1. Topología

- **Tipo:** laptop <-> VPS propio
- **Red:** red de casa
- **Peers:** peer A (`10.10.10.1`) y peer B (`10.10.10.2`)

## 2. Configuración (peer A)

```
[Interface]
PrivateKey = ---
ListenPort = 51820
Address = 10.10.10.1/32

[Peer]
PublicKey = R6SPcLzWKu3rir8uSZ/007MgIOeWwsWUuALmo56NUzM=
AllowedIPs = 10.10.10.2/32
Endpoint = ---:51820
PersistentKeepalive = 25
```

## 3. Qué ve cada quién

Mi ISP / la red ve paquetes UDP entre mi equipo y la IP del otro peer en el puerto 51820, con sus tiempos y tamaños, pero no el contenido ni qué se envía dentro del túnel. El otro peer del túnel ve el tráfico que mando por el túnel ya descifrado, mi llave pública y la dirección desde la que me conecto.