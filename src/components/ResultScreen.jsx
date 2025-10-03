import { useNavigate } from 'react-router-dom';
import { calculatePayslip } from '../utils/calculations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ResultScreen({ payslipData }) {
  const navigate = useNavigate();
  
  if (!payslipData.basicSalary) {
    // Redirect to home if no data
    navigate('/home');
    return null;
  }

  const result = calculatePayslip(payslipData);
  const { allowances, deductions, totalAllowances, totalDeductions, netSalary, additionalAllowances } = result;

  const generatePDF = async () => {
    try {
      // Create a temporary div for PDF content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.background = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'monospace';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.color = 'black';
      
      const getCurrentDate = () => {
        const now = new Date();
        const month = now.toLocaleString('en-IN', { month: 'long' });
        const year = now.getFullYear();
        return `${month}-${year}`;
      };

      const formatCurrencyForPDF = (amount) => {
        return Math.round(amount).toLocaleString('en-IN');
      };

      tempDiv.innerHTML = `
        <div style="text-align: center; font-weight: bold; background: #f5f5f5; padding: 15px; border: 2px solid black; margin-bottom: 10px;">
          <div style="font-size: 16px; margin-bottom: 8px;">GOVERNMENT OF MAHARASHTRA</div>
          <div style="font-size: 14px;">PAYSLIP FOR THE MONTH OF ${getCurrentDate().toUpperCase()}</div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid black;">
          <tr>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; width: 25%; font-size: 11px;">Employee Name:</td>
            <td style="border: 1px solid black; padding: 8px; width: 25%; font-size: 11px;">[EMPLOYEE NAME]</td>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; width: 25%; font-size: 11px;">DDO CODE:</td>
            <td style="border: 1px solid black; padding: 8px; width: 25%; font-size: 11px;">[DDO CODE]</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; font-size: 11px;">Designation:</td>
            <td style="border: 1px solid black; padding: 8px; font-size: 11px;">${payslipData.class}</td>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; font-size: 11px;">Salary Month:</td>
            <td style="border: 1px solid black; padding: 8px; font-size: 11px;">${getCurrentDate()}</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; font-size: 11px;">Employee Type:</td>
            <td style="border: 1px solid black; padding: 8px; font-size: 11px;">${payslipData.employeeType}</td>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; font-size: 11px;">Level:</td>
            <td style="border: 1px solid black; padding: 8px; font-size: 11px;">${payslipData.class}</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; font-size: 11px;">City:</td>
            <td style="border: 1px solid black; padding: 8px; font-size: 11px;">${payslipData.city}</td>
            <td style="border: 1px solid black; padding: 8px; font-weight: bold; font-size: 11px;">Basic Pay:</td>
            <td style="border: 1px solid black; padding: 8px; font-size: 11px;">₹${formatCurrencyForPDF(payslipData.basicSalary)}</td>
          </tr>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid black;">
          <thead>
            <tr style="background: #e0e0e0;">
              <th style="border: 1px solid black; padding: 8px; text-align: left; width: 20%; font-size: 11px;">Particulars</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right; width: 12%; font-size: 11px;">Amount(Rs.)</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left; width: 20%; font-size: 11px;">Particulars</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right; width: 12%; font-size: 11px;">Amount(Rs.)</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left; width: 20%; font-size: 11px;">Particulars</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right; width: 16%; font-size: 11px;">Amount(Rs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">BASIC</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(allowances.basicSalary)}</td>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">Prof. Tax.</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(deductions.professionalTax)}</td>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">Co. Op. Cr. Soc.</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">0</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">H.R.A.</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(allowances.hra)}</td>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">GIS</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(deductions.gis)}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">D.A.</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(allowances.da)}</td>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">${payslipData.employeeType === 'GPF' ? 'GPF' : 'NPS'}</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${payslipData.employeeType === 'GPF' ? formatCurrencyForPDF(deductions.gpfSubscription || 0) : formatCurrencyForPDF(deductions.dcps || 0)}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">T.A.</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(allowances.ta)}</td>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">REVENUE STAMP</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(deductions.revenueStamp)}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
            </tr>
            ${allowances.perTA > 0 ? `
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">Personal T.A.</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(allowances.perTA)}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
            </tr>` : ''}
            
            ${additionalAllowances && additionalAllowances.length > 0 ? 
              additionalAllowances.map(allowance => `
                <tr>
                  <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">${allowance.type}</td>
                  <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(allowance.type === 'NPA' ? Math.round(payslipData.basicSalary * 0.35) : parseFloat(allowance.amount) || 0)}</td>
                  <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
                  <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
                  <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
                  <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
                </tr>
              `).join('') : ''
            }
            
            ${(deductions.festivalAdvances > 0 || deductions.otherAdvances > 0 || deductions.incomeTax > 0) ? `
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-weight: bold; font-size: 11px;">${deductions.festivalAdvances > 0 ? 'Festival Advance' : deductions.otherAdvances > 0 ? 'Other Advance' : deductions.incomeTax > 0 ? 'Income Tax' : ''}</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${deductions.festivalAdvances > 0 ? formatCurrencyForPDF(deductions.festivalAdvances) : deductions.otherAdvances > 0 ? formatCurrencyForPDF(deductions.otherAdvances) : deductions.incomeTax > 0 ? formatCurrencyForPDF(deductions.incomeTax) : ''}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
            </tr>` : ''}
            <tr>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;"></td>
            </tr>
            <tr style="background: #f0f0f0; font-weight: bold;">
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;">Total Emolument</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(totalAllowances)}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;">Total Govt. Recoveries</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">${formatCurrencyForPDF(totalDeductions)}</td>
              <td style="border: 1px solid black; padding: 6px; font-size: 11px;">Total NG Recoveries</td>
              <td style="border: 1px solid black; padding: 6px; text-align: right; font-size: 11px;">0</td>
            </tr>
          </tbody>
        </table>
        
        <div style="background: #f5f5f5; padding: 15px; border: 2px solid black; margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 14px;">
            Net Pay: ₹${formatCurrencyForPDF(netSalary)} ( Rupees ${netSalary.toLocaleString('en-IN')} Only )
          </div>
        </div>
        
        <div style="border: 1px solid black; padding: 12px; font-size: 10px;">
          <div style="margin-bottom: 8px;">
            <strong>Bill No.:</strong> [BILL NUMBER] &nbsp;&nbsp;&nbsp;
            <strong>Bill Description:</strong> ${payslipData.employeeType} EMPLOYEE GROUP &nbsp;&nbsp;&nbsp;
            <strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN')}
          </div>
          <div>
            <strong>Gross Amt:</strong> ₹${formatCurrencyForPDF(totalAllowances)} &nbsp;&nbsp;&nbsp;
            <strong>Net Amt:</strong> ₹${formatCurrencyForPDF(netSalary)} &nbsp;&nbsp;&nbsp;
            <strong>Voucher Date:</strong> ${new Date().toLocaleDateString('en-IN')}
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temp div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 190; // A4 width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Download PDF
      const fileName = `Payslip_${getCurrentDate().replace(' ', '_')}_${payslipData.employeeType}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  // Allowance Card Component
  const AllowanceCard = () => (
    <div className="result-card">
      <h3>💰 Allowances</h3>
      <div className="result-item">
        <span>Basic Salary</span>
        <span>{formatCurrency(allowances.basicSalary)}</span>
      </div>
      <div className="result-item">
        <span>DA ({payslipData.daRate}%)</span>
        <span>{formatCurrency(allowances.da)}</span>
      </div>
      <div className="result-item">
        <span>HRA</span>
        <span>{formatCurrency(allowances.hra)}</span>
      </div>
      <div className="result-item">
        <span>TA</span>
        <span>{formatCurrency(allowances.ta)}</span>
      </div>
      {allowances.perTA > 0 && (
        <div className="result-item">
          <span>Personal TA</span>
          <span>{formatCurrency(allowances.perTA)}</span>
        </div>
      )}
      
      {/* Additional Allowances */}
      {payslipData.additionalAllowances && payslipData.additionalAllowances.map((allowance, index) => (
        <div className="result-item" key={index}>
          <span>{allowance.type}{allowance.type === 'NPA' ? ' (35% of Basic)' : ''}</span>
          <span>
            {formatCurrency(
              allowance.type === 'NPA' 
                ? Math.round(payslipData.basicSalary * 0.35) 
                : parseFloat(allowance.amount) || 0
            )}
          </span>
        </div>
      ))}
      
      <div className="result-total">
        <span>Total Allowances</span>
        <span>{formatCurrency(totalAllowances)}</span>
      </div>
    </div>
  );

  // Deduction Card Component
  const DeductionCard = () => (
    <div className="result-card">
      <h3>💸 Deductions</h3>
      <div className="result-item">
        <span>Professional Tax</span>
        <span>{formatCurrency(deductions.professionalTax)}</span>
      </div>
      <div className="result-item">
        <span>GIS</span>
        <span>{formatCurrency(deductions.gis)}</span>
      </div>
      {payslipData.employeeType === 'NPS' ? (
        <div className="result-item">
          <span>DCPS (10% of Basic+DA)</span>
          <span>{formatCurrency(deductions.dcps)}</span>
        </div>
      ) : (
        <>
          <div className="result-item">
            <span>GPF Subscription</span>
            <span>{formatCurrency(deductions.gpfSubscription)}</span>
          </div>
          <div className="result-item">
            <span>GPF Recovery</span>
            <span>{formatCurrency(deductions.gpfRecovery)}</span>
          </div>
        </>
      )}
      <div className="result-item">
        <span>Revenue Stamp</span>
        <span>{formatCurrency(deductions.revenueStamp)}</span>
      </div>
      {(deductions.festivalAdvances > 0 || deductions.otherAdvances > 0 || deductions.incomeTax > 0) && (
        <>
          {deductions.festivalAdvances > 0 && (
            <div className="result-item">
              <span>Festival Advances</span>
              <span>{formatCurrency(deductions.festivalAdvances)}</span>
            </div>
          )}
          {deductions.otherAdvances > 0 && (
            <div className="result-item">
              <span>Other Advances</span>
              <span>{formatCurrency(deductions.otherAdvances)}</span>
            </div>
          )}
          {deductions.incomeTax > 0 && (
            <div className="result-item">
              <span>Income Tax</span>
              <span>{formatCurrency(deductions.incomeTax)}</span>
            </div>
          )}
          {deductions.otherRecovery > 0 && (
            <div className="result-item">
              <span>Other Recovery</span>
              <span>{formatCurrency(deductions.otherRecovery)}</span>
            </div>
          )}
        </>
      )}
      <div className="result-total">
        <span>Total Deductions</span>
        <span>{formatCurrency(totalDeductions)}</span>
      </div>
    </div>
  );

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
          onClick={() => navigate('/home')}
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
            Payslip Result
          </h1>
          <p style={{ color: '#666', fontSize: '1.3em' }}>
            Your calculated payslip breakdown
          </p>
          <div style={{ 
            background: payslipData.employeeType === 'NPS' ? '#e8f5e8' : '#e8f4f8',
            color: payslipData.employeeType === 'NPS' ? '#28a745' : '#667eea',
            padding: '10px 20px',
            borderRadius: '25px',
            display: 'inline-block',
            marginTop: '10px',
            fontWeight: 'bold',
            border: `2px solid ${payslipData.employeeType === 'NPS' ? '#28a745' : '#667eea'}`
          }}>
            👥 {payslipData.employeeType} Employee
          </div>
        </div>

        <div className="result-cards">
          <AllowanceCard />
          <DeductionCard />
        </div>

        <div className="net-salary">
          <h2>Net Salary</h2>
          <div className="amount">{formatCurrency(netSalary)}</div>
          <p style={{ marginTop: '10px', opacity: 0.9 }}>
            After all allowances and deductions
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/home')}
            style={{ flex: 1, minWidth: '180px', maxWidth: '200px' }}
          >
            Recalculate
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              // Small delay to ensure DOM is ready
              setTimeout(() => {
                window.print();
              }, 100);
            }}
            style={{ flex: 1, minWidth: '180px', maxWidth: '200px' }}
          >
            Print Payslip
          </button>
          <button 
            className="btn btn-primary"
            onClick={generatePDF}
            style={{ 
              flex: 1, 
              minWidth: '180px', 
              maxWidth: '200px',
              background: 'linear-gradient(45deg, #dc3545, #c82333)',
              border: 'none'
            }}
          >
            Download PDF
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/main-menu')}
            style={{ flex: 1, minWidth: '180px', maxWidth: '200px' }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;