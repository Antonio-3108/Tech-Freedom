# P2P.md — Token de la U (Lab 16)

## Que hice?

Con Node.js, `hyperswarm` y `hypercore` realize tres cosas:

1. **Mensaje P2P:** dos peers se encontraron por el topic definido (`cs031-s19-20261012`, SHA-256, primeros 8 hex: `35276680`) y se intercambiaron `ping desde <carnet>`. Los logs de ambos lados están en `logs-kickoff.txt`.
2. **Transferencia:** un archivo de 360000 bytes (22 bloques de 16 KB, sin PII) pasó de un seeder a un downloader con Hypercore. Llegaron 22/22 bloques y el hash SHA-256 de `archivo.txt` y `recibido.txt` coincidió.
3. **Kill-seeder:** termine el proceso del seeder a mitad de la descarga. El downloader recibió 13/22 bloques y quedó incompleto. Los logs están en `logs-transferencia.txt`.

```
topic (SHA-256 de un string acordado, 32 bytes)
   │
   ▼
DHT lookup (HyperDHT, entrando por bootstrap nodes)
   │   los peers anuncian y buscan el mismo topic
   ▼
holepunch / conexión (UDP, handshake con la publicKey del peer)
   │
   ▼
exchange: mensaje directo, o bloques de un Hypercore replicados
          (para el archivo, el topic es el discoveryKey del core)
```

## Infraestructura que si se uso

- **Bootstrap nodes de HyperDHT** - Son los puntos de entrada al DHT. No los configure, vienen por defecto en la librería.
- **Relays** - No se observo ninguno. Los dos peers estaban en la misma red local, así que la conexión terminó siendo directa por IP privada.
- El seeder fue el único proveedor del archivo.

## Qué vio cada peer

Cada proceso recibió de su contraparte:
- su dirección IP
- su puerto
- su publicKey,
- el topic / discoveryKey al que se unieron los peers
- los tiempos** de cada conexión y de cada bloque pedido

Al matar al seeder, el downloader vio `connection timed out` unos 14 segundos después del último bloque recibido, y poco después un `REQUEST_TIMEOUT` en el bloque 14. Como no quedaba otro seeder, la descarga no se pudo completar. La disponibilidad dependió de que alguien tuviera los bloques y estuviera conectado.

## Liability: host centralizado vs. usuarios que seedean

| Aspecto | Host centralizado | P2P |
| --- | --- | --- |
| Quién recibe takedowns y requerimientos | El operador del servicio | No hay operador central de contenido, recae sobre quienes seedean y sobre quien coordina o distribuye el software |
| Moderar, banear, guardar logs, KYC | Puede hacerlo desde un solo punto | Difícil ya que cada peer decide lo que sirve |
| Costos de operación | Los paga el operador | Se reparten entre los peers |
| Punto único de apagado | Sí | No pero depende de que haya seeders |


## Napster y Grokster vs BitTorrent

- **Napster** tenía un índice central de qué archivos tenía cada usuario, aunque los archivos se transferían entre usuarios. Ese servidor central fue lo que lo hizo vulnerable, se le consideró responsable por la infracción de sus usuarios y terminó cerrado.
- **Grokster** no tenía índice central, así que su arquitectura era más descentralizada. Aun así, se le consideró responsable por inducement (quien distribuye una herramienta con el objetivo de promover su uso para infringir derechos de autor responde por esas infracciones).
- **BitTorrent** es un protocolo para repartir un archivo en pedazos entre seeders y leechers. Históricamente usaba trackers como coordinadores, y las variantes con DHT reducen esa dependencia sin llevarla a cero. El protocolo es neutral, la exposición recae en quienes indexan o promueven contenido infractor y en los usuarios que lo comparten.


## Decreto 15-2026

Aunque el venture corriera sobre una red P2P sin servidor, si algún día los puntos fueran transferibles o canjeables por valor fuera de la universidad y el venture se convirtiera en un Proveedor de Servicios de Activos Virtuales, el Decreto 15-2026 lo seguiría tratando como el grupo obligado, con deberes como conocer al cliente y reportar operaciones sospechosas a la IVE, porque esas obligaciones dependen del servicio que prestamos y no de que haya un servidor.