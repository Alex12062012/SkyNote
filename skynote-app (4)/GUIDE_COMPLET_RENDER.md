# 📘 SKYNOTE - GUIDE COMPLET RENDER

**De l'installation au lancement - Tout en un seul document**

---

## 📋 TABLE DES MATIÈRES

1. [Présentation](#présentation)
2. [Prérequis](#prérequis)
3. [Obtenir les clés API](#obtenir-les-clés-api)
4. [Mettre le code sur GitHub](#mettre-le-code-sur-github)
5. [Déployer sur Render](#déployer-sur-render)
6. [Configuration complète](#configuration-complète)
7. [Tests de l'application](#tests-de-lapplication)
8. [Acheter et configurer le domaine](#acheter-et-configurer-le-domaine)
9. [Passer en production Stripe](#passer-en-production-stripe)
10. [Coûts et rentabilité](#coûts-et-rentabilité)
11. [Dépannage](#dépannage)

---

## 🎯 PRÉSENTATION

**SkyNote** transforme tes cours en fiches de révision et QCM avec l'IA.

### Fonctionnalités :
- ✅ Upload **texte, PDF, ou photo** (OCR)
- ✅ Génération automatique de **fiches structurées**
- ✅ **QCM personnalisés** avec explications
- ✅ **Freemium** : 3 fiches gratuites, illimité en Premium
- ✅ **100 premiers inscrits** = Premium gratuit à vie
- ✅ Paiements **Stripe** (5,90€/mois)

### Prix pour l'utilisateur :
**5,90€/mois** pour Premium

---

## ✅ PRÉREQUIS

### 1. Compte GitHub
- [github.com](https://github.com) → Gratuit
- **Télécharge** [GitHub Desktop](https://desktop.github.com)

### 2. Compte Render
- [render.com](https://render.com) → Gratuit
- Connecte-toi avec GitHub

### 3. Compte Stripe
- [stripe.com](https://stripe.com) → Gratuit
- Mode TEST au début (pas besoin de valider)

### 4. Compte OpenAI
- [platform.openai.com](https://platform.openai.com) → Gratuit
- ⚠️ Carte bancaire obligatoire (5$ gratuits)

---

## 🔑 OBTENIR LES CLÉS API

### OPENAI

1. Va sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Create new secret key**
3. Nom : `SkyNote`
4. **Copie la clé** (commence par `sk-proj-`)
5. ⚠️ **SAUVEGARDE** dans un fichier texte

**Ta clé :**
```
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
```

---

### STRIPE (Mode TEST)

**Tu as déjà ces clés :**

```
Secret Key:
sk_test_51Sx95w0bWDBDwCtUTY8JSBV9LKobbOY5CfRFNgAcSdVyrTpqsKWchCCZyy1iCkIy3Vd5jtX8QTBTwkUYBU8B1iZ0008SMZ6DZF

Public Key:
pk_test_51Sx95w0bWDBDwCtUOIOx6hpcymOpySJjCckrzrTNA9INNznp4iJJhj0HvSvQHVVCFzzr7aJ213Bgj6MYfSP1sKxv00as5prznB

Price ID:
price_1Sx9CI0bWDBDwCtUnI2mkRd3
```

⚠️ **IMPORTANT** : Pour avoir le prix à 5,90€, tu devras créer un nouveau Price dans Stripe (voir section plus bas)

---

## 📤 METTRE LE CODE SUR GITHUB

### Avec GitHub Desktop :

1. **Décompresse** `skynote-app.zip`
2. **Ouvre GitHub Desktop**
3. **File** → **Add Local Repository**
4. **Choose** → Sélectionne `skynote-app`
5. Si erreur :
   - **Create a repository**
   - Nom : `skynote-app`
   - **Décoche** "Keep this code private"
   - **Create Repository**
6. **Publish repository**
7. **Décoche** "Keep this code private"
8. **Publish**

✅ **Code sur GitHub !**

---

## 🚀 DÉPLOYER SUR RENDER

### ÉTAPE 1 : Backend

1. Va sur [render.com](https://render.com)
2. **Dashboard** → **New +** → **Web Service**
3. Connecte ton repo `skynote-app`
4. **Configure** :

```
Name: skynote-backend
Region: Frankfurt
Branch: main
Root Directory: (vide)
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

5. **Instance Type** :
   - ⚠️ **Free** pour tester MAINTENANT (shutdown après 15min)
   - ✅ **Starter ($7/mois)** pour lancer vraiment (pas de shutdown)

---

### Variables d'environnement Backend :

**Clique** sur **Advanced** puis **Add Environment Variable** pour chaque :

```
OPENAI_API_KEY
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

STRIPE_SECRET_KEY
sk_test_51Sx95w0bWDBDwCtUTY8JSBV9LKobbOY5CfRFNgAcSdVyrTpqsKWchCCZyy1iCkIy3Vd5jtX8QTBTwkUYBU8B1iZ0008SMZ6DZF

STRIPE_PUBLIC_KEY
pk_test_51Sx95w0bWDBDwCtUOIOx6hpcymOpySJjCckrzrTNA9INNznp4iJJhj0HvSvQHVVCFzzr7aJ213Bgj6MYfSP1sKxv00as5prznB

STRIPE_PRICE_ID
price_1Sx9CI0bWDBDwCtUnI2mkRd3

NODE_ENV
production

PORT
3001
```

6. **Create Web Service**

⏳ **Attends 3-5 minutes**

7. **Note l'URL** : `https://skynote-backend.onrender.com`

8. **Teste** : `https://skynote-backend.onrender.com/api/health`

✅ **Tu dois voir** :
```json
{
  "status": "OK",
  "message": "SkyNote API is running!"
}
```

---

### ÉTAPE 2 : Frontend

1. **Dashboard** → **New +** → **Static Site**
2. Connecte le même repo `skynote-app`
3. **Configure** :

```
Name: skynote-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: build
```

4. **Add Environment Variable** :

```
REACT_APP_API_URL
https://skynote-backend.onrender.com
```

⚠️ Remplace par TON URL backend !

5. **Create Static Site**

⏳ **Attends 5-10 minutes**

6. **Note l'URL** : `https://skynote-frontend.onrender.com`

---

### ÉTAPE 3 : Finaliser la connexion

1. Retourne sur **skynote-backend**
2. **Environment** → **Add Variable** :

```
FRONTEND_URL
https://skynote-frontend.onrender.com

ALLOWED_ORIGINS
https://skynote-frontend.onrender.com
```

3. Le backend redémarre (30 sec)

---

## ✅ CONFIGURATION COMPLÈTE

### Teste ton app

Ouvre : `https://skynote-frontend.onrender.com`

✅ **Tu devrais voir :**
- Interface SkyNote
- Logo nuage bleu + badge jaune
- Gradient sky/blue
- Formulaire de création

---

## 🧪 TESTS DE L'APPLICATION

### TEST 1 : Génération fiches (TEXTE)

1. Copie ce texte :

```
La photosynthèse est le processus par lequel les plantes utilisent la lumière du soleil pour convertir le dioxyde de carbone et l'eau en glucose et en oxygène. Ce processus se déroule dans les chloroplastes. Les pigments chlorophylliens absorbent la lumière. L'oxygène est libéré comme sous-produit. La photosynthèse comprend deux phases : les réactions lumineuses et le cycle de Calvin.
```

2. **Titre** : "Photosynthèse"
3. **Matière** : "Biologie"
4. **Générer**
5. Attends 10-20 secondes

✅ **3 fiches générées !**

---

### TEST 2 : Upload PDF

1. Crée un PDF avec du texte
2. Onglet **PDF**
3. Upload
4. Texte extrait automatiquement
5. Génère les fiches

✅ **Ça marche !**

---

### TEST 3 : Upload Photo (OCR)

1. Prends une photo d'un cours
2. Onglet **Photo**
3. Upload
4. OCR extrait le texte
5. Génère les fiches

✅ **L'OCR fonctionne !**

---

### TEST 4 : QCM

1. Clique sur une fiche
2. **"Lancer le quiz"**
3. Réponds aux questions
4. Vois ton score

✅ **Quiz OK !**

---

### TEST 5 : Paiement Stripe

1. **Premium**
2. **"Passer à Premium"**
3. Carte test : `4242 4242 4242 4242`
4. Date : `12/34`
5. CVC : `123`
6. Valide

✅ **Page de succès !**

---

## 🌐 ACHETER ET CONFIGURER LE DOMAINE

### Quand acheter ?

**Attends d'avoir tes 3-5 premiers users Premium (18-30€/mois de revenus)**

Comme ça, le domaine est rentabilisé.

---

### Où acheter skynote.fr ?

**Option 1 : Namecheap** (~8€/an)
- [namecheap.com](https://namecheap.com)
- Cherche `skynote.fr`
- Achète

**Option 2 : OVH** (~12€/an)
- [ovh.com](https://ovh.com)
- Achète `skynote.fr`

---

### Connecter à Render

#### BACKEND (api.skynote.fr)

1. **skynote-backend** → **Settings** → **Custom Domains**
2. **Add Custom Domain** : `api.skynote.fr`
3. Render te donne un **CNAME**

Exemple :
```
Type: CNAME
Host: api
Value: skynote-backend.onrender.com
```

---

#### FRONTEND (skynote.fr)

1. **skynote-frontend** → **Settings** → **Custom Domains**
2. **Add Custom Domain** : `skynote.fr`
3. **Add** aussi : `www.skynote.fr`
4. Render te donne des **CNAME**

Exemple :
```
Type: CNAME
Host: @
Value: skynote-frontend.onrender.com

Type: CNAME
Host: www
Value: skynote-frontend.onrender.com
```

---

#### Chez ton registrar (Namecheap/OVH)

1. **Gestion DNS** de skynote.fr
2. **Ajoute les CNAME** que Render t'a donnés
3. **Sauvegarde**

⏳ **Attends 30 min - 2h** (propagation DNS)

✅ **skynote.fr fonctionne !**

---

### Mettre à jour les variables

**Backend** :
```
FRONTEND_URL=https://skynote.fr
ALLOWED_ORIGINS=https://skynote.fr,https://www.skynote.fr
```

**Frontend** :
```
REACT_APP_API_URL=https://api.skynote.fr
```

---

## 💳 PASSER EN PRODUCTION STRIPE

### Pour avoir le prix à 5,90€ :

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products** → Trouve "SkyNote Premium"
3. **Add price**
4. Montant : **5,90 EUR**
5. Récurrence : **Mensuelle**
6. **Save**
7. **Copie le Price ID** (commence par `price_...`)

8. Dans Render backend, **change la variable** :
```
STRIPE_PRICE_ID=TON_NOUVEAU_PRICE_ID
```

---

### Quand tu es prêt à accepter de vrais paiements :

#### 1. Créer ton Auto-Entrepreneur

1. [autoentrepreneur.urssaf.fr](https://autoentrepreneur.urssaf.fr)
2. **Crée** ton auto-entreprise (gratuit)
3. **Code APE** : 6201Z (Programmation)
4. **Note ton SIRET**

---

#### 2. Activer Stripe LIVE

1. Stripe Dashboard → **Désactive** le mode Test
2. **Remplis** les infos (SIRET, RIB, etc.)
3. **Active** le compte

---

#### 3. Obtenir clés LIVE

1. **Developers** → **API Keys**
2. **Copie** :
   - Secret key (`sk_live_...`)
   - Public key (`pk_live_...`)

---

#### 4. Mettre à jour Render

Backend variables :
```
STRIPE_SECRET_KEY=sk_live_TA_CLÉ
STRIPE_PUBLIC_KEY=pk_live_TA_CLÉ
```

---

#### 5. Webhook Stripe

1. **Developers** → **Webhooks**
2. **Add endpoint**
3. URL : `https://api.skynote.fr/api/stripe/webhook`
4. Événements :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. **Copie le Webhook Secret**

6. Render backend :
```
STRIPE_WEBHOOK_SECRET=whsec_TON_SECRET
```

✅ **Paiements réels actifs !**

---

## 💰 COÛTS ET RENTABILITÉ

### Phase 1 : GRATUIT (Tests)

```
Backend Render Free   : 0€
Frontend Render       : 0€
OpenAI (5$ gratuits)  : 0€
Pas de domaine        : 0€
════════════════════════════
TOTAL                 : 0€/mois
```

⚠️ Backend shutdown après 15 min (réveil en 30 sec)

---

### Phase 2 : LANCÉ (~8€/mois)

```
Backend Render Paid   : 7$/mois (~6,50€)
Frontend Render       : 0€
OpenAI                : ~1€/mois
Pas de domaine        : 0€
════════════════════════════
TOTAL                 : ~8€/mois
```

✅ Pas de shutdown
✅ URL : skynote.onrender.com

**Rentable dès 2 users Premium (11,80€/mois)**

---

### Phase 3 : AVEC DOMAINE (~13€/mois)

```
Backend Render Paid   : 7$/mois (~6,50€)
Frontend Render       : 0€
OpenAI                : ~1€/mois
Domaine skynote.fr    : ~1€/mois (10€/an)
════════════════════════════
TOTAL                 : ~13€/mois
```

✅ Domaine pro : skynote.fr

**Rentable dès 3 users Premium (17,70€/mois)**

---

### Tableau de rentabilité (5,90€/mois) :

| Users Premium | Revenus | Coûts (Phase 2) | Profit |
|---------------|---------|-----------------|--------|
| 2             | 11,80€  | 8€              | **+3,80€** |
| 5             | 29,50€  | 8€              | **+21,50€** |
| 10            | 59€     | 8€              | **+51€** |
| 20            | 118€    | 8€              | **+110€** |
| 50            | 295€    | 8€              | **+287€** |
| 100           | 590€    | 13€             | **+577€** |

---

## 🆘 DÉPANNAGE

### ❌ "Cannot connect to backend"

**Solution :**
1. Vérifie `REACT_APP_API_URL` dans frontend
2. Vérifie `ALLOWED_ORIGINS` dans backend
3. Pas de `/` à la fin des URLs

---

### ❌ "OpenAI API error"

**Solutions :**
1. Vérifie crédit sur [platform.openai.com/usage](https://platform.openai.com/usage)
2. Vérifie que la clé est correcte
3. Vérifie que la carte bancaire est ajoutée

---

### ❌ "Stripe error"

**Solutions :**
1. Vérifie les 3 clés Stripe
2. En test : carte `4242 4242 4242 4242`
3. Vérifie le Price ID

---

### ❌ Backend lent (30-60 sec)

**C'est normal en FREE !**

Render Free met en veille après 15 min.

**Solution :** Upgrade vers Starter (7$/mois)

---

### ❌ PDF ne s'extrait pas

**Vérifications :**
- PDF contient du texte (pas juste images)
- Fichier < 10MB
- Regarde les logs Render

---

### ❌ OCR ne détecte rien

**Vérifications :**
- Photo nette
- Texte lisible
- Image < 5MB
- Crédit OpenAI disponible

---

## 📋 CHECKLIST AVANT LANCEMENT

- [ ] Backend déployé et `/api/health` OK
- [ ] Frontend accessible
- [ ] OpenAI a du crédit
- [ ] Upload texte fonctionne
- [ ] Upload PDF fonctionne
- [ ] Upload photo fonctionne
- [ ] Génération fiches OK
- [ ] QCM fonctionne
- [ ] Paiement Stripe test OK
- [ ] 5-10 amis ont testé
- [ ] Feedback collecté
- [ ] Bugs corrigés
- [ ] Auto-entrepreneur créé (pour Stripe LIVE)
- [ ] Stripe en LIVE
- [ ] Domaine acheté (optionnel)

---

## 🚀 PLAN DE LANCEMENT

### Semaine 1 : Tests privés (Gratuit Render)
- 10-20 amis
- Collecte feedback
- Corrige bugs

### Semaine 2 : Upgrade Render (8€/mois)
- Render Paid (pas de shutdown)
- Lancement doux public
- Groupes Facebook
- Reddit (r/etudiant)

### Semaine 3-4 : Marketing
- TikTok/Reels (3-4 vidéos/semaine)
- Bouche-à-oreille
- Objectif : 100 users

### Mois 2-3 : Premiers revenus
- Objectif : 5-10 Premium (30-60€/mois)
- **Achète skynote.fr** quand rentable

### Mois 6+ : Stable
- 50-100 Premium (295-590€/mois)
- Profit : 280-575€/mois 💰

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ **Décompresse** le ZIP
2. ✅ **Push** sur GitHub
3. ✅ **Déploie** sur Render (Free pour tester)
4. ✅ **Teste** avec 5 amis
5. ✅ **Upgrade** Render Paid (7$/mois)
6. ✅ **Lance** publiquement
7. ✅ **Achète domaine** quand rentable

---

# 🎉 FÉLICITATIONS !

**Tu as TOUT pour lancer SkyNote ! ☁️**

**Bon courage ! 💪**

---

*Guide créé le 7 février 2026*
*Version Render optimisée*
