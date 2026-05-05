# Agente LFT — README
## Disrupting MEX · DisruptingShit umbrella

Asesor legal laboral mexicano por WhatsApp. Orientación basada en la LFT vigente, cálculos de conceptos laborales y conexión con abogados certificados.

---

## Estructura del repositorio

```
agente-lft/
├── index.html              # Landing page principal
├── pricing.html            # Página de planes detallada
├── abogados.html           # Catálogo público de abogados
├── login.html              # Acceso al portal (detecta rol automáticamente)
├── legal.html              # Términos y Condiciones + Aviso de Privacidad
├── registro-abogado.html   # Formulario de alta para abogados
├── registro-despacho.html  # Formulario de alta para despachos
├── perfil-abogado.html     # Portal privado del abogado (edición de perfil)
├── dashboard-despacho.html # Portal privado del admin de despacho
├── dashboard-superadmin.html # Control total — solo Mau
└── README.md               # Este archivo
```

---

## Stack tecnológico

| Componente | Tecnología | Detalle |
|---|---|---|
| Frontend | HTML/CSS/JS vanilla | GitHub Pages — sin frameworks |
| Automatización | N8N | `workflow.grupoalefsi.com` |
| IA | Claude Sonnet 4.6 | Anthropic API — key "general" |
| Mensajería | Meta WhatsApp Business API | WABA: Disrupting Shit |
| Base de datos operativa | Google Sheets | 5 hojas — ver `sheets_structure.md` |
| Base de datos futura | Supabase (PostgreSQL) | Pendiente migración |
| Pagos | Stripe | Links de pago + webhooks |
| Hosting | GitHub Pages | `disruptingshit-ai.github.io/agente-lft` |
| VPS | Grupo Alefsi (RC) | Cubierto temporalmente |

---

## Flujo principal de WhatsApp

```
Usuario → WhatsApp (+52 5534844790)
  → Meta WhatsApp API
    → N8N webhook: lft-agent
      → Buscar usuario en Google Sheets (hoja: usuarios)
      → ¿Usuario nuevo? → Crear registro → Onboarding
      → ¿Tiene acceso? → Verificar plan y consultas disponibles
      → Claude Sonnet 4.6 (con RAG de LFT chunks)
      → Actualizar contador de consultas en Sheets
      → Respuesta al usuario vía Meta API
```

---

## Flujo de pago (Stripe)

```
Usuario elige plan en pricing.html
  → Link de pago Stripe (test o producción)
    → Stripe procesa el pago
      → Webhook Stripe → N8N webhook: stripe-webhook
        → Actualizar hoja usuarios (plan, fecha_expiracion, stripe_ids)
        → Confirmar por WhatsApp al usuario
```

Ver `webhook_stripe.md` para configuración detallada.

---

## Números y IDs importantes

| Recurso | Valor |
|---|---|
| Número WhatsApp producción | `+52 5534844790` |
| Phone ID producción | `1188784574310380` |
| WABA ID (Disrupting Shit) | `1981915379088780` |
| Número de prueba Meta | `+1 555 169 2327` |
| Phone ID prueba | `1073779295821730` |
| WABA ID prueba (LFTM) | `1486483656470062` |
| N8N webhook lft-agent | `https://workflow.grupoalefsi.com/webhook/lft-agent` |
| N8N webhook lft-web | `https://workflow.grupoalefsi.com/webhook/lft-web` |
| GitHub Pages | `https://disruptingshit-ai.github.io/agente-lft` |
| Meta app | LFTM (publicada) |

---

## Roles del portal

| Rol | Acceso | Dashboard |
|---|---|---|
| Super Admin | Control total | `dashboard-superadmin.html` |
| Admin Despacho | Su despacho y equipo | `dashboard-despacho.html` |
| Abogado | Su perfil y calificaciones | `perfil-abogado.html` |
| Cliente final | Solo WhatsApp | Sin acceso web |

El login detecta el rol automáticamente consultando Google Sheets por número de WhatsApp.

---

## Planes

| Plan | Precio | Consultas | Notas |
|---|---|---|---|
| Free | $0 | 8/mes | Sin tarjeta |
| Plus mensual | $49 MXN | Ilimitadas | Precio de lealtad: $39 mes 6+, $29 mes 12+ |
| Plus 6 meses | $234 MXN | Ilimitadas | Prepago único |
| Plus 12 meses | $348 MXN | Ilimitadas | Prepago único |
| Partner Abogado | Alta gratuita | — | 15% comisión por atención |
| Partner Despacho | $500 + $50/abogado | — | Factura mensual vía Stripe |

---

## Pendientes técnicos

- [ ] Migrar Google Sheets → Supabase
- [ ] Activar prompt caching en N8N (Anthropic)
- [ ] Implementar webhook de Stripe en N8N
- [ ] Token permanente Meta (System User) — actual expira Jul 2026
- [ ] Verificación de negocio Meta completada
- [ ] Dominio `disruptingshit.com` (22 EUR/año — pendiente compra)
- [ ] Sistema OTP real vía N8N para login del portal
- [ ] RAG con Qdrant + Voyage AI (deferred)

---

## Contacto

- **Gmail DS**: `agentlft.mx@gmail.com`
- **GitHub org**: `disruptingshit-ai`
- **N8N**: `workflow.grupoalefsi.com`
- **Anthropic Console**: `console.anthropic.com` (workspace: Disrupting Shit)
