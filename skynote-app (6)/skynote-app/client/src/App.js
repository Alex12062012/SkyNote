import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/index.css';

// Import des composants
import HomePage from './pages/HomePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import SuccessPage from './pages/SuccessPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  // État global de l'application
  const [currentPage, setCurrentPage] = useState('home');
  const [userId] = useState(() => {
    // Générer ou récupérer un ID utilisateur unique
    let id = localStorage.getItem('skynote_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('skynote_user_id', id);
    }
    return id;
  });
  
  const [userPlan, setUserPlan] = useState('free'); // 'free' ou 'premium'
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('skynote_courses');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sauvegarder les cours dans localStorage
  useEffect(() => {
    localStorage.setItem('skynote_courses', JSON.stringify(courses));
  }, [courses]);

  // Ajouter un nouveau cours
  const addCourse = (courseData) => {
    const newCourse = {
      id: courseData.courseId,
      title: courseData.flashcards[0]?.title || 'Nouveau cours',
      flashcards: courseData.flashcards,
      totalConceptsDetected: courseData.totalConceptsDetected,
      isLimited: courseData.isLimited,
      createdAt: new Date().toISOString(),
      progress: 0
    };
    
    setCourses([...courses, newCourse]);
    setCurrentCourse(newCourse);
    setCurrentPage('flashcards');
  };

  // Sélectionner un cours
  const selectCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setCurrentCourse(course);
      setCurrentPage('flashcards');
    }
  };

  // Supprimer un cours
  const deleteCourse = (courseId) => {
    setCourses(courses.filter(c => c.id !== courseId));
    if (currentCourse?.id === courseId) {
      setCurrentCourse(null);
      setCurrentPage('home');
    }
  };

  // Démarrer un quiz
  const startQuiz = (flashcard) => {
    setCurrentFlashcard(flashcard);
    setCurrentPage('quiz');
  };

  // Retour à l'accueil
  const goHome = () => {
    setCurrentPage('home');
    setCurrentCourse(null);
    setCurrentFlashcard(null);
  };

  // Mettre à jour la progression
  const updateProgress = (courseId, progress) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, progress } 
        : course
    ));
  };

  // Passer à Premium
  const upgradeToPremium = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/stripe/create-checkout-session`, {
        userId
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session Stripe:', error);
      alert('Erreur lors du passage à Premium. Veuillez réessayer.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Sidebar */}
      <Sidebar
        courses={courses}
        currentCourse={currentCourse}
        selectCourse={selectCourse}
        deleteCourse={deleteCourse}
        userPlan={userPlan}
        upgradeToPremium={upgradeToPremium}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Contenu principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          userPlan={userPlan}
          upgradeToPremium={upgradeToPremium}
          goHome={goHome}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {currentPage === 'home' && (
            <HomePage
              userId={userId}
              userPlan={userPlan}
              addCourse={addCourse}
              upgradeToPremium={upgradeToPremium}
            />
          )}

          {currentPage === 'flashcards' && currentCourse && (
            <FlashcardsPage
              course={currentCourse}
              userPlan={userPlan}
              startQuiz={startQuiz}
              goHome={goHome}
              upgradeToPremium={upgradeToPremium}
              updateProgress={updateProgress}
            />
          )}

          {currentPage === 'quiz' && currentFlashcard && (
            <QuizPage
              flashcard={currentFlashcard}
              userId={userId}
              courseId={currentCourse?.id}
              userPlan={userPlan}
              goBack={() => setCurrentPage('flashcards')}
              upgradeToPremium={upgradeToPremium}
              updateProgress={updateProgress}
            />
          )}

          {currentPage === 'success' && (
            <SuccessPage
              goHome={goHome}
              setUserPlan={setUserPlan}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
