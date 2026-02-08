require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer pour uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Base de données en mémoire (à remplacer par PostgreSQL en production)
const database = {
  users: new Map(),
  courses: new Map(),
  flashcards: new Map(),
  progress: new Map()
};

// Initialiser utilisateur par défaut
const defaultUserId = 'user_' + Date.now();
database.users.set(defaultUserId, {
  id: defaultUserId,
  email: 'user@skynote.fr',
  full_name: 'Utilisateur',
  is_premium: false,
  fiches_count: 0,
  qcm_count: 0,
  created_at: new Date(),
  premium_check_done: false
});

// ========== ROUTES API ==========

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SkyNote API is running!',
    timestamp: new Date().toISOString()
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const user = database.users.get(defaultUserId);
  res.json(user);
});

// Update user
app.patch('/api/auth/me', (req, res) => {
  const user = database.users.get(defaultUserId);
  const updated = { ...user, ...req.body };
  database.users.set(defaultUserId, updated);
  res.json(updated);
});

// Check si dans les 100 premiers inscrits → Premium gratuit
app.get('/api/users/check-premium-eligibility', (req, res) => {
  const allUsers = Array.from(database.users.values())
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  const user = database.users.get(defaultUserId);
  const userIndex = allUsers.findIndex(u => u.id === user.id);
  
  const eligible = userIndex < 100 && !user.is_premium && !user.premium_check_done;
  
  if (eligible) {
    user.is_premium = true;
    user.premium_check_done = true;
    database.users.set(defaultUserId, user);
  }
  
  res.json({ eligible, user });
});

// Upload et extraction PDF
app.post('/api/upload/pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Lire et extraire le texte du PDF
    const dataBuffer = await fs.readFile(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Nettoyer le fichier temporaire
    await fs.unlink(file.path);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Le PDF ne contient pas assez de texte lisible' });
    }

    res.json({ text: text.trim() });
  } catch (error) {
    console.error('PDF extraction error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'extraction du PDF' });
  }
});

// Upload et OCR photo avec OpenAI Vision
app.post('/api/upload/photo', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    // Appel OpenAI Vision pour OCR
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyse cette image et extrait tout le texte visible. Si l\'image ne contient aucun texte lisible, réponds exactement "AUCUN_TEXTE". Sinon, retourne uniquement le texte extrait, sans commentaire additionnel.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    });

    const text = response.choices[0].message.content.trim();

    if (text === 'AUCUN_TEXTE' || text.length < 20) {
      return res.status(400).json({ error: 'Aucun texte détecté dans l\'image' });
    }

    res.json({ text });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'extraction du texte de l\'image' });
  }
});

// Générer des fiches de révision
app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { courseText, title, subject, userId } = req.body;
    const user = database.users.get(userId || defaultUserId);

    // Vérifier limites gratuit (3 fiches max)
    if (!user.is_premium && user.fiches_count >= 3) {
      return res.status(403).json({ 
        error: 'Limite gratuite atteinte (3 fiches max). Passez à Premium pour continuer.',
        limit_reached: true 
      });
    }

    // Générer fiches avec OpenAI
    const prompt = `Tu es un expert en pédagogie. Analyse ce cours et crée exactement 5 fiches de révision structurées.

COURS:
Titre: ${title || 'Non spécifié'}
Matière: ${subject || 'Non spécifiée'}
Contenu: ${courseText}

Pour chaque fiche, identifie un concept clé important et crée:
- title: Un titre clair et concis du concept
- keywords: 3-5 mots-clés essentiels (array de strings)
- summary: Un résumé explicatif de 2-3 phrases
- keyPoints: 4-5 points clés à retenir (array de strings)

Retourne un JSON avec ce format exact:
{
  "flashcards": [
    {
      "title": "string",
      "keywords": ["string"],
      "summary": "string",
      "keyPoints": ["string"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const data = JSON.parse(response.choices[0].message.content);
    
    // Créer le cours
    const courseId = uuidv4();
    const course = {
      id: courseId,
      title: title || 'Nouveau cours',
      subject: subject || '',
      content: courseText,
      created_at: new Date(),
      progress: 0
    };
    database.courses.set(courseId, course);

    // Limiter à 3 fiches en version gratuite
    const flashcardsToCreate = data.flashcards.slice(0, user.is_premium ? 5 : 3);
    const createdFlashcards = [];

    for (const flashcardData of flashcardsToCreate) {
      const flashcardId = uuidv4();
      const flashcard = {
        id: flashcardId,
        course_id: courseId,
        ...flashcardData,
        mastered: false,
        created_at: new Date()
      };
      database.flashcards.set(flashcardId, flashcard);
      createdFlashcards.push(flashcard);
    }

    // Mettre à jour compteur utilisateur
    user.fiches_count += createdFlashcards.length;
    database.users.set(user.id, user);

    res.json({
      courseId,
      flashcards: createdFlashcards,
      totalConceptsDetected: data.flashcards.length,
      isLimited: !user.is_premium && data.flashcards.length > 3
    });

  } catch (error) {
    console.error('Flashcard generation error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des fiches' });
  }
});

// Get tous les cours
app.get('/api/courses', (req, res) => {
  const courses = Array.from(database.courses.values())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(courses);
});

// Get fiches d'un cours
app.get('/api/courses/:courseId/flashcards', (req, res) => {
  const { courseId } = req.params;
  const flashcards = Array.from(database.flashcards.values())
    .filter(f => f.course_id === courseId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  res.json(flashcards);
});

// Marquer fiche comme maîtrisée
app.patch('/api/flashcards/:flashcardId', (req, res) => {
  const { flashcardId } = req.params;
  const { mastered } = req.body;
  
  const flashcard = database.flashcards.get(flashcardId);
  if (!flashcard) {
    return res.status(404).json({ error: 'Fiche non trouvée' });
  }

  flashcard.mastered = mastered;
  database.flashcards.set(flashcardId, flashcard);

  // Recalculer progression du cours
  const allFlashcards = Array.from(database.flashcards.values())
    .filter(f => f.course_id === flashcard.course_id);
  const masteredCount = allFlashcards.filter(f => f.mastered).length;
  const progress = Math.round((masteredCount / allFlashcards.length) * 100);

  const course = database.courses.get(flashcard.course_id);
  if (course) {
    course.progress = progress;
    database.courses.set(course.id, course);
  }

  res.json({ flashcard, course });
});

// Générer QCM
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { flashcardId, flashcardContent, userId } = req.body;
    const user = database.users.get(userId || defaultUserId);

    // Vérifier limites QCM (5 max en gratuit)
    if (!user.is_premium && user.qcm_count >= 5) {
      return res.status(403).json({ 
        error: 'Limite gratuite atteinte (5 QCM max). Passez à Premium pour continuer.',
        limit_reached: true 
      });
    }

    const prompt = `Crée exactement 5 questions de QCM basées sur cette fiche de révision.

FICHE:
Titre: ${flashcardContent.title}
Résumé: ${flashcardContent.summary}
Points clés: ${flashcardContent.keyPoints.join(', ')}

Pour chaque question:
- question: Une question pertinente sur le contenu
- options: Un array de exactement 4 réponses possibles
- correctAnswer: L'index (0-3) de la bonne réponse
- explanation: Une explication claire de pourquoi c'est la bonne réponse

Retourne un JSON avec ce format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8
    });

    const data = JSON.parse(response.choices[0].message.content);

    const questions = data.questions.map(q => ({
      id: uuidv4(),
      ...q
    }));

    // Incrémenter compteur QCM
    user.qcm_count += 1;
    database.users.set(user.id, user);

    res.json({
      quizId: uuidv4(),
      flashcardId,
      questions: questions.slice(0, user.is_premium ? 20 : 5),
      isLimited: !user.is_premium
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du quiz' });
  }
});

// Sauvegarder progression quiz
app.post('/api/save-progress', (req, res) => {
  const { userId, courseId, flashcardId, score, totalQuestions } = req.body;

  const progressKey = `${userId}-${courseId}-${flashcardId}`;
  
  database.progress.set(progressKey, {
    userId,
    courseId,
    flashcardId,
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    completedAt: new Date()
  });

  res.json({ success: true });
});

// Get progress
app.get('/api/progress/:userId/:courseId', (req, res) => {
  const { userId, courseId } = req.params;
  const progress = Array.from(database.progress.values())
    .filter(p => p.userId === userId && p.courseId === courseId);
  res.json(progress);
});

// ========== STRIPE ==========

app.get('/api/stripe/public-key', (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const userId = req.body.userId || defaultUserId;
    const user = database.users.get(userId);

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      user.stripe_customer_id = customerId;
      database.users.set(user.id, user);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${req.body.origin || process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.body.origin || process.env.FRONTEND_URL}/premium`,
      metadata: { user_id: user.id }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.user_id;
      const user = database.users.get(userId);
      if (user) {
        user.is_premium = true;
        user.stripe_customer_id = session.customer;
        database.users.set(userId, user);
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const users = Array.from(database.users.values());
      const userToDowngrade = users.find(u => u.stripe_customer_id === subscription.customer);
      if (userToDowngrade) {
        userToDowngrade.is_premium = false;
        database.users.set(userToDowngrade.id, userToDowngrade);
      }
      break;
  }

  res.json({ received: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║      ☁️  STUDYFLOW API SERVER         ║
  ║                                        ║
  ║  Status: ✅ Running                    ║
  ║  Port: ${PORT}                       ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}         ║
  ║                                        ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;
