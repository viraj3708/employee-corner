import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SIPCalculator() {
  const [formData, setFormData] = useState({
    monthlyInvestment: 5000,
    expectedReturn: 12,
    timePeriod: 10,
    stepUpPercentage: 0 // New field for step-up investment
  });
  
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('yearly'); // For switching between yearly and monthly views
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateSIP = () => {
    const P = formData.monthlyInvestment;
    const r = formData.expectedReturn / 12 / 100; // Monthly interest rate
    const n = formData.timePeriod * 12; // Total number of months
    const stepUp = formData.stepUpPercentage / 100; // Step-up percentage
    
    // For step-up SIP calculation
    let futureValue = 0;
    let totalInvested = 0;
    const monthlyBreakdown = [];
    const yearlyBreakdown = [];
    
    let currentInvestment = P;
    let yearlyInvestment = 0;
    let yearlyReturns = 0;
    let yearlyStartBalance = 0;
    let currentYear = 1;
    
    for (let month = 1; month <= n; month++) {
      // Apply step-up at the beginning of each year (except first year)
      if (month > 1 && month % 12 === 1 && stepUp > 0) {
        currentInvestment = currentInvestment * (1 + stepUp);
        currentYear++;
      }
      
      totalInvested += currentInvestment;
      futureValue = (futureValue + currentInvestment) * (1 + r);
      
      // Store monthly breakdown for key months
      if (month === 1 || month % 12 === 0 || month === n) {
        monthlyBreakdown.push({
          month: month,
          year: Math.ceil(month / 12),
          investment: currentInvestment,
          totalInvested: totalInvested,
          balance: futureValue,
          returns: futureValue - totalInvested
        });
      }
      
      // Yearly calculations
      yearlyInvestment += currentInvestment;
      
      if (month % 12 === 0 || month === n) {
        const year = Math.ceil(month / 12);
        yearlyReturns = futureValue - yearlyStartBalance - yearlyInvestment;
        
        yearlyBreakdown.push({
          year: year,
          investment: yearlyInvestment,
          totalInvested: totalInvested,
          balance: futureValue,
          returns: yearlyReturns,
          cumulativeReturns: futureValue - totalInvested
        });
        
        // Reset for next year
        yearlyInvestment = 0;
        yearlyStartBalance = futureValue;
      }
    }
    
    const wealthGained = futureValue - totalInvested;
    
    setResult({
      futureValue: futureValue.toFixed(0),
      totalInvested: totalInvested.toFixed(0),
      wealthGained: wealthGained.toFixed(0),
      monthlyBreakdown: monthlyBreakdown,
      yearlyBreakdown: yearlyBreakdown
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
      monthlyInvestment: 5000,
      expectedReturn: 12,
      timePeriod: 10,
      stepUpPercentage: 0
    });
    setResult(null);
    setActiveTab('yearly');
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
            💰 SIP Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Calculate your mutual fund investment returns with step-up option
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
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.monthlyInvestment}
                onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                placeholder="Enter monthly investment amount"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[1000, 5000, 10000, 25000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('monthlyInvestment', amount)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.monthlyInvestment === amount ? '#667eea' : '#e9ecef',
                      color: formData.monthlyInvestment === amount ? 'white' : '#495057',
                      border: '1px solid #667eea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.monthlyInvestment !== amount) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.monthlyInvestment !== amount) {
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
                Step-up Investment (%)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.stepUpPercentage}
                onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                placeholder="Enter annual step-up percentage"
                min="0"
                max="100"
                step="0.1"
                style={{ borderColor: '#667eea' }}
              />
              <div style={{ 
                fontSize: '0.85em',
                color: '#666',
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                💡 Increase your monthly investment by this percentage every year
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                {[0, 5, 10, 15].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleInputChange('stepUpPercentage', rate)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.stepUpPercentage === rate ? '#667eea' : '#e9ecef',
                      color: formData.stepUpPercentage === rate ? 'white' : '#495057',
                      border: '1px solid #667eea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.stepUpPercentage !== rate) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.stepUpPercentage !== rate) {
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
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.expectedReturn}
                onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                placeholder="Enter expected return percentage"
                min="0"
                max="100"
                step="0.1"
                style={{ borderColor: '#667eea' }}
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
                    onClick={() => handleInputChange('expectedReturn', rate)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.expectedReturn === rate ? '#667eea' : '#e9ecef',
                      color: formData.expectedReturn === rate ? 'white' : '#495057',
                      border: '1px solid #667eea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.expectedReturn !== rate) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.expectedReturn !== rate) {
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
                Time Period (Years)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.timePeriod}
                onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                placeholder="Enter investment duration in years"
                min="0"
                max="50"
                style={{ borderColor: '#667eea' }}
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
                    onClick={() => handleInputChange('timePeriod', years)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85em',
                      borderRadius: '6px',
                      background: formData.timePeriod === years ? '#667eea' : '#e9ecef',
                      color: formData.timePeriod === years ? 'white' : '#495057',
                      border: '1px solid #667eea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.timePeriod !== years) {
                        e.target.style.background = '#ced4da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.timePeriod !== years) {
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
                onClick={calculateSIP}
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
                    <h3 style={{ margin: 0, fontSize: '1.5em' }}>Future Value</h3>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '10px' }}>
                      {formatCurrency(result.futureValue)}
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
                      <div style={{ color: '#667eea', fontWeight: 'bold' }}>Total Invested</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.totalInvested)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      background: '#fff3cd',
                      padding: '15px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#ffc107', fontWeight: 'bold' }}>Wealth Gained</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                        {formatCurrency(result.wealthGained)}
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
                        width: `${(result.totalInvested / result.futureValue) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      Invested
                    </div>
                    <div 
                      style={{ 
                        background: '#28a745',
                        width: `${(result.wealthGained / result.futureValue) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}
                    >
                      Returns
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
                      <span>Invested Amount</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: '#28a745',
                        borderRadius: '4px',
                        marginRight: '10px'
                      }}></div>
                      <span>Returns Generated</span>
                    </div>
                  </div>
                </div>
                
                {/* Tabs for Monthly/Yearly Breakdown */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex',
                    marginBottom: '20px',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    <button
                      onClick={() => setActiveTab('yearly')}
                      style={{
                        padding: '10px 20px',
                        background: activeTab === 'yearly' ? '#667eea' : 'transparent',
                        color: activeTab === 'yearly' ? 'white' : '#495057',
                        border: 'none',
                        borderBottom: activeTab === 'yearly' ? '3px solid #667eea' : 'none',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'yearly' ? 'bold' : 'normal',
                        borderRadius: '5px 5px 0 0'
                      }}
                    >
                      Yearly Breakdown
                    </button>
                    <button
                      onClick={() => setActiveTab('monthly')}
                      style={{
                        padding: '10px 20px',
                        background: activeTab === 'monthly' ? '#667eea' : 'transparent',
                        color: activeTab === 'monthly' ? 'white' : '#495057',
                        border: 'none',
                        borderBottom: activeTab === 'monthly' ? '3px solid #667eea' : 'none',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'monthly' ? 'bold' : 'normal',
                        borderRadius: '5px 5px 0 0'
                      }}
                    >
                      Monthly Breakdown
                    </button>
                  </div>
                  
                  <div style={{ 
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px'
                  }}>
                    {activeTab === 'yearly' ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8f9fa' }}>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'left', 
                              borderBottom: '2px solid #dee2e6',
                              borderRight: '1px solid #dee2e6'
                            }}>Year</th>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              borderBottom: '2px solid #dee2e6',
                              borderRight: '1px solid #dee2e6'
                            }}>Investment</th>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              borderBottom: '2px solid #dee2e6',
                              borderRight: '1px solid #dee2e6'
                            }}>Returns</th>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              borderBottom: '2px solid #dee2e6'
                            }}>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.yearlyBreakdown.map((item, index) => (
                            <tr 
                              key={item.year} 
                              style={{ 
                                background: index % 2 === 0 ? 'white' : '#f8f9fa',
                                borderBottom: '1px solid #dee2e6'
                              }}
                            >
                              <td style={{ 
                                padding: '10px', 
                                borderRight: '1px solid #dee2e6'
                              }}>{item.year}</td>
                              <td style={{ 
                                padding: '10px', 
                                textAlign: 'right', 
                                borderRight: '1px solid #dee2e6'
                              }}>{formatCurrency(item.investment)}</td>
                              <td style={{ 
                                padding: '10px', 
                                textAlign: 'right', 
                                borderRight: '1px solid #dee2e6',
                                color: '#28a745',
                                fontWeight: 'bold'
                              }}>{formatCurrency(item.returns)}</td>
                              <td style={{ 
                                padding: '10px', 
                                textAlign: 'right',
                                fontWeight: 'bold'
                              }}>{formatCurrency(item.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8f9fa' }}>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'left', 
                              borderBottom: '2px solid #dee2e6',
                              borderRight: '1px solid #dee2e6'
                            }}>Month</th>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              borderBottom: '2px solid #dee2e6',
                              borderRight: '1px solid #dee2e6'
                            }}>Investment</th>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              borderBottom: '2px solid #dee2e6',
                              borderRight: '1px solid #dee2e6'
                            }}>Total Invested</th>
                            <th style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              borderBottom: '2px solid #dee2e6'
                            }}>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.monthlyBreakdown.map((item, index) => (
                            <tr 
                              key={item.month} 
                              style={{ 
                                background: index % 2 === 0 ? 'white' : '#f8f9fa',
                                borderBottom: '1px solid #dee2e6'
                              }}
                            >
                              <td style={{ 
                                padding: '10px', 
                                borderRight: '1px solid #dee2e6'
                              }}>{item.month}</td>
                              <td style={{ 
                                padding: '10px', 
                                textAlign: 'right', 
                                borderRight: '1px solid #dee2e6'
                              }}>{formatCurrency(item.investment)}</td>
                              <td style={{ 
                                padding: '10px', 
                                textAlign: 'right', 
                                borderRight: '1px solid #dee2e6'
                              }}>{formatCurrency(item.totalInvested)}</td>
                              <td style={{ 
                                padding: '10px', 
                                textAlign: 'right',
                                fontWeight: 'bold'
                              }}>{formatCurrency(item.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  
                  <div style={{ 
                    marginTop: '20px',
                    padding: '15px',
                    background: '#e8f4f8',
                    borderRadius: '10px',
                    fontSize: '0.9em'
                  }}>
                    <p style={{ margin: '0 0 10px 0' }}><strong>Key Highlights:</strong></p>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li>Total Investment: {formatCurrency(result.totalInvested)} over {formData.timePeriod} years</li>
                      <li>Total Returns: {formatCurrency(result.wealthGained)}</li>
                      <li>Final Corpus: {formatCurrency(result.futureValue)}</li>
                      <li>Annualized Return: {formData.expectedReturn}%</li>
                      {formData.stepUpPercentage > 0 && (
                        <li>Step-up Investment: {formData.stepUpPercentage}% annually</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '4em', marginBottom: '20px' }}>📈</div>
                <h3 style={{ marginBottom: '10px' }}>Calculate Your SIP Returns</h3>
                <p>Enter your investment details and click "Calculate Returns" to see the magic of compounding!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SIPCalculator;