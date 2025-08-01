// ROI Calculator
function calculateROI() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const finalValue = parseFloat(document.getElementById('finalValue').value);
    
    if (isNaN(initialInvestment) || isNaN(finalValue)) {
        document.getElementById('roiResult').innerHTML = 'Please enter valid numbers';
        return;
    }

    const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const resultElement = document.getElementById('roiResult');
    resultElement.innerHTML = `ROI: ${roi.toFixed(2)}%`;
    resultElement.className = roi >= 0 ? 'result-positive' : 'result-negative';
}

// Loan Calculator
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('loanInterest').value);
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        document.getElementById('loanResult').innerHTML = 'Please enter valid numbers';
        return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    document.getElementById('loanResult').innerHTML = `
        Monthly Payment: $${monthlyPayment.toFixed(2)}<br>
        Total Interest: $${totalInterest.toFixed(2)}<br>
        Total Payment: $${totalPayment.toFixed(2)}
    `;
}

// Cash Flow Calculator
function calculateCashFlow() {
    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);

    if (isNaN(income) || isNaN(expenses)) {
        document.getElementById('cashFlowResult').innerHTML = 'Please enter valid numbers';
        return;
    }

    const cashFlow = income - expenses;
    const resultElement = document.getElementById('cashFlowResult');
    resultElement.innerHTML = `Monthly Cash Flow: $${cashFlow.toFixed(2)}`;
    resultElement.className = cashFlow >= 0 ? 'result-positive' : 'result-negative';
}

// Interest Calculator
function calculateInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const time = parseFloat(document.getElementById('time').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        document.getElementById('interestResult').innerHTML = 'Please enter valid numbers';
        return;
    }

    // Simple Interest
    const simpleInterest = (principal * rate * time) / 100;
    
    // Compound Interest (annually)
    const compoundInterest = principal * Math.pow(1 + rate/100, time) - principal;

    document.getElementById('interestResult').innerHTML = `
        Simple Interest: $${simpleInterest.toFixed(2)}<br>
        Compound Interest: $${compoundInterest.toFixed(2)}
    `;
}
