// Payslip calculation utilities
import { getCityMetroStatus } from './cityData';

// Calculate DA (Dearness Allowance)
export const calculateDA = (basicSalary, daRate) => {
  return Math.round(basicSalary * (daRate / 100));
};

// Calculate HRA based on city category AND DA Rate conditions with minimum amounts
export const calculateHRA = (basicSalary, cityCategory, daRate) => {
  let hraRate;
  
  // Condition 1: If DA Rate < 25%
  if (daRate < 25) {
    const hraRates = {
      X: 0.24, // 24%
      Y: 0.16, // 16% 
      Z: 0.08  // 8%
    };
    hraRate = hraRates[cityCategory] || hraRates.Z;
  }
  // Condition 2: If DA Rate >= 25% AND < 50%
  else if (daRate >= 25 && daRate < 50) {
    const hraRates = {
      X: 0.27, // 27%
      Y: 0.18, // 18% 
      Z: 0.09  // 9%
    };
    hraRate = hraRates[cityCategory] || hraRates.Z;
  }
  // Condition 3: If DA Rate >= 50%
  else {
    const hraRates = {
      X: 0.30, // 30%
      Y: 0.20, // 20% 
      Z: 0.10  // 10%
    };
    hraRate = hraRates[cityCategory] || hraRates.Z;
  }
  
  // Calculate HRA based on percentage
  const calculatedHRA = Math.round(basicSalary * hraRate);
  
  // Define minimum HRA amounts for each city category
  const minimumHRA = {
    X: 5400, // ₹5,400 for X cities
    Y: 3600, // ₹3,600 for Y cities
    Z: 1800  // ₹1,800 for Z cities
  };
  
  const minHRA = minimumHRA[cityCategory] || minimumHRA.Z;
  
  // Return the higher of calculated HRA or minimum HRA
  return Math.max(calculatedHRA, minHRA);
};

// Calculate TA (Travel Allowance) based on salary bracket, handicap status, and metro/non-metro
export const calculateTA = (basicSalary, handicapStatus, cityName) => {
  const isMetro = getCityMetroStatus(cityName);
  
  // TA rates based on: [Regular Non-Metro, Regular Metro, Handicap Non-Metro, Handicap Metro]
  let taAmount;
  
  if (basicSalary < 24200) {
    // Salary bracket: < ₹24,200
    if (handicapStatus === 'Handicap') {
      taAmount = isMetro ? 2250 : 2250; // Both metro and non-metro same for handicap in this bracket
    } else {
      taAmount = isMetro ? 1000 : 675; // Regular employees
    }
  } else if (basicSalary < 56100) {
    // Salary bracket: ₹24,200 to < ₹56,100
    if (handicapStatus === 'Handicap') {
      taAmount = isMetro ? 5400 : 2700; // Handicap employees
    } else {
      taAmount = isMetro ? 2700 : 1350; // Regular employees
    }
  } else {
    // Salary bracket: ≥ ₹56,100
    if (handicapStatus === 'Handicap') {
      taAmount = isMetro ? 10800 : 5400; // Handicap employees
    } else {
      taAmount = isMetro ? 5400 : 2700; // Regular employees
    }
  }
  
  return taAmount;
};

// Calculate GIS (Group Insurance Scheme) based on class
export const calculateGIS = (employeeClass) => {
  const gisRates = {
    'Class 1': 960,
    'Class 2': 480,
    'Class 3': 360,
    'Class 4': 240
  };
  
  return gisRates[employeeClass] || 0;
};

// Calculate DCPS Deduction (10% of Basic + DA)
export const calculateDCPS = (basicSalary, da) => {
  return Math.round((basicSalary + da) * 0.10);
};

// Calculate total allowances
export const calculateTotalAllowances = (allowances) => {
  return Math.round(Object.values(allowances).reduce((total, amount) => total + (amount || 0), 0));
};

// Calculate total deductions
export const calculateTotalDeductions = (deductions) => {
  return Math.round(Object.values(deductions).reduce((total, amount) => total + (amount || 0), 0));
};

// Main payslip calculation function
export const calculatePayslip = (data) => {
  const {
    basicSalary,
    daRate,
    cityCategory,
    city,
    handicapStatus,
    employeeType,
    class: employeeClass,
    perTA,
    additionalAllowances = [],
    gpfSubscription,
    gpfRecovery,
    festivalAdvances,
    otherAdvances,
    otherRecovery,
    incomeTax
  } = data;

  // Calculate allowances
  const da = calculateDA(basicSalary, daRate);
  const hra = calculateHRA(basicSalary, cityCategory, daRate); // Pass daRate to HRA calculation
  const ta = calculateTA(basicSalary, handicapStatus, city); // Pass handicap status and city name

  // Calculate additional allowances total
  const additionalAllowancesTotal = additionalAllowances.reduce((total, allowance) => {
    // For NPA, ensure it's calculated as 35% of basic salary
    if (allowance.type === 'NPA') {
      return total + Math.round(basicSalary * 0.35);
    }
    return total + (parseFloat(allowance.amount) || 0);
  }, 0);

  const allowances = {
    basicSalary: basicSalary,
    da: da,
    hra: hra,
    ta: ta,
    perTA: perTA || 0,
    additionalAllowances: additionalAllowancesTotal
  };

  // Calculate deductions
  const professionalTax = 200; // Fixed
  const gis = calculateGIS(employeeClass);
  const revenueStamp = 1; // Fixed Revenue Stamp deduction
  
  // Only calculate DCPS for NPS employees, not for GPF employees
  const dcps = employeeType === 'NPS' ? calculateDCPS(basicSalary, da) : 0;

  const deductions = {
    professionalTax: professionalTax,
    gis: gis,
    dcps: dcps,
    revenueStamp: revenueStamp,
    gpfSubscription: gpfSubscription || 0,
    gpfRecovery: gpfRecovery || 0,
    festivalAdvances: festivalAdvances || 0,
    otherAdvances: otherAdvances || 0,
    otherRecovery: otherRecovery || 0,
    incomeTax: incomeTax || 0
  };

  const totalAllowances = calculateTotalAllowances(allowances);
  const totalDeductions = calculateTotalDeductions(deductions);
  const netSalary = Math.round(totalAllowances - totalDeductions);

  return {
    allowances,
    deductions,
    totalAllowances,
    totalDeductions,
    netSalary,
    additionalAllowances // Include the additional allowances details for display
  };
};