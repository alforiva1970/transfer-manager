# Transfer Manager — Documentazione API

## Base URL

```
http://localhost:8000/api/
```

## Autenticazione

L'API usa **Token Authentication** di Django REST Framework.

### Ottenere Token

```http
POST /api/api-token-auth/
Content-Type: application/json

{
  "username": "tuo_username",
  "password": "tua_password"
}
```

**Risposta:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Usare il Token

Includi l'header in ogni richiesta:
```http
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

---

## Endpoints

### Users

| Metodo | Endpoint | Descrizione | Permessi |
|--------|----------|-------------|----------|
| GET | `/api/users/` | Lista utenti | Admin |
| POST | `/api/users/` | Crea utente | Admin |
| GET | `/api/users/{id}/` | Dettaglio utente | Admin |
| PUT | `/api/users/{id}/` | Aggiorna utente | Admin |
| DELETE | `/api/users/{id}/` | Elimina utente | Admin |
| GET | `/api/current-user/` | Utente corrente | Authenticated |

**Modello User:**
```json
{
  "id": 1,
  "username": "mario_rossi",
  "email": "mario@example.com",
  "first_name": "Mario",
  "last_name": "Rossi",
  "role": "Cliente",
  "associated_client": null
}
```

**Ruoli disponibili:**
- `Amministratore` — accesso completo
- `Cliente` — azienda che richiede transfer
- `Utilizzatore` — dipendente di un Cliente
- `Operatore` — autista

---

### Vehicles

| Metodo | Endpoint | Descrizione | Permessi |
|--------|----------|-------------|----------|
| GET | `/api/vehicles/` | Lista veicoli | Authenticated |
| POST | `/api/vehicles/` | Crea veicolo | Authenticated |
| GET | `/api/vehicles/{id}/` | Dettaglio veicolo | Authenticated |
| PUT | `/api/vehicles/{id}/` | Aggiorna veicolo | Authenticated |
| DELETE | `/api/vehicles/{id}/` | Elimina veicolo | Authenticated |

**Modello Vehicle:**
```json
{
  "id": 1,
  "service_class": "Auto",
  "license_plate": "AB123CD",
  "capacity": 4
}
```

**Classi disponibili:**
- `Auto` — berline
- `Van` — van/monovolume
- `Minibus` — 9-15 posti
- `Bus` — 16+ posti

---

### Transfers

| Metodo | Endpoint | Descrizione | Permessi |
|--------|----------|-------------|----------|
| GET | `/api/transfers/` | Lista transfer (filtrata per ruolo) | Authenticated |
| POST | `/api/transfers/` | Crea transfer | Authenticated |
| GET | `/api/transfers/{id}/` | Dettaglio transfer | Authenticated |
| PUT | `/api/transfers/{id}/` | Aggiorna transfer | Authenticated |
| DELETE | `/api/transfers/{id}/` | Elimina transfer | Authenticated |

**Filtro per ruolo:**
- `Amministratore` → vede tutti i transfer
- `Cliente` → vede solo i propri transfer
- `Operatore` → vede solo i transfer assegnati
- `Utilizzatore` → non vede transfer (solo requests)

**Modello Transfer:**
```json
{
  "id": 1,
  "client": "azienda_spa",
  "end_user": "mario_rossi",
  "operator": "autista_01",
  "vehicle": "Auto - AB123CD",
  "service_type": "Transfer A-B",
  "status": "Confermato",
  "start_location": "Milano Centrale",
  "end_location": "Malpensa Aeroporto",
  "scheduled_start_time": "2026-01-05T09:00:00Z",
  "scheduled_duration_hours": null,
  "actual_start_time": null,
  "actual_end_time": null,
  "notes": "",
  "deviations": "",
  "service_value": "75.00",
  "service_cost": "25.00"
}
```

**Status disponibili:**
- `Richiesto` — appena creato
- `Confermato` — approvato e schedulato
- `In Corso` — transfer attivo
- `Completato` — transfer finito
- `Annullato` — cancellato

---

### Price Lists

| Metodo | Endpoint | Descrizione | Permessi |
|--------|----------|-------------|----------|
| GET | `/api/prices/` | Lista listini | Authenticated |
| POST | `/api/prices/` | Crea listino | Authenticated |
| GET | `/api/prices/{id}/` | Dettaglio listino | Authenticated |
| PUT | `/api/prices/{id}/` | Aggiorna listino | Authenticated |
| DELETE | `/api/prices/{id}/` | Elimina listino | Authenticated |

**Modello PriceList:**
```json
{
  "id": 1,
  "service_class": "Auto",
  "service_type": "Transfer A-B",
  "price_per_km": "2.50",
  "price_per_hour": null,
  "operator_rate": "25.00"
}
```

---

### Service Requests

| Metodo | Endpoint | Descrizione | Permessi |
|--------|----------|-------------|----------|
| GET | `/api/requests/` | Lista richieste (filtrata) | Authenticated |
| POST | `/api/requests/` | Crea richiesta | Authenticated |
| GET | `/api/requests/{id}/` | Dettaglio richiesta | Authenticated |
| PUT | `/api/requests/{id}/` | Aggiorna richiesta | Authenticated |
| DELETE | `/api/requests/{id}/` | Elimina richiesta | Authenticated |
| POST | `/api/requests/{id}/approve/` | Approva richiesta | Admin/Cliente |

**Modello ServiceRequest:**
```json
{
  "id": 1,
  "requester": "mario_rossi",
  "start_location": "Ufficio",
  "end_location": "Aeroporto",
  "requested_datetime": "2026-01-10T14:00:00Z",
  "status": "In Attesa",
  "client_approved": false,
  "admin_approved": false
}
```

**Sistema Dual Approval:**
- Richiesta creata da Utilizzatore
- Cliente associato deve approvare (`client_approved = true`)
- Admin deve approvare (`admin_approved = true`)
- Solo quando entrambi approvano → `status = "Approvato"`

---

### Daily Reports

| Metodo | Endpoint | Descrizione | Permessi |
|--------|----------|-------------|----------|
| GET | `/api/reports/` | Lista report | Authenticated |
| POST | `/api/reports/` | Crea report | Authenticated |
| GET | `/api/reports/{id}/` | Dettaglio report | Authenticated |

**Modello DailyReport:**
```json
{
  "id": 1,
  "date": "2026-01-02",
  "completed_transfers": [1, 3, 5],
  "total_value": "450.00",
  "total_cost": "150.00"
}
```

---

## Codici Errore

| Codice | Significato |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (dati invalidi) |
| 401 | Unauthorized (token mancante/invalido) |
| 403 | Forbidden (permessi insufficienti) |
| 404 | Not Found |
| 500 | Server Error |

---

## Esempi cURL

### Login
```bash
curl -X POST http://localhost:8000/api/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

### Lista Veicoli
```bash
curl http://localhost:8000/api/vehicles/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Crea Transfer
```bash
curl -X POST http://localhost:8000/api/transfers/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "client": 2,
    "vehicle": 1,
    "service_type": "Transfer A-B",
    "start_location": "Milano",
    "end_location": "Roma",
    "scheduled_start_time": "2026-01-10T09:00:00Z"
  }'
```

---

*Documentazione generata da Nova/Antigravity — 2 Gennaio 2026*
