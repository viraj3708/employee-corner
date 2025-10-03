import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoanCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: 500000,
    interestRate: 10,
    loanTenure: 5 // in years
  });
  
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateLoan = () => {
    const principal = formData.loanAmount;
    const annualInterestRate = formData.interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const tenureInMonths = formData.loanTenure * 12;
    
    // EMI Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = principal * monthlyInterestRate * 
                (Math.pow(1 + monthlyInterestRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
    
    const totalPayment = emi * tenureInMonths;
    const totalInterest = totalPayment - principal;
    
    setResult({
      emi: emi.toFixed(0),
      totalPayment: totalPayment.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      principal: principal
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
      loanAmount: 500000,
      interestRate: 10,
      loanTenure: 5
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
            💳 Loan Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Calculate your monthly loan payments
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
            background: 'linear-gradient(135deg, #f8d7da, #f1c4c4)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #dc3545'
          }}>
            <h2 style={{ 
              color: '#dc3545', 
              textAlign: 'center', 
              marginBottom: '25px',
              fontSize: '1.8em',
              fontWeight: 'bold'
            }}>
              Loan Details
            </h2>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                Loan Amount (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                placeholder="Enter loan amount"
                min="0"
                style={{ borderColor: '#dc3545' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[100000, 500000, 1000000, 2500000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('loanAmount', amount)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.loanAmount === amount ? '#dc3545' : '#e9ecef',
                      color: formData.loanAmount === amount ? 'white' : '#495057',
                      border: '1px solid #dc3545',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.loanAmount !== amount) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.loanAmount !== amount) {
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
              <label className="form-label" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                placeholder="Enter annual interest rate"
                min="0"
                max="100"
                step="0.1"
                style={{ borderColor: '#dc3545' }}
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
                      background: formData.interestRate === rate ? '#dc3545' : '#e9ecef',
                      color: formData.interestRate === rate ? 'white' : '#495057',
                      border: '1px solid #dc3545',
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
              <label className="form-label" style={{ color: '#dc3545', fontWeight: 'bold' }}>
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
                style={{ borderColor: '#dc3545' }}
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
                      background: formData.loanTenure === years ? '#dc3545' : '#e9ecef',
                      color: formData.loanTenure === years ? 'white' : '#495057',
                      border: '1px solid #dc3545',
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

            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <button 
                className="btn btn-primary"
                onClick={calculateLoan}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px',
                  fontSize: '1.1em',
                  background: 'linear-gradient(45deg, #dc3545, #c82333)',
                  border: 'none'
                }}
              >
                Calculate EMI
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
              Loan Summary
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
                    background: 'linear-gradient(135deg, #dc3545, #c82333)',
                    borderRadius: '10px',
                    color: 'white'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.5em' }}>Monthly EMI</h3>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '10px' }}>
                      {formatCurrency(result.emi)}
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
                      background: '#f8d7da',
                      padding: '15px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#dc3545', fontWeight: 'bold' }}>Principal Amount</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.principal)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      background: '#fff3cd',
                      padding: '15px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#ffc107', fontWeight: 'bold' }}>Total Interest</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.totalInterest)}
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
                    Payment Breakdown
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
                        width: `${(result.principal / result.totalPayment) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      Principal
                    </div>
                    <div 
                      style={{ 
                        background: '#28a745',
                        width: `${(result.totalInterest / result.totalPayment) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      Interest
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '10px',
                    gridTemplateColumns: '1fr 1fr',
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
                      <span>Principal Amount</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: '#28a745',
                        borderRadius: '4px',
                        marginRight: '10px'
                      }}></div>
                      <span>Interest Amount</span>
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
                      fontSize: '1.2em', 
                      fontWeight: 'bold', 
                      color: '#667eea',
                      marginBottom: '5px'
                    }}>
                      Total Payment: {formatCurrency(result.totalPayment)}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#6c757d' }}>
                      ({formatCurrency(result.emi)} × {formData.loanTenure * 12} months)
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
                <div style={{ fontSize: '4em', marginBottom: '20px' }}>📊</div>
                <h3 style={{ marginBottom: '10px' }}>Calculate Your Loan EMI</h3>
                <p>Enter your loan details and click "Calculate EMI" to see your monthly payment and total interest.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanCalculator;