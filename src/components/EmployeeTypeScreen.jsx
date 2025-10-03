import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeTypeScreen() {
  const [selectedEmployeeType, setSelectedEmployeeType] = useState('GPF');
  const [selectedHandicapStatus, setSelectedHandicapStatus] = useState('Regular');
  const navigate = useNavigate();

  const handleContinue = () => {
    // Pass both employee type and handicap status to the home screen
    navigate('/home', { 
      state: { 
        employeeType: selectedEmployeeType,
        handicapStatus: selectedHandicapStatus
      } 
    });
  };

  return (
    <div className="container">
      {/* Navigation Buttons */}
      <div style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button 
          onClick={() => navigate('/main-menu')}
          style={{
            padding: '10px 15px',
            fontSize: '1em',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.background = '#c82333'}
          onMouseLeave={(e) => e.target.style.background = '#dc3545'}
        >
          ← Back
        </button>
        <button 
          onClick={() => navigate('/main-menu')}
          style={{
            padding: '10px 15px',
            fontSize: '1em',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.background = '#5a6268'}
          onMouseLeave={(e) => e.target.style.background = '#6c757d'}
        >
          Home
        </button>
      </div>
      
      <div className="card fade-in" style={{ maxWidth: '900px', margin: '8vh auto', marginTop: '80px' }}>
        
        {/* Employee Type Selection Section */}
        <div style={{ 
          padding: '30px 20px',
          borderBottom: '3px solid #e9ecef',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            color: '#495057', 
            textAlign: 'center',
            marginBottom: '25px',
            fontSize: '2.5em',
            fontWeight: 'bold'
          }}>
            🏦 Employee Type Selection
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {/* NPS Employee Option */}
            <div 
              className="employee-type-tab"
              onClick={() => setSelectedEmployeeType('NPS')}
              style={{
                background: selectedEmployeeType === 'NPS' 
                  ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                  : 'white',
                border: selectedEmployeeType === 'NPS' 
                  ? '3px solid #667eea' 
                  : '2px solid #dee2e6',
                borderRadius: '15px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedEmployeeType === 'NPS' 
                  ? '0 8px 25px rgba(102, 126, 234, 0.3)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)',
                transform: selectedEmployeeType === 'NPS' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ 
                fontSize: '3.5em', 
                marginBottom: '15px',
                color: selectedEmployeeType === 'NPS' ? '#667eea' : '#6c757d'
              }}>
                🏢
              </div>
              <h3 style={{ 
                color: selectedEmployeeType === 'NPS' ? '#667eea' : '#495057',
                marginBottom: '0',
                fontSize: '1.4em',
                fontWeight: 'bold'
              }}>
                NPS Employee
              </h3>
            </div>

            {/* GPF Employee Option */}
            <div 
              className="employee-type-tab"
              onClick={() => setSelectedEmployeeType('GPF')}
              style={{
                background: selectedEmployeeType === 'GPF' 
                  ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' 
                  : 'white',
                border: selectedEmployeeType === 'GPF' 
                  ? '3px solid #28a745' 
                  : '2px solid #dee2e6',
                borderRadius: '15px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedEmployeeType === 'GPF' 
                  ? '0 8px 25px rgba(40, 167, 69, 0.3)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)',
                transform: selectedEmployeeType === 'GPF' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ 
                fontSize: '3.5em', 
                marginBottom: '15px',
                color: selectedEmployeeType === 'GPF' ? '#28a745' : '#6c757d'
              }}>
                🏦
              </div>
              <h3 style={{ 
                color: selectedEmployeeType === 'GPF' ? '#28a745' : '#495057',
                marginBottom: '0',
                fontSize: '1.4em',
                fontWeight: 'bold'
              }}>
                GPF Employee
              </h3>
            </div>
          </div>
        </div>

        {/* Handicap Status Selection Section */}
        <div style={{ 
          padding: '0 20px 30px'
        }}>
          <h2 style={{ 
            color: '#495057', 
            textAlign: 'center',
            marginBottom: '25px',
            fontSize: '1.8em',
            fontWeight: 'bold'
          }}>
            ⚕️ Handicap Status Selection
          </h2>
          
          <div style={{ 
            display: 'grid',
            gap: '15px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Regular Option */}
            <div 
              className="handicap-type-tab"
              onClick={() => setSelectedHandicapStatus('Regular')}
              style={{
                background: selectedHandicapStatus === 'Regular' 
                  ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                  : 'white',
                border: selectedHandicapStatus === 'Regular' 
                  ? '3px solid #667eea' 
                  : '2px solid #dee2e6',
                borderRadius: '12px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedHandicapStatus === 'Regular' 
                  ? '0 6px 20px rgba(102, 126, 234, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedHandicapStatus === 'Regular' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedHandicapStatus === 'Regular' ? '#667eea' : '#6c757d'
              }}>
                👤
              </div>
              <h4 style={{ 
                color: selectedHandicapStatus === 'Regular' ? '#667eea' : '#495057',
                marginBottom: '0',
                fontSize: '1.1em',
                fontWeight: 'bold'
              }}>
                Regular
              </h4>
            </div>

            {/* Handicap Option */}
            <div 
              className="handicap-type-tab"
              onClick={() => setSelectedHandicapStatus('Handicap')}
              style={{
                background: selectedHandicapStatus === 'Handicap' 
                  ? 'linear-gradient(135deg, #fff3cd, #ffeaa7)' 
                  : 'white',
                border: selectedHandicapStatus === 'Handicap' 
                  ? '3px solid #ffc107' 
                  : '2px solid #dee2e6',
                borderRadius: '12px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedHandicapStatus === 'Handicap' 
                  ? '0 6px 20px rgba(255, 193, 7, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedHandicapStatus === 'Handicap' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedHandicapStatus === 'Handicap' ? '#ffc107' : '#6c757d'
              }}>
                ♿
              </div>
              <h4 style={{ 
                color: selectedHandicapStatus === 'Handicap' ? '#ffc107' : '#495057',
                marginBottom: '0',
                fontSize: '1.1em',
                fontWeight: 'bold'
              }}>
                Handicap
              </h4>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleContinue}
            style={{ 
              padding: '15px 40px',
              fontSize: '1.3em',
              minWidth: '250px'
            }}
          >
            Continue to Payslip Calculator
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/main-menu')}
              style={{ 
                padding: '10px 20px',
                fontSize: '1em',
                background: '#6c757d',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5a6268'}
              onMouseLeave={(e) => e.target.style.background = '#6c757d'}
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeTypeScreen;