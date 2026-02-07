# 📘 SKYNOTE - INSTRUCTIONS COMPLÈTES

**De l'installation au lancement public - Tout ce dont tu as besoin**

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Configuration des clés API](#configuration-des-clés-api)
4. [Déploiement sur Railway](#déploiement-sur-railway)
5. [Configuration du backend](#configuration-du-backend)
6. [Configuration des paiements Stripe](#configuration-des-paiements-stripe)
7. [Achat et configuration du nom de domaine](#achat-et-configuration-du-nom-de-domaine)
8. [Tests complets](#tests-complets)
9. [Mise en production](#mise-en-production)
10. [Dépannage](#dépannage)

---

## 🎯 VUE D'ENSEMBLE

**SkyNote** est une application SAAS éducative qui transforme les cours en fiches de révision et QCM grâce à l'IA.

### Fonctionnalités principales :
- ✅ Upload texte, PDF, ou photo (OCR)
- ✅ Génération automatique de fiches structurées
- ✅ QCM personnalisés avec explications
- ✅ Système freemium (3 fiches gratuites, illimité en Premium)
- ✅ 100 premiers inscrits = Premium gratuit à vie
- ✅ Paiements Stripe (9€/mois)

### Architecture :
- **Backend** : Node.js + Express + OpenAI
- **Frontend** : React + Tailwind CSS
- **Paiements** : Stripe
- **Hébergement** : Railway (0€ puis ~8€/mois)

---

## ✅ PRÉREQUIS

Avant de commencer, crée ces comptes (tous gratuits) :

### 1. Compte GitHub
- Va sur [github.com](https://github.com)
- Crée un compte gratuit
- **Télécharge GitHub Desktop** : [desktop.github.com](https://desktop.github.com)

### 2. Compte Railway  
- Va sur [railway.app](https://railway.app)
- Connecte-toi avec GitHub
- ✅ **Tu as 5$ de crédit gratuit** (~3-4 mois d'utilisation)

### 3. Compte Stripe
- Va sur [stripe.com](https://stripe.com)
- Crée un compte gratuit
- ⚠️ Tu peux rester en mode TEST au début (pas besoin de valider le compte)

### 4. Compte OpenAI
- Va sur [platform.openai.com](https://platform.openai.com)
- Crée un compte
- ⚠️ **Ajoute une carte bancaire** (obligatoire, mais tu as 5$ gratuits)

---

## 🔑 CONFIGURATION DES CLÉS API

### ÉTAPE 1 : Clé OpenAI

1. Va sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Clique **"Create new secret key"**
3. Nom : `SkyNote Production`
4. **Copie la clé** (commence par `sk-proj-` ou `sk-`)
5. ⚠️ **SAUVEGARDE-LA** dans un fichier texte sécurisé

**Tu ne pourras plus la voir après !**

---

### ÉTAPE 2 : Clés Stripe (MODE TEST)

**Tu as déjà tes clés de test :**

```
STRIPE_SECRET_KEY = sk_test_51Sx95w0bWDBDwCtUTY8JSBV9LKobbOY5CfRFNgAcSdVyrTpqsKWchCCZyy1iCkIy3Vd5jtX8QTBTwkUYBU8B1iZ0008SMZ6DZF

STRIPE_PUBLIC_KEY = pk_test_51Sx95w0bWDBDwCtUOIOx6hpcymOpySJjCckrzrTNA9INNznp4iJJhj0HvSvQHVVCFzzr7aJ213Bgj6MYfSP1sKxv00as5prznB

STRIPE_PRICE_ID = price_1Sx9CI0bWDBDwCtUnI2mkRd3
```

⚠️ **Ces clés sont déjà dans le fichier `.env`** du projet !

---

## 🚀 DÉPLOIEMENT SUR RAILWAY

### ÉTAPE 1 : Mettre le code sur GitHub

#### Option A : Avec GitHub Desktop (RECOMMANDÉ)

1. **Décompresse** `skynote-app.zip` sur ton ordinateur
2. **Ouvre GitHub Desktop**
3. **File** → **Add Local Repository**
4. **Choose...** → Sélectionne le dossier `skynote-app`
5. Si erreur :
   - Clique **"Create a repository"**
   - Nom : `skynote-app`
   - **Décoche** "Keep this code private" ⚠️
   - Clique **"Create Repository"**
6. En haut à droite : **"Publish repository"**
7. **Décoche** "Keep this code private"
8. Clique **"Publish repository"**

✅ **Ton code est sur GitHub !**

Note l'URL : `https://github.com/TON_USERNAME/skynote-app`

---

### ÉTAPE 2 : Créer le projet Railway

1. Va sur [railway.app](https://railway.app)
2. Clique **"New Project"**
3. Sélectionne **"Deploy from GitHub repo"**
4. Choisis **`skynote-app`**
5. Railway détecte automatiquement Node.js

⏳ **Attends 2-3 minutes** - Railway crée 2 services automatiquement :
- **Backend** (API)
- **Frontend** (Interface)

---

### ÉTAPE 3 : Configurer les variables d'environnement

#### SERVICE BACKEND

1. Dans Railway, clique sur le service **backend**
2. Onglet **"Variables"**
3. Ajoute ces variables **UNE PAR UNE** :

```bash
STRIPE_SECRET_KEY
sk_test_51Sx95w0bWDBDwCtUTY8JSBV9LKobbOY5CfRFNgAcSdVyrTpqsKWchCCZyy1iCkIy3Vd5jtX8QTBTwkUYBU8B1iZ0008SMZ6DZF

STRIPE_PUBLIC_KEY
pk_test_51Sx95w0bWDBDwCtUOIOx6hpcymOpySJjCckrzrTNA9INNznp4iJJhj0HvSvQHVVCFzzr7aJ213Bgj6MYfSP1sKxv00as5prznB

STRIPE_PRICE_ID
price_1Sx9CI0bWDBDwCtUnI2mkRd3

OPENAI_API_KEY
sk-proj-TACLÉ ICI

NODE_ENV
production

PORT
3001
```

⚠️ **IMPORTANT** : Remplace `sk-proj-TACLÉ` par ta vraie clé OpenAI !

4. Pour chaque variable :
   - Clique **"New Variable"**
   - Entre le nom (ex: `OPENAI_API_KEY`)
   - Entre la valeur
   - Clique **"Add"**

---

#### OBTENIR L'URL DU BACKEND

1. Service **backend** → Onglet **"Settings"**
2. Section **"Networking"** → **"Generate Domain"**
3. **Copie l'URL** (ex: `skynote-backend-production.up.railway.app`)

---

#### SERVICE FRONTEND

1. Clique sur le service **frontend**
2. Onglet **"Variables"**
3. Ajoute :

```bash
REACT_APP_API_URL
https://TON-BACKEND-URL.railway.app
```

⚠️ Remplace `TON-BACKEND-URL` par l'URL de ton backend !

---

#### MISE À JOUR DU BACKEND

Retourne sur le **backend** et ajoute :

```bash
FRONTEND_URL
https://TON-FRONTEND-URL.railway.app

ALLOWED_ORIGINS
https://TON-FRONTEND-URL.railway.app
```

⚠️ Remplace `TON-FRONTEND-URL` par l'URL de ton frontend !

---

### ÉTAPE 4 : Vérifier le déploiement

#### Test Backend

Ouvre : `https://TON-BACKEND.railway.app/api/health`

✅ **Tu dois voir :**
```json
{
  "status": "OK",
  "message": "SkyNote API is running!"
}
```

#### Test Frontend

Ouvre : `https://TON-FRONTEND.railway.app`

✅ **Tu dois voir :**
- Interface SkyNote
- Logo nuage bleu avec badge jaune
- Gradient sky/blue
- Formulaire de création

---

## ⚙️ CONFIGURATION DU BACKEND

Le backend est déjà configuré ! Voici ce qu'il fait :

### Fonctionnalités actives :

1. **Upload PDF** : Extraction de texte via `pdf-parse`
2. **Upload Photo** : OCR via OpenAI Vision (GPT-4o)
3. **Génération fiches** : 5 fiches par cours (3 en gratuit)
4. **Génération QCM** : 5 questions par fiche
5. **Système 100 premiers** : Premium gratuit à vie
6. **Limites freemium** :
   - Gratuit : 3 fiches max + 5 QCM max
   - Premium : Illimité
7. **Stripe** : Paiements + webhooks

### Routes API disponibles :

```
GET  /api/health                     → Santé du serveur
GET  /api/auth/me                    → User actuel
POST /api/upload/pdf                 → Upload PDF
POST /api/upload/photo               → Upload photo (OCR)
POST /api/generate-flashcards        → Générer fiches
POST /api/generate-quiz              → Générer QCM
GET  /api/courses                    → Liste des cours
POST /api/stripe/create-checkout-session → Créer paiement
POST /api/stripe/webhook             → Webhooks Stripe
```

---

## 💳 CONFIGURATION DES PAIEMENTS STRIPE

### MODE TEST (Pour tester maintenant)

✅ **C'est déjà configuré !**

**Carte de test Stripe :**
```
Numéro: 4242 4242 4242 4242
Date: 12/34
CVC: 123
Code postal: 12345
```

### Test du paiement :

1. Va sur ton app
2. Clique **"Premium"**
3. Clique **"Passer à Premium"**
4. Utilise la carte de test ci-dessus
5. Clique **"S'abonner"**

✅ **Tu es redirigé vers la page de succès !**

⚠️ **Aucun vrai paiement**, c'est en mode TEST.

---

### MODE PRODUCTION (Quand tu es prêt à lancer)

⚠️ **NE FAIS ÇA QUE QUAND TU ES PRÊT À ACCEPTER DE VRAIS PAIEMENTS**

#### ÉTAPE 1 : Créer ton Auto-Entreprise (France)

1. Va sur [autoentrepreneur.urssaf.fr](https://autoentrepreneur.urssaf.fr)
2. **Crée ton auto-entreprise** (gratuit)
3. **Code APE** : 6201Z (Programmation informatique)
4. **Note ton SIRET** (tu en auras besoin)

**Pourquoi ?** Stripe exige un statut légal pour les paiements réels.

---

#### ÉTAPE 2 : Activer Stripe Production

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Désactive le mode Test** (toggle en haut à droite)
3. **Remplis les informations** :
   - Nom de l'entreprise
   - SIRET
   - Adresse
   - RIB/Compte bancaire
4. **Active le compte** (Stripe peut demander des documents)

---

#### ÉTAPE 3 : Obtenir les clés LIVE

1. Dans Stripe Dashboard (mode Live), va dans **Developers** → **API Keys**
2. **Copie** :
   - **Publishable key** (commence par `pk_live_`)
   - **Secret key** (commence par `sk_live_`)

---

#### ÉTAPE 4 : Mettre à jour Railway

Dans Railway, **backend** → **Variables** :

**Remplace** les clés test par les clés live :

```bash
STRIPE_SECRET_KEY
sk_live_TA_CLÉ_LIVE

STRIPE_PUBLIC_KEY
pk_live_TA_CLÉ_LIVE
```

⚠️ **Garde le même `STRIPE_PRICE_ID`** (il fonctionne en live aussi)

---

#### ÉTAPE 5 : Configurer le Webhook

1. Dans Stripe, **Developers** → **Webhooks**
2. **"Add endpoint"**
3. **URL** : `https://api.skynote.fr/api/stripe/webhook` (ou ton URL backend)
4. **Sélectionne ces événements** :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. **"Add endpoint"**
6. **Copie le Webhook Secret** (commence par `whsec_`)

7. Dans Railway, ajoute :

```bash
STRIPE_WEBHOOK_SECRET
whsec_TON_SECRET
```

✅ **Stripe est en production ! Les vrais paiements fonctionnent !**

---

## 🌐 ACHAT ET CONFIGURATION DU NOM DE DOMAINE

### ÉTAPE 1 : Acheter skynote.fr

#### Registrars recommandés :

**Option 1 : Namecheap** (~8€/an)
- Va sur [namecheap.com](https://namecheap.com)
- Cherche `skynote.fr`
- Ajoute au panier
- Paye (~8-10€/an)

**Option 2 : OVH** (~12€/an)
- Va sur [ovh.com](https://ovh.com)
- Cherche `skynote.fr`
- Achète (~12€/an)

**Option 3 : Google Domains** (~12€/an)
- Va sur [domains.google](https://domains.google)
- Achète `skynote.fr`

---

### ÉTAPE 2 : Connecter le domaine à Railway

#### Sur Railway - SERVICE BACKEND

1. Service **backend** → **Settings** → **Domains**
2. **"Custom Domain"**
3. Entre : `api.skynote.fr`
4. Railway te donne un **CNAME**

Exemple :
```
Type: CNAME
Host: api.skynote.fr
Value: skynote-backend-production-abc123.up.railway.app
```

---

#### Sur Railway - SERVICE FRONTEND

1. Service **frontend** → **Settings** → **Domains**
2. **"Custom Domain"**
3. Entre : `skynote.fr`
4. Ajoute aussi : `www.skynote.fr`
5. Railway te donne des **CNAME**

Exemple :
```
Type: CNAME
Host: @
Value: skynote-frontend-xyz.up.railway.app

Type: CNAME
Host: www
Value: skynote-frontend-xyz.up.railway.app
```

---

#### Chez ton registrar (Namecheap/OVH)

1. **Connexion** à ton compte
2. **Gestion DNS** de skynote.fr
3. **Ajoute les enregistrements** que Railway t'a donnés

**Exemple sur Namecheap :**

| Type  | Host | Value                                       | TTL  |
|-------|------|---------------------------------------------|------|
| CNAME | api  | skynote-backend-production.up.railway.app   | Auto |
| CNAME | @    | skynote-frontend.up.railway.app             | Auto |
| CNAME | www  | skynote-frontend.up.railway.app             | Auto |

4. **Sauvegarde**

---

#### Attends la propagation DNS

⏳ **30 minutes à 2 heures**

Les DNS prennent du temps à se propager mondialement.

✅ **Après, ton app sera accessible sur `skynote.fr` !**

---

### ÉTAPE 3 : Mettre à jour les variables Railway

Une fois le domaine actif, **mets à jour** :

**Backend** :
```bash
FRONTEND_URL
https://skynote.fr

ALLOWED_ORIGINS
https://skynote.fr,https://www.skynote.fr
```

**Frontend** :
```bash
REACT_APP_API_URL
https://api.skynote.fr
```

**Stripe Webhook URL** :
```
https://api.skynote.fr/api/stripe/webhook
```

---

## 🧪 TESTS COMPLETS

### TEST 1 : Génération de fiches (TEXTE)

1. Va sur ton app
2. Copie ce texte :

```
La photosynthèse est le processus par lequel les plantes utilisent la lumière du soleil pour convertir le dioxyde de carbone et l'eau en glucose et en oxygène. Ce processus se déroule principalement dans les chloroplastes des cellules végétales. Les pigments chlorophylliens absorbent la lumière. L'oxygène est libéré comme sous-produit. La photosynthèse comprend deux phases : les réactions lumineuses et le cycle de Calvin.
```

3. **Titre** : "La Photosynthèse"
4. **Matière** : "Biologie"
5. **Générer**
6. Attends 10-20 secondes

✅ **Tu dois voir 3 fiches !**

---

### TEST 2 : Upload PDF

1. Crée un PDF avec du texte
2. Onglet **"PDF"**
3. Upload
4. Le texte est extrait
5. Génère les fiches

✅ **Ça marche !**

---

### TEST 3 : Upload Photo (OCR)

1. Prends une photo d'un cours
2. Onglet **"Photo"**
3. Upload
4. Le texte est extrait via OCR
5. Génère les fiches

✅ **L'OCR fonctionne !**

---

### TEST 4 : QCM

1. Clique sur une fiche
2. **"Lancer le quiz"**
3. Réponds aux questions
4. Vois ton score

✅ **Le quiz marche !**

---

### TEST 5 : Paiement

1. **"Premium"**
2. **"Passer à Premium"**
3. Carte test : `4242 4242 4242 4242`
4. Valide

✅ **Page de succès !**

---

## 🎉 MISE EN PRODUCTION

### Checklist finale avant le lancement :

- [ ] Backend déployé et `api/health` fonctionne
- [ ] Frontend accessible
- [ ] OpenAI avec crédit (vérifie sur [platform.openai.com/usage](https://platform.openai.com/usage))
- [ ] Stripe en mode TEST fonctionne
- [ ] Upload texte/PDF/photo fonctionnent
- [ ] Génération fiches fonctionne
- [ ] QCM fonctionne
- [ ] 5-10 amis ont testé
- [ ] Feedback collecté et bugs corrigés
- [ ] Auto-entrepreneur créé (pour Stripe LIVE)
- [ ] Stripe passé en LIVE
- [ ] Domaine skynote.fr actif
- [ ] Première vidéo TikTok prête

---

### Stratégie de lancement :

#### Semaine 1 : Tests privés
- 10-20 amis/famille
- Collecte feedback
- Corrige les bugs

#### Semaine 2 : Lancement doux
- Poste sur groupes Facebook étudiants
- Partage sur Reddit (r/etudiant)
- 1-2 vidéos TikTok

#### Semaine 3-4 : Marketing intensif
- 3-4 vidéos TikTok/semaine
- Bouche-à-oreille
- Partenariats délégués de classe

**Objectif** : 200 utilisateurs en 1 mois

---

## 🆘 DÉPANNAGE

### ❌ "Cannot connect to backend"

**Cause** : Variables mal configurées

**Solution** :
1. Vérifie `REACT_APP_API_URL` dans frontend = URL backend exacte
2. Vérifie `ALLOWED_ORIGINS` dans backend = URL frontend exacte
3. Pas de slash `/` à la fin des URLs

---

### ❌ "OpenAI API error"

**Causes possibles** :
- Pas de crédit OpenAI
- Clé invalide
- Carte bancaire pas ajoutée

**Solution** :
1. Va sur [platform.openai.com/usage](https://platform.openai.com/usage)
2. Vérifie que tu as du crédit (5$ gratuits)
3. Vérifie que la carte est bien ajoutée
4. Vérifie que la clé est correcte dans Railway

---

### ❌ "Stripe checkout error"

**Solution** :
1. Vérifie les 3 clés Stripe dans Railway
2. En mode test, utilise `4242 4242 4242 4242`
3. Vérifie `STRIPE_PRICE_ID`

---

### ❌ Le backend est lent (30-60 secondes)

**C'est normal !** 

Railway (gratuit) met les services en veille après 10 minutes d'inactivité.

**Solutions** :
- Accepte le délai (gratuit)
- Upgrade Railway Pro (~8$/mois) pour éviter la mise en veille

---

### ❌ PDF ne s'extrait pas

**Vérifications** :
- Le PDF contient du texte (pas juste des images)
- Fichier < 10MB
- Regarde les logs Railway backend

---

### ❌ OCR ne détecte pas le texte

**Vérifications** :
- Photo nette et lisible
- Texte suffisamment gros
- Image < 5MB
- Crédit OpenAI disponible

---

### ❌ Paiement réussi mais pas Premium

**Cause** : Webhook pas configuré

**Solution** :
1. Vérifie que `STRIPE_WEBHOOK_SECRET` est dans Railway
2. Vérifie l'URL du webhook dans Stripe Dashboard
3. Regarde les logs Railway backend

---

## 💰 COÛTS RÉCAPITULATIFS

### Mois 1-3 : **GRATUIT (0€)**
- Railway : Crédit gratuit (5$)
- OpenAI : Crédit gratuit (5$)
- Stripe : Gratuit
- **Total : 0€**

### Mois 4+ : **~11€/mois**
- Railway : ~8€/mois
- OpenAI : ~2€/mois
- Domaine : ~1€/mois (10€/an)
- **Total : ~11€/mois**

### Rentabilité :
- 2 users Premium (18€/mois) → **Rentable !**
- 10 users Premium (90€/mois) → **79€ de profit**
- 50 users Premium (450€/mois) → **439€ de profit**

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ **Déploie** en suivant ce guide
2. ✅ **Teste** avec 5-10 amis
3. ✅ **Collecte** les retours
4. ✅ **Améliore** ce qui bloque
5. ✅ **Lance** publiquement
6. ✅ **Crée** des vidéos TikTok
7. ✅ **Partage** dans les groupes
8. ✅ **Objectif** : 50 utilisateurs en 2 semaines

---

## 📞 AIDE SUPPLÉMENTAIRE

**Docs officielles :**
- Railway : [docs.railway.app](https://docs.railway.app)
- Stripe : [stripe.com/docs](https://stripe.com/docs)
- OpenAI : [platform.openai.com/docs](https://platform.openai.com/docs)

---

# 🎉 FÉLICITATIONS !

**Tu as TOUT ce qu'il faut pour lancer SkyNote ! 🚀**

**Bon courage pour le lancement ! 💪**

---

*Document créé le 7 février 2026*
*Version 1.0*
