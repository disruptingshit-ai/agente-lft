# Webhook de Stripe → N8N
## Agente LFT · Configuración completa

---

## Qué hace este webhook

Cuando un usuario completa un pago en Stripe, Stripe notifica automáticamente a N8N. N8N actualiza el plan del usuario en Google Sheets y le confirma por WhatsApp.

---

## Paso 1 — Crear el webhook en N8N

1. En N8N crear nuevo workflow llamado **`stripe-webhook`**
2. Agregar nodo **Webhook** como trigger
3. Configurar:
   - **HTTP Method**: `POST`
   - **Path**: `stripe-webhook`
   - **Authentication**: `Header Auth`
   - **Header Name**: `stripe-signature`
4. Copiar la **Production URL** del webhook:
   ```
   https://workflow.grupoalefsi.com/webhook/stripe-webhook
   ```

---

## Paso 2 — Registrar el webhook en Stripe

1. Ir a `dashboard.stripe.com` → **Developers** → **Webhooks**
2. Clic en **Add endpoint**
3. **Endpoint URL**:
   ```
   https://workflow.grupoalefsi.com/webhook/stripe-webhook
   ```
4. **Events to listen** — seleccionar:
   - `checkout.session.completed` — pago exitoso
   - `customer.subscription.created` — suscripción nueva
   - `customer.subscription.updated` — cambio de plan
   - `customer.subscription.deleted` — cancelación
   - `invoice.payment_failed` — pago fallido
5. Copiar el **Webhook signing secret** (`whsec_...`)

---

## Paso 3 — Flujo completo en N8N

```
Webhook (POST /stripe-webhook)
  → Code: Extraer datos del evento Stripe
  → Switch: tipo de evento
    → checkout.session.completed
        → Google Sheets: buscar usuario por metadata.phone
        → Google Sheets: actualizar plan, fechas, stripe_ids
        → HTTP Request: enviar confirmación por WhatsApp
    → customer.subscription.deleted
        → Google Sheets: cambiar plan a "free"
        → Google Sheets: actualizar fecha_expiracion
        → HTTP Request: notificar al usuario por WhatsApp
    → invoice.payment_failed
        → Google Sheets: marcar status pendiente
        → HTTP Request: notificar al usuario para reintentar pago
```

---

## Paso 4 — Código del nodo "Extraer datos"

```javascript
const event = $input.first().json.body;
const eventType = event.type;

let phone = '';
let planType = '';
let stripeCustomerId = '';
let stripeSubscriptionId = '';
let periodStart = '';
let periodEnd = '';
let amount = 0;

if (eventType === 'checkout.session.completed') {
  const session = event.data.object;
  phone = session.metadata?.phone || '';
  stripeCustomerId = session.customer || '';
  stripeSubscriptionId = session.subscription || '';
  amount = session.amount_total / 100;
  
  // Detectar tipo de plan por precio
  if (session.metadata?.plan === 'plus_mensual') planType = 'plus';
  else if (session.metadata?.plan === 'plus_6m') planType = 'plus';
  else if (session.metadata?.plan === 'plus_12m') planType = 'plus';
  
  const now = new Date();
  periodStart = now.toISOString().split('T')[0];
  
  // Calcular fecha de expiración
  const months = session.metadata?.meses || 1;
  const exp = new Date(now);
  exp.setMonth(exp.getMonth() + parseInt(months));
  periodEnd = exp.toISOString().split('T')[0];
}

if (eventType === 'customer.subscription.deleted') {
  const sub = event.data.object;
  stripeCustomerId = sub.customer;
  stripeSubscriptionId = sub.id;
  planType = 'free';
}

return [{
  json: {
    eventType,
    phone,
    planType,
    stripeCustomerId,
    stripeSubscriptionId,
    periodStart,
    periodEnd,
    amount
  }
}];
```

---

## Paso 5 — Links de pago con metadata

Los links de Stripe deben incluir el número de WhatsApp del usuario en los metadatos para que el webhook pueda identificar a quién actualizar.

**Opción A — Payment Links con parámetros pre-filled** (más simple):
```
https://buy.stripe.com/LINK_ID?prefilled_email=&client_reference_id=52NUMERO
```

**Opción B — Checkout Session desde N8N** (recomendado a futuro):
```javascript
// N8N HTTP Request a Stripe API
POST https://api.stripe.com/v1/checkout/sessions
{
  "payment_method_types": ["card"],
  "line_items": [{"price": "price_ID", "quantity": 1}],
  "mode": "subscription",
  "metadata": {
    "phone": "525534844790",
    "plan": "plus_mensual",
    "meses": "1"
  },
  "success_url": "https://disruptingshit-ai.github.io/agente-lft/pricing.html?success=1",
  "cancel_url": "https://disruptingshit-ai.github.io/agente-lft/pricing.html"
}
```

---

## Paso 6 — Mensaje de confirmación por WhatsApp

```javascript
// Nodo HTTP Request → Meta API
// URL: https://graph.facebook.com/v21.0/1188784574310380/messages
// Method: POST
// Headers: Authorization: Bearer TOKEN

const body = {
  messaging_product: "whatsapp",
  to: phone, // ej: "525534844790"
  type: "text",
  text: {
    body: `✅ *¡Pago recibido!*\n\nTu plan Plus está activo. A partir de ahora tienes consultas ilimitadas.\n\nVigencia hasta: ${periodEnd}\n\nEscribe cualquier pregunta laboral para comenzar. 👋`
  }
};
```

---

## Stripe IDs actuales (modo test)

| Recurso | ID |
|---|---|
| Link Plus mensual | `test_5kQ6oJ6Mseem1n7dGc5c401` |
| Link Plus 6 meses | `test_00w4gB7Qwc6eaXHcC85c403` |
| Link Plus 12 meses | `test_dRmfZj0o46LU2rb9pW5c400` |

⚠️ Estos son links de **modo test**. Antes de lanzar reemplazar con links de producción en Stripe Dashboard → Payment Links.

---

## Checklist de activación

- [ ] Crear workflow `stripe-webhook` en N8N
- [ ] Registrar URL del webhook en Stripe Dashboard
- [ ] Copiar webhook signing secret a N8N
- [ ] Agregar metadata `phone` y `plan` a los Payment Links o Checkout Sessions
- [ ] Probar con tarjeta de prueba Stripe `4242 4242 4242 4242`
- [ ] Verificar que Google Sheets se actualiza correctamente
- [ ] Verificar que el mensaje de WhatsApp llega al usuario
- [ ] Cambiar links de test a producción en `pricing.html` e `index.html`
