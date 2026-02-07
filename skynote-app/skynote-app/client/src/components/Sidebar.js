import React from 'react';
import { BookOpen, Trash2, Plus, Crown, X } from 'lucide-react';

function Sidebar({ courses, currentCourse, selectCourse, deleteCourse, userPlan, upgradeToPremium, isOpen, toggleSidebar }) {
  if (!isOpen) return null;

  return (
    <aside style={{
      width: '280px',
      background: 'white',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Header de la sidebar */}
      <div style={{
        padding: '20px',
        borderBottom: '2px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0
        }}>
          Mes Cours
        </h2>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={20} color="#6b7280" />
        </button>
      </div>

      {/* Liste des cours */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {courses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#9ca3af'
          }}>
            <BookOpen size={48} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Aucun cours pour le moment.<br/>
              Commencez en ajoutant votre premier cours !
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => selectCourse(course.id)}
                style={{
                  padding: '16px',
                  background: currentCourse?.id === course.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f9fafb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: currentCourse?.id === course.id ? '2px solid #667eea' : '2px solid transparent',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (currentCourse?.id !== course.id) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentCourse?.id !== course.id) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: currentCourse?.id === course.id ? 'white' : '#1f2937',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {course.title.length > 40 ? course.title.substring(0, 40) + '...' : course.title}
                    </h3>
                    
                    <div style={{
                      fontSize: '12px',
                      color: currentCourse?.id === course.id ? 'rgba(255,255,255,0.9)' : '#6b7280',
                      marginBottom: '8px'
                    }}>
                      {course.flashcards.length} fiche{course.flashcards.length > 1 ? 's' : ''}
                    </div>

                    {/* Barre de progression */}
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: currentCourse?.id === course.id ? 'rgba(255,255,255,0.3)' : '#e5e7eb',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${course.progress || 0}%`,
                        height: '100%',
                        background: currentCourse?.id === course.id ? 'white' : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
                        deleteCourse(course.id);
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      marginLeft: '8px',
                      borderRadius: '4px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = currentCourse?.id === course.id ? 'rgba(255,255,255,0.2)' : '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={16} color={currentCourse?.id === course.id ? 'white' : '#ef4444'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer avec upgrade Premium */}
      {userPlan === 'free' && (
        <div style={{
          padding: '20px',
          borderTop: '2px solid #f3f4f6',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            <Crown size={32} color="#fbbf24" style={{ margin: '0 auto 8px' }} />
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              lineHeight: '1.5',
              marginBottom: '12px'
            }}>
              Version gratuite :<br/>
              • 3 fiches max par cours<br/>
              • 5 questions par QCM
            </p>
          </div>
          <button
            onClick={upgradeToPremium}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Crown size={16} />
            Passer à Premium
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
