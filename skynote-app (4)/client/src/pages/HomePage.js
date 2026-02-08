import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Sparkles, BookOpen, CheckCircle, Image as ImageIcon, Crown, Zap, Cloud } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function HomePage({ userId, userPlan, addCourse, upgradeToPremium }) {
  const [mode, setMode] = useState('text'); // 'text', 'pdf', 'photo'
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [courseText, setCourseText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    checkPremiumEligibility();
  }, []);

  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const checkPremiumEligibility = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/check-premium-eligibility`);
      if (response.data.eligible) {
        alert('🎉 Félicitations ! Vous êtes dans les 100 premiers inscrits : Premium gratuit à vie !');
        loadUser();
      }
    } catch (error) {
      console.error('Premium check error:', error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (mode === 'pdf') {
      setIsLoading(true);
      setError('');
      
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await axios.post(`${API_URL}/api/upload/pdf`, formData);
        setCourseText(response.data.text);
      } catch (err) {
        setError(err.response?.data?.error || 'Erreur lors de l\'extraction du PDF');
      } finally {
        setIsLoading(false);
      }
    }

    if (mode === 'photo') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setIsLoading(true);
        setError('');
        
        try {
          const imageBase64 = event.target.result;
          const response = await axios.post(`${API_URL}/api/upload/photo`, { imageBase64 });
          setCourseText(response.data.text);
        } catch (err) {
          setError(err.response?.data?.error || 'Aucun texte détecté dans l\'image');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Veuillez entrer un titre');
      return;
    }

    if (courseText.trim().length < 50) {
      setError('Le cours doit contenir au moins 50 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/generate-flashcards`, {
        courseText: courseText.trim(),
        title: title.trim(),
        subject: subject.trim(),
        userId
      });

      addCourse(response.data);
      setCourseText('');
      setTitle('');
      setSubject('');
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.data?.limit_reached) {
        setError('Limite gratuite atteinte (3 fiches max). Passez à Premium pour continuer.');
      } else {
        setError(err.response?.data?.error || 'Une erreur est survenue lors de la génération des fiches.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-sky-300 rounded-full px-4 py-2 shadow-lg mb-4">
          <Sparkles className="w-5 h-5 text-sky-500" />
          <span className="font-bold text-sky-700">Propulsé par l'IA</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Révisez sans limites
        </h2>
        <p className="text-xl text-white/95 drop-shadow max-w-2xl mx-auto">
          Transformez vos cours en fiches de révision et QCM personnalisés en quelques secondes
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto px-4">
        <div className="card text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Génération Instantanée</h3>
          <p className="text-gray-600 text-sm">
            L'IA analyse votre cours et crée des fiches structurées en secondes
          </p>
        </div>

        <div className="card text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">QCM Intelligents</h3>
          <p className="text-gray-600 text-sm">
            Des quiz adaptés à chaque fiche pour tester vos connaissances
          </p>
        </div>

        <div className="card text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Scan & Upload</h3>
          <p className="text-gray-600 text-sm">
            Importez vos cours en texte, PDF ou photo pour une révision rapide
          </p>
        </div>
      </div>

      {/* Formulaire de création */}
      <div className="card max-w-3xl mx-auto mb-8 px-4">
        <h3 className="text-2xl font-bold mb-6">Créer des fiches de révision</h3>

        {/* Mode selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              mode === 'text'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Texte
          </button>
          <button
            onClick={() => setMode('pdf')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              mode === 'pdf'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            PDF
          </button>
          <button
            onClick={() => setMode('photo')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              mode === 'photo'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ImageIcon className="w-5 h-5 inline mr-2" />
            Photo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Titre du cours</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: La photosynthèse"
              className="input-field"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Matière (optionnel)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Biologie, Histoire..."
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {mode === 'text' && (
            <div>
              <label className="block font-semibold mb-2">Contenu du cours</label>
              <textarea
                value={courseText}
                onChange={(e) => setCourseText(e.target.value)}
                placeholder="Collez ou saisissez le contenu de votre cours ici..."
                className="input-field min-h-[200px]"
                disabled={isLoading}
              />
            </div>
          )}

          {(mode === 'pdf' || mode === 'photo') && (
            <div>
              <label className="block font-semibold mb-2">
                {mode === 'pdf' ? 'Fichier PDF' : 'Photo du cours'}
              </label>
              <input
                type="file"
                accept={mode === 'pdf' ? '.pdf' : 'image/*'}
                onChange={handleFileChange}
                className="input-field"
                disabled={isLoading}
              />
              {courseText && (
                <div className="mt-4">
                  <label className="block font-semibold mb-2">Texte extrait</label>
                  <textarea
                    value={courseText}
                    onChange={(e) => setCourseText(e.target.value)}
                    className="input-field min-h-[150px]"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !title.trim() || !courseText.trim()}
            className="btn-primary w-full text-lg py-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Génération en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Générer mes fiches
              </span>
            )}
          </button>

          {user && !user.is_premium && (
            <p className="text-center text-sm text-gray-600">
              Version gratuite : 3 fiches max • {user.fiches_count || 0}/3 utilisées
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default HomePage;
