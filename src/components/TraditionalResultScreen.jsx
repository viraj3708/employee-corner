import { useNavigate } from 'react-router-dom';
import { calculatePayslip } from '../utils/calculations';

function TraditionalResultScreen({ payslipData }) {
  const navigate = useNavigate();
  
  if (!payslipData.basicSalary) {
    // Redirect to home if no data
    navigate('/home');
    return null;
  }

  const result = calculatePayslip(payslipData);
  const { allowances, deductions, totalAllowances, totalDeductions, netSalary, additionalAllowances } = result;

  const formatCurrency = (amount) => {
    return Math.round(amount).toLocaleString('en-IN');
  };

  const getCurrentDate = () => {
    const now = new Date();
    const month = now.toLocaleString('en-IN', { month: 'long' });
    const year = now.getFullYear();
    return `${month}-${year}`;
  };

  return (
    <div className="container">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          fontSize: '1em',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000
        }}
        onMouseEnter={(e) => e.target.style.background = '#c82333'}
        onMouseLeave={(e) => e.target.style.background = '#dc3545'}
      >
        ← Back
      </button>
      
      <div className="fade-in" style={{ marginTop: '60px' }}>
        {/* Traditional Payslip Layout */}
        <div style={{
          background: 'white',
          border: '2px solid #000',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0'
        }}>
          
          {/* Header Section */}
          <div style={{
            borderBottom: '2px solid #000',
            padding: '10px',
            textAlign: 'center',
            background: '#f5f5f5'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
              GOVERNMENT OF MAHARASHTRA
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
              PAYSLIP FOR THE MONTH OF {getCurrentDate().toUpperCase()}
            </div>
          </div>

          {/* Employee Details Section */}
          <div style={{ borderBottom: '1px solid #000' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', width: '25%', fontWeight: 'bold' }}>
                    Employee Name:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', width: '25%' }}>
                    [EMPLOYEE NAME]
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', width: '25%', fontWeight: 'bold' }}>
                    DDO CODE:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', width: '25%' }}>
                    [DDO CODE]
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    Designation:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>
                    {payslipData.class}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    Salary Month:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>
                    {getCurrentDate()}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    Employee Type:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>
                    {payslipData.employeeType}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    Level:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>
                    {payslipData.class}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    City:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>
                    {payslipData.city}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    Basic Pay:
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>
                    ₹{formatCurrency(payslipData.basicSalary)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Allowances and Deductions Table */}
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#e0e0e0' }}>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', width: '20%' }}>
                    Particulars
                  </th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', width: '15%' }}>
                    Amount(Rs.)
                  </th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', width: '20%' }}>
                    Particulars
                  </th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', width: '15%' }}>
                    Amount(Rs.)
                  </th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', width: '20%' }}>
                    Particulars
                  </th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', width: '10%' }}>
                    Amount(Rs.)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>BASIC</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(allowances.basicSalary)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>Prof. Tax.</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(deductions.professionalTax)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>Co. Op. Cr. Soc.</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>0</td>
                </tr>
                
                {/* Row 2 */}
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>H.R.A.</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(allowances.hra)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>GIS</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(deductions.gis)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                </tr>
                
                {/* Row 3 */}
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>D.A.</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(allowances.da)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                    {payslipData.employeeType === 'GPF' ? 'GPF' : 'NPS'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {payslipData.employeeType === 'GPF' ? 
                      formatCurrency(deductions.gpfSubscription) : 
                      formatCurrency(deductions.dcps)
                    }
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                </tr>
                
                {/* Row 4 */}
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>T.A.</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(allowances.ta)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>REVENUE STAMP</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(deductions.revenueStamp)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                </tr>
                
                {/* Row 5 - Personal TA if applicable */}
                {allowances.perTA > 0 && (
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>Personal T.A.</td>
                    <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                      {formatCurrency(allowances.perTA)}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  </tr>
                )}
                
                {/* Additional Allowances Rows */}
                {payslipData.additionalAllowances && payslipData.additionalAllowances.map((allowance, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                      {allowance.type}{allowance.type === 'NPA' ? ' (35%)' : ''}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                      {formatCurrency(
                        allowance.type === 'NPA' 
                          ? Math.round(payslipData.basicSalary * 0.35) 
                          : parseFloat(allowance.amount) || 0
                      )}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  </tr>
                ))}
                
                {/* Additional deductions rows */}
                {(deductions.festivalAdvances > 0 || deductions.otherAdvances > 0 || deductions.incomeTax > 0) && (
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>
                      {deductions.festivalAdvances > 0 ? 'Festival Advance' : 
                       deductions.otherAdvances > 0 ? 'Other Advance' : 
                       deductions.incomeTax > 0 ? 'Income Tax' : ''}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                      {deductions.festivalAdvances > 0 ? formatCurrency(deductions.festivalAdvances) : 
                       deductions.otherAdvances > 0 ? formatCurrency(deductions.otherAdvances) : 
                       deductions.incomeTax > 0 ? formatCurrency(deductions.incomeTax) : ''}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  </tr>
                )}
                
                {/* Empty rows for spacing */}
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                </tr>
                
                {/* Totals Row */}
                <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>Total Emolument</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(totalAllowances)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>Total Govt. Recoveries</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>
                    {formatCurrency(totalDeductions)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}>Total NG Recoveries</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Pay Section */}
          <div style={{ borderTop: '2px solid #000', padding: '10px', background: '#f5f5f5' }}>
            <table style={{ width: '100%', fontSize: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', width: '15%' }}>Net Pay:</td>
                  <td style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    ₹{formatCurrency(netSalary)} ( {netSalary < 100000 ? 'Rupees ' : ''}{netSalary.toLocaleString('en-IN')} Only )
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div style={{ borderTop: '1px solid #000', padding: '8px', fontSize: '10px' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '25%' }}>
                    <strong>Bill No.:</strong> [BILL NUMBER]
                  </td>
                  <td style={{ width: '35%' }}>
                    <strong>Bill Description:</strong> {payslipData.employeeType} EMPLOYEE GROUP
                  </td>
                  <td style={{ width: '40%', textAlign: 'right' }}>
                    Generated on: {new Date().toLocaleDateString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Gross Amt:</strong> ₹{formatCurrency(totalAllowances)}
                  </td>
                  <td>
                    <strong>Net Amt:</strong> ₹{formatCurrency(netSalary)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <strong>Voucher Date:</strong> {new Date().toLocaleDateString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/home')}
            style={{ minWidth: '200px' }}
          >
            Recalculate
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setTimeout(() => {
                window.print();
              }, 100);
            }}
            style={{ minWidth: '200px' }}
          >
            Print Payslip
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/main-menu')}
            style={{ minWidth: '200px' }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default TraditionalResultScreen;