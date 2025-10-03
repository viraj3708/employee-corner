import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PayScaleViewer = () => {
  const navigate = useNavigate();
  const [selectedScales, setSelectedScales] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compare'
  const [payScales, setPayScales] = useState([]);

  // Generate pay scales S-1 to S-20 with actual 7th CPC Pay Matrix data
  useEffect(() => {
    // Actual 7th CPC Pay Matrix values for Level 1 to Level 20 (as provided by user)
    // Including actual Grade Pay values for each level (for indication only)
    const payMatrix = [
      { level: 1, basicPay: 15000, gradePay: "1300" },
      { level: 2, basicPay: 15300, gradePay: "1400" },
      { level: 3, basicPay: 16600, gradePay: "1600" },
      { level: 4, basicPay: 17100, gradePay: "1650 & 1700" },
      { level: 5, basicPay: 18000, gradePay: "1800" },
      { level: 6, basicPay: 19900, gradePay: "1900" },
      { level: 7, basicPay: 21700, gradePay: "2000" },
      { level: 8, basicPay: 25500, gradePay: "2400" },
      { level: 9, basicPay: 26400, gradePay: "2500" },
      { level: 10, basicPay: 29200, gradePay: "2800" },
      { level: 11, basicPay: 30100, gradePay: "2900 & 3000" },
      { level: 12, basicPay: 32000, gradePay: "3500" },
      { level: 13, basicPay: 35400, gradePay: "4100 & 4200" },
      { level: 14, basicPay: 38600, gradePay: "4300" },
      { level: 15, basicPay: 41800, gradePay: "4400" },
      { level: 16, basicPay: 44900, gradePay: "4500 & 4600" },
      { level: 17, basicPay: 47600, gradePay: "4800" },
      { level: 18, basicPay: 49100, gradePay: "5000" },
      { level: 19, basicPay: 55100, gradePay: "5000" },
      { level: 20, basicPay: 56100, gradePay: "5400" }
    ];

    const scales = payMatrix.map((matrixEntry, index) => {
      const basePay = matrixEntry.basicPay;
      const increments = [];
      
      // Calculate 20 increments (20 years) using 3% compound rule
      let currentPay = basePay;
      for (let j = 0; j < 20; j++) {
        // Apply 3% increment and round to nearest 100
        const incremented = currentPay * 1.03;
        currentPay = Math.round(incremented / 100) * 100;
        increments.push(currentPay);
      }
      
      return {
        id: `S-${matrixEntry.level}`,
        level: matrixEntry.level,
        basePay: basePay,
        gradePay: matrixEntry.gradePay,
        increments: increments,
        currentPay: increments[increments.length - 1]
      };
    });
    
    setPayScales(scales);
  }, []);

  const handleScaleSelect = (scale) => {
    if (viewMode === 'compare') {
      // For comparison mode, allow selecting up to 4 scales
      if (selectedScales.find(s => s.id === scale.id)) {
        // Deselect if already selected
        setSelectedScales(selectedScales.filter(s => s.id !== scale.id));
      } else if (selectedScales.length < 4) {
        // Select if less than 4 are selected
        setSelectedScales([...selectedScales, scale]);
      }
    } else {
      // For grid mode, show detail view
      navigate('/pay-scale-detail', { state: { scale } });
    }
  };

  const toggleCompareMode = () => {
    setViewMode(viewMode === 'grid' ? 'compare' : 'grid');
    setSelectedScales([]);
  };

  const calculateIncrement = (base, incrementCount) => {
    let current = base;
    for (let i = 0; i < incrementCount; i++) {
      const incremented = current * 1.03;
      current = Math.round(incremented / 100) * 100;
    }
    return current;
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
      
      <div className="card fade-in" style={{ marginTop: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            Pay Scale Viewer
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            View and compare government pay scales with 3% compound increments
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '12px 25px',
              fontSize: '1em',
              background: viewMode === 'grid' ? '#667eea' : '#e9ecef',
              color: viewMode === 'grid' ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Grid View
          </button>
          <button
            onClick={toggleCompareMode}
            style={{
              padding: '12px 25px',
              fontSize: '1em',
              background: viewMode === 'compare' ? '#28a745' : '#e9ecef',
              color: viewMode === 'compare' ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {viewMode === 'compare' ? 'Select Scales to Compare' : 'Compare Scales'}
          </button>
        </div>

        {/* Pay Scale Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '8px',
          marginTop: '20px'
        }}>
          {payScales.map(scale => (
            <div
              key={scale.id}
              onClick={() => handleScaleSelect(scale)}
              style={{
                background: 'white',
                border: viewMode === 'compare' && selectedScales.find(s => s.id === scale.id) 
                  ? '2px solid #28a745' 
                  : '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
              }}
            >
              {viewMode === 'compare' && selectedScales.find(s => s.id === scale.id) && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#28a745',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.7em'
                }}>
                  ✓
                </div>
              )}
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ 
                  margin: '0 0 5px 0', 
                  color: '#667eea',
                  fontSize: '1em'
                }}>
                  S-{scale.level}
                </h3>
                <div style={{ 
                  fontSize: '0.75em', 
                  color: '#dc3545',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  lineHeight: '1.2'
                }}>
                  GP ({scale.gradePay})
                </div>
                <div style={{ 
                  fontSize: '0.9em', 
                  fontWeight: 'bold', 
                  color: '#28a745',
                  marginBottom: '6px'
                }}>
                  ₹{scale.basePay.toLocaleString()}
                </div>
                <div style={{ 
                  fontSize: '0.6em', 
                  color: '#999'
                }}>
                  20 yrs
                </div>
              </div>
            </div>
          ))}
        </div>

        {viewMode === 'compare' && selectedScales.length > 0 && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ 
              color: '#28a745', 
              marginBottom: '12px',
              textAlign: 'center',
              fontSize: '1.2em'
            }}>
              Comparing {selectedScales.length} Scale{selectedScales.length > 1 ? 's' : ''}
            </h3>
            
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '500px',
                fontSize: '0.8em'
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '8px', 
                      borderBottom: '2px solid #dee2e6',
                      textAlign: 'left',
                      background: '#e9ecef',
                      fontSize: '0.9em'
                    }}>
                      Details
                    </th>
                    {selectedScales.map(scale => (
                      <th key={scale.id} style={{ 
                        padding: '8px', 
                        borderBottom: '2px solid #dee2e6',
                        textAlign: 'center',
                        background: '#e9ecef',
                        fontSize: '0.85em'
                      }}>
                        <div>S-{scale.level}</div>
                        <div style={{ 
                          fontSize: '0.8em', 
                          color: '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          GP ({scale.gradePay})
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ 
                      padding: '8px', 
                      borderBottom: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      color: '#667eea'
                    }}>
                      Base Pay
                    </td>
                    {selectedScales.map(scale => (
                      <td key={`${scale.id}-base`} style={{ 
                        padding: '8px', 
                        borderBottom: '1px solid #dee2e6',
                        textAlign: 'center',
                        color: '#667eea',
                        fontWeight: 'bold'
                      }}>
                        ₹{scale.basePay.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  {[...Array(20)].map((_, index) => {
                    const scaleYear = index + 1;
                    return (
                      <tr key={scaleYear}>
                        <td style={{ 
                          padding: '8px', 
                          borderBottom: '1px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#28a745',
                          fontSize: '0.85em'
                        }}>
                          Yr {scaleYear}
                        </td>
                        {selectedScales.map(scale => (
                          <td key={`${scale.id}-${scaleYear}`} style={{ 
                            padding: '8px', 
                            borderBottom: '1px solid #dee2e6',
                            textAlign: 'center',
                            color: '#28a745',
                            fontSize: '0.85em'
                          }}>
                            ₹{calculateIncrement(scale.basePay, scaleYear).toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'compare' && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            padding: '15px',
            background: '#e9f7ef',
            borderRadius: '8px',
            color: '#28a745'
          }}>
            {selectedScales.length === 0 
              ? 'Click on up to 4 pay scales to compare them' 
              : `Selected ${selectedScales.length} scale${selectedScales.length > 1 ? 's' : ''} for comparison`}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayScaleViewer;