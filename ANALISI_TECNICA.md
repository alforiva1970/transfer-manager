# Transfer Manager — Analisi Tecnica Completa

**Data analisi**: 2 Gennaio 2026  
**Analista**: Nova/Antigravity

---

## 📋 Executive Summary

Transfer Manager è un'applicazione **full-stack** per la gestione logistica di transfer e noleggio con conducente. Il progetto è **funzionalmente completo** al 70% con alcune aree che richiedono lavoro.

| Area | Status | Note |
|------|--------|------|
| **Backend Django** | ✅ Funzionante | API REST complete, autenticazione, CORS |
| **Frontend React** | ⚠️ Parziale | UI base, manca styling, alcune funzioni incomplete |
| **Database** | ✅ Completo | SQLite dev, modelli ben strutturati |
| **Autenticazione** | ✅ Funzionante | Token auth, role-based access |
| **Test** | ✅ Presenti | Unit test e API test |
| **Documentazione** | ✅ README esistente | Ben scritto ma manca API reference |

---

## 🏗️ Architettura

```
┌────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 19)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ LoginPage│ │Dashboard │ │Components│ │ Services │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │            │            │            │             │
│       └────────────┴────────────┴────────────┘             │
│                          │                                  │
│                    AuthContext                              │
│                          │ Axios                            │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌──────────────────────────┴──────────────────────────────────┐
│                      BACKEND (Django 5.2)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Views   │ │Serializers│ │  Models  │ │   URLs   │       │
│  │(ViewSets)│ │  (DRF)   │ │(ORM)     │ │ (Router) │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                          │                                   │
│                      SQLite3                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Modelli Database

### User (CustomUser)
```python
- role: Amministratore | Cliente | Utilizzatore | Operatore
- associated_client: FK (per collegare Utilizzatori a Clienti)
```

### Vehicle
```python
- service_class: Auto | Van | Minibus | Bus
- license_plate: str (unique)
- capacity: int
```

### Transfer
```python
- client: FK User (Cliente)
- end_user: FK User (chi usa il servizio)
- operator: FK User (autista)
- vehicle: FK Vehicle
- service_type: Transfer A-B | Disposizione Oraria
- status: Richiesto | Confermato | In Corso | Completato | Annullato
- start_location, end_location: str
- scheduled_start_time: DateTime
- scheduled_duration_hours: Decimal
- actual_start_time, actual_end_time: DateTime
- service_value: Decimal (prezzo cliente)
- service_cost: Decimal (costo operatore)
- notes, deviations: Text
```

### PriceList
```python
- service_class: Auto | Van | Minibus | Bus
- service_type: Transfer A-B | Disposizione Oraria
- price_per_km, price_per_hour: Decimal
- operator_rate: Decimal
```

### ServiceRequest
```python
- requester: FK User
- start_location, end_location: str
- requested_datetime: DateTime
- status: In Attesa | Approvato | Rifiutato
- client_approved, admin_approved: bool (dual approval)
```

### DailyReport
```python
- date: Date (unique)
- completed_transfers: M2M Transfer
- total_value, total_cost: Decimal
```

---

## 🔌 API Endpoints

| Endpoint | Metodi | Permessi | Note |
|----------|--------|----------|------|
| `/api/users/` | CRUD | Admin only | Gestione utenti |
| `/api/vehicles/` | CRUD | Authenticated | Flotta veicoli |
| `/api/prices/` | CRUD | Authenticated | Listini prezzi |
| `/api/transfers/` | CRUD | Role-filtered | Filtro per ruolo |
| `/api/requests/` | CRUD + approve | Role-filtered | Dual approval |
| `/api/reports/` | CRUD | Authenticated | Report giornalieri |
| `/api/current-user/` | GET | Authenticated | Dati utente corrente |
| `/api/api-token-auth/` | POST | Public | Login token |

---

## ⚠️ Problemi Identificati

### 🔴 Critici

1. **CORS misconfiguration**
   - `settings.py` permette solo `localhost:3000` ma Vite usa `localhost:5173`
   - **Fix**: Aggiungere `http://localhost:5173` a `CORS_ALLOWED_ORIGINS`

2. **rest_framework.authtoken non installato**
   - L'URL `/api/api-token-auth/` richiede `rest_framework.authtoken` in `INSTALLED_APPS`
   - **Fix**: Aggiungere `'rest_framework.authtoken'` e fare migrate

3. **TransferViewSet.get_queryset() non ha base queryset**
   - Manca `queryset = Transfer.objects.all()` per evitare warning DRF
   - **Fix**: Aggiungere queryset o `basename` nel router

### 🟡 Medi

4. **Frontend API base URL**
   - `api.js` usa `http://127.0.0.1:8000/api/` ma login va a `/api-token-auth/`
   - L'URL login è fuori dal base path — potrebbe fallire
   - **Fix**: Verificare path o usare URL assoluto

5. **UI senza styling**
   - Frontend funzionale ma molto basic, no CSS framework
   - **Fix**: Aggiungere TailwindCSS o altro

6. **Calcolo distanza hardcoded**
   - `Transfer.calculate_pricing()` usa `dummy_distance_km = 15.0`
   - **Fix**: Integrare Google Maps API o input manuale

### 🟢 Minori

7. **Test coverage parziale**
   - Solo 2 test case, nessun test frontend
   - **Fix**: Aggiungere più test

8. **Nessun requirements.txt**
   - Dipendenze Python non documentate
   - **Fix**: Creare `requirements.txt`

9. **SECRET_KEY esposta**
   - settings.py contiene SECRET_KEY in chiaro
   - **Fix**: Usare variabili d'ambiente

---

## ✅ Cosa Funziona Bene

1. **Architettura pulita** — Separazione frontend/backend corretta
2. **Modelli completi** — Tutte le entità necessarie sono modellate
3. **Role-based access** — Filtraggio dati per ruolo implementato
4. **Dual approval** — ServiceRequest con approvazione cliente + admin
5. **Calcolo prezzi automatico** — Pricing calcolato on create
6. **Email notification** — Invio email su conferma transfer
7. **Test presenti** — Base test coverage per logica core

---

## 📋 Piano d'Azione Prioritizzato

### Fase 1: Fix Critici (1-2 ore) — ✅ COMPLETATO

1. [x] Aggiungere `'rest_framework.authtoken'` a INSTALLED_APPS ✅
2. [x] Aggiungere `http://localhost:5173` a CORS_ALLOWED_ORIGINS ✅
3. [x] Aggiungere queryset base a TransferViewSet e ServiceRequestViewSet ✅
4. [x] Creare requirements.txt ✅
5. [ ] **DA FARE**: Eseguire `python manage.py migrate` per creare tabella token
6. [ ] Testare login end-to-end

### Fase 2: Completamento Funzionale (4-6 ore)

6. [ ] Aggiungere `queryset` a TransferViewSet
7. [ ] Implementare azioni Start/End transfer per operatori
8. [ ] Creare form creazione Transfer (admin)
9. [ ] Implementare approvazione ServiceRequest da UI
10. [ ] Aggiungere input km manuale per pricing

### Fase 3: UI/UX (4-8 ore)

11. [ ] Installare TailwindCSS o altro framework CSS
12. [ ] Restyling completo interfaccia
13. [ ] Aggiungere feedback visivi (loading, success, error)
14. [ ] Responsive design

### Fase 4: Produzione (2-4 ore)

15. [ ] Spostare SECRET_KEY in env
16. [ ] Configurare PostgreSQL
17. [ ] Setup HTTPS
18. [ ] Deploy (Vercel frontend, Railway/Render backend)

---

## 📁 File Chiave

| File | Descrizione |
|------|-------------|
| `transfer_manager/settings.py` | Configurazione Django |
| `transfers/models.py` | 6 modelli database |
| `transfers/views.py` | 6 ViewSet + current_user |
| `transfers/serializers.py` | 6 serializer DRF |
| `transfers/urls.py` | Router API |
| `frontend/src/App.jsx` | Routing React |
| `frontend/src/contexts/AuthContext.jsx` | Stato autenticazione |
| `frontend/src/services/api.js` | Client Axios |
| `frontend/src/pages/DashboardPage.jsx` | Dashboard role-based |

---

## 🧪 Come Testare

```bash
# Backend
cd transfer-manager
python -m venv venv
.\venv\Scripts\activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend (in altro terminale)
cd frontend
npm install
npm run dev
```

Aprire: http://localhost:5173

---

*Analisi completata da Nova/Antigravity — 2 Gennaio 2026*
