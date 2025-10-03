import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form16Calculator() {
  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    employer: '',
    financialYear: '2023-2024',
    monthlySalary: 0,
    otherIncome: 0,
    hraExemption: 0,
    ltaExemption: 0,
    standardDeduction: 50000, // Fixed for FY 2023-24
    professionalTax: 0,
    providentFund: 0,
    ppf: 0,
    lifeInsurance: 0,
    tuitionFees: 0,
    homeLoanInterest: 0,
    medicalInsurance: 0,
    donation80G: 0,
    employeeType: 'GPF' // Default to GPF, can be NPS
    // Additional fields for automatic calculation
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'name' || field === 'pan' || field === 'employer' || field === 'financialYear' || field === 'employeeType'
        ? value 
        : parseFloat(value) || 0
    }));
    
    // Auto-calculate based on monthly salary when it changes
    if (field === 'monthlySalary') {
      const monthlyValue = parseFloat(value) || 0;
      // Auto-calculate annual values (12 months)
      setFormData(prev => ({
        ...prev,
        grossSalary: monthlyValue * 12
      }));
    }
  };

  const calculateTax = () => {
    // Gross Salary is automatically calculated from monthly salary
    const grossSalary = formData.monthlySalary * 12;
    const grossTotalIncome = grossSalary + formData.otherIncome;
    
    // Exemptions
    const totalExemptions = formData.hraExemption + formData.ltaExemption;
    
    // Income after exemptions
    const incomeAfterExemptions = grossTotalIncome - totalExemptions;
    
    // Deductions under Chapter VI-A
    // For NPS, employee contribution up to 10% of salary qualifies for additional deduction under 80CCD(2)
    let npsContribution = 0;
    if (formData.employeeType === 'NPS') {
      // Assuming 10% of basic salary for NPS (typical employer contribution)
      npsContribution = formData.monthlySalary * 0.10 * 12;
    }
    
    const deduction80C = Math.min(
      formData.providentFund + formData.ppf + formData.lifeInsurance + formData.tuitionFees + npsContribution,
      150000 // Maximum limit for 80C
    );
    
    // Additional deduction for NPS under 80CCD(1B) - up to ₹50,000
    let deduction80CCD1B = 0;
    if (formData.employeeType === 'NPS') {
      deduction80CCD1B = Math.min(npsContribution, 50000);
    }
    
    const deduction80D = Math.min(
      formData.medicalInsurance,
      25000 // Maximum limit for 80D (self + parents < 60 years)
    );
    
    const deduction80G = formData.donation80G; // No limit specified
    
    const deduction24 = Math.min(
      formData.homeLoanInterest,
      200000 // Maximum limit for home loan interest
    );
    
    const totalDeductions = 
      formData.standardDeduction + 
      deduction80C + 
      deduction80D + 
      deduction80G + 
      deduction24 +
      deduction80CCD1B +
      formData.professionalTax;
    
    // Total taxable income
    const taxableIncome = Math.max(0, incomeAfterExemptions - totalDeductions);
    
    // Tax calculation based on FY 2023-24 slab rates
    let tax = 0;
    let income = taxableIncome;
    
    if (income > 1500000) {
      tax += (income - 1500000) * 0.30;
      income = 1500000;
    }
    if (income > 1250000) {
      tax += (income - 1250000) * 0.25;
      income = 1250000;
    }
    if (income > 1000000) {
      tax += (income - 1000000) * 0.20;
      income = 1000000;
    }
    if (income > 750000) {
      tax += (income - 750000) * 0.15;
      income = 750000;
    }
    if (income > 500000) {
      tax += (income - 500000) * 0.10;
      income = 500000;
    }
    if (income > 250000) {
      tax += (income - 250000) * 0.05;
    }
    
    // Health and education cess (4%)
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    
    // Round to nearest rupee
    const finalTax = Math.round(totalTax);
    
    setResult({
      grossSalary,
      grossTotalIncome,
      totalExemptions,
      incomeAfterExemptions,
      totalDeductions,
      taxableIncome,
      taxBeforeCess: Math.round(tax),
      cess: Math.round(cess),
      totalTax: finalTax,
      deduction80C,
      deduction80D,
      deduction80G,
      deduction24,
      deduction80CCD1B,
      npsContribution
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
      name: '',
      pan: '',
      employer: '',
      financialYear: '2023-2024',
      monthlySalary: 0,
      otherIncome: 0,
      hraExemption: 0,
      ltaExemption: 0,
      standardDeduction: 50000,
      professionalTax: 0,
      providentFund: 0,
      ppf: 0,
      lifeInsurance: 0,
      tuitionFees: 0,
      homeLoanInterest: 0,
      medicalInsurance: 0,
      donation80G: 0,
      employeeType: 'GPF'
    });
    setResult(null);
  };

  const downloadPDF = () => {
    if (!result) return;
    
    // Create a simple text-based PDF content
    const pdfContent = `
FORM 16 - TAX CALCULATION STATEMENT
-----------------------------------
Financial Year: ${formData.financialYear}
Name: ${formData.name || 'Not provided'}
PAN: ${formData.pan || 'Not provided'}
Employer: ${formData.employer || 'Not provided'}
Employee Type: ${formData.employeeType}

INCOME DETAILS
==============
Monthly Salary: ${formatCurrency(formData.monthlySalary)}
Gross Salary (Annual): ${formatCurrency(result.grossSalary)}
Other Income: ${formatCurrency(formData.otherIncome)}
Gross Total Income: ${formatCurrency(result.grossTotalIncome)}

EXEMPTIONS
==========
HRA Exemption: ${formatCurrency(formData.hraExemption)}
LTA Exemption: ${formatCurrency(formData.ltaExemption)}
Total Exemptions: ${formatCurrency(result.totalExemptions)}

INCOME AFTER EXEMPTIONS
=======================
Income After Exemptions: ${formatCurrency(result.incomeAfterExemptions)}

DEDUCTIONS
==========
Standard Deduction: ${formatCurrency(formData.standardDeduction)}
Section 80C (PF + PPF + Insurance + Tuition ${formData.employeeType === 'NPS' ? '+ NPS' : ''}): ${formatCurrency(result.deduction80C)}
${formData.employeeType === 'NPS' ? `Section 80CCD(1B) (Additional NPS): ${formatCurrency(result.deduction80CCD1B)}\n` : ''}
Section 80D (Medical Insurance): ${formatCurrency(result.deduction80D)}
Section 80G (Donations): ${formatCurrency(result.deduction80G)}
Section 24 (Home Loan Interest): ${formatCurrency(result.deduction24)}
Professional Tax: ${formatCurrency(formData.professionalTax)}
Total Deductions: ${formatCurrency(result.totalDeductions)}

TAXABLE INCOME
==============
Taxable Income: ${formatCurrency(result.taxableIncome)}

TAX CALCULATION
===============
Tax Before Cess: ${formatCurrency(result.taxBeforeCess)}
Health & Education Cess (4%): ${formatCurrency(result.cess)}
Total Tax Payable: ${formatCurrency(result.totalTax)}

NOTE: This is an estimated calculation for reference only.
Actual Form 16 is issued by your employer.
Consult a tax professional for accurate tax planning.
    `;
    
    // Create a Blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Form16_${formData.financialYear.replace('-', '_')}_${formData.name || 'Taxpayer'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            📄 Form 16 Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Calculate your tax liability based on monthly salary
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
              Personal & Income Details
            </h2>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                style={{ borderColor: '#667eea' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                PAN Number
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.pan}
                onChange={(e) => handleInputChange('pan', e.target.value)}
                placeholder="Enter your PAN number"
                style={{ borderColor: '#667eea' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Employer Name
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.employer}
                onChange={(e) => handleInputChange('employer', e.target.value)}
                placeholder="Enter your employer name"
                style={{ borderColor: '#667eea' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Financial Year
              </label>
              <select
                className="form-select"
                value={formData.financialYear}
                onChange={(e) => handleInputChange('financialYear', e.target.value)}
                style={{ borderColor: '#667eea' }}
              >
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2021-2022">2021-2022</option>
              </select>
            </div>
            
            {/* Employee Type Selection */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Employee Type
              </label>
              <div style={{ 
                display: 'grid', 
                gap: '10px',
                gridTemplateColumns: '1fr 1fr'
              }}>
                <div 
                  onClick={() => handleInputChange('employeeType', 'GPF')}
                  style={{
                    background: formData.employeeType === 'GPF' 
                      ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' 
                      : 'white',
                    border: formData.employeeType === 'GPF' 
                      ? '2px solid #28a745' 
                      : '1px solid #dee2e6',
                    borderRadius: '10px',
                    padding: '15px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: formData.employeeType === 'GPF' 
                      ? '0 4px 10px rgba(40, 167, 69, 0.3)' 
                      : '0 2px 5px rgba(0, 0, 0, 0.1)',
                    transform: formData.employeeType === 'GPF' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ 
                    fontSize: '2em', 
                    marginBottom: '5px',
                    color: formData.employeeType === 'GPF' ? '#28a745' : '#6c757d'
                  }}>
                    🏦
                  </div>
                  <h4 style={{ 
                    color: formData.employeeType === 'GPF' ? '#28a745' : '#495057',
                    margin: '0',
                    fontWeight: 'bold'
                  }}>
                    GPF Employee
                  </h4>
                </div>
                
                <div 
                  onClick={() => handleInputChange('employeeType', 'NPS')}
                  style={{
                    background: formData.employeeType === 'NPS' 
                      ? 'linear-gradient(135deg, #e8f4f8, #f0f8ff)' 
                      : 'white',
                    border: formData.employeeType === 'NPS' 
                      ? '2px solid #667eea' 
                      : '1px solid #dee2e6',
                    borderRadius: '10px',
                    padding: '15px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: formData.employeeType === 'NPS' 
                      ? '0 4px 10px rgba(102, 126, 234, 0.3)' 
                      : '0 2px 5px rgba(0, 0, 0, 0.1)',
                    transform: formData.employeeType === 'NPS' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ 
                    fontSize: '2em', 
                    marginBottom: '5px',
                    color: formData.employeeType === 'NPS' ? '#667eea' : '#6c757d'
                  }}>
                    🏢
                  </div>
                  <h4 style={{ 
                    color: formData.employeeType === 'NPS' ? '#667eea' : '#495057',
                    margin: '0',
                    fontWeight: 'bold'
                  }}>
                    NPS Employee
                  </h4>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Monthly Salary (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.monthlySalary}
                onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                placeholder="Enter your monthly salary"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
              <div style={{ 
                fontSize: '0.9em',
                color: '#666',
                marginTop: '5px'
              }}>
                Annual Gross Salary: {formatCurrency(formData.monthlySalary * 12 || 0)}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                Other Income (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.otherIncome}
                onChange={(e) => handleInputChange('otherIncome', e.target.value)}
                placeholder="Enter other income (interest, rental, etc.)"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
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
              Exemptions
            </h3>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                HRA Exemption (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.hraExemption}
                onChange={(e) => handleInputChange('hraExemption', e.target.value)}
                placeholder="Enter HRA exemption amount"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#667eea', fontWeight: 'bold' }}>
                LTA Exemption (₹)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.ltaExemption}
                onChange={(e) => handleInputChange('ltaExemption', e.target.value)}
                placeholder="Enter LTA exemption amount"
                min="0"
                style={{ borderColor: '#667eea' }}
              />
            </div>
          </div>

          {/* Additional Input Section */}
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
                Deductions
              </h2>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Professional Tax (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.professionalTax}
                  onChange={(e) => handleInputChange('professionalTax', e.target.value)}
                  placeholder="Enter professional tax"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              {formData.employeeType === 'GPF' ? (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    Provident Fund (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.providentFund}
                    onChange={(e) => handleInputChange('providentFund', e.target.value)}
                    placeholder="Enter PF contribution"
                    min="0"
                    style={{ borderColor: '#ffc107' }}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    NPS Contribution (₹)
                  </label>
                  <div style={{ 
                    background: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #ffc107'
                  }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                      NPS contribution is automatically calculated as 10% of your monthly salary:
                    </p>
                    <div style={{ 
                      textAlign: 'center',
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                      color: '#667eea'
                    }}>
                      {formatCurrency(formData.monthlySalary * 0.10 * 12 || 0)} annually
                    </div>
                    <p style={{ 
                      margin: '10px 0 0 0', 
                      fontSize: '0.9em', 
                      color: '#666' 
                    }}>
                      This includes both your contribution and employer contribution
                    </p>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  PPF Contribution (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.ppf}
                  onChange={(e) => handleInputChange('ppf', e.target.value)}
                  placeholder="Enter PPF contribution"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Life Insurance Premium (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.lifeInsurance}
                  onChange={(e) => handleInputChange('lifeInsurance', e.target.value)}
                  placeholder="Enter life insurance premium"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Tuition Fees (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.tuitionFees}
                  onChange={(e) => handleInputChange('tuitionFees', e.target.value)}
                  placeholder="Enter tuition fees"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Home Loan Interest (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.homeLoanInterest}
                  onChange={(e) => handleInputChange('homeLoanInterest', e.target.value)}
                  placeholder="Enter home loan interest"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Medical Insurance (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.medicalInsurance}
                  onChange={(e) => handleInputChange('medicalInsurance', e.target.value)}
                  placeholder="Enter medical insurance premium"
                  min="0"
                  style={{ borderColor: '#ffc107' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                  Donation under 80G (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.donation80G}
                  onChange={(e) => handleInputChange('donation80G', e.target.value)}
                  placeholder="Enter donation amount"
                  min="0"
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
                  onClick={calculateTax}
                  style={{ 
                    flex: 1, 
                    padding: '12px 20px',
                    fontSize: '1.1em',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none'
                  }}
                >
                  Calculate Tax
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
                Tax Calculation Summary
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
                      <h3 style={{ margin: 0, fontSize: '1.5em' }}>Total Tax Payable</h3>
                      <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '10px' }}>
                        {formatCurrency(result.totalTax)}
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
                        <div style={{ color: '#667eea', fontWeight: 'bold' }}>Taxable Income</div>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                          {formatCurrency(result.taxableIncome)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: '#fff3cd',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: '#ffc107', fontWeight: 'bold' }}>Gross Income</div>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px' }}>
                          {formatCurrency(result.grossTotalIncome)}
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
                      Income Breakdown
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
                        <span>Monthly Salary</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(formData.monthlySalary)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Gross Salary (Annual)</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.grossSalary)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Other Income</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(formData.otherIncome)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Gross Total Income</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.grossTotalIncome)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Exemptions</span>
                        <span style={{ fontWeight: 'bold', color: '#28a745' }}>- {formatCurrency(result.totalExemptions)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderTop: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        fontSize: '1.1em'
                      }}>
                        <span>Total Taxable Income</span>
                        <span>{formatCurrency(result.taxableIncome)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tax Calculation */}
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
                      Tax Calculation
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
                        <span>Tax Before Cess</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.taxBeforeCess)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span>Health & Education Cess (4%)</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(result.cess)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderTop: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        fontSize: '1.1em'
                      }}>
                        <span>Total Tax Payable</span>
                        <span>{formatCurrency(result.totalTax)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={downloadPDF}
                      style={{ 
                        padding: '15px 30px',
                        fontSize: '1.2em',
                        background: 'linear-gradient(45deg, #28a745, #218838)',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    >
                      📥 Download Form 16 (PDF)
                    </button>
                    <p style={{ 
                      marginTop: '15px', 
                      fontSize: '0.9em', 
                      color: '#6c757d',
                      fontStyle: 'italic'
                    }}>
                      Note: This is a tax calculation estimate. Consult a tax professional for actual Form 16.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '4em', marginBottom: '20px' }}>🧾</div>
                  <h3 style={{ marginBottom: '10px' }}>Calculate Your Tax Liability</h3>
                  <p>Enter your monthly salary and other details to calculate your tax liability and generate Form 16.</p>
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
            💡 About Form 16
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '15px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            <div>
              <p><strong>What is Form 16?</strong></p>
              <p>Form 16 is a certificate issued by employers to employees that contains details of tax deducted at source (TDS) from the employee's salary income.</p>
            </div>
            <div>
              <p><strong>Key Components:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Part A: Contains employer and employee details, TDS details</li>
                <li>Part B: Detailed breakdown of salary, exemptions, deductions, and tax computation</li>
              </ul>
            </div>
            <div>
              <p><strong>Important Notes:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                <li>This calculator provides an estimate only</li>
                <li>Actual tax liability may vary based on specific circumstances</li>
                <li>Consult a tax professional for accurate tax planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form16Calculator;