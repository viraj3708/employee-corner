import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function PensionCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    basicPay: '',
    dateOfBirth: '',
    dateOfJoining: '',
    totalEarnedLeave: '',
    daRate: 55, // Auto-populate with current DA rate
    retirementDate: '' // User input for retirement date
  });
  
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // DA Rate table based on retirement date (simplified version)
  const getDARate = (retirementDate) => {
    const year = new Date(retirementDate).getFullYear();
    // Simplified DA rate logic - you can expand this based on actual government rates
    if (year >= 2025) return 55; // Current rate for Maharashtra
    if (year >= 2024) return 52;
    if (year >= 2023) return 50;
    return 48; // Default for older dates
  };

  // CVP (Commutation Value of Pension) table based on age
  const getCVPRate = (ageAtRetirement) => {
    const cvpTable = {
      58: 8.194, 59: 8.371, 60: 8.543, 61: 8.711, 62: 8.874,
      63: 9.032, 64: 9.186, 65: 9.335, 66: 9.480, 67: 9.621,
      68: 9.757, 69: 9.890, 70: 10.019
    };
    return cvpTable[Math.floor(ageAtRetirement)] || 8.543; // Default to age 60 rate
  };

  // Function to get current DA rate (you can update this with actual current rate)
  const getCurrentDARate = () => {
    // Current DA rate for Maharashtra as of 2024
    return 55; // Current DA rate percentage for Maharashtra
  };

  // Function to download results as PDF
  const downloadPDF = async () => {
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up styling for single page fit
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15; // Start higher to use more space
      
      // Title (smaller font to save space)
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 50, 0); // Dark brown
      pdf.text('PENSION CALCULATION REPORT', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      
      // Generated date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 10;
      
      // Employee Details Section (reduced spacing)
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(102, 118, 234); // Blue
      pdf.text('👤 Employee Details', 15, yPosition);
      yPosition += 5;
      
      pdf.setLineWidth(0.1);
      pdf.setDrawColor(102, 118, 234);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 3;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Employee details in compact table format
      const employeeDetails = [
        ['Name:', result.personalDetails.name],
        ['DOB:', formatDate(result.personalDetails.dateOfBirth)],
        ['DOJ:', formatDate(result.personalDetails.dateOfJoining)],
        ['DOR:', formatDate(result.personalDetails.dateOfRetirement)],
        ['Service:', result.personalDetails.serviceLength],
        ['Age:', `${result.personalDetails.ageAtRetirement}y`],
        ['Basic Pay:', formatCurrency(result.personalDetails.basicPay)],
        ['DA Rate:', `${result.personalDetails.daRate}%`],
        ['Leave:', `${result.personalDetails.totalEarnedLeave}d`]
      ];
      
      employeeDetails.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, 18, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, 45, yPosition);
        yPosition += 5;
      });
      
      yPosition += 2;
      
      // Pension Details Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 167, 69); // Green
      pdf.text('💰 Pension Details', 15, yPosition);
      yPosition += 5;
      
      pdf.setLineWidth(0.1);
      pdf.setDrawColor(40, 167, 69);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 3;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Pension details (compact)
      pdf.text(`Basic Pension: ${formatCurrency(result.pension.basicPension)}`, 18, yPosition);
      yPosition += 4;
      pdf.text(`Commuted Pension: ${formatCurrency(result.pension.commutedPension)}`, 18, yPosition);
      yPosition += 4;
      pdf.text(`Commuted Value: ${formatCurrency(result.pension.commutedValue)}`, 18, yPosition);
      yPosition += 4;
      pdf.text(`Reduced Pension: ${formatCurrency(result.pension.reducedPension)}`, 18, yPosition);
      yPosition += 4;
      pdf.text(`DA on Pension: ${formatCurrency(result.pension.daOnPension)}`, 18, yPosition);
      yPosition += 5;
      
      // Net Pension (highlighted)
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 167, 69);
      pdf.text(`Net Monthly Pension: ${formatCurrency(result.pension.netPension)}`, 18, yPosition);
      yPosition += 7;
      
      // Gratuity Details Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 193, 7); // Orange
      pdf.text('🎁 Gratuity Details', 15, yPosition);
      yPosition += 5;
      
      pdf.setLineWidth(0.1);
      pdf.setDrawColor(255, 193, 7);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 3;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      // Gratuity calculation (very compact)
      pdf.setFont('helvetica', 'bold');
      pdf.text('Formula:', 18, yPosition);
      yPosition += 4;
      pdf.setFont('helvetica', 'normal');
      pdf.text('(Pay)×1/4×6-mo periods', 22, yPosition);
      yPosition += 5;
      
      // Gratuity results
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Calculated: ${formatCurrency(result.gratuity.gratuity)}`, 18, yPosition);
      yPosition += 4;
      
      if (result.gratuity.isLimited) {
        pdf.setTextColor(220, 53, 69); // Red
        pdf.text('* Limited to ₹20,00,000', 18, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 4;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 193, 7);
      pdf.text(`Net Gratuity: ${formatCurrency(result.gratuity.netGratuity)}`, 18, yPosition);
      yPosition += 7;
      
      // Family Pension Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(233, 30, 99); // Pink
      pdf.text('👨‍👩‍👧‍👦 Family Pension', 15, yPosition);
      yPosition += 5;
      
      pdf.setLineWidth(0.1);
      pdf.setDrawColor(233, 30, 99);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 3;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text(`Family Pension: ${formatCurrency(result.familyPension.familyPension)}`, 18, yPosition);
      yPosition += 4;
      pdf.text(`DA on Family Pension: ${formatCurrency(result.familyPension.daOnFamilyPension)}`, 18, yPosition);
      yPosition += 5;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(233, 30, 99);
      pdf.text(`Net Family Pension: ${formatCurrency(result.familyPension.netFamilyPension)}`, 18, yPosition);
      yPosition += 7;
      
      // Leave Encashment Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 53, 69); // Red
      pdf.text('🏖️ Leave Encashment', 15, yPosition);
      yPosition += 5;
      
      pdf.setLineWidth(0.1);
      pdf.setDrawColor(220, 53, 69);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 3;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text(`Leave (${result.personalDetails.totalEarnedLeave}d): ${formatCurrency(result.leaveEncashment)}`, 18, yPosition);
      yPosition += 7;
      
      // Final Summary Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(111, 66, 193); // Purple
      pdf.text('📊 Retirement Benefits Summary', 15, yPosition);
      yPosition += 5;
      
      pdf.setLineWidth(0.2);
      pdf.setDrawColor(111, 66, 193);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 4;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Summary items (compact)
      pdf.text(`Monthly Pension: ${formatCurrency(result.summary.pensionInHand)}`, 18, yPosition);
      yPosition += 5;
      pdf.text(`Family Pension: ${formatCurrency(result.summary.familyPensionInHand)}`, 18, yPosition);
      yPosition += 5;
      pdf.text(`Leave Encashment: ${formatCurrency(result.summary.leaveEncashment)}`, 18, yPosition);
      yPosition += 5;
      pdf.text(`Commuted Value: ${formatCurrency(result.summary.commutedValue)}`, 18, yPosition);
      yPosition += 5;
      pdf.text(`Retirement Gratuity: ${formatCurrency(result.summary.retirementGratuity)}`, 18, yPosition);
      yPosition += 7;
      
      // Total Amount (highlighted)
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(111, 66, 193);
      pdf.text(`Total Amount: ${formatCurrency(result.summary.finalTotal)}`, 18, yPosition);
      
      // Add footer (smaller)
      yPosition = pageHeight - 8;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(150, 150, 150);
      pdf.text('Computer-generated pension calculation report', pageWidth / 2, yPosition, { align: 'center' });
      
      // Download PDF
      const fileName = `Pension_Calculation_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const calculateAge = (birthDate, targetDate) => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    let age = target.getFullYear() - birth.getFullYear();
    const monthDiff = target.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateYearsMonthsDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.basicPay || formData.basicPay <= 0) {
      newErrors.basicPay = 'Basic Pay is required and must be greater than 0';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }
    
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of Joining is required';
    }
    
    if (!formData.totalEarnedLeave || formData.totalEarnedLeave < 0) {
      newErrors.totalEarnedLeave = 'Total Earned Leave is required and must be 0 or greater';
    }
    
    if (!formData.daRate || formData.daRate < 0) {
      newErrors.daRate = 'DA Rate is required and must be 0 or greater';
    }
    
    if (!formData.retirementDate) {
      newErrors.retirementDate = 'Retirement Date is required';
    }
    
    // Validate dates
    if (formData.dateOfBirth && formData.dateOfJoining) {
      const birthDate = new Date(formData.dateOfBirth);
      const joiningDate = new Date(formData.dateOfJoining);
      
      if (joiningDate <= birthDate) {
        newErrors.dateOfJoining = 'Date of Joining must be after Date of Birth';
      }
      
      const ageAtJoining = calculateAge(formData.dateOfBirth, formData.dateOfJoining);
      if (ageAtJoining < 18) {
        newErrors.dateOfJoining = 'Age at joining must be at least 18 years';
      }
    }

    // Validate retirement date
    if (formData.retirementDate && formData.dateOfJoining) {
      const retirementDate = new Date(formData.retirementDate);
      const joiningDate = new Date(formData.dateOfJoining);
      
      if (retirementDate <= joiningDate) {
        newErrors.retirementDate = 'Retirement Date must be after Date of Joining';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePension = () => {
    if (!validateForm()) return;
    
    const basicPay = parseFloat(formData.basicPay);
    const totalEarnedLeave = parseInt(formData.totalEarnedLeave);
    
    // Use user-input retirement date
    const retirementDate = new Date(formData.retirementDate);
    
    // Calculate length of service
    const serviceLength = calculateYearsMonthsDays(formData.dateOfJoining, retirementDate);
    const totalServiceYears = serviceLength.years + (serviceLength.months / 12);
    
    // Get DA rate and CVP rate
    const daRate = parseFloat(formData.daRate) || getDARate(retirementDate);
    const ageAtRetirement = calculateAge(formData.dateOfBirth, retirementDate);
    const cvpRate = getCVPRate(ageAtRetirement);
    
    // Pension Calculations
    const basicPension = Math.round(basicPay * 0.5); // 50% of last basic pay
    const commutedPension = Math.round(basicPension * 0.4); // 40% of basic pension
    const commutedValue = Math.round(commutedPension * 12 * cvpRate);
    const reducedPension = basicPension - commutedPension;
    const daOnPension = Math.round((daRate / 100) * basicPension);
    const netPension = reducedPension + daOnPension;
    
    // Family Pension Calculation (30% of basic pension)
    const familyPension = Math.round(basicPension * 0.3);
    const daOnFamilyPension = Math.round((daRate / 100) * familyPension);
    const netFamilyPension = familyPension + daOnFamilyPension;
    
    // Gratuity Calculation - Updated Government Formula
    // Formula: (Last Basic Pay) × 1/4 × Completed 6-monthly periods of service
    // Maximum limit: ₹20,00,000 (Central Govt.; Maharashtra follows similar ceiling)
    const da = Math.round((daRate / 100) * basicPay);
    // Modified to exclude DA from gratuity calculation as per user request
    const emoluments = basicPay; // Only Last Basic Pay (DA excluded)
    
    // Calculate completed 6-monthly periods 
    // As per user requirement: if months >= 3, count as complete 6-monthly period
    // For example: 6 years, 2 months = 12 periods (2 months < 3, so no additional period)
    //              6 years, 3 months = 13 periods (3 months >= 3, so one additional period)
    //              6 years, 4 months = 13 periods (4 months >= 3, so one additional period)
    const completed6MonthlyPeriods = (serviceLength.years * 2) + (serviceLength.months >= 3 ? 1 : 0);
    
    // Using the modified formula: (Last Basic Pay) × 1/4 × Completed 6-monthly periods
    const gratuityCalculated = emoluments * 0.25 * completed6MonthlyPeriods;
    const gratuity = Math.round(gratuityCalculated);
    
    // Alternative simplified formula: Last Basic Pay × Completed Years × 14
    // (commonly used: "14" comes from ½ month salary × 12 months ÷ average 30 days ≈ 15 days pay = 14 days of Basic)
    // const gratuitySimplified = Math.round(basicPay * Math.round(totalServiceYears) * 14);
    
    const maxGratuityLimit = 2000000; // Current govt. limit ₹20 lakhs
    const netGratuity = Math.min(gratuity, maxGratuityLimit);
    
    // Leave Encashment Calculation
    const leaveEncashment = Math.round(((basicPay + da) / 30) * totalEarnedLeave);
    
    // Final Total
    const finalTotal = netPension + leaveEncashment + commutedValue + netGratuity + netFamilyPension;
    
    const calculationResult = {
      personalDetails: {
        name: formData.name,
        basicPay,
        dateOfBirth: formData.dateOfBirth,
        dateOfJoining: formData.dateOfJoining,
        dateOfRetirement: retirementDate.toISOString().split('T')[0],
        serviceLength: `${serviceLength.years} years, ${serviceLength.months} months, ${serviceLength.days} days`,
        totalEarnedLeave,
        ageAtRetirement,
        daRate,
        cvpRate
      },
      pension: {
        basicPension,
        commutedPension,
        commutedValue,
        reducedPension,
        daOnPension,
        netPension
      },
      familyPension: {
        familyPension,
        daOnFamilyPension,
        netFamilyPension
      },
      gratuity: {
        gratuity,
        netGratuity,
        isLimited: gratuity > maxGratuityLimit,
        emoluments,
        sixMonthlyPeriods: completed6MonthlyPeriods,
        da
      },
      leaveEncashment,
      summary: {
        pensionInHand: netPension,
        familyPensionInHand: netFamilyPension,
        leaveEncashment,
        commutedValue,
        retirementGratuity: netGratuity,
        finalTotal
      }
    };
    
    setResult(calculationResult);
  };

  const formatCurrency = (amount) => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            background: 'linear-gradient(45deg, #ffc107, #ff8f00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            🏦 Pension Calculator
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Calculate retirement benefits and pension details
          </p>
        </div>

        {!result ? (
          <>
            {/* Input Form */}
            <div style={{ 
              background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              border: '2px solid #ffc107'
            }}>
              <h2 style={{ 
                color: '#ffc107', 
                textAlign: 'center', 
                marginBottom: '25px',
                fontSize: '1.8em',
                fontWeight: 'bold'
              }}>
                📝 Employee Details
              </h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    Employee Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    style={{ borderColor: '#ffc107' }}
                  />
                  {errors.name && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    Basic Pay (Last Month Salary) (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.basicPay}
                    onChange={(e) => handleInputChange('basicPay', e.target.value)}
                    placeholder="Enter basic pay amount"
                    min="0"
                    step="1"
                    style={{ borderColor: '#ffc107' }}
                  />
                  {errors.basicPay && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      {errors.basicPay}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    style={{ borderColor: '#ffc107' }}
                  />
                  {errors.dateOfBirth && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      {errors.dateOfBirth}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    style={{ borderColor: '#ffc107' }}
                  />
                  {errors.dateOfJoining && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      {errors.dateOfJoining}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    Total Earned Leave (Days)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalEarnedLeave}
                    onChange={(e) => handleInputChange('totalEarnedLeave', e.target.value)}
                    placeholder="Enter total earned leave days"
                    min="0"
                    step="1"
                    style={{ borderColor: '#ffc107' }}
                  />
                  {errors.totalEarnedLeave && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      {errors.totalEarnedLeave}
                    </div>
                  )}
                </div>

                {/* User Input Retirement Date Tab - Manual Only */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    📅 Retirement Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.retirementDate}
                    onChange={(e) => handleInputChange('retirementDate', e.target.value)}
                    placeholder="Select your retirement date"
                    style={{ 
                      borderColor: '#ffc107'
                    }}
                  />
                  <div style={{
                    fontSize: '0.85em',
                    color: '#666',
                    marginTop: '5px',
                    fontStyle: 'italic'
                  }}>
                    🎯 Please enter your planned retirement date
                  </div>
                  {errors.retirementDate && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      {errors.retirementDate}
                    </div>
                  )}
                </div>

                {/* Enhanced DA Rate Tab */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    DA Rate (%)
                  </label>
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
                      style={{ borderColor: '#ffc107', paddingRight: '100px' }}
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
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn btn-primary"
                onClick={calculatePension}
                style={{ 
                  padding: '15px 40px',
                  fontSize: '1.3em',
                  minWidth: '300px',
                  background: 'linear-gradient(45deg, #ffc107, #ff8f00)',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🧮 Calculate Pension
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
                  ← Back to Menu
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results Display - Compact 2-Column Tile Layout */}
            <div style={{ marginTop: '20px' }}>
              {/* Header with key information */}
              <div style={{ 
                background: 'linear-gradient(135deg, #6f42c1, #5a32a3)',
                color: 'white',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8em' }}>
                  📊 Pension Calculation Results
                </h2>
                <p style={{ margin: '0', fontSize: '1.2em', fontWeight: 'bold' }}>
                  {result.personalDetails.name} • Total: {formatCurrency(result.summary.finalTotal)}
                </p>
              </div>
              
              {/* 2-Column Tile Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                {/* Employee Details Tile */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #e8f4f8, #f0f8ff)',
                  borderRadius: '12px',
                  padding: '15px',
                  border: '2px solid #667eea',
                  minHeight: '180px'
                }}>
                  <h3 style={{ color: '#667eea', margin: '0 0 12px 0', fontSize: '1.2em' }}>
                    👤 Employee Details
                  </h3>
                  <div style={{ fontSize: '0.9em', display: 'grid', gap: '6px' }}>
                    <div><strong>Name:</strong> {result.personalDetails.name}</div>
                    <div><strong>DOB:</strong> {formatDate(result.personalDetails.dateOfBirth)}</div>
                    <div><strong>DOJ:</strong> {formatDate(result.personalDetails.dateOfJoining)}</div>
                    <div><strong>Retirement:</strong> {formatDate(result.personalDetails.dateOfRetirement)}</div>
                    <div><strong>Service:</strong> {result.personalDetails.serviceLength}</div>
                    <div><strong>Age:</strong> {result.personalDetails.ageAtRetirement} years</div>
                  </div>
                </div>
                
                {/* Financial Summary Tile */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                  borderRadius: '12px',
                  padding: '15px',
                  border: '2px solid #ffc107',
                  minHeight: '180px'
                }}>
                  <h3 style={{ color: '#ffc107', margin: '0 0 12px 0', fontSize: '1.2em' }}>
                    💰 Financial Summary
                  </h3>
                  <div style={{ fontSize: '0.9em', display: 'grid', gap: '6px' }}>
                    <div><strong>Basic Pay:</strong> {formatCurrency(result.personalDetails.basicPay)}</div>
                    <div><strong>DA Rate:</strong> {result.personalDetails.daRate}%</div>
                    <div><strong>Leave Days:</strong> {result.personalDetails.totalEarnedLeave}</div>
                    <div><strong>Gratuity:</strong> {formatCurrency(result.gratuity.netGratuity)}</div>
                    <div><strong>Family Pension:</strong> {formatCurrency(result.summary.familyPensionInHand)}</div>
                    <div><strong>Leave Encashment:</strong> {formatCurrency(result.leaveEncashment)}</div>
                    <div><strong>Commuted Value:</strong> {formatCurrency(result.summary.commutedValue)}</div>
                  </div>
                </div>
                
                {/* Pension Details Tile */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)',
                  borderRadius: '12px',
                  padding: '15px',
                  border: '2px solid #28a745',
                  minHeight: '180px'
                }}>
                  <h3 style={{ color: '#28a745', margin: '0 0 12px 0', fontSize: '1.2em' }}>
                    💰 Pension Details
                  </h3>
                  <div style={{ fontSize: '0.9em', display: 'grid', gap: '6px' }}>
                    <div><strong>Basic Pension:</strong> {formatCurrency(result.pension.basicPension)}</div>
                    <div><strong>Commuted:</strong> {formatCurrency(result.pension.commutedPension)}</div>
                    <div><strong>Reduced:</strong> {formatCurrency(result.pension.reducedPension)}</div>
                    <div><strong>DA on Pension:</strong> {formatCurrency(result.pension.daOnPension)}</div>
                    <div style={{ fontWeight: 'bold', borderTop: '1px solid #e0e0e0', paddingTop: '6px' }}>
                      <strong>Net Monthly:</strong> {formatCurrency(result.pension.netPension)}
                    </div>
                  </div>
                </div>
                
                {/* Final Summary Tile */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #ffe8e8, #fff0f0)',
                  borderRadius: '12px',
                  padding: '15px',
                  border: '2px solid #dc3545',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <h3 style={{ color: '#dc3545', margin: '0 0 12px 0', fontSize: '1.2em', textAlign: 'center' }}>
                    📊 Final Amount
                  </h3>
                  <div style={{ fontSize: '1.1em', textAlign: 'center', fontWeight: 'bold' }}>
                    <div style={{ marginBottom: '8px' }}>Total in Hand:</div>
                    <div style={{ fontSize: '1.4em', color: '#dc3545' }}>
                      {formatCurrency(result.summary.finalTotal)}
                    </div>
                    <div style={{ fontSize: '0.9em', marginTop: '8px', color: '#666' }}>
                      (Includes Family Pension: {formatCurrency(result.summary.familyPensionInHand)})
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gratuity Calculation Details (smaller tile) */}
              <div style={{ 
                background: 'linear-gradient(135deg, #d1ecf1, #bee5eb)',
                borderRadius: '12px',
                padding: '15px',
                border: '2px solid #17a2b8',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#17a2b8', margin: '0 0 10px 0', fontSize: '1.2em' }}>
                  🎁 Gratuity Calculation
                </h3>
                <div style={{ fontSize: '0.85em', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><strong>Formula:</strong> (Pay) × 1/4 × 6-mo periods</div>
                  <div><strong>Basic Pay:</strong> {formatCurrency(result.gratuity.emoluments)}</div>
                  <div><strong>Periods:</strong> {result.gratuity.sixMonthlyPeriods}</div>
                  <div><strong>Calculated:</strong> {formatCurrency(result.gratuity.gratuity)}</div>
                  <div><strong>Limit:</strong> ₹20,00,000</div>
                  <div style={{ fontWeight: 'bold' }}><strong>Net:</strong> {formatCurrency(result.gratuity.netGratuity)}</div>
                </div>
              </div>
              
              {/* Family Pension Details Tile */}
              <div style={{ 
                background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
                borderRadius: '12px',
                padding: '15px',
                border: '2px solid #e91e63',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#e91e63', margin: '0 0 12px 0', fontSize: '1.2em' }}>
                  👨‍👩‍👧‍👦 Family Pension Details
                </h3>
                <div style={{ fontSize: '0.9em', display: 'grid', gap: '6px' }}>
                  <div><strong>Family Pension:</strong> {formatCurrency(result.familyPension.familyPension)}</div>
                  <div><strong>DA on Family Pension:</strong> {formatCurrency(result.familyPension.daOnFamilyPension)}</div>
                  <div style={{ fontWeight: 'bold', borderTop: '1px solid #e0e0e0', paddingTop: '6px' }}>
                    <strong>Net Family Pension:</strong> {formatCurrency(result.familyPension.netFamilyPension)}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginTop: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setResult(null)}
                  style={{ minWidth: '150px' }}
                >
                  Calculate Again
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={downloadPDF}
                  style={{ 
                    minWidth: '150px',
                    background: 'linear-gradient(45deg, #ffc107, #ff8f00)',
                    border: 'none'
                  }}
                >
                  Download PDF
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/main-menu')}
                  style={{ minWidth: '150px' }}
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PensionCalculator;