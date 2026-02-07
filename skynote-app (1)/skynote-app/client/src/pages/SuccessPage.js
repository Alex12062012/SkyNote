import React, { useEffect } from 'react';
import { CheckCircle, Sparkles, Zap, Crown } from 'lucide-react';

function SuccessPage({ goHome, setUserPlan }) {
  useEffect(() => {
    // Marquer l'utilisateur comme Premium
    setUserPlan('premium');
    localStorage.setItem('skynote_user_plan', 'premium');
  }, [setUserPlan]);

  return (
    <div className="fade-in" style={{
      maxWidth: '700px',
      margin: '60px auto',
      padding: '20px'
    }}>
      <div className="card" style={{
        textAlign: 'center',
        padding: '48px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CheckCircle size={40} color="white" />
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Bienvenue dans Premium ! 🎉
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Votre abonnement est actif. Profitez de toutes les fonctionnalités avancées de SkyNote !
        </p>

        {/* Avantages Premium */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Crown size={24} color="#fbbf24" />
            Ce qui est débloqué
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <Sparkles size={20} color="#667eea" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  Fiches illimitées
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Générez autant de fiches que nécessaire pour couvrir tous vos cours en profondeur
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <Zap size={20} color="#667eea" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  QCM complets (20 questions)
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Des quiz approfondis pour tester vos connaissances de manière exhaustive
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <CheckCircle size={20} color="#667eea" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  Statistiques avancées
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Suivez votre progression détaillée et optimisez vos révisions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gestion abonnement */}
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          marginBottom: '32px'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            💳 Vous pouvez gérer votre abonnement à tout moment depuis votre{' '}
            <a
              href="https://billing.stripe.com/p/login/test_VOTRE_LIEN"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}
            >
              portail Stripe
            </a>
          </p>
        </div>

        <button
          onClick={goHome}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Commencer à réviser →
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
