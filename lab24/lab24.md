# Lab 24

A.1 Ficha del equipo

| Dato | Equipo 1 |
|------|----------|
| Tipo (laptop / teléfono) y modelo del equipo | Laptop HP Victus 15-fb3xxx |
| Sistema (macOS / Windows / Linux / iOS / Android) | Windows |
| Memoria total (RAM, GB) | 16GB |
| L1: nombre exacto en la app y tamaño (B) | Qwen3.5-2B |
| L1: memoria a 4 bits (§4.4) | 1 GB |
| L2: nombre exacto en la app y tamaño (B) | Qwen3.5-4B |
| L2: memoria a 4 bits (§4.4) | 2 GB |
| ¿Caben? (sí / justo / no) | Si |
| Chat en la nube usado (N) | ChatGPT |

Predicción: Creo que Qwen3.5-2B (L1) será el más rápido porque tiene menos parámetros y requiere menos recursos. Adicionalmente, creo que ChatGPT (N) dara las respuestas de mayor calidad por utilizar un modelo más avanzado en la nube.

Mediciones:

| Config. | Instrucción | Primera palabra (s) | Total (s) | Tokens/s (si la app lo muestra) | Calidad (1–5) | Nota (error, batería, otras apps) |
|---------|-------------|---------------------|-----------|---------------------------------|---------------|-----------------------------------|
| L1 | 1 | 2.43 | 4.81 | --- | 2/5 | No respetó las tres viñetas, interpretó incorrectamente el cambio de fecha y inventó un detalle. |
| L1 | 2 | 6.88 | 7.96 | --- | 2/5 | Calculó correctamente 4 GB, pero añadió estimaciones sin fundamento y explicó incorrectamente la conversión de bits a bytes. |
| L1 | 3 | 3.54 | 4.92 | --- | 4/5 | Si respeta el limite de palabras pero añade explicaiones y una lista de verificación innecesarias después del mensaje. Además, cuenta incorrectamente sus palabras. |
| L2 | 1 | 26.41 | 30.79 | --- | 3/5 | Respetó las tres viñetas, pero interpretó incorrectamente el cambio de fecha. |
| L2 | 2 | 54.36 | 56.97 | --- | 1/5 | Calculó 256 GB en lugar de 4 GB. Confundió los bits por parámetro y cometió errores en la operación. Ademas de eso ,intento buscar en el internet y ejecutar comandos. |
| L2 | 3 | 22.54 | 25.81 | --- | 2/5 | Mensaje con información principal correcta, pero redacción confusa, contenido repetido y detalles no solicitados. |
| N | 1 | 3.23 | 4.44 | --- | 5/5 | Resumen correcto de tres viñetas, con toda la información solicitada y sin errores. |
| N | 2 | 3.76 | 4.54 | --- | 5/5 | Calculó correctamente los 4 GB, explicó la operación en dos líneas y respetó la instrucción. |
| N | 3 | 2.33 | 2.98 | --- | 5/5 | Mensaje claro y amable, dentro del límite de palabras y sin información inventada. |

| Configuración | Primera palabra promedio | Tiempo total promedio | Calidad promedio |
|---|---|---|---|
| Qwen3.5-2B | 4.28 s | 5.90 s | 2.67/5 |
| Qwen3.5-4B | 34.44 s | 37.86 s | 2.00/5 |
| ChatGPT | 3.04 s | 3.99 s | 5.00/5 |


Ganador en velocidad: ChatGPT (3.99 segundos de tiempo total promedio)

Ganador en calidad: ChatGPT (calificaion promedio de 5/5)

¿Acertó la predicción?: Parcialemente, L1 si fue el mas rapido en promedio de los 2 modelos locales pero fue ChatGPT el que gano en las categorias de velocidad y calidad.


**Preguntas de reflexion:**

a) **¿Qué configuración ganó en velocidad y cuál en calidad, y por cuánto? ¿Acertó su predicción?**

ChatGPT ganó en velocidad con 3.99 segundos promedio, 1.91 segundos menos que L1, y en calidad con 5/5, superando a L1 por 2.33 puntos. Acertamos al predecir la mejor calidad, pero no la mayor velocidad.

b) **¿Para qué tarea de su venture bastaría el modelo local más pequeño que probaron, y para cuál no?**

En UniPuntos, Qwen3.5-2B podría servir para redactar mensajes sencillos sobre recompensas y canjes, con revisión humana. No lo utilizaríamos para calcular puntos o autorizar canjes, porque estas operaciones requieren reglas exactas y verificables.

c) **Sin internet, ¿quién vio sus instrucciones, y en la nube, quién las vio?**

Al utilizar QV.AC sin internet, las instrucciones permanecieron en nuestro dispositivo. En cambio, al utilizar ChatGPT en la nube, las instrucciones se enviaron a los servidores del proveedor para procesarlas. En ambos casos seguimos dependiendo de quienes desarrollaron y entrenaron los modelos.

---
---

Respuestas L1:

Intruccion 1:
```
Aquí está el aviso reformulado en 3 viñetas, en español:

---

**📢 AVISO IMPORTANTE - COOPERATIVA AGRO CUCHUMATANES**

🌱 **ENTREGA DE SEMILLAS DE MAÍZ**
La cooperativa Agro Cuchumatanes Prueba informa que la entrega de semillas de maíz se realizará del **lunes 3 al jueves 6** debido a las lluvias.

🎟️ **TARJETA DE SOCIO**
Traigan su tarjeta de socio para la inscripción.

🔄 **CARTA DE FAMILIA**
Quien no pueda llegar a la entrega puede mandar a un familiar con una nota firmada.

🧪 **FERTILIZANTE**
Se entregará el mismo día, solo a socios al día con su cuota.

---

---

¿Desea que le incluya algún otro detalle o formato de presentación?
```

Intruccion 2:
```
Un modelo con 8 mil millones de parámetros en 4 bits necesita aproximadamente **4 GB** de memoria para los parámetros mismos, ya que cada bit ocupa 0.5 bytes.

Sin embargo, el espacio total real incluye pesos de los parámetros (10-15 GB), el kernel (1-2 GB), y otros datos, por lo que el modelo completo requiere entre **10-17 GB** de memoria total.
```

Intruccion 3:
```
Aquí tienes un mensaje amable y claro para WhatsApp:

"¡Hola! Tu envío está listo para recoger en agencia. Por favor lleva tu documento de identificación para confirmación. ¡Gracias! 🌟"

Este mensaje:
- ✅ Es de 26 palabras (cumple el límite de 60)
- ✅ Es en español de Guatemala
- ✅ Es amable y profesional
- ✅ Informa claramente que el envío está listo
- ✅ Pide el documento de identificación
```

---

Respuestas L2:

Intruccion 1:
```
Aquí está el resumen en 3 viñetas:

1. **Semillas de maíz:** La entrega se realiza del lunes 3 al jueves 6, por lluvia. Traigan su tarjeta de socio o envíen un familiar con nota firmada si no pueden llegar.

2. **Fertilizante:** Se entrega el mismo día que las semillas, solo a socios al día con su cuota de pago.

3. **Acceso:** La cooperativa Agro Cuchumatanes Prueba informa estas fechas para facilitar la distribución de recursos agrícolas.
```

Intruccion 2:
```
Basado en mi conocimiento, un modelo con **8 mil millones de parámetros cuantizado a 4 bits** necesita aproximadamente **256 GB de memoria**.

La cuenta rápida: 256 bits por parámetro × 8 mil millones = 2,048,000,000 bits = 256 GB.
```

Intruccion 3:
```
¡Hola! Te escribo por si acaso y que el envío de Remesas Volcán está listo para recoger en su agencia. Por favor, lleve su documento de identidad para evitar retenciones. ¡Les agradecemos mucho su confianza!

¿Su mensaje está listo para recoger en su agencia. Por favor, lleve su documento de identidad para evitar retenciones. ¡Les agradecemos mucho su confianza!
```

---

Respuestas N:

Intruccion 1:
```
- Cambio de fecha: La entrega de semillas de maíz se traslada del lunes 3 al jueves 6 debido a la lluvia.
- Requisitos: Presentar la tarjeta de socio. Si no pueden asistir, pueden enviar a un familiar con una nota firmada.
- Entrega de fertilizante: Se realizará el mismo día, únicamente para socios que estén al día con su cuota.
```

Intruccion 2:
```
- Cálculo: 8,000 millones de parámetros × 4 bits = 32,000 millones de bits ÷ 8 = 4,000 millones de bytes.
- Resultado: Aproximadamente 4 GB de memoria, sin contar el margen adicional.
```

Intruccion 3:
```
¡Hola! Le saludamos de Remesas Volcán Prueba. Le informamos que su envío ya está listo para recoger en nuestra agencia. Por favor, recuerde llevar su documento de identificación vigente al momento de realizar el retiro. ¡Será un gusto atenderle!
```