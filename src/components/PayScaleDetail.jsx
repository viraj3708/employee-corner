import { useLocation, useNavigate } from 'react-router-dom';

const PayScaleDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scale } = location.state || {};

  // Get the correct base pay and grade pay for the scale level
  const getPayInfoForLevel = (level) => {
    const payMatrix = {
      1: { basicPay: 15000, gradePay: "1300" },
      2: { basicPay: 15300, gradePay: "1400" },
      3: { basicPay: 16600, gradePay: "1600" },
      4: { basicPay: 17100, gradePay: "1650 & 1700" },
      5: { basicPay: 18000, gradePay: "1800" },
      6: { basicPay: 19900, gradePay: "1900" },
      7: { basicPay: 21700, gradePay: "2000" },
      8: { basicPay: 25500, gradePay: "2400" },
      9: { basicPay: 26400, gradePay: "2500" },
      10: { basicPay: 29200, gradePay: "2800" },
      11: { basicPay: 30100, gradePay: "2900 & 3000" },
      12: { basicPay: 32000, gradePay: "3500" },
      13: { basicPay: 35400, gradePay: "4100 & 4200" },
      14: { basicPay: 38600, gradePay: "4300" },
      15: { basicPay: 41800, gradePay: "4400" },
      16: { basicPay: 44900, gradePay: "4500 & 4600" },
      17: { basicPay: 47600, gradePay: "4800" },
      18: { basicPay: 49100, gradePay: "5000" },
      19: { basicPay: 55100, gradePay: "5000" },
      20: { basicPay: 56100, gradePay: "5400" }
    };
    
    return payMatrix[level] || { basicPay: 15000, gradePay: "1300" };
  };

  // If we don't have the correct scale data, update it with correct values
  const correctedScale = scale ? {
    ...scale,
    basePay: getPayInfoForLevel(scale.level).basicPay,
    gradePay: getPayInfoForLevel(scale.level).gradePay
  } : null;

  // Recalculate current pay with correct base pay (20 increments for 20 years)
  const correctedCurrentPay = correctedScale ? calculateIncrement(correctedScale.basePay, 20) : 0;

  if (!correctedScale) {
    return (
      <div className="container">
        <div className="card fade-in">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Pay Scale Not Found</h2>
            <button
              onClick={() => navigate('/pay-scale-viewer')}
              style={{
                padding: '12px 25px',
                fontSize: '1em',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Back to Pay Scale Viewer
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          onClick={() => navigate('/pay-scale-viewer')}
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
            color: '#667eea',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            Pay Scale {correctedScale.id} Details
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Detailed view with 3% compound increment calculation
          </p>
        </div>

        {/* Scale Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '10px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Scale {correctedScale.level}</h2>
          <div style={{ 
            fontSize: '1.5em', 
            marginBottom: '10px',
            color: '#ffcc00'
          }}>
            Grade Pay ({correctedScale.gradePay})
          </div>
          <div style={{ 
            fontSize: '2em', 
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            ₹{correctedScale.basePay.toLocaleString()} (Base Pay)
          </div>
          <div style={{ 
            fontSize: '1.5em',
            marginBottom: '10px'
          }}>
            ₹{correctedCurrentPay.toLocaleString()} (After 20 Scales)
          </div>
          <div style={{ 
            fontSize: '1em',
            opacity: '0.9'
          }}>
            3% Compound Scale Rule Applied (20 Years)
          </div>
        </div>

        {/* Increment Breakdown */}
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          border: '1px solid #dee2e6',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            color: '#667eea', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Increment Breakdown
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '500px'
            }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '12px', 
                    borderBottom: '2px solid #dee2e6',
                    textAlign: 'left',
                    background: '#f8f9fa'
                  }}>
                    Increment
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    borderBottom: '2px solid #dee2e6',
                    textAlign: 'center',
                    background: '#f8f9fa'
                  }}>
                    Calculation
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    borderBottom: '2px solid #dee2e6',
                    textAlign: 'center',
                    background: '#f8f9fa'
                  }}>
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    Base Pay
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    color: '#667eea'
                  }}>
                    Starting Amount
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    {correctedScale.basePay.toLocaleString()}
                  </td>
                </tr>
                {[1, 2, 3, 4, 5, 10, 15, 20].map(scaleYear => {
                  const previousAmount = scaleYear === 1 
                    ? correctedScale.basePay 
                    : calculateIncrement(correctedScale.basePay, scaleYear - 1);
                  const currentAmount = calculateIncrement(correctedScale.basePay, scaleYear);
                  const incrementAmount = currentAmount - previousAmount;
                  
                  return (
                    <tr key={scaleYear}>
                      <td style={{ 
                        padding: '12px', 
                        borderBottom: '1px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#28a745'
                      }}>
                        Scale {scaleYear}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        borderBottom: '1px solid #dee2e6',
                        textAlign: 'center',
                        color: '#28a745'
                      }}>
                        ₹{previousAmount.toLocaleString()} × 1.03 = ₹{currentAmount.toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        borderBottom: '1px solid #dee2e6',
                        textAlign: 'center',
                        color: '#28a745',
                        fontWeight: 'bold'
                      }}>
                        +₹{incrementAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula Explanation */}
        <div style={{ 
          background: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '10px', 
          border: '1px solid #28a745'
        }}>
          <h3 style={{ 
            color: '#28a745', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            Calculation Method
          </h3>
          <div style={{ 
            fontSize: '0.95em', 
            color: '#333',
            lineHeight: '1.6'
          }}>
            <p>
              <strong>3% Compound Scale Rule:</strong> Each scale is calculated by multiplying the previous amount by 1.03 (3% increase).
            </p>
            <p>
              <strong>Rounding Formula:</strong> After calculating the 3% scale, the result is rounded to the nearest hundred using the formula: 
              <code style={{ background: '#fff', padding: '2px 5px', borderRadius: '3px' }}>
                MROUND(Sum(basic, 3%), 100)
              </code>
            </p>
            <p>
              <strong>Example Calculation:</strong> For Scale {correctedScale.level} with base pay ₹{correctedScale.basePay.toLocaleString()}:
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Scale 1: ₹{correctedScale.basePay.toLocaleString()} × 1.03 = ₹{calculateIncrement(correctedScale.basePay, 1).toLocaleString()} (rounded)</li>
              <li>Scale 5: ₹{calculateIncrement(correctedScale.basePay, 4).toLocaleString()} × 1.03 = ₹{calculateIncrement(correctedScale.basePay, 5).toLocaleString()} (rounded)</li>
              <li>Scale 10: ₹{calculateIncrement(correctedScale.basePay, 9).toLocaleString()} × 1.03 = ₹{calculateIncrement(correctedScale.basePay, 10).toLocaleString()} (rounded)</li>
              <li>... and so on for all 20 scales (20 years)</li>
            </ul>
            <p>
              <strong>Total Period:</strong> 20 scales representing 20 years of service with 1 scale per year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayScaleDetail;