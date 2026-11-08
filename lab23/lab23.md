# Lab 23

Justificacion de prioridades:

- Prioridad 1: La conexión web y los datos KYC pueden ser almacenados por un atacante para intentar descifrarlos después.
- Prioridad 2: Sería para elementos que requieren una migración planificada, pero no tienen la urgencia de los anteriores.
- Prioridad 3: Signal ya incorpora mecanismos post-cuánticos, el precio del dólar es público, y el cifrado simétrico robusto es menos vulnerable a los ataques cuánticos.

---

Preguntas de reflexion:

a) **En el promedio secreto, ¿en quién tuvieron que confiar y en qué momento se rompió?**

Tuvimos que confiar en que cada participante mantuviera sus piezas privadas y anunciara correctamente su suma parcial. La privacidad se rompió cuando dos participantes colaboraron para calcular el salario del tercero.

b) **En el inventario, ¿cuál es el elemento que más urge y por qué "más adelante" no sirve para ese?**

Lo más urgente es proteger la conexión web que transmite datos financieros, porque un atacante podría almacenar las comunicaciones cifradas hoy y descifrarlas en el futuro. Migrar después no protegería los datos ya interceptados.

c) **En su venture, ¿qué dato calcularían cifrado (FHE) o repartido entre varias partes (MPC), y qué llave o firma migrarían primero a post-cuántica y por qué (piensen en "cosechar ahora, descifrar después")?**

En UniPuntos, utilizaríamos MPC para calcular cuántos puntos corresponden a cada estudiante sin que las distintas áreas de la universidad tengan que compartir sus registros individuales. Migraríamos primero las llaves de intercambio de la conexión entre la aplicación y el backend a un esquema híbrido post-cuántico, para evitar que información sensible interceptada hoy pueda descifrarse en el futuro.