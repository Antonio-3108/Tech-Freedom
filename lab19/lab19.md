
**npub de test:** `npub160u3nrcsla7tz2w5t7emae2q2vfhngt23ykykkkgvgjgrna7ynnsg7gg20`
**id de la nota 1:** `a1aa0c3cf5c366579619d9fd5b3cbc1c1df6cc7bb90dff8516fe977df26d0385`

### Tabla de relays

| Relay | ¿Aceptó la nota 1? (respuesta OK) | ¿La devolvió al pedirla? | ¿Aceptó la nota #2 después del ban? |
| --- | --- | --- | --- |
| relay.damus.io | Sí: `publishing to relay.damus.io... success.` | Sí, con `nak req -i <id>` devolvió la nota completa | No probado (no hubo relay de clase para hacer el ban) |
| nos.lol | Sí: `publishing to nos.lol... success.` | Sí, devolvió la nota completa | No probado (no hubo relay de clase para hacer el ban) |
| nostr.wine (pago) | No: `failed: msg: restricted: sign up at https://nostr.wine to write events to this relay` | No: `nak req` conectó pero no devolvió ningún evento | No probado (no hubo relay de clase para hacer el ban) |


### Comprobación de firma

La nota original pasó `nak verify` sin error (válida), y la copia con una letra cambiada (`prueba` → `prueva`) falló con `invalid .id` (esperaba `7e61bc2e…` y tenía `a1aa0c3c…`) porque el id es el hash del contenido del evento: si el contenido cambia, el hash ya no coincide con el id y la firma, que cubre ese id, deja de ser válida.

### Reflexión

- Mi nota quedó en 2 de los 3 relays disponibles  (no hubo relay de clase); nostr.wine la rechazó con `restricted: sign up at https://nostr.wine to write events to this relay`.
- El ban no se pudo probar porque no hubo relay de clase, pero cada relay guardó la nota de forma independiente (damus y nos.lol la devolvieron por separado), así que un ban en un relay solo afectaría a ese relay y no a las copias en los demás.
- Si mi venture tuviera una cuenta Nostr, la nsec la guardaría en un gestor de secretos o en un firmador externo, nunca en el repo ni en el código, porque en Nostr la nsec es la identidad: si se filtra no hay forma de revocarla ni de recuperar la cuenta.