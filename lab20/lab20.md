### A.1. Estado real del proyecto

El Global Chess Passport es una propuesta de Algorand Foundation y World Chess para crear una identidad digital portátil para ajedrecistas mediante identificadores descentralizados (DID) y credenciales verificables (VC).

**Hechos:** En abril de 2025 se publicó el whitepaper. En octubre de 2025 se anunció el futuro Global Chess Passport y existe una aplicación de demostración en GitHub con información simulada.

**Promesas:** Permitir compartir ratings, títulos y reputación entre plataformas, con mayor privacidad y sin repetir verificaciones.

**Estado real:** Al 16 de octubre de 2026, el proyecto está en desarrollo a pequeña escala. No hay evidencia de lanzamiento público ni adopción por la FIDE.

### Triángulo de identidad

| Credencial | Emisor (Issuer) | Holder | Verificador |
|---|---|---|---|
| Rating ≥ 2000 | World Chess | Jugador que guarda la VC en su billetera | Organizador de un torneo |
| Buena conducta | Plataforma que evalúa la conducta | Jugador que guarda la VC | Otra plataforma de ajedrez |

El emisor firma la credencial, el jugador la conserva y el verificador comprueba su validez.

### ¿Quién ve qué?

| Actor | Ve o podría ver | No ve / incertidumbre | Fuente |
|---|---|---|---|
| Emisor | Datos que certifica y credencial emitida | No se especifica acceso a otras credenciales | [1] |
| Jugador | Sus propias credenciales e identidad | No tiene acceso automático a las de otros jugadores | [1] |
| Verificador | Credenciales presentadas por el jugador | No debería acceder a información no compartida; falta comprobarlo | [1] |
| Blockchain pública | Metadatos o pruebas verificables, según el diseño | Los datos personales se proponen off-chain; el contenido exacto on-chain no está definido | [1] |
| Persona que roba las 24 palabras | Podría recuperar claves y acceder a credenciales | No se conoce el alcance exacto del acceso en la implementación | [1][2] |

### Divulgación selectiva, revocación y correlación

**Divulgación selectiva — No se sabe si funciona.** El whitepaper indica que estas técnicas "should be used where possible". La intención es mostrar únicamente información necesaria, pero no se demuestra una implementación concreta. Concepto: privacidad y divulgación selectiva.

**Revocación — Sí, en el diseño.** El documento indica "VCs can be revoked by the issuer". Un emisor podría invalidar credenciales por trampas, aunque el mecanismo técnico no está especificado. Concepto: revocación.

**Correlación — Sí, existe el riesgo.** Reutilizar la misma DID permite relacionar la actividad de varias plataformas. El whitepaper señala "A user could decide to have multiple DIDs". Concepto: correlación de identidades.

### A.5. ¿Qué se rompe y qué cambiaríamos?

- **Falla 1:** Una plataforma revoca erróneamente la credencial de buena conducta. Esto podría perjudicar al jugador en otros torneos, incluso sin haber cometido una infracción.
- **Falla 2:** Un jugador pierde su frase de recuperación de 24 palabras y podría perder el control de su identidad digital.

**Cambio de diseño:** Proponemos incorporar un mecanismo opcional de recuperación mediante contactos de confianza y rotación de claves, sin depender exclusivamente de la frase de 24 palabras. Esto reduciría el riesgo de perder permanentemente el acceso a la identidad.

### Fuentes

1) [Whitepaper oficial — Algorand y World Chess](https://algorand.co/universal-chess-passport)
2) [Repositorio GitHub — Chess Passport](https://github.com/algorandfoundation/chess-passport)
3) [Alianza Algorand y World Chess — Octubre 2025](https://algorand.co/blog/algorand-and-world-chess-renewed-strategic-partnership-features-an-innovative-web3-business-model)