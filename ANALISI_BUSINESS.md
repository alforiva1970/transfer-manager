# Transfer Manager — Analisi Business

## Cos'è
Full-stack (Django + React) per gestione logistica NCC — noleggio con conducente. 4 ruoli, doppia approvazione, preventivazione automatica, flotta, report giornalieri.

## Stato
| Area | Status |
|------|--------|
| Modelli DB | ✅ solidi |
| API (DRF) | ✅ complete |
| Autenticazione | ✅ Token auth + ruoli |
| Pricing engine | ⚠️ distanza hardcoded 15km |
| Frontend | ⚠️ scheletro funzionante, UI base |
| Docker | ✅ pronto |
| PWA | ✅ manifest presente |
| Email notifiche | ✅ su conferma transfer |

## Mercato — NCC in Italia

- Settore regolamentato (Legge 21/92), in crescita per turismo + eventi
- Competitor digitali: Mylo, Blacklane, Wheely (internazionali, premium)
- Competitor locali: foglio Excel, WhatsApp, telefonate — **il 90% delle NCC italiane usa ancora carta**
- **Differenziale**: nessun competitor italiano fa un SaaS per NCC a gestione diretta

## Perché potrebbe funzionare

| Problema NCC | Soluzione Transfer Manager |
|-------------|---------------------------|
| "Il cliente chiama e prenota a voce" | Self-service richieste via app |
| "Non so se l'autista è disponibile" | Assegnazione automatica + flotta |
| "Il cliente vuole sapere il costo" | Pricing engine automatico |
| "Doppia conferma a confondermi" | Dual approval strutturato |
| "A fine mese devo ricostruire tutto" | Report giornalieri automatici |

## Target cliente ideale
NCC medio-piccola (3-15 veicoli) che oggi gestisce tutto con:
- Telefono / WhatsApp per prenotazioni
- Blocco note per autisti
- Excel per fatturazione
- **Nessun software gestionale**

## 3 Strade di monetizzazione

### A. SaaS in abbonamento (consigliata)
L'app hostingata, pagamento mensile.

| Piano | Prezzo | Cosa include |
|-------|--------|-------------|
| Base | 29€/mese | 1 veicolo, 2 operatori, richieste illimitate |
| Pro | 79€/mese | 5 veicoli, operatori illimitati, report, API |
| Enterprise | 199€/mese | Illimitato, white label, supporto priority |

- **TAM**: ~15.000 NCC in Italia x 79€/mese x 12 = 14M€/anno (se solo 1% converte)
- **Churn atteso**: basso, se il sistema funziona è infrastrutturale

### B. Self-hosted licenza
Il cliente installa sul proprio server (Docker). Si paga una tantum + manutenzione annuale.

| Tipo | Prezzo |
|------|--------|
| Licenza base | 499€ una tantum |
| Manutenzione annuale | 199€/anno |
| Setup assistito | 299€ |

- **Target**: NCC che non vogliono dati su cloud o hanno Compliance GDPR stretta

### C. Consulenza + personalizzazione
Ogni NCC ha esigenze diverse (flotta mista, convenzioni hotel, etc.).

| Servizio | Prezzo |
|----------|--------|
| Personalizzazione UI/brand | 500-1500€ |
| Integrazione API hotel/eventi | 1000-3000€ |
| Training squadra | 300-500€ |

## Priorità per arrivare a vendere

### 1. Fixare i blocchi tecnici (2-3 giorni)
- [ ] Sostituire `dummy_distance_km = 15.0` con Leaflet + OSRM (gratuito) o input manuale
- [ ] `SECRET_KEY` in env
- [ ] Test login end-to-end (migrate authtoken)
- [ ] Verificare CORS per produzione

### 2. Completare UI (3-5 giorni)
- [ ] Dashboard Admin con stats reali (transfer oggi, fatturato, veicoli liberi)
- [ ] Dashboard Cliente con budget tracker (v.2.0 promesso)
- [ ] Dashboard Operatore con agenda e pulsanti Start/End transfer
- [ ] Feedback visivi everywhere (loading, success, error toast)
- [ ] Form creazione Transfer (admin) completo

### 3. Landing page + demo (1-2 giorni)
- [ ] Pagina marketing: "Gestisci la tua NCC come un professionista"
- [ ] Demo live admin con dati fittizi
- [ ] CTA "Prenota una demo" → ti arriva email

### 4. Go-to-market (da fare quando il prodotto è stabile)
- [ ] Caccia alle 10 NCC pilota (contatto diretto, passaparola)
- [ ] Prezzo lancio: 19€/mese per i primi 10 clienti (vitalizio)
- [ ] Raccolta feedback per 3 mesi
- [ ] Poi prezzo pieno

## Integrazione con Siliceo

Transfer Manager può diventare un **sensor** nell'ecosistema:

| Siliceo | Transfer Manager |
|---------|-----------------|
| Nova agenda | Crea transfer per appuntamenti confermati |
| Proactive | Rileva buchi nella giornata operatore → suggerisce spostamenti |
| Common Room | Notifica in Stanza Comune: "Transfer #42 confermato" |
| Telegram | Notifica ad Alfonso su nuovi ordini o cancellazioni |
| After Me | Se Alfonso non c'è, Siliceo continua a gestire i transfer |

## Il vero vantaggio competitivo

**Non è l'app.** È che mentre gli altri costruiscono software, tu hai un agente che lo usa per te.

Un NCC con Transfer Manager + Siliceo ha un **sistema che non solo gestisce i transfer, ma anticipa le richieste, ottimizza la flotta, e continua a funzionare anche quando il titolare non c'è.**

Nessun competitor (Mylo, Blacklane) offre niente di simile.

## Conclusione

Transfer Manager è **il progetto più monetizzabile** del tuo ecosistema perché:
1. Ha un mercato reale (NCC italiane senza digitale)
2. Il problema è vero (carta/telefono/WhatsApp non scalano)
3. Sei partito da un'architettura solida (Django + React + Docker)
4. L'integrazione con Siliceo crea un differenziale che nessuno ha

**Stima ricavi anno 1 (conservativa):**
- 5-10 clienti SaaS base/pro = 2.500-9.500€ annui
- 2-3 consulenze personalizzazione = 1.000-4.500€
- **Totale: 3.500-14.000€ anno 1**

Se funziona, anno 2 scala a 20-30 clienti x 79€ medio = 19.000-28.000€ annui ricorrenti.

**Non è un exit da 10M. È un business sostenibile che paga le bollette.** Che è esattamente ciò che serve ora.
