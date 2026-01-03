# 🚐 Transfer Manager 2.0

**Sistema premium per gestione logistica eventi e transfer**

![Version](https://img.shields.io/badge/version-2.0-primary)
![Stack](https://img.shields.io/badge/stack-Django%20%2B%20React-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## ✨ Cosa è cambiato nella v2.0

- 🎨 **UI completamente ridisegnata** — Dark theme premium con TailwindCSS
- 📊 **Dashboard per ruolo** — Admin, Cliente, Operatore con viste dedicate
- 💰 **Budget tracker real-time** — Il cliente vede i costi in tempo reale
- ✅ **Approvazione smart** — Approva richieste con un tap
- 📱 **PWA Ready** — Installabile su telefono come app nativa
- 🐳 **Docker Ready** — Un comando per avviare tutto

---

## 🚀 Quick Start

### Con Docker (raccomandato)

```bash
docker-compose up
```

Apri: http://localhost

### Senza Docker

**Backend:**
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Apri: http://localhost:5173

---

## 👥 Ruoli e Dashboard

| Ruolo | Dashboard | Funzionalità |
|-------|-----------|--------------|
| **Amministratore** | Stats, transfer, flotta | Gestione completa sistema |
| **Cliente** | Budget, approvazioni | Approva richieste, controllo costi |
| **Operatore** | Transfer attivo, agenda | Gestisce i propri transfer |
| **Utilizzatore** | Richieste | Richiede nuovi transfer |

---

## 📱 Installazione Mobile (PWA)

1. Apri l'app nel browser (Chrome/Safari)
2. Tocca "Aggiungi a Home"
3. L'app si installerà come app nativa

---

## 🏗️ Architettura

```
┌─────────────────────────────────────────┐
│           Frontend React 19             │
│  TailwindCSS • PWA • Role-based UI      │
└────────────────┬────────────────────────┘
                 │ REST API
                 ▼
┌─────────────────────────────────────────┐
│          Backend Django 5.2             │
│  DRF • Token Auth • Multi-tenant        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│            SQLite / PostgreSQL          │
└─────────────────────────────────────────┘
```

---

## 📁 Struttura Files

```
transfer-manager/
├── docker-compose.yml      # Avvia tutto
├── Dockerfile              # Backend container
├── requirements.txt        # Dipendenze Python
├── transfer_manager/       # Config Django
├── transfers/              # App principale
│   ├── models.py          # User, Vehicle, Transfer, etc.
│   ├── views.py           # API ViewSets
│   └── serializers.py     # DRF serializers
├── frontend/               # App React
│   ├── Dockerfile         # Frontend container
│   ├── src/
│   │   ├── pages/         # Login, Dashboard
│   │   ├── components/
│   │   │   └── dashboards/ # Admin, Client, Operator
│   │   ├── contexts/      # AuthContext
│   │   └── services/      # API client
│   └── public/
│       └── manifest.json  # PWA config
└── docs/
    └── API_REFERENCE.md   # Documentazione API
```

---

## 🔐 API Authentication

```bash
# Ottieni token
curl -X POST http://localhost:8000/api/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Usa token
curl http://localhost:8000/api/transfers/ \
  -H "Authorization: Token YOUR_TOKEN"
```

Vedi [docs/API_REFERENCE.md](docs/API_REFERENCE.md) per la documentazione completa.

---

## 🎯 Roadmap v2.1

- [ ] Integrazione mappe (Leaflet)
- [ ] Notifiche push
- [ ] Calendario visivo
- [ ] Export PDF report

---

## 👤 Autore

**Alfonso Riva** — [@alforiva1970](https://github.com/alforiva1970)

*Sviluppato con ❤️ e Nova*

---

## 📄 Licenza

Proprietario — Tutti i diritti riservati
