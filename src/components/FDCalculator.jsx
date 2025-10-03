import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FDCalculator() {
  const [formData, setFormData] = useState({
    principal: 100000,
    interestRate: 7,
    tenure: 5, // in years
    compoundingFrequency: 'annually' // annually, semi-annually, quarterly, monthly
  });
  
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'compoundingFrequency' ? value : parseFloat(value) || 0
    }));
  };

  const calculateFD = () => {
    const principal = formData.principal;
    const annualInterestRate = formData.interestRate;
    const tenureInYears = formData.tenure;
    
    // Determine compounding frequency
    let n; // Number of times interest is compounded per year
    switch(formData.compoundingFrequency) {
      case 'monthly':
        n = 12;
        break;
      case 'quarterly':
        n = 4;
        break;
      case 'semi-annually':
        n = 2;
        break;
      case 'annually':
      default:
        n = 1;
        break;
    }
    
    // FD Formula: A = P(1 + r/n)^(nt)
    const rate = annualInterestRate / 100;
    const amount = principal * Math.pow((1 + rate / n), n * tenureInYears);
    const interestEarned = amount - principal;
    
    setResult({
      maturityAmount: amount.toFixed(0),
      interestEarned: interestEarned.toFixed(0),
      principal: principal,
      totalYears: tenureInYears
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
      principal: 100000,
      interestRate: 7,
      tenure: 5,
      compoundingFrequency: 'annually'
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
            💰 FD Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Calculate your Fixed Deposit returns
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
              FD Details
            </h2>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>
                Principal Amount (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.principal}
                onChange={(e) => handleInputChange('principal', e.target.value)}
                placeholder="Enter principal amount"
                min="0"
                style={{ borderColor: '#28a745' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[50000, 100000, 500000, 1000000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('principal', amount)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.principal === amount ? '#28a745' : '#e9ecef',
                      color: formData.principal === amount ? 'white' : '#495057',
                      border: '1px solid #28a745',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.principal !== amount) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.principal !== amount) {
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
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                placeholder="Enter annual interest rate"
                min="0"
                max="15"
                step="0.1"
                style={{ borderColor: '#28a745' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[6, 7, 7.5, 8].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleInputChange('interestRate', rate)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.interestRate === rate ? '#28a745' : '#e9ecef',
                      color: formData.interestRate === rate ? 'white' : '#495057',
                      border: '1px solid #28a745',
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
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>
                Tenure (Years)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.tenure}
                onChange={(e) => handleInputChange('tenure', e.target.value)}
                placeholder="Enter tenure in years"
                min="0"
                max="10"
                style={{ borderColor: '#28a745' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[1, 2, 3, 5, 7].map(years => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => handleInputChange('tenure', years)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.tenure === years ? '#28a745' : '#e9ecef',
                      color: formData.tenure === years ? 'white' : '#495057',
                      border: '1px solid #28a745',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.tenure !== years) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.tenure !== years) {
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
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>
                Compounding Frequency
              </label>
              <select
                className="form-select"
                value={formData.compoundingFrequency}
                onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                style={{ borderColor: '#28a745' }}
              >
                <option value="annually">Annually</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
              </select>
              <div style={{ 
                fontSize: '0.85em',
                color: '#666',
                marginTop: '5px'
              }}>
                💡 More frequent compounding results in higher returns
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
                onClick={calculateFD}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px',
                  fontSize: '1.1em',
                  background: 'linear-gradient(45deg, #28a745, #218838)',
                  border: 'none'
                }}
              >
                Calculate Returns
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
            background: 'linear-gradient(135deg, #e8f4f8, #f0f8ff)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #667eea'
          }}>
            <h2 style={{ 
              color: '#667eea', 
              textAlign: 'center', 
              marginBottom: '25px',
              fontSize: '1.8em',
              fontWeight: 'bold'
            }}>
              FD Summary
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
                    background: 'linear-gradient(135deg, #28a745, #218838)',
                    borderRadius: '10px',
                    color: 'white'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.5em' }}>Maturity Amount</h3>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '10px' }}>
                      {formatCurrency(result.maturityAmount)}
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
                      background: '#e8f5e8',
                      padding: '15px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#28a745', fontWeight: 'bold' }}>Principal Amount</div>
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
                      <div style={{ color: '#ffc107', fontWeight: 'bold' }}>Interest Earned</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.interestEarned)}
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
                    Investment Breakdown
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
                        width: `${(result.principal / result.maturityAmount) * 100}%`,
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
                        width: `${(result.interestEarned / result.maturityAmount) * 100}%`,
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
                      <span>Interest Earned</span>
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
                      Tenure: {result.totalYears} years
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#6c757d' }}>
                      Compounded {formData.compoundingFrequency}
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
                <div style={{ fontSize: '4em', marginBottom: '20px' }}>🏦</div>
                <h3 style={{ marginBottom: '10px' }}>Calculate Your FD Returns</h3>
                <p>Enter your FD details and click "Calculate Returns" to see your maturity amount and interest earned.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FDCalculator;