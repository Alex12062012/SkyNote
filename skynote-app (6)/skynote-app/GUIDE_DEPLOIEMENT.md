# 📘 SKYNOTE - GUIDE DE DÉPLOIEMENT

**Déployer SkyNote sur Render en 30 minutes**

---

## 🎯 VUE D'ENSEMBLE

**SkyNote** transforme les cours en fiches de révision et QCM avec l'IA.

**Prix pour l'utilisateur : 5,90€/mois**

---

## ✅ PRÉREQUIS

### Comptes nécessaires (tous gratuits) :

1. **GitHub** : [github.com](https://github.com)
   - Télécharge [GitHub Desktop](https://desktop.github.com)

2. **Render** : [render.com](https://render.com)
   - Connecte avec GitHub

3. **Stripe** : [stripe.com](https://stripe.com)
   - Mode TEST au début

4. **OpenAI** : [platform.openai.com](https://platform.openai.com)
   - ⚠️ Carte bancaire obligatoire (5$ gratuits)

---

## 🔑 OBTENIR TES CLÉS API

### 1. OpenAI

1. Va sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Create new secret key**
3. Nom : `SkyNote`
4. **Copie la clé** (commence par `sk-proj-`)
5. ⚠️ **SAUVEGARDE** dans un fichier texte

---

### 2. Stripe

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Mode **TEST** (toggle en haut à droite)
3. **Developers** → **API Keys**
4. **Copie** :
   - **Secret key** (commence par `sk_test_`)
   - **Publishable key** (commence par `pk_test_`)

5. **Products** → **Create product**
   - Nom : `SkyNote Premium`
   - Prix : **5,90 EUR / mois**
   - **Save**
   - **Copie le Price ID** (commence par `price_`)

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
Region: Frankfurt (ou proche de toi)
Branch: main
Root Directory: (laisse vide)
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

5. **Instance Type** :
   - **Free** pour tester (shutdown après 15min)
   - **Starter ($7/mois)** pour lancer vraiment

---

### Variables d'environnement Backend :

**Advanced** → **Add Environment Variable** :

```
OPENAI_API_KEY
[Colle ta clé OpenAI ici]

STRIPE_SECRET_KEY
[Colle ta clé Stripe Secret ici]

STRIPE_PUBLIC_KEY
[Colle ta clé Stripe Public ici]

STRIPE_PRICE_ID
[Colle ton Price ID ici]

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

### ÉTAPE 3 : Finaliser

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

## ✅ TESTER L'APPLICATION

Ouvre : `https://skynote-frontend.onrender.com`

### Tests à faire :

1. **Génération texte** : Colle un cours, génère des fiches
2. **Upload PDF** : Upload un PDF, génère des fiches
3. **Upload Photo** : Prends en photo un cours, génère des fiches
4. **QCM** : Lance un quiz sur une fiche
5. **Paiement** : Teste avec carte `4242 4242 4242 4242`

---

## 🌐 ACHETER LE DOMAINE (optionnel)

**Attends d'avoir 3-5 users Premium avant !**

### Où acheter skynote.fr :

- **Namecheap** : ~8€/an
- **OVH** : ~12€/an

### Connecter à Render :

1. **Backend** → **Custom Domain** : `api.skynote.fr`
2. **Frontend** → **Custom Domain** : `skynote.fr` + `www.skynote.fr`
3. Ajoute les **CNAME** chez ton registrar
4. Attends 30min-2h

---

## 💳 PASSER EN PRODUCTION STRIPE

### Quand tu es prêt :

1. **Crée ton auto-entreprise** : [autoentrepreneur.urssaf.fr](https://autoentrepreneur.urssaf.fr)
2. **Active Stripe** : Remplis infos, RIB, SIRET
3. **Obtiens clés LIVE** : `sk_live_...` et `pk_live_...`
4. **Remplace** dans Render les clés TEST par les clés LIVE
5. **Configure webhook** : `https://api.skynote.fr/api/stripe/webhook`

---

## 💰 COÛTS

### Phase 1 : Gratuit (tests)
- Backend Free : 0€
- Frontend : 0€
- **Total : 0€**

### Phase 2 : Lancé (~8€/mois)
- Backend Paid : 7$/mois (~6,50€)
- Frontend : 0€
- OpenAI : ~1€/mois
- **Total : ~8€/mois**

### Phase 3 : Avec domaine (~13€/mois)
- Hébergement : ~7,50€
- Domaine : ~1€/mois
- OpenAI : ~1€/mois
- **Total : ~13€/mois**

---

## 📊 RENTABILITÉ (5,90€/mois)

| Users | Revenus | Coûts | Profit |
|-------|---------|-------|--------|
| 2     | 11,80€  | 8€    | +3,80€ |
| 5     | 29,50€  | 8€    | +21,50€ |
| 10    | 59€     | 8€    | +51€ |
| 20    | 118€    | 8€    | +110€ |
| 50    | 295€    | 13€   | +282€ |

---

## 🆘 DÉPANNAGE

### Backend lent (30-60 sec)
→ Normal en Free (réveil après veille)
→ Solution : Upgrade Starter (7$/mois)

### "Cannot connect to backend"
→ Vérifie `REACT_APP_API_URL` dans frontend
→ Vérifie `ALLOWED_ORIGINS` dans backend

### "OpenAI error"
→ Vérifie crédit sur [platform.openai.com/usage](https://platform.openai.com/usage)
→ Vérifie que la clé est correcte

### "Stripe error"
→ Vérifie les 3 clés Stripe
→ En test : carte `4242 4242 4242 4242`

---

## 📋 CHECKLIST AVANT LANCEMENT

- [ ] Backend déployé
- [ ] Frontend déployé
- [ ] Clés API configurées
- [ ] Upload texte/PDF/photo fonctionnent
- [ ] Génération fiches OK
- [ ] QCM fonctionne
- [ ] Paiement test OK
- [ ] 5-10 amis ont testé
- [ ] Bugs corrigés

---

## 🚀 PLAN DE LANCEMENT

**Semaine 1** : Tests privés (10-20 amis)
**Semaine 2** : Upgrade Render Paid + Lancement public
**Semaine 3-4** : Marketing (TikTok, Reddit, Facebook)
**Mois 2-3** : Premiers revenus (objectif 5-10 Premium)
**Mois 6+** : Stable (50-100 Premium = 295-590€/mois)

---

# 🎉 BON LANCEMENT !

**SkyNote est prêt ! ☁️**
