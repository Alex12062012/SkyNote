import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, BookOpen, Crown, CheckCircle } from 'lucide-react';

function FlashcardsPage({ course, userPlan, startQuiz, goHome, upgradeToPremium, updateProgress }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState(new Set());

  const currentCard = course.flashcards[currentIndex];
  const totalCards = course.flashcards.length;

  const nextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markAsCompleted = () => {
    const newCompleted = new Set(completedCards);
    newCompleted.add(currentCard.id);
    setCompletedCards(newCompleted);
    
    // Calculer la progression
    const progress = Math.round((newCompleted.size / totalCards) * 100);
    updateProgress(course.id, progress);
  };

  const handleStartQuiz = () => {
    markAsCompleted();
    startQuiz(currentCard);
  };

  const progress = Math.round((completedCards.size / totalCards) * 100);

  return (
    <div className="fade-in" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header avec progression */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={goHome}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Retour à l'accueil
        </button>

        <div className="card">
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            {course.title}
          </h1>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                Progression globale
              </span>
              <span style={{ fontSize: '14px', color: '#667eea', fontWeight: 'bold' }}>
                {progress}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>📚 {totalCards} fiche{totalCards > 1 ? 's' : ''}</span>
            <span>✅ {completedCards.size} maîtrisée{completedCards.size > 1 ? 's' : ''}</span>
          </div>

          {course.isLimited && userPlan === 'free' && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              border: '1px solid #667eea',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', color: '#667eea', fontWeight: '600' }}>
                🔒 {course.totalConceptsDetected - 3} fiches supplémentaires disponibles en Premium
              </span>
              <button
                onClick={upgradeToPremium}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <Crown size={14} style={{ marginRight: '6px' }} />
                Débloquer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fiche actuelle */}
      <div className="card slide-in-left" style={{
        marginBottom: '24px',
        minHeight: '400px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span className="badge-free">
              Fiche {currentIndex + 1}/{totalCards}
            </span>
            {completedCards.has(currentCard.id) && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                color: '#10b981',
                fontWeight: '600'
              }}>
                <CheckCircle size={16} />
                Maîtrisée
              </span>
            )}
          </div>

          <BookOpen size={24} color="#667eea" />
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          lineHeight: '1.4'
        }}>
          {currentCard.title}
        </h2>

        <div style={{
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {currentCard.keywords.map((keyword, idx) => (
            <span
              key={idx}
              style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                color: '#667eea',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {keyword}
            </span>
          ))}
        </div>

        <p style={{
          fontSize: '16px',
          color: '#4b5563',
          lineHeight: '1.8',
          marginBottom: '24px'
        }}>
          {currentCard.summary}
        </p>

        <div style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            Points essentiels
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {currentCard.keyPoints.map((point, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '12px',
                  marginBottom: '12px',
                  fontSize: '15px',
                  color: '#4b5563',
                  lineHeight: '1.6'
                }}
              >
                <span style={{
                  minWidth: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '2px'
                }}>
                  {idx + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleStartQuiz}
          className="btn-primary"
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '16px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <Play size={20} />
          Lancer le quiz pour cette fiche
        </button>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: currentIndex === 0 ? 0.5 : 1,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={20} />
          Fiche précédente
        </button>

        <button
          onClick={nextCard}
          disabled={currentIndex === totalCards - 1}
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: currentIndex === totalCards - 1 ? 0.5 : 1,
            cursor: currentIndex === totalCards - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Fiche suivante
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default FlashcardsPage;
