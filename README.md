# 🚐 Transfer Manager

**Sistema completo di gestione logistica per eventi e transfer**

Applicazione full-stack per la gestione professionale di transfer, disposizioni orarie e logistica eventi con gestione multi-ruolo (Amministratori, Clienti, Utilizzatori, Operatori).

## 🎯 Caratteristiche Principali

### 📊 Gestione Transfer
- **Prenotazioni transfer** punto-a-punto (A-B)
- **Disposizioni orarie** per eventi
- Gestione completa del ciclo di vita: Richiesto → Confermato → In Corso → Completato/Annullato
- Tracking in tempo reale di start/end effettivi
- Note e deviazioni personalizzabili

### 👥 Sistema Multi-Ruolo
- **Amministratori**: gestione completa del sistema
- **Clienti**: richiedono e gestiscono transfer
- **Utilizzatori**: utenti finali associati ai clienti
- **Operatori**: autisti che eseguono i transfer

### 🚗 Gestione Flotta
- Veicoli multi-classe: Auto, Van, Minibus, Bus
- Capacità passeggeri
- Targhe uniche
- Assegnazione automatica

### 💰 Pricing Dinamico
- Listini prezzi per classe servizio e tipologia
- Calcolo automatico basato su:
  - Tariffa oraria
  - Tariffa al km
  - Compenso operatore
- Separazione valore cliente / costo operatore

### 📱 Frontend React Moderno
- Interfaccia utente responsive
- React 19 + Vite
- React Router per navigazione
- Axios per comunicazione API
- Gestione stato con Context API

### 🔐 API REST
- Django REST Framework
- Autenticazione e autorizzazioni
- CORS configurato per frontend separato
- Serializzatori JSON ottimizzati

## 🛠️ Stack Tecnologico

### Backend
- **Django 5.2.6**: Framework web Python
- **Django REST Framework**: API RESTful
- **SQLite3**: Database (development)
- **CORS Headers**: Comunicazione cross-origin

### Frontend
- **React 19.1.1**: Libreria UI
- **Vite 5.0.3**: Build tool e dev server
- **React Router DOM 7.9.1**: Routing SPA
- **Axios 1.12.2**: HTTP client
- **ESLint**: Code quality

## 📁 Struttura Progetto

```
transfer-manager/
├── transfer_manager/          # Configurazione Django
│   ├── settings.py           # Configurazioni progetto
│   ├── urls.py               # URL routing principale
│   ├── wsgi.py               # WSGI entry point
│   └── asgi.py               # ASGI entry point
│
├── transfers/                 # App Django principale
│   ├── models.py             # Modelli dati (User, Vehicle, Transfer, PriceList)
│   ├── views.py              # API views
│   ├── serializers.py        # DRF serializers
│   ├── urls.py               # URL routing app
│   ├── admin.py              # Django admin config
│   ├── migrations/           # Database migrations
│   └── management/           # Custom management commands
│
├── frontend/                  # App React
│   ├── src/
│   │   ├── components/       # Componenti React riutilizzabili
│   │   ├── pages/            # Pagine/views applicazione
│   │   ├── contexts/         # React Context (stato globale)
│   │   ├── services/         # API services (Axios)
│   │   ├── assets/           # Immagini, icone
│   │   ├── App.jsx           # Componente principale
│   │   └── main.jsx          # Entry point
│   ├── public/               # Assets statici
│   ├── package.json          # Dipendenze npm
│   └── vite.config.js        # Configurazione Vite
│
├── manage.py                  # Django management script
├── db.sqlite3                # Database SQLite
└── README.md                 # Questa documentazione
```

## 🚀 Installazione e Setup

### Prerequisiti
- Python 3.10+
- Node.js 18+ e npm
- Git

### 1. Clona il Repository
```bash
git clone https://github.com/alforiva1970/transfer-manager.git
cd transfer-manager
```

### 2. Setup Backend (Django)

```bash
# Crea virtual environment
python -m venv venv

# Attiva virtual environment
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Installa dipendenze
pip install django djangorestframework django-cors-headers

# Esegui migrazioni database
python manage.py migrate

# Crea superuser (amministratore)
python manage.py createsuperuser

# Avvia server Django
python manage.py runserver
```

Backend disponibile su: `http://localhost:8000`

### 3. Setup Frontend (React)

```bash
# Entra nella cartella frontend
cd frontend

# Installa dipendenze
npm install

# Avvia dev server
npm run dev
```

Frontend disponibile su: `http://localhost:5173`

## 📊 Modelli Database

### User (CustomUser)
Estende Django AbstractUser con:
- `role`: Amministratore | Cliente | Utilizzatore | Operatore
- `associated_client`: FK opzionale per collegare utilizzatori ai clienti

### Vehicle
- `service_class`: Auto | Van | Minibus | Bus
- `license_plate`: Targa univoca
- `capacity`: Numero passeggeri

### Transfer
- `client`: FK a User (chi richiede)
- `end_user`: FK a User (chi utilizza)
- `operator`: FK a User (autista)
- `vehicle`: FK a Vehicle
- `service_type`: Transfer A-B | Disposizione Oraria
- `status`: Richiesto | Confermato | In Corso | Completato | Annullato
- `start_location` / `end_location`: Indirizzi
- `scheduled_start_time`: DateTime pianificato
- `scheduled_duration_hours`: Durata prevista
- `actual_start_time` / `actual_end_time`: Tracking reale
- `service_value`: Prezzo per cliente
- `service_cost`: Costo operatore
- `notes` / `deviations`: Annotazioni

### PriceList
- `service_class`: FK a classe veicolo
- `service_type`: Tipologia servizio
- `price_per_km`: Tariffa chilometrica
- `price_per_hour`: Tariffa oraria
- `operator_rate`: Compenso autista

## 🔌 API Endpoints

Base URL: `http://localhost:8000/api/`

### Transfers
- `GET /api/transfers/` - Lista tutti i transfer
- `POST /api/transfers/` - Crea nuovo transfer
- `GET /api/transfers/{id}/` - Dettaglio transfer
- `PUT /api/transfers/{id}/` - Aggiorna transfer
- `DELETE /api/transfers/{id}/` - Elimina transfer

### Vehicles
- `GET /api/vehicles/` - Lista veicoli
- `POST /api/vehicles/` - Crea veicolo

### Users
- `GET /api/users/` - Lista utenti
- `POST /api/users/` - Crea utente

### Price Lists
- `GET /api/pricelists/` - Lista listini
- `POST /api/pricelists/` - Crea listino

*(URL esatti dipendono dalla configurazione in `transfers/urls.py`)*

## 🧪 Testing

### Backend Tests
```bash
python manage.py test transfers
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🎨 Build Produzione

### Frontend Build
```bash
cd frontend
npm run build
```
Files ottimizzati in `frontend/dist/`

### Django Produzione
1. Configura `DEBUG = False` in settings.py
2. Configura `ALLOWED_HOSTS`
3. Usa database PostgreSQL/MySQL
4. Configura `STATIC_ROOT` e raccogli static files:
   ```bash
   python manage.py collectstatic
   ```
5. Usa server WSGI (Gunicorn, uWSGI)

## 🔐 Sicurezza

⚠️ **IMPORTANTE**: Prima del deploy in produzione:
1. Cambia `SECRET_KEY` in settings.py
2. Imposta `DEBUG = False`
3. Configura `ALLOWED_HOSTS`
4. Usa HTTPS
5. Configura CORS policies restrittive
6. Usa database production-ready (PostgreSQL)
7. Implementa backup database

## 📝 Django Admin

Accedi all'admin panel: `http://localhost:8000/admin/`

Credenziali: quelle create con `createsuperuser`

L'admin permette di:
- Gestire utenti e ruoli
- CRUD su transfer
- Gestire veicoli
- Configurare listini prezzi

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è di proprietà privata.

## 👤 Autore

**alforiva1970**
- GitHub: [@alforiva1970](https://github.com/alforiva1970)

## 🆘 Supporto

Per domande o problemi, apri una [Issue](https://github.com/alforiva1970/transfer-manager/issues) su GitHub.

---

**Sviluppato con ❤️ usando Django + React**
