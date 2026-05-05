# Google Sheets — Estructura de base de datos
## Agente LFT · Disrupting MEX

---

## Hoja 1: `usuarios`

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `numero` | Texto | Número WhatsApp con código de país | `525534844790` |
| `nombre` | Texto | Nombre del perfil de WhatsApp | `Mario R.` |
| `plan` | Texto | `free` / `plus` / `vulnerable` | `plus` |
| `consultas_usadas` | Número | Consultas usadas en el mes actual | `3` |
| `consultas_limite` | Número | Límite mensual según plan (8 free, -1 ilimitado) | `8` |
| `fecha_inicio` | Fecha | Fecha de primer contacto | `2026-05-01` |
| `fecha_renovacion` | Fecha | Próxima fecha de reset de consultas | `2026-06-01` |
| `fecha_expiracion` | Fecha | Expiración del plan Plus (vacío si free) | `2026-11-01` |
| `stripe_customer_id` | Texto | ID del cliente en Stripe | `cus_ABC123` |
| `stripe_subscription_id` | Texto | ID de suscripción activa en Stripe | `sub_XYZ789` |
| `meses_activo` | Número | Meses consecutivos con plan Plus activo | `3` |
| `precio_actual` | Número | Precio mensual actual según lealtad | `49` |
| `es_premium_manual` | Boolean | `TRUE` si fue activado manualmente por admin | `FALSE` |
| `notas_admin` | Texto | Notas internas del super admin | `` |
| `created_at` | Timestamp | Fecha y hora de creación del registro | `2026-05-01 10:32:00` |
| `updated_at` | Timestamp | Última actualización | `2026-05-04 18:15:00` |

**Notas:**
- `consultas_limite = -1` indica consultas ilimitadas (plan Plus o vulnerable)
- El campo `meses_activo` se usa para calcular el precio de lealtad automáticamente
- `es_premium_manual = TRUE` permite activar premium con clave secreta sin pasar por Stripe

---

## Hoja 2: `transacciones`

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `id` | Texto | ID único de la transacción | `txn_001` |
| `numero` | Texto | Número WhatsApp del usuario | `525534844790` |
| `tipo` | Texto | `suscripcion` / `prepago_6` / `prepago_12` / `despacho` | `suscripcion` |
| `plan` | Texto | Plan adquirido | `plus` |
| `monto` | Número | Monto en MXN sin IVA | `49` |
| `monto_total` | Número | Monto total cobrado con IVA | `56.84` |
| `moneda` | Texto | Siempre `MXN` | `MXN` |
| `stripe_payment_id` | Texto | ID del pago en Stripe | `pi_ABC123` |
| `stripe_invoice_id` | Texto | ID de la factura en Stripe | `in_XYZ789` |
| `status` | Texto | `pagado` / `fallido` / `reembolsado` / `pendiente` | `pagado` |
| `periodo_inicio` | Fecha | Inicio del período pagado | `2026-05-01` |
| `periodo_fin` | Fecha | Fin del período pagado | `2026-06-01` |
| `created_at` | Timestamp | Fecha y hora del pago | `2026-05-01 10:33:00` |

---

## Hoja 3: `logs`

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `id` | Texto | ID único del log | `log_001` |
| `numero` | Texto | Número WhatsApp del usuario | `525534844790` |
| `tipo` | Texto | `consulta` / `error` / `otp` / `pago` / `upgrade` | `consulta` |
| `mensaje_entrada` | Texto | Texto enviado por el usuario (primeros 500 chars) | `¿Cuánto me corresponde de...` |
| `tema_detectado` | Texto | Tema clasificado por Claude | `liquidacion` |
| `tokens_entrada` | Número | Tokens del prompt | `1240` |
| `tokens_salida` | Número | Tokens de la respuesta | `380` |
| `costo_usd` | Número | Costo estimado en USD | `0.0018` |
| `duracion_ms` | Número | Tiempo de respuesta en milisegundos | `2340` |
| `status` | Texto | `ok` / `error` / `limite_alcanzado` | `ok` |
| `error_detalle` | Texto | Descripción del error si aplica | `` |
| `created_at` | Timestamp | Fecha y hora exacta | `2026-05-04 18:15:32` |

---

## Hoja 4: `abogados`

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `id` | Texto | ID único del abogado | `abg_001` |
| `numero` | Texto | WhatsApp de contacto (privado) | `525512345678` |
| `nombre` | Texto | Nombre completo | `Mario Reyes Ortiz` |
| `cedula` | Texto | Número de cédula profesional | `3847291` |
| `ciudad` | Texto | Ciudad donde opera | `Ciudad de México` |
| `estado` | Texto | Estado de la República | `CDMX` |
| `especialidades` | Texto | Lista separada por comas | `liquidaciones,finiquitos,IMSS` |
| `bio` | Texto | Descripción profesional | `Especialista en...` |
| `linkedin` | Texto | URL de LinkedIn | `https://linkedin.com/in/...` |
| `foto_url` | Texto | URL de la foto en Drive | `https://drive.google.com/...` |
| `calificacion` | Número | Promedio de calificaciones (1-5) | `4.9` |
| `total_opiniones` | Número | Total de opiniones recibidas | `47` |
| `casos_totales` | Número | Total de casos atendidos | `142` |
| `status` | Texto | `pendiente` / `activo` / `suspendido` / `inactivo` | `activo` |
| `disponible` | Boolean | Si acepta clientes en este momento | `TRUE` |
| `probono` | Boolean | Participa en programa pro bono | `TRUE` |
| `despacho_id` | Texto | ID del despacho si aplica (vacío si independiente) | `` |
| `created_at` | Timestamp | Fecha de registro | `2026-04-15 09:00:00` |
| `verified_at` | Timestamp | Fecha de verificación de cédula | `2026-04-16 14:00:00` |

---

## Hoja 5: `despachos`

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `id` | Texto | ID único del despacho | `des_001` |
| `nombre` | Texto | Nombre del despacho | `Castillo & Asociados` |
| `rfc` | Texto | RFC del despacho | `CAAS850101ABC` |
| `razon_social` | Texto | Razón social completa | `Castillo Asociados S.C.` |
| `ciudad` | Texto | Ciudad | `Monterrey` |
| `estado` | Texto | Estado | `Nuevo León` |
| `contacto_nombre` | Texto | Nombre del responsable de cuenta | `Sofía Castillo` |
| `contacto_numero` | Texto | WhatsApp del responsable | `528112345678` |
| `contacto_email` | Texto | Correo del responsable | `sofia@castillo.mx` |
| `num_abogados` | Número | Abogados registrados actualmente | `8` |
| `factura_mensual` | Número | Monto mensual en MXN sin IVA | `900` |
| `stripe_customer_id` | Texto | ID del cliente en Stripe | `cus_DEF456` |
| `stripe_subscription_id` | Texto | ID de suscripción en Stripe | `sub_GHI012` |
| `status` | Texto | `pendiente` / `activo` / `suspendido` | `activo` |
| `email_facturacion` | Texto | Correo para recibir facturas | `facturacion@castillo.mx` |
| `created_at` | Timestamp | Fecha de registro | `2026-03-01 10:00:00` |
| `verified_at` | Timestamp | Fecha de aprobación | `2026-03-03 12:00:00` |

---

## Configuración recomendada en Google Sheets

- **Hoja `usuarios`**: Ordenar por `updated_at` descendente. Congelar fila 1.
- **Hoja `transacciones`**: Ordenar por `created_at` descendente. Nunca borrar registros.
- **Hoja `logs`**: Purgar registros mayores a 90 días mensualmente para mantener rendimiento.
- **Hoja `abogados`**: Filtro rápido por `status` para gestión de verificaciones pendientes.
- **Hoja `despachos`**: Filtro por `status = pendiente` para revisiones de aprobación.

## Permisos

- **N8N** necesita acceso de lectura/escritura a todas las hojas
- **Super admin** tiene acceso completo
- **Admin despacho** solo puede leer su hoja de abogados filtrada por `despacho_id`
- Las hojas **nunca son públicas**
