import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoanEligibilityCalculator() {
  const [formData, setFormData] = useState({
    monthlyIncome: 50000,
    existingEmi: 0,
    interestRate: 10,
    loanTenure: 5, // in years
    FOIR: 50 // Fixed Obligation to Income Ratio in percentage
  });
  
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateEligibility = () => {
    const monthlyIncome = formData.monthlyIncome;
    const existingEmi = formData.existingEmi;
    const annualInterestRate = formData.interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const tenureInMonths = formData.loanTenure * 12;
    const FOIR = formData.FOIR / 100; // Convert to decimal
    
    // Maximum eligible EMI based on FOIR
    const maxEmi = monthlyIncome * FOIR - existingEmi;
    
    // Loan Amount Formula: P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
    const loanAmount = maxEmi * 
                      (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1) / 
                      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths));
    
    setResult({
      maxEmi: maxEmi.toFixed(0),
      eligibleLoanAmount: loanAmount.toFixed(0),
      monthlyIncome: monthlyIncome,
      existingEmi: existingEmi
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const resetCalculator = () => {
    setFormData({
      monthlyIncome: 50000,
      existingEmi: 0,
      interestRate: 10,
      loanTenure: 5,
      FOIR: 50
    });
    setResult(null);
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
      
      <div className="card fade-in" style={{ marginTop: '80px', maxWidth: '900px', margin: '80px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            ✅ Loan Eligibility Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Check how much loan you are eligible for
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gap: '30px',
          gridTemplateColumns: '1fr 1fr',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Input Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #ffc107'
          }}>
            <h2 style={{ 
              color: '#ffc107', 
              textAlign: 'center', 
              marginBottom: '25px',
              fontSize: '1.8em',
              fontWeight: 'bold'
            }}>
              Income & Loan Details
            </h2>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                Monthly Income (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                placeholder="Enter your monthly income"
                min="0"
                style={{ borderColor: '#ffc107' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[30000, 50000, 75000, 100000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('monthlyIncome', amount)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.monthlyIncome === amount ? '#ffc107' : '#e9ecef',
                      color: formData.monthlyIncome === amount ? '#212529' : '#495057',
                      border: '1px solid #ffc107',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.monthlyIncome !== amount) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.monthlyIncome !== amount) {
                        e.target.style.background = '#e9ecef';
                      }
                    }}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                Existing EMIs (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.existingEmi}
                onChange={(e) => handleInputChange('existingEmi', e.target.value)}
                placeholder="Enter your existing monthly EMIs"
                min="0"
                style={{ borderColor: '#ffc107' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                placeholder="Enter expected interest rate"
                min="0"
                max="100"
                step="0.1"
                style={{ borderColor: '#ffc107' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[8, 10, 12, 15].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleInputChange('interestRate', rate)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.interestRate === rate ? '#ffc107' : '#e9ecef',
                      color: formData.interestRate === rate ? '#212529' : '#495057',
                      border: '1px solid #ffc107',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.interestRate !== rate) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.interestRate !== rate) {
                        e.target.style.background = '#e9ecef';
                      }
                    }}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.loanTenure}
                onChange={(e) => handleInputChange('loanTenure', e.target.value)}
                placeholder="Enter loan tenure in years"
                min="0"
                max="30"
                style={{ borderColor: '#ffc107' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[5, 10, 15, 20, 25].map(years => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => handleInputChange('loanTenure', years)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.loanTenure === years ? '#ffc107' : '#e9ecef',
                      color: formData.loanTenure === years ? '#212529' : '#495057',
                      border: '1px solid #ffc107',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.loanTenure !== years) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.loanTenure !== years) {
                        e.target.style.background = '#e9ecef';
                      }
                    }}
                  >
                    {years}Y
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                FOIR (%)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.FOIR}
                onChange={(e) => handleInputChange('FOIR', e.target.value)}
                placeholder="Fixed Obligation to Income Ratio"
                min="0"
                max="100"
                style={{ borderColor: '#ffc107' }}
              />
              <div style={{ 
                fontSize: '0.85em',
                color: '#666',
                marginTop: '5px'
              }}>
                💡 FOIR is typically 40-60%. This represents the maximum percentage of your income that can go toward loan EMIs.
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <button 
                className="btn btn-primary"
                onClick={calculateEligibility}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px',
                  fontSize: '1.1em',
                  background: 'linear-gradient(45deg, #ffc107, #e0a800)',
                  border: 'none'
                }}
              >
                Check Eligibility
              </button>
              <button 
                className="btn btn-secondary"
                onClick={resetCalculator}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px',
                  fontSize: '1.1em'
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #28a745'
          }}>
            <h2 style={{ 
              color: '#28a745', 
              textAlign: 'center', 
              marginBottom: '25px',
              fontSize: '1.8em',
              fontWeight: 'bold'
            }}>
              Eligibility Summary
            </h2>
            
            {result ? (
              <div>
                <div style={{ 
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                    borderRadius: '10px',
                    color: '#212529'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.5em' }}>Eligible Loan Amount</h3>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '10px' }}>
                      {formatCurrency(result.eligibleLoanAmount)}
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '15px',
                    gridTemplateColumns: '1fr 1fr',
                    '@media (max-width: 480px)': {
                      gridTemplateColumns: '1fr'
                    }
                  }}>
                    <div style={{ 
                      background: '#e8f4f8',
                      padding: '15px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#667eea', fontWeight: 'bold' }}>Monthly Income</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.monthlyIncome)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      background: '#f8d7da',
                      padding: '15px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#dc3545', fontWeight: 'bold' }}>Max Eligible EMI</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.maxEmi)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visualization */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ 
                    color: '#495057', 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    fontSize: '1.3em'
                  }}>
                    Income Utilization
                  </h3>
                  
                  <div style={{ 
                    display: 'flex',
                    height: '30px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}>
                    <div 
                      style={{ 
                        background: '#667eea',
                        width: `${(result.existingEmi / result.monthlyIncome) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      Existing EMIs
                    </div>
                    <div 
                      style={{ 
                        background: '#28a745',
                        width: `${(result.maxEmi / result.monthlyIncome) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      New Loan EMI
                    </div>
                    <div 
                      style={{ 
                        background: '#6c757d',
                        width: `${((result.monthlyIncome - result.existingEmi - result.maxEmi) / result.monthlyIncome) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      Balance
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '10px',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    '@media (max-width: 480px)': {
                      gridTemplateColumns: '1fr'
                    }
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: '#667eea',
                        borderRadius: '4px',
                        marginRight: '10px'
                      }}></div>
                      <span style={{ fontSize: '0.85em' }}>Existing EMIs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: '#28a745',
                        borderRadius: '4px',
                        marginRight: '10px'
                      }}></div>
                      <span style={{ fontSize: '0.85em' }}>New Loan EMI</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: '#6c757d',
                        borderRadius: '4px',
                        marginRight: '10px'
                      }}></div>
                      <span style={{ fontSize: '0.85em' }}>Balance Income</span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '20px',
                    padding: '15px',
                    background: '#e8f4f8',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '1em', 
                      fontWeight: 'bold', 
                      color: '#667eea',
                      marginBottom: '5px'
                    }}>
                      FOIR: {formData.FOIR}%
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#6c757d' }}>
                      {(parseFloat(result.maxEmi) + parseFloat(result.existingEmi)).toFixed(0)} / {formatCurrency(result.monthlyIncome)} = {(((parseFloat(result.maxEmi) + parseFloat(result.existingEmi)) / parseFloat(result.monthlyIncome)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '4em', marginBottom: '20px' }}>✅</div>
                <h3 style={{ marginBottom: '10px' }}>Check Your Loan Eligibility</h3>
                <p>Enter your income details and loan preferences to see how much loan you are eligible for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanEligibilityCalculator;