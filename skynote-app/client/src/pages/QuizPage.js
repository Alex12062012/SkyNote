import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Trophy, ArrowLeft, Crown } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function QuizPage({ flashcard, userId, courseId, userPlan, goBack, upgradeToPremium, updateProgress }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/generate-quiz`, {
        flashcardId: flashcard.id,
        flashcardContent: flashcard,
        userPlan
      });

      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de générer le quiz. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);

    // Sauvegarder la progression
    try {
      await axios.post(`${API_URL}/api/save-progress`, {
        userId,
        courseId,
        flashcardId: flashcard.id,
        score,
        totalQuestions: questions.length
      });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    generateQuiz();
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px'
      }}>
        <div className="spinner" />
        <p style={{ color: 'white', fontSize: '16px' }}>
          Génération du quiz en cours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '12px' }}>
          Erreur
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
        <button onClick={goBack} className="btn-primary">
          Retour aux fiches
        </button>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <div className="fade-in" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Trophy size={64} color={passed ? '#10b981' : '#f59e0b'} style={{ margin: '0 auto 24px' }} />
          
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            {passed ? '🎉 Excellent !' : '💪 Continuez comme ça !'}
          </h2>

          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            Vous avez obtenu un score de
          </p>

          <div style={{
            fontSize: '64px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            {score}/{questions.length}
          </div>

          <div style={{
            fontSize: '24px',
            color: passed ? '#10b981' : '#f59e0b',
            fontWeight: 'bold',
            marginBottom: '32px'
          }}>
            {percentage}%
          </div>

          {passed ? (
            <div style={{
              padding: '16px',
              background: '#d1fae5',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#065f46', fontSize: '15px', lineHeight: '1.6' }}>
                ✓ Vous maîtrisez cette fiche ! Vous pouvez passer à la suivante ou refaire le quiz pour consolider vos connaissances.
              </p>
            </div>
          ) : (
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#92400e', fontSize: '15px', lineHeight: '1.6' }}>
                Relisez la fiche et réessayez le quiz pour améliorer votre score !
              </p>
            </div>
          )}

          {userPlan === 'free' && (
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #667eea'
            }}>
              <p style={{ fontSize: '14px', color: '#667eea', fontWeight: '600', marginBottom: '12px' }}>
                💎 Avec Premium : jusqu'à 20 questions par quiz pour une maîtrise complète
              </p>
              <button
                onClick={upgradeToPremium}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                <Crown size={16} style={{ marginRight: '6px' }} />
                Passer à Premium
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={goBack}
              className="btn-secondary"
              style={{ flex: 1, padding: '14px' }}
            >
              <ArrowLeft size={18} style={{ marginRight: '6px' }} />
              Retour aux fiches
            </button>
            <button
              onClick={restartQuiz}
              className="btn-primary"
              style={{ flex: 1, padding: '14px' }}
            >
              Refaire le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      {/* Header */}
      <button
        onClick={goBack}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Retour aux fiches
      </button>

      {/* Progression */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="badge-free">
            Score: {score}/{questions.length}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card slide-in-left">
        <h2 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = index === selectedAnswer;
            
            let backgroundColor = 'white';
            let borderColor = '#e5e7eb';
            let textColor = '#1f2937';

            if (isAnswered) {
              if (isSelected && isCorrect) {
                backgroundColor = '#d1fae5';
                borderColor = '#10b981';
                textColor = '#065f46';
              } else if (isSelected && !isCorrect) {
                backgroundColor = '#fee2e2';
                borderColor = '#ef4444';
                textColor = '#991b1b';
              } else if (isCorrect) {
                backgroundColor = '#d1fae5';
                borderColor = '#10b981';
                textColor = '#065f46';
              }
            } else if (isSelected) {
              backgroundColor = '#e0e7ff';
              borderColor = '#667eea';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                style={{
                  padding: '16px 20px',
                  background: backgroundColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '12px',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  fontSize: '16px',
                  color: textColor,
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{
                  minWidth: '32px',
                  height: '32px',
                  background: isAnswered
                    ? (isSelected && isCorrect ? '#10b981' : isSelected && !isCorrect ? '#ef4444' : isCorrect ? '#10b981' : '#e5e7eb')
                    : (isSelected ? '#667eea' : '#e5e7eb'),
                  color: (isAnswered && (isCorrect || isSelected)) || (!isAnswered && isSelected) ? 'white' : '#6b7280',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={{ flex: 1 }}>{option}</span>
                {isAnswered && isCorrect && <CheckCircle size={20} color="#10b981" />}
                {isAnswered && isSelected && !isCorrect && <XCircle size={20} color="#ef4444" />}
              </button>
            );
          })}
        </div>

        {/* Explication */}
        {isAnswered && (
          <div className="fade-in" style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              💡 Explication
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#4b5563',
              lineHeight: '1.6',
              margin: 0
            }}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Bouton suivant */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px'
            }}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Question suivante →' : 'Voir les résultats 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
