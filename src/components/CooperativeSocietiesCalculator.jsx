import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CooperativeSocietiesCalculator() {
  const [formData, setFormData] = useState({
    shareCapital: 1000,
    dividendRate: 8,
    tenure: 5, // in years
    monthlyContribution: 500,
    interestRate: 9,
    loanAmount: 0,
    loanInterestRate: 12,
    loanTenure: 0 // in years
  });
  
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateReturns = () => {
    const shareCapital = formData.shareCapital;
    const dividendRate = formData.dividendRate / 100;
    const tenure = formData.tenure;
    const monthlyContribution = formData.monthlyContribution;
    const interestRate = formData.interestRate / 100;
    
    // Calculate dividend on share capital
    const totalDividend = shareCapital * dividendRate * tenure;
    
    // Calculate returns on monthly contributions (Recurring Deposit formula)
    const months = tenure * 12;
    const monthlyInterestRate = interestRate / 12;
    
    // Future Value of Annuity Formula: FV = P * [((1 + r)^n - 1) / r]
    const contributionReturns = monthlyContribution * 
                              (Math.pow(1 + monthlyInterestRate, months) - 1) / 
                              monthlyInterestRate;
    
    // Total maturity amount
    const maturityAmount = shareCapital + totalDividend + contributionReturns;
    
    // Calculate loan details if loan is taken
    let loanEMI = 0;
    let totalLoanPayment = 0;
    let totalLoanInterest = 0;
    
    if (formData.loanAmount > 0 && formData.loanTenure > 0) {
      const loanTenureMonths = formData.loanTenure * 12;
      const loanMonthlyRate = formData.loanInterestRate / 12 / 100;
      
      // EMI Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
      loanEMI = formData.loanAmount * loanMonthlyRate * 
                (Math.pow(1 + loanMonthlyRate, loanTenureMonths)) / 
                (Math.pow(1 + loanMonthlyRate, loanTenureMonths) - 1);
      
      totalLoanPayment = loanEMI * loanTenureMonths;
      totalLoanInterest = totalLoanPayment - formData.loanAmount;
    }
    
    setResult({
      shareCapital: shareCapital,
      totalDividend: totalDividend.toFixed(0),
      contributionReturns: contributionReturns.toFixed(0),
      maturityAmount: maturityAmount.toFixed(0),
      loanEMI: loanEMI.toFixed(0),
      totalLoanPayment: totalLoanPayment.toFixed(0),
      totalLoanInterest: totalLoanInterest.toFixed(0),
      hasLoan: formData.loanAmount > 0 && formData.loanTenure > 0
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
      shareCapital: 1000,
      dividendRate: 8,
      tenure: 5,
      monthlyContribution: 500,
      interestRate: 9,
      loanAmount: 0,
      loanInterestRate: 12,
      loanTenure: 0
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
      
      <div className="card fade-in" style={{ marginTop: '80px', maxWidth: '1200px', margin: '80px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            🤝 Co-operative Societies Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Calculate your returns and loan eligibility in co-operative societies
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
              Investment Details
            </h2>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Share Capital (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.shareCapital}
                onChange={(e) => handleInputChange('shareCapital', e.target.value)}
                placeholder="Enter share capital amount"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[500, 1000, 2000, 5000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('shareCapital', amount)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.shareCapital === amount ? '#667eea' : '#e9ecef',
                      color: formData.shareCapital === amount ? 'white' : '#495057',
                      border: '1px solid #667eea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.shareCapital !== amount) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.shareCapital !== amount) {
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
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Dividend Rate (% per annum)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.dividendRate}
                onChange={(e) => handleInputChange('dividendRate', e.target.value)}
                placeholder="Enter annual dividend rate"
                min="0"
                max="20"
                step="0.1"
                style={{ borderColor: '#667eea' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[6, 8, 10, 12].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleInputChange('dividendRate', rate)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.dividendRate === rate ? '#667eea' : '#e9ecef',
                      color: formData.dividendRate === rate ? 'white' : '#495057',
                      border: '1px solid #667eea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.dividendRate !== rate) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.dividendRate !== rate) {
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
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Tenure (Years)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.tenure}
                onChange={(e) => handleInputChange('tenure', e.target.value)}
                placeholder="Enter investment tenure in years"
                min="0"
                max="20"
                style={{ borderColor: '#667eea' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[3, 5, 7, 10].map(years => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => handleInputChange('tenure', years)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.tenure === years ? '#667eea' : '#e9ecef',
                      color: formData.tenure === years ? 'white' : '#495057',
                      border: '1px solid #667eea',
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

            <h3 style={{ 
              color: '#667eea', 
              marginTop: '30px',
              marginBottom: '20px',
              fontSize: '1.4em',
              fontWeight: 'bold',
              paddingBottom: '10px',
              borderBottom: '2px solid #667eea'
            }}>
              Savings Scheme
            </h3>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Monthly Contribution (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.monthlyContribution}
                onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                placeholder="Enter monthly contribution"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
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
                style={{ borderColor: '#667eea' }}
              />
            </div>
          </div>

          {/* Loan Section */}
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid #ffc107',
              marginBottom: '30px'
            }}>
              <h2 style={{ 
                color: '#ffc107', 
                textAlign: 'center', 
                marginBottom: '25px',
                fontSize: '1.8em',
                fontWeight: 'bold'
              }}>
                Loan Details (Optional)
              </h2>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  placeholder="Enter loan amount (0 if no loan)"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Loan Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.loanInterestRate}
                  onChange={(e) => handleInputChange('loanInterestRate', e.target.value)}
                  placeholder="Enter loan interest rate"
                  min="0"
                  max="25"
                  step="0.1"
                  style={{ borderColor: '#ffc107' }}
                />
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
                  placeholder="Enter loan tenure in years (0 if no loan)"
                  min="0"
                  max="15"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginTop: '30px',
                flexWrap: 'wrap'
              }}>
                <button 
                  className="btn btn-primary"
                  onClick={calculateReturns}
                  style={{ 
                    flex: 1, 
                    padding: '12px 20px',
                    fontSize: '1.1em',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
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
                Investment Summary
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
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
                        background: '#e8f4f8',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: '#667eea', fontWeight: 'bold' }}>Share Capital</div>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                          {formatCurrency(result.shareCapital)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: '#fff3cd',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: '#ffc107', fontWeight: 'bold' }}>Total Returns</div>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                          {formatCurrency(parseFloat(result.totalDividend) + parseFloat(result.contributionReturns))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Breakdown */}
                  <div style={{ 
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ 
                      color: '#495057', 
                      marginBottom: '15px',
                      fontSize: '1.3em',
                      paddingBottom: '10px',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      Detailed Breakdown
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gap: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Share Capital</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.shareCapital)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Dividend Earned ({formData.dividendRate}% for {formData.tenure} years)</span>
                        <span style={{ fontWeight: 'bold', color: '#28a745' }}>{formatCurrency(result.totalDividend)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Savings Returns (Monthly Contributions)</span>
                        <span style={{ fontWeight: 'bold', color: '#28a745' }}>{formatCurrency(result.contributionReturns)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderTop: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        fontSize: '1.1em'
                      }}>
                        <span>Total Maturity Amount</span>
                        <span>{formatCurrency(result.maturityAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loan Details if applicable */}
                  {result.hasLoan && (
                    <div style={{ 
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h3 style={{ 
                        color: '#495057', 
                        marginBottom: '15px',
                        fontSize: '1.3em',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #dee2e6'
                      }}>
                        Loan Details
                      </h3>
                      
                      <div style={{ 
                        display: 'grid', 
                        gap: '12px'
                      }}>
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <span>Monthly EMI</span>
                          <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.loanEMI)}</span>
                        </div>
                        
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <span>Total Loan Payment</span>
                          <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.totalLoanPayment)}</span>
                        </div>
                        
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <span>Total Interest Paid</span>
                          <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{formatCurrency(result.totalLoanInterest)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '4em', marginBottom: '20px' }}>🤝</div>
                  <h3 style={{ marginBottom: '10px' }}>Calculate Your Co-operative Society Returns</h3>
                  <p>Enter your investment and loan details to calculate your returns and loan obligations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Information Section */}
        <div style={{ 
          marginTop: '30px',
          background: '#f8f9fa',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ 
            color: '#495057', 
            marginBottom: '15px',
            fontSize: '1.4em',
            textAlign: 'center'
          }}>
            💡 How Co-operative Societies Calculator Works
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '15px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            <div>
              <p><strong>Investment Components:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Share Capital:</strong> One-time investment in society shares</li>
                <li><strong>Dividend:</strong> Returns on share capital (fixed rate)</li>
                <li><strong>Monthly Contributions:</strong> Regular savings with compound interest</li>
              </ul>
            </div>
            <div>
              <p><strong>Loan Facility:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Members can avail loans against their contributions</li>
                <li>Loan interest rates are typically lower than market rates</li>
                <li>EMI is calculated using standard loan formula</li>
              </ul>
            </div>
            <div>
              <p><strong>Benefits:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Safe and secure investment option</li>
                <li>Regular income through dividends</li>
                <li>Access to low-interest loans</li>
                <li>Community-based financial support</li>
              </ul>
            </div>
          </div>
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: '#e8f4f8',
            borderRadius: '10px',
            borderLeft: '4px solid #667eea'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Formulas Used:</strong><br/>
              1. Dividend: Share Capital × Dividend Rate × Tenure<br/>
              2. Savings Returns: FV = P × [((1 + r)^n - 1) / r] (Future Value of Annuity)<br/>
              3. Loan EMI: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CooperativeSocietiesCalculator;