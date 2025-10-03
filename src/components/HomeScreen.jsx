import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllCities, getCityCategory } from '../utils/cityData';

function HomeScreen({ payslipData, setPayslipData }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to get current DA rate (you can update this with actual current rate)
  const getCurrentDARate = () => {
    // Current DA rate for Maharashtra as of 2024
    return 55; // Current DA rate percentage for Maharashtra
  };
  
  // Get employee type and handicap status from previous screen or use existing data
  const employeeType = location.state?.employeeType || payslipData.employeeType || 'GPF';
  const handicapStatus = location.state?.handicapStatus || payslipData.handicapStatus || 'Regular';
  
  // Initialize additional allowances state
  const initialAdditionalAllowances = payslipData.additionalAllowances || [];
  
  const [formData, setFormData] = useState({
    employeeType: employeeType,
    handicapStatus: handicapStatus,
    basicSalary: payslipData.basicSalary || '',
    daRate: payslipData.daRate || getCurrentDARate(), // Auto-populate with current DA rate
    city: payslipData.city || '',
    class: payslipData.class || '',
    perTA: payslipData.perTA || 0,
    gpfSubscription: payslipData.gpfSubscription || 0,
    gpfRecovery: payslipData.gpfRecovery || 0,
    festivalAdvances: payslipData.festivalAdvances || 0,
    otherAdvances: payslipData.otherAdvances || 0,
    otherRecovery: payslipData.otherRecovery || 0,
    incomeTax: payslipData.incomeTax || 0
  });
  
  const [additionalAllowances, setAdditionalAllowances] = useState(initialAdditionalAllowances);
  const [isAdditionalAllowancesOpen, setIsAdditionalAllowancesOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const cities = getAllCities();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  // Handle additional allowance changes
  const handleAdditionalAllowanceChange = (id, field, value) => {
    setAdditionalAllowances(prev => 
      prev.map(allowance => {
        if (allowance.id === id) {
          const updatedAllowance = { ...allowance, [field]: value };
          
          // If type is NPA, calculate amount as 35% of basic salary
          if (field === 'type' && value === 'NPA') {
            const basicSalary = parseFloat(formData.basicSalary) || 0;
            updatedAllowance.amount = Math.round(basicSalary * 0.35);
          } else if (field === 'type' && value !== 'NPA') {
            // Reset amount if changing from NPA to another type
            if (allowance.type === 'NPA') {
              updatedAllowance.amount = 0;
            }
          }
          
          return updatedAllowance;
        }
        return allowance;
      })
    );
  };
  
  // Add a new additional allowance
  const addAdditionalAllowance = () => {
    const newId = additionalAllowances.length > 0 
      ? Math.max(...additionalAllowances.map(a => a.id)) + 1 
      : 1;
      
    setAdditionalAllowances(prev => [
      ...prev,
      { id: newId, type: 'Permanent TA', amount: 0 }
    ]);
  };
  
  // Remove an additional allowance
  const removeAdditionalAllowance = (id) => {
    if (additionalAllowances.length > 1) {
      setAdditionalAllowances(prev => prev.filter(allowance => allowance.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.basicSalary || formData.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic Salary is required and must be greater than 0';
    }
    
    if (!formData.daRate || formData.daRate < 0) {
      newErrors.daRate = 'DA Rate is required and must be 0 or greater';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }
    
    if (!formData.class) {
      newErrors.class = 'Please select a class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const cityCategory = getCityCategory(formData.city);
      
      // Calculate NPA amounts before submitting
      const processedAllowances = additionalAllowances.map(allowance => {
        if (allowance.type === 'NPA') {
          const basicSalary = parseFloat(formData.basicSalary) || 0;
          return { ...allowance, amount: Math.round(basicSalary * 0.35) };
        }
        return allowance;
      });
      
      setPayslipData({
        ...formData,
        basicSalary: parseFloat(formData.basicSalary),
        daRate: parseFloat(formData.daRate),
        cityCategory,
        handicapStatus: handicapStatus,
        perTA: parseFloat(formData.perTA) || 0,
        additionalAllowances: processedAllowances,
        gpfSubscription: formData.employeeType === 'GPF' ? parseFloat(formData.gpfSubscription) || 0 : 0,
        gpfRecovery: formData.employeeType === 'GPF' ? parseFloat(formData.gpfRecovery) || 0 : 0,
        festivalAdvances: parseFloat(formData.festivalAdvances) || 0,
        otherAdvances: parseFloat(formData.otherAdvances) || 0,
        otherRecovery: parseFloat(formData.otherRecovery) || 0,
        incomeTax: parseFloat(formData.incomeTax) || 0
      });
      
      navigate('/result');
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
          onClick={() => navigate('/employee-type')}
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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            Payslip Calculator
          </h1>
          
          {/* Display selected employee type and handicap status */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ 
              background: employeeType === 'GPF' ? '#e8f5e8' : '#e8f4f8',
              color: employeeType === 'GPF' ? '#28a745' : '#667eea',
              padding: '10px 20px',
              borderRadius: '20px',
              fontWeight: 'bold',
              border: `2px solid ${employeeType === 'GPF' ? '#28a745' : '#667eea'}`,
              fontSize: '1em'
            }}>
              🏦 {employeeType} Employee
            </div>
            <div style={{ 
              background: handicapStatus === 'Handicap' ? '#fff3cd' : '#e8f4f8',
              color: handicapStatus === 'Handicap' ? '#ffc107' : '#667eea',
              padding: '10px 20px',
              borderRadius: '20px',
              fontWeight: 'bold',
              border: `2px solid ${handicapStatus === 'Handicap' ? '#ffc107' : '#667eea'}`,
              fontSize: '1em'
            }}>
              {handicapStatus === 'Handicap' ? '♿' : '👤'} {handicapStatus}
            </div>
          </div>
        </div>

        {/* ALLOWANCES SECTION */}
        <div style={{ 
          background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          border: '2px solid #28a745'
        }}>
          <h2 style={{ 
            color: '#28a745', 
            textAlign: 'center', 
            marginBottom: '25px',
            fontSize: '1.8em',
            fontWeight: 'bold'
          }}>
            📊 ALLOWANCES
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>Basic Salary (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.basicSalary}
                onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                placeholder="Enter basic salary amount"
                min="0"
                step="0.01"
                style={{ borderColor: '#28a745' }}
              />
              {errors.basicSalary && (
                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                  {errors.basicSalary}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>DA Rate (%)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-input"
                  value={formData.daRate}
                  onChange={(e) => handleInputChange('daRate', e.target.value)}
                  placeholder="Enter DA rate percentage"
                  min="0"
                  max="100"
                  step="0.01"
                  style={{ borderColor: '#28a745', paddingRight: '100px' }}
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('daRate', getCurrentDARate())}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '6px 12px',
                    fontSize: '0.8em',
                    borderRadius: '6px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#5a6268'}
                  onMouseLeave={(e) => e.target.style.background = '#6c757d'}
                >
                  Current DA
                </button>
              </div>
              <div style={{
                fontSize: '0.85em',
                color: '#666',
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                💡 Click "Current DA" for automatic rate (55%) or enter manually
              </div>
              {errors.daRate && (
                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                  {errors.daRate}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>City</label>
              <select
                className="form-select"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                style={{ borderColor: '#28a745' }}
              >
                <option value="">Select a city by scrolling</option>
                <optgroup label="X Category Cities">
                  {cities.filter(city => city.category === 'X').map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Y Category Cities">
                  {cities.filter(city => city.category === 'Y').map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Z Category Cities">
                  {cities.filter(city => city.category === 'Z').map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </optgroup>
              </select>
              {errors.city && (
                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                  {errors.city}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#28a745', fontWeight: 'bold' }}>Class</label>
              <select
                className="form-select"
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                style={{ borderColor: '#28a745' }}
              >
                <option value="">Select class by scrolling</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
              </select>
              {errors.class && (
                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                  {errors.class}
                </div>
              )}
            </div>
            
            {/* Additional Allowances Section */}
            <div style={{ 
              background: 'white', 
              padding: '15px', 
              borderRadius: '10px', 
              border: '1px solid #28a745' 
            }}>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsAdditionalAllowancesOpen(!isAdditionalAllowancesOpen)}
              >
                <h3 style={{ 
                  color: '#28a745', 
                  margin: 0,
                  fontSize: '1.3em'
                }}>
                  Additional Allowances
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addAdditionalAllowance();
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '1em',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#218838'}
                  onMouseLeave={(e) => e.target.style.background = '#28a745'}
                >
                  + Add
                </button>
              </div>
              
              {isAdditionalAllowancesOpen && (
                <>
                  {additionalAllowances.map((allowance, index) => (
                    <div 
                      key={allowance.id} 
                      style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        marginBottom: '10px',
                        alignItems: 'center'
                      }}
                    >
                      <select
                        className="form-select"
                        value={allowance.type}
                        onChange={(e) => handleAdditionalAllowanceChange(allowance.id, 'type', e.target.value)}
                        style={{ 
                          flex: 1,
                          borderColor: '#28a745',
                          padding: '8px'
                        }}
                      >
                        <option value="Permanent TA">Permanent TA</option>
                        <option value="Washing allowance">Washing allowance</option>
                        <option value="NPA">NPA</option>
                        <option value="other allowance">Other allowance</option>
                      </select>
                      
                      <input
                        type="number"
                        className="form-input"
                        value={allowance.amount}
                        onChange={(e) => handleAdditionalAllowanceChange(allowance.id, 'amount', e.target.value)}
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                        style={{ 
                          flex: 1,
                          borderColor: '#28a745',
                          padding: '8px'
                        }}
                        disabled={allowance.type === 'NPA'} // Disable input for NPA as it's calculated
                      />
                      
                      {additionalAllowances.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAdditionalAllowance(allowance.id)}
                          style={{
                            padding: '8px 12px',
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
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div style={{ 
                    fontSize: '0.85em', 
                    color: '#666', 
                    marginTop: '10px',
                    fontStyle: 'italic'
                  }}>
                    💡 NPA is automatically calculated as 35% of Basic Salary. For other allowances, enter the amount manually.
                  </div>
                </>
              )}
            </div>
            
            {/* Optional Deductions Section */}
            <div style={{ 
              background: 'white', 
              padding: '15px', 
              borderRadius: '10px', 
              border: '1px solid #dc3545',
              marginTop: '20px'
            }}>
              <h3 style={{ 
                color: '#dc3545', 
                margin: '0 0 15px 0',
                fontSize: '1.3em'
              }}>
                Optional Deductions
              </h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                {/* Income Tax - User enters amount directly */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      color: '#dc3545', 
                      fontWeight: 'bold',
                      flex: 1
                    }}
                  >
                    Income Tax
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.incomeTax || 0}
                    onChange={(e) => handleInputChange('incomeTax', e.target.value)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    style={{ 
                      flex: 1,
                      borderColor: '#dc3545',
                      padding: '8px'
                    }}
                  />
                </div>
                
                {/* Festival Advance - Checkbox to enable/disable, fixed at ₹1250 */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="festivalAdvancesCheckbox"
                    checked={formData.festivalAdvances !== undefined && formData.festivalAdvances !== 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('festivalAdvances', 1250); // Fixed amount
                      } else {
                        handleInputChange('festivalAdvances', 0);
                      }
                    }}
                    style={{ 
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <label 
                    htmlFor="festivalAdvancesCheckbox"
                    style={{ 
                      color: '#dc3545', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Festival Advance (Fixed ₹1250)
                  </label>
                  {formData.festivalAdvances !== undefined && formData.festivalAdvances !== 0 && (
                    <input
                      type="text"
                      className="form-input"
                      value="₹1250"
                      readOnly
                      style={{ 
                        flex: 1,
                        borderColor: '#dc3545',
                        padding: '8px',
                        background: '#f8f9fa'
                      }}
                    />
                  )}
                </div>
                
                {/* Other Recovery - User enters amount directly */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      color: '#dc3545', 
                      fontWeight: 'bold',
                      flex: 1
                    }}
                  >
                    Other Recovery
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.otherRecovery || 0}
                    onChange={(e) => handleInputChange('otherRecovery', e.target.value)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    style={{ 
                      flex: 1,
                      borderColor: '#dc3545',
                      padding: '8px'
                    }}
                  />
                </div>
                
                {/* Other Advances - User enters amount directly */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      color: '#dc3545', 
                      fontWeight: 'bold',
                      flex: 1
                    }}
                  >
                    Other Advances
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.otherAdvances || 0}
                    onChange={(e) => handleInputChange('otherAdvances', e.target.value)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    style={{ 
                      flex: 1,
                      borderColor: '#dc3545',
                      padding: '8px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ 
                fontSize: '0.85em', 
                color: '#666', 
                marginTop: '10px',
                fontStyle: 'italic'
              }}>
                💡 Enter amounts for deductions. Festival Advance is fixed at ₹1250 when enabled.
              </div>
            </div>
            
            {/* GPF Specific Deductions - Only shown for GPF employees */}
            {formData.employeeType === 'GPF' && (
              <div style={{ 
                background: 'white', 
                padding: '15px', 
                borderRadius: '10px', 
                border: '1px solid #007bff',
                marginTop: '20px'
              }}>
                <h3 style={{ 
                  color: '#007bff', 
                  margin: '0 0 15px 0',
                  fontSize: '1.3em'
                }}>
                  GPF Deductions
                </h3>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {/* GPF Subscription - User enters amount directly */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label 
                      style={{ 
                        color: '#007bff', 
                        fontWeight: 'bold',
                        flex: 1
                      }}
                    >
                      GPF Subscription
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.gpfSubscription || 0}
                      onChange={(e) => handleInputChange('gpfSubscription', e.target.value)}
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                      style={{ 
                        flex: 1,
                        borderColor: '#007bff',
                        padding: '8px'
                      }}
                    />
                  </div>
                  
                  {/* GPF Advances EMI - User enters amount directly */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label 
                      style={{ 
                        color: '#007bff', 
                        fontWeight: 'bold',
                        flex: 1
                      }}
                    >
                      GPF Advances EMI
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.gpfRecovery || 0}
                      onChange={(e) => handleInputChange('gpfRecovery', e.target.value)}
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                      style={{ 
                        flex: 1,
                        borderColor: '#007bff',
                        padding: '8px'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '0.85em', 
                  color: '#666', 
                  marginTop: '10px',
                  fontStyle: 'italic'
                }}>
                  💡 Enter amounts for GPF deductions.
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            style={{ 
              padding: '15px 40px',
              fontSize: '1.3em',
              minWidth: '250px'
            }}
          >
            Generate Payslip
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/employee-type')}
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
              ← Back to Employee Type
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;