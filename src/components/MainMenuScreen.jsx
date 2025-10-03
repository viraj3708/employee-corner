import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainMenuScreen() {
  const [selectedTab, setSelectedTab] = useState('payslip');
  const navigate = useNavigate();

  const handleTabSelect = (tabId) => {
    setSelectedTab(tabId);
    
    // Navigate based on selected tab
    switch(tabId) {
      case 'payslip':
        navigate('/employee-type');
        break;
      case 'arrears':
        // TODO: Navigate to arrears calculator when implemented
        alert('Arrears Calculator - Coming Soon!');
        break;
      case 'pension':
        navigate('/pension-calculator');
        break;
      case 'payscale':
        navigate('/pay-scale-viewer');
        break;
      case 'form16':
        // TODO: Navigate to Form 16 Calculator when implemented
        navigate('/form-16');
        break;
      case 'medical':
        // TODO: Navigate to Medical Reimbursement Form when implemented
        alert('Medical Reimbursement Form - Coming Soon!');
        break;
      case 'manualbill':
        // TODO: Navigate to Manual Bill Form when implemented
        alert('Manual Bill Form - Coming Soon!');
        break;
      case 'sip':
        // TODO: Navigate to SIP Calculator when implemented
        navigate('/sip-calculator');
        break;
      case 'loan':
        // TODO: Navigate to Loan Calculator when implemented
        navigate('/loan-calculator');
        break;
      case 'loaneligibility':
        // TODO: Navigate to Loan Eligibility Calculator when implemented
        navigate('/loan-eligibility-calculator');
        break;
      case 'fd':
        // TODO: Navigate to FD Calculator when implemented
        navigate('/fd-calculator');
        break;
      case 'cooperative':
        // TODO: Navigate to Co-operative Societies Calculator when implemented
        navigate('/cooperative-societies-calculator');
        break;
      default:
        break;
    }
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
      
      <div className="card fade-in" style={{ marginTop: '80px', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3.5em',
            marginBottom: '15px'
          }}>
            Financial Calculator Suite
          </h1>
          <p style={{ color: '#666', fontSize: '1.5em', marginBottom: '30px' }}>
            Choose the calculator you need
          </p>
        </div>

        {/* Employee Corner Section */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            color: '#495057',
            fontSize: '2em',
            marginBottom: '25px',
            paddingBottom: '10px',
            borderBottom: '3px solid #667eea',
            display: 'inline-block'
          }}>
            👨‍💼 Employee Corner
          </h2>
          
          <div style={{ 
            display: 'grid',
            gap: '15px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 10px'
          }}>
            
            {/* Payslip Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('payslip')}
              style={{
                background: selectedTab === 'payslip' 
                  ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' 
                  : 'white',
                border: selectedTab === 'payslip' 
                  ? '2px solid #28a745' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'payslip' 
                  ? '0 5px 15px rgba(40, 167, 69, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'payslip' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'payslip') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'payslip') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'payslip' ? '#28a745' : '#6c757d'
              }}>
                📊
              </div>
              <h3 style={{ 
                color: selectedTab === 'payslip' ? '#28a745' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Payslip Calc
              </h3>
              <p style={{ 
                color: selectedTab === 'payslip' ? '#28a745' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Calculate monthly salary
              </p>
            </div>

            {/* Arrears Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('arrears')}
              style={{
                background: selectedTab === 'arrears' 
                  ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                  : 'white',
                border: selectedTab === 'arrears' 
                  ? '2px solid #667eea' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'arrears' 
                  ? '0 5px 15px rgba(102, 126, 234, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'arrears' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'arrears') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'arrears') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'arrears' ? '#667eea' : '#6c757d'
              }}>
                💰
              </div>
              <h3 style={{ 
                color: selectedTab === 'arrears' ? '#667eea' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Arrears Calc
              </h3>
              <p style={{ 
                color: selectedTab === 'arrears' ? '#667eea' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Calculate salary arrears
              </p>
            </div>

            {/* Pension Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('pension')}
              style={{
                background: selectedTab === 'pension' 
                  ? 'linear-gradient(135deg, #fff3cd, #ffeaa7)' 
                  : 'white',
                border: selectedTab === 'pension' 
                  ? '2px solid #ffc107' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'pension' 
                  ? '0 5px 15px rgba(255, 193, 7, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'pension' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'pension') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'pension') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'pension' ? '#ffc107' : '#6c757d'
              }}>
                🏦
              </div>
              <h3 style={{ 
                color: selectedTab === 'pension' ? '#ffc107' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Pension Calc
              </h3>
              <p style={{ 
                color: selectedTab === 'pension' ? '#ffc107' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Calculate pension benefits
              </p>
            </div>

            {/* Pay Scale Viewer Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('payscale')}
              style={{
                background: selectedTab === 'payscale' 
                  ? 'linear-gradient(135deg, #f8d7da, #f1c4c4)' 
                  : 'white',
                border: selectedTab === 'payscale' 
                  ? '2px solid #dc3545' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'payscale' 
                  ? '0 5px 15px rgba(220, 53, 69, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'payscale' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'payscale') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'payscale') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'payscale' ? '#dc3545' : '#6c757d'
              }}>
                📈
              </div>
              <h3 style={{ 
                color: selectedTab === 'payscale' ? '#dc3545' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Pay Scale
              </h3>
              <p style={{ 
                color: selectedTab === 'payscale' ? '#dc3545' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                View pay scales
              </p>
            </div>

            {/* Form No 16 Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('form16')}
              style={{
                background: selectedTab === 'form16' 
                  ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                  : 'white',
                border: selectedTab === 'form16' 
                  ? '2px solid #667eea' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'form16' 
                  ? '0 5px 15px rgba(102, 126, 234, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'form16' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'form16') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'form16') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'form16' ? '#667eea' : '#6c757d'
              }}>
                📄
              </div>
              <h3 style={{ 
                color: selectedTab === 'form16' ? '#667eea' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Form No 16
              </h3>
              <p style={{ 
                color: selectedTab === 'form16' ? '#667eea' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Tax certificate form
              </p>
            </div>

            {/* Medical Reimbursement Form Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('medical')}
              style={{
                background: selectedTab === 'medical' 
                  ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' 
                  : 'white',
                border: selectedTab === 'medical' 
                  ? '2px solid #28a745' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'medical' 
                  ? '0 5px 15px rgba(40, 167, 69, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'medical' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'medical') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'medical') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'medical' ? '#28a745' : '#6c757d'
              }}>
                🏥
              </div>
              <h3 style={{ 
                color: selectedTab === 'medical' ? '#28a745' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Medical Form
              </h3>
              <p style={{ 
                color: selectedTab === 'medical' ? '#28a745' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Reimbursement form
              </p>
            </div>

            {/* Manual Bill Form Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('manualbill')}
              style={{
                background: selectedTab === 'manualbill' 
                  ? 'linear-gradient(135deg, #fff3cd, #ffeaa7)' 
                  : 'white',
                border: selectedTab === 'manualbill' 
                  ? '2px solid #ffc107' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'manualbill' 
                  ? '0 5px 15px rgba(255, 193, 7, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'manualbill' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'manualbill') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'manualbill') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'manualbill' ? '#ffc107' : '#6c757d'
              }}>
                🧾
              </div>
              <h3 style={{ 
                color: selectedTab === 'manualbill' ? '#ffc107' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Manual Bill
              </h3>
              <p style={{ 
                color: selectedTab === 'manualbill' ? '#ffc107' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Bill processing form
              </p>
            </div>
          </div>
        </div>

        {/* General Calculator Section */}
        <div>
          <h2 style={{ 
            color: '#495057',
            fontSize: '2em',
            marginBottom: '25px',
            paddingBottom: '10px',
            borderBottom: '3px solid #28a745',
            display: 'inline-block'
          }}>
            🧮 General Calculator
          </h2>
          
          <div style={{ 
            display: 'grid',
            gap: '15px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 10px'
          }}>
            
            {/* SIP Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('sip')}
              style={{
                background: selectedTab === 'sip' 
                  ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                  : 'white',
                border: selectedTab === 'sip' 
                  ? '2px solid #667eea' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'sip' 
                  ? '0 5px 15px rgba(102, 126, 234, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'sip' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'sip') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'sip') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'sip' ? '#667eea' : '#6c757d'
              }}>
                📈
              </div>
              <h3 style={{ 
                color: selectedTab === 'sip' ? '#667eea' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                SIP Calc
              </h3>
              <p style={{ 
                color: selectedTab === 'sip' ? '#667eea' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Mutual fund calculator
              </p>
            </div>

            {/* Loan Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('loan')}
              style={{
                background: selectedTab === 'loan' 
                  ? 'linear-gradient(135deg, #f8d7da, #f1c4c4)' 
                  : 'white',
                border: selectedTab === 'loan' 
                  ? '2px solid #dc3545' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'loan' 
                  ? '0 5px 15px rgba(220, 53, 69, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'loan' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'loan') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'loan') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'loan' ? '#dc3545' : '#6c757d'
              }}>
                💳
              </div>
              <h3 style={{ 
                color: selectedTab === 'loan' ? '#dc3545' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Loan Calc
              </h3>
              <p style={{ 
                color: selectedTab === 'loan' ? '#dc3545' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Calculate loan payments
              </p>
            </div>

            {/* Loan Eligibility Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('loaneligibility')}
              style={{
                background: selectedTab === 'loaneligibility' 
                  ? 'linear-gradient(135deg, #fff3cd, #ffeaa7)' 
                  : 'white',
                border: selectedTab === 'loaneligibility' 
                  ? '2px solid #ffc107' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'loaneligibility' 
                  ? '0 5px 15px rgba(255, 193, 7, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'loaneligibility' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'loaneligibility') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'loaneligibility') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'loaneligibility' ? '#ffc107' : '#6c757d'
              }}>
                ✅
              </div>
              <h3 style={{ 
                color: selectedTab === 'loaneligibility' ? '#ffc107' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Loan Eligibility
              </h3>
              <p style={{ 
                color: selectedTab === 'loaneligibility' ? '#ffc107' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Check loan eligibility
              </p>
            </div>

            {/* FD Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('fd')}
              style={{
                background: selectedTab === 'fd' 
                  ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' 
                  : 'white',
                border: selectedTab === 'fd' 
                  ? '2px solid #28a745' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'fd' 
                  ? '0 5px 15px rgba(40, 167, 69, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'fd' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'fd') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'fd') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'fd' ? '#28a745' : '#6c757d'
              }}>
                💰
              </div>
              <h3 style={{ 
                color: selectedTab === 'fd' ? '#28a745' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                FD Calc
              </h3>
              <p style={{ 
                color: selectedTab === 'fd' ? '#28a745' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Fixed deposit calculator
              </p>
            </div>

            {/* Co-operative Societies Calculator Tab */}
            <div 
              className="calculator-tab"
              onClick={() => handleTabSelect('cooperative')}
              style={{
                background: selectedTab === 'cooperative' 
                  ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                  : 'white',
                border: selectedTab === 'cooperative' 
                  ? '2px solid #667eea' 
                  : '1px solid #dee2e6',
                borderRadius: '15px',
                padding: '20px 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: selectedTab === 'cooperative' 
                  ? '0 5px 15px rgba(102, 126, 234, 0.3)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)',
                transform: selectedTab === 'cooperative' ? 'scale(1.02)' : 'scale(1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== 'cooperative') {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 'cooperative') {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ 
                fontSize: '2.5em', 
                marginBottom: '10px',
                color: selectedTab === 'cooperative' ? '#667eea' : '#6c757d'
              }}>
                🤝
              </div>
              <h3 style={{ 
                color: selectedTab === 'cooperative' ? '#667eea' : '#495057',
                marginBottom: '5px',
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}>
                Co-operative
              </h3>
              <p style={{ 
                color: selectedTab === 'cooperative' ? '#667eea' : '#6c757d',
                fontSize: '0.8em',
                margin: '0',
                lineHeight: '1.3'
              }}>
                Societies calculator
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div style={{ marginTop: '40px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => handleTabSelect(selectedTab)}
            style={{ 
              padding: '15px 40px',
              fontSize: '1.3em',
              minWidth: '250px'
            }}
          >
            Continue with Selected Calculator
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
              ← Back to Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenuScreen;