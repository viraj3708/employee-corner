import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
// Removed LoginScreen import
import MainMenuScreen from './components/MainMenuScreen';
import EmployeeTypeScreen from './components/EmployeeTypeScreen';
import HomeScreen from './components/HomeScreen';
import ResultScreen from './components/ResultScreen';
import PensionCalculator from './components/PensionCalculator';
import PayScaleViewer from './components/PayScaleViewer';
import PayScaleDetail from './components/PayScaleDetail';
import SIPCalculator from './components/SIPCalculator';
import Form16Calculator from './components/Form16Calculator';
import LoanCalculator from './components/LoanCalculator';
import LoanEligibilityCalculator from './components/LoanEligibilityCalculator';
import FDCalculator from './components/FDCalculator';
import CooperativeSocietiesCalculator from './components/CooperativeSocietiesCalculator';

function App() {
  const [payslipData, setPayslipData] = useState({
    employeeType: 'GPF', // Default to GPF
    handicapStatus: 'Regular', // Default to Regular as requested
    basicSalary: 0,
    daRate: 0,
    city: '',
    cityCategory: '',
    class: '',
    perTA: 0,
    additionalAllowances: [
      { id: 1, type: 'Permanent TA', amount: 0 },
      { id: 2, type: 'Washing allowance', amount: 0 }
    ],
    gpfSubscription: 0,
    gpfRecovery: 0,
    festivalAdvances: 0,
    otherAdvances: 0,
    otherRecovery: 0,
    incomeTax: 0
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenuScreen />} />
          <Route path="/main-menu" element={<MainMenuScreen />} />
          <Route path="/employee-type" element={<EmployeeTypeScreen />} />
          <Route 
            path="/home" 
            element={
              <HomeScreen 
                payslipData={payslipData} 
                setPayslipData={setPayslipData} 
              />
            } 
          />
          <Route 
            path="/result" 
            element={
              <ResultScreen 
                payslipData={payslipData} 
              />
            } 
          />
          <Route path="/pension-calculator" element={<PensionCalculator />} />
          <Route path="/pay-scale-viewer" element={<PayScaleViewer />} />
          <Route path="/pay-scale-detail" element={<PayScaleDetail />} />
          <Route path="/sip-calculator" element={<SIPCalculator />} />
          <Route path="/form-16" element={<Form16Calculator />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/loan-eligibility-calculator" element={<LoanEligibilityCalculator />} />
          <Route path="/fd-calculator" element={<FDCalculator />} />
          <Route path="/cooperative-societies-calculator" element={<CooperativeSocietiesCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;