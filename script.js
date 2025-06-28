// 8th Pay Commission Calculator - JavaScript Logic
// This file contains all the calculation functions and user interactions

// Global variables to store calculation results
let calculationResults = {
    current: {},
    new: {},
    increase: {}
};

// Main calculation function - called when user clicks "Calculate New Salary"
function calculateSalary() {
    // Show loading state
    showLoadingState();
    
    // Get all input values from the form
    const inputs = getInputValues();
    
    // Validate inputs
    if (!validateInputs(inputs)) {
        hideLoadingState();
        return;
    }
    
    // Perform calculations
    const results = performCalculations(inputs);
    
    // Display results
    displayResults(results);
    
    // Hide loading state and show success animation
    hideLoadingState();
    showSuccessAnimation();
    
    // Store results for potential future use
    calculationResults = results;
}

// Function to get all input values from the form
function getInputValues() {
    return {
        payLevel: document.getElementById('payLevel').value,
        currentBasic: parseFloat(document.getElementById('currentBasic').value) || 0,
        gradePay: parseFloat(document.getElementById('gradePay').value) || 0,
        currentDA: parseFloat(document.getElementById('currentDA').value) || 55,
        currentHRAPercentage: parseFloat(document.getElementById('currentHRAPercentage').value) || 18,
        cityType: document.getElementById('cityType').value,
        fitmentFactor: parseFloat(document.getElementById('fitmentFactor').value) || 2.28,
        newDA: parseFloat(document.getElementById('newDA').value) || 0
    };
}

// Function to validate user inputs
function validateInputs(inputs) {
    const errors = [];
    
    // Check if basic pay is provided
    if (inputs.currentBasic <= 0) {
        errors.push("Please enter your current basic pay");
    }
    
    // Check if DA percentage is reasonable
    if (inputs.currentDA < 0 || inputs.currentDA > 100) {
        errors.push("DA percentage should be between 0 and 100");
    }
    
    // Check if new DA percentage is reasonable
    if (inputs.newDA < 0 || inputs.newDA > 100) {
        errors.push("New DA percentage should be between 0 and 100");
    }
    
    // If there are errors, show them to the user
    if (errors.length > 0) {
        showError(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Main calculation function that performs all salary calculations
function performCalculations(inputs) {
    // Calculate current salary components
    const currentSalary = calculateCurrentSalary(inputs);
    
    // Calculate new salary components
    const newSalary = calculateNewSalary(inputs);
    
    // Calculate increase
    const increase = calculateIncrease(currentSalary, newSalary);
    
    return {
        current: currentSalary,
        new: newSalary,
        increase: increase
    };
}

// Calculate current salary breakdown
function calculateCurrentSalary(inputs) {
    const currentBasic = inputs.currentBasic;
    const gradePay = inputs.gradePay;
    const currentDA = inputs.currentDA;
    const currentHRAPercentage = inputs.currentHRAPercentage;
    const currentTA = inputs.currentTA;
    
    // Calculate current DA amount
    const currentDAAmount = (currentBasic + gradePay) * (currentDA / 100);
    
    // Calculate current HRA (percentage of basic pay, multiples of 9000)
    const currentHRA = calculateHRA(currentBasic, currentHRAPercentage);
    
    // Calculate total current salary
    const totalCurrent = currentBasic + gradePay + currentDAAmount + currentHRA + currentTA;
    
    return {
        basic: currentBasic,
        gradePay: gradePay,
        da: currentDAAmount,
        hra: currentHRA,
        ta: currentTA,
        total: totalCurrent
    };
}

// Calculate new salary breakdown under 8th Pay Commission
function calculateNewSalary(inputs) {
    const currentBasic = inputs.currentBasic;
    const gradePay = inputs.gradePay;
    const fitmentFactor = inputs.fitmentFactor;
    const newDA = inputs.newDA;
    const currentHRAPercentage = inputs.currentHRAPercentage;
    const currentTA = inputs.currentTA;
    
    // Calculate new basic pay using fitment factor
    // New basic pay = (Current basic + Grade pay) × Fitment factor
    const newBasicPay = (currentBasic + gradePay) * fitmentFactor;
    
    // Calculate new DA amount
    const newDAAmount = newBasicPay * (newDA / 100);
    
    // Calculate new HRA (percentage of new basic pay, multiples of 9000)
    const newHRA = calculateHRA(newBasicPay, currentHRAPercentage);
    
    // Calculate new Transport Allowance (fixed amounts based on pay level)
    const newTA = calculateNewTA(newBasicPay, currentTA);
    
    // Calculate total new salary
    const totalNew = newBasicPay + newDAAmount + newHRA + newTA;
    
    return {
        basic: newBasicPay,
        da: newDAAmount,
        hra: newHRA,
        ta: newTA,
        total: totalNew
    };
}

// Calculate HRA based on basic pay and percentage (multiples of 9000)
function calculateHRA(basicPay, hraPercentage) {
    // HRA is calculated as percentage of basic pay, but in multiples of 9000
    const hraAmount = basicPay * (hraPercentage / 100);
    
    // Round to nearest multiple of 9000
    const roundedHRA = Math.round(hraAmount / 9000) * 9000;
    
    // Ensure minimum HRA of 9000 if basic pay is sufficient
    return Math.max(roundedHRA, basicPay > 0 ? 9000 : 0);
}

// Calculate new Transport Allowance based on new basic pay
function calculateNewTA(newBasicPay, currentTA) {
    // Transport Allowance is fixed based on pay level
    // For 8th Pay Commission, it's expected to be revised upward
    // We'll estimate based on the new basic pay level
    
    if (newBasicPay <= 50000) {
        return 3600; // Level 1-3 equivalent
    } else if (newBasicPay <= 100000) {
        return 7200; // Level 4-6 equivalent
    } else if (newBasicPay <= 150000) {
        return 10800; // Level 7-9 equivalent
    } else {
        return 14400; // Level 10+ equivalent
    }
}

// Calculate salary increase
function calculateIncrease(currentSalary, newSalary) {
    const amountIncrease = newSalary.total - currentSalary.total;
    const percentageIncrease = (amountIncrease / currentSalary.total) * 100;
    
    return {
        amount: amountIncrease,
        percentage: percentageIncrease
    };
}

// Function to display results in the UI
function displayResults(results) {
    // Format numbers for display
    const formatCurrency = (amount) => {
        return '₹' + amount.toLocaleString('en-IN', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        });
    };
    
    const formatPercentage = (percentage) => {
        return percentage.toFixed(1) + '%';
    };
    
    // Display current salary breakdown
    document.getElementById('currentBasicDisplay').textContent = formatCurrency(results.current.basic);
    document.getElementById('currentGradeDisplay').textContent = formatCurrency(results.current.gradePay);
    document.getElementById('currentDADisplay').textContent = formatCurrency(results.current.da);
    document.getElementById('currentHRADisplay').textContent = formatCurrency(results.current.hra);
    document.getElementById('currentTADisplay').textContent = formatCurrency(results.current.ta);
    document.getElementById('currentTotalDisplay').textContent = formatCurrency(results.current.total);
    
    // Display new salary breakdown
    document.getElementById('newBasicDisplay').textContent = formatCurrency(results.new.basic);
    document.getElementById('newDADisplay').textContent = formatCurrency(results.new.da);
    document.getElementById('newHRADisplay').textContent = formatCurrency(results.new.hra);
    document.getElementById('newTADisplay').textContent = formatCurrency(results.new.ta);
    document.getElementById('newTotalDisplay').textContent = formatCurrency(results.new.total);
    
    // Display increase summary
    document.getElementById('increaseAmount').textContent = formatCurrency(results.increase.amount);
    document.getElementById('increasePercentage').textContent = formatPercentage(results.increase.percentage);
    
    // Show/hide grade pay row based on whether grade pay exists
    const gradePayRow = document.getElementById('gradePayRow');
    if (results.current.gradePay > 0) {
        gradePayRow.classList.remove('hidden');
    } else {
        gradePayRow.classList.add('hidden');
    }
    
    // Add success animation to results
    const resultsSection = document.querySelector('.results-section');
    resultsSection.classList.add('success-animation');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        resultsSection.classList.remove('success-animation');
    }, 500);
}

// Function to show loading state
function showLoadingState() {
    const calculateBtn = document.querySelector('.calculate-btn');
    const mainContent = document.querySelector('.main-content');
    
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    mainContent.classList.add('calculating');
}

// Function to hide loading state
function hideLoadingState() {
    const calculateBtn = document.querySelector('.calculate-btn');
    const mainContent = document.querySelector('.main-content');
    
    calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate New Salary';
    mainContent.classList.remove('calculating');
}

// Function to show success animation
function showSuccessAnimation() {
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.classList.add('success-animation');
    
    setTimeout(() => {
        calculateBtn.classList.remove('success-animation');
    }, 500);
}

// Function to show error messages
function showError(message) {
    // Create a simple alert for now - you can enhance this with a better UI
    alert('Error: ' + message);
}

// Function to reset the calculator
function resetCalculator() {
    // Clear all input fields
    document.getElementById('currentBasic').value = '';
    document.getElementById('gradePay').value = '';
    document.getElementById('currentDA').value = '42';
    document.getElementById('currentHRAPercentage').value = '16';
    document.getElementById('currentTA').value = '7200';
    document.getElementById('fitmentFactor').value = '2.28';
    document.getElementById('newDA').value = '0';
    
    // Reset all display fields
    const displayFields = [
        'currentBasicDisplay', 'currentGradeDisplay', 'currentDADisplay',
        'currentHRADisplay', 'currentTADisplay', 'currentTotalDisplay',
        'newBasicDisplay', 'newDADisplay', 'newHRADisplay', 'newTADisplay',
        'newTotalDisplay', 'increaseAmount', 'increasePercentage'
    ];
    
    displayFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = fieldId.includes('Display') ? '₹0' : '0%';
        }
    });
    
    // Show grade pay row by default
    document.getElementById('gradePayRow').classList.remove('hidden');
}

// Function to save calculation results (for future enhancement)
function saveResults() {
    if (calculationResults.current.total > 0) {
        // You can implement local storage or export functionality here
        const dataToSave = {
            timestamp: new Date().toISOString(),
            results: calculationResults
        };
        
        // For now, just log to console
        console.log('Calculation Results:', dataToSave);
        
        // You could also implement:
        // - Local storage: localStorage.setItem('payCommissionResults', JSON.stringify(dataToSave));
        // - Export to PDF
        // - Share via email
    }
}

// Function to handle scroll and show/hide SEO content
function handleScroll() {
    const seoIntro = document.getElementById('seo-intro');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Show SEO content when user scrolls down significantly
    if (scrollPosition > windowHeight * 0.5) {
        seoIntro.classList.add('show');
    } else {
        seoIntro.classList.remove('show');
    }
}

// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add input validation on blur
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleInput(this);
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateSalary();
        }
        
        // Escape to reset
        if (e.key === 'Escape') {
            e.preventDefault();
            resetCalculator();
        }
    });
    
    // Add form submission handler
    const form = document.querySelector('.input-section');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSalary();
    });
    
    // Add scroll event listener for SEO content
    window.addEventListener('scroll', handleScroll);
    
    // Initialize with some sample data for demonstration
    // You can remove this in production
    initializeSampleData();
    
    // On page load, set the last updated date
    setLastUpdated('29 June 2025');
});

// Function to validate individual input fields
function validateSingleInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (input.value !== '' && (isNaN(value) || value < min || (max && value > max))) {
        input.style.borderColor = '#e53e3e';
        input.style.backgroundColor = '#fed7d7';
    } else {
        input.style.borderColor = '#e2e8f0';
        input.style.backgroundColor = '#f7fafc';
    }
}

// Function to initialize sample data for demonstration
function initializeSampleData() {
    // This function adds sample data to help users understand how to use the calculator
    // You can remove this in production or make it optional
    
    // Check if URL has a demo parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        document.getElementById('currentBasic').value = '50000';
        document.getElementById('gradePay').value = '5400';
        document.getElementById('currentDA').value = '42';
        document.getElementById('currentHRAPercentage').value = '16';
        document.getElementById('currentTA').value = '7200';
        document.getElementById('fitmentFactor').value = '2.28';
        document.getElementById('newDA').value = '0';
        
        // Auto-calculate after a short delay
        setTimeout(() => {
            calculateSalary();
        }, 1000);
    }
}

// Export functions for potential future use
window.PayCommissionCalculator = {
    calculateSalary,
    resetCalculator,
    saveResults,
    getResults: () => calculationResults
};

// Add this function for live calculation
function calculateSalaryLive() {
    const inputs = getInputValues();
    // Fitment factor logic ...
    const fitmentSelect = document.getElementById('fitmentFactor');
    if (fitmentSelect && fitmentSelect.value === 'custom') {
        const customVal = parseFloat(document.getElementById('fitmentCustom').value);
        if (!isNaN(customVal)) {
            inputs.fitmentFactor = customVal;
        }
    }
    // TA auto-calc logic
    const overrideTA = document.getElementById('overrideTA').checked;
    const taInput = document.getElementById('currentTA');
    if (!overrideTA) {
        const ta = calculateTA(inputs.payLevel, inputs.cityType, inputs.currentDA, inputs.currentBasic);
        taInput.value = ta;
        inputs.currentTA = ta;
        taInput.readOnly = true;
        taInput.style.background = '#f7fafc';
    } else {
        taInput.readOnly = false;
        taInput.style.background = '#fff';
        inputs.currentTA = parseFloat(taInput.value) || 0;
    }
    // Validate and calculate
    if (!validateInputs(inputs)) return;
    const results = performCalculations(inputs);
    displayResults(results);
}

// Add this handler for fitment factor dropdown
function handleFitmentChange() {
    const fitmentSelect = document.getElementById('fitmentFactor');
    const customInput = document.getElementById('fitmentCustom');
    if (fitmentSelect.value === 'custom') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

// Add function to set Last Updated date
function setLastUpdated(dateStr) {
    const el = document.getElementById('lastUpdated');
    if (el) el.textContent = 'Last Updated: ' + dateStr;
}

// Add function to toggle What's New section
function toggleWhatsNew() {
    const content = document.getElementById('whatsNewContent');
    const arrow = document.getElementById('whatsNewArrow');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.textContent = '▲';
        document.querySelector('.whats-new-toggle').setAttribute('aria-expanded', 'true');
    } else {
        content.style.display = 'none';
        arrow.textContent = '▼';
        document.querySelector('.whats-new-toggle').setAttribute('aria-expanded', 'false');
    }
}

// Add function to determine pay level from basic/grade pay (simple mapping for now)
function getPayLevel(basic, gradePay) {
    // Example mapping (should be replaced with actual pay matrix if available)
    if (basic + gradePay <= 19900) return 1;
    if (basic + gradePay <= 21700) return 2;
    if (basic + gradePay <= 25500) return 3;
    if (basic + gradePay <= 29200) return 4;
    if (basic + gradePay <= 35400) return 5;
    if (basic + gradePay <= 44900) return 6;
    if (basic + gradePay <= 47600) return 7;
    if (basic + gradePay <= 53100) return 8;
    if (basic + gradePay <= 56100) return 9;
    if (basic + gradePay <= 67700) return 10;
    if (basic + gradePay <= 78800) return 11;
    if (basic + gradePay <= 123100) return 12;
    if (basic + gradePay <= 131100) return 13;
    if (basic + gradePay <= 144200) return 14;
    if (basic + gradePay <= 182200) return 15;
    if (basic + gradePay <= 205400) return 16;
    if (basic + gradePay <= 225000) return 17;
    return 18;
}

// Add toggleTAOverride to enable/disable TA editing
function toggleTAOverride() {
    const taInput = document.getElementById('currentTA');
    const overrideTA = document.getElementById('overrideTA').checked;
    if (overrideTA) {
        taInput.readOnly = false;
        taInput.style.background = '#fff';
    } else {
        taInput.readOnly = true;
        taInput.style.background = '#f7fafc';
        calculateSalaryLive(); // recalc TA
    }
}

// Update TA calculation logic as per 7th CPC chart
function calculateTA(payLevel, cityType, daPercent, basicPay) {
    payLevel = String(payLevel);
    let baseTA = 0;
    // Level 1 & 2 special case for basic < 24200
    if ((payLevel === '1' || payLevel === '2') && basicPay < 24200) {
        baseTA = cityType === 'higher' ? 1350 : 900;
    } else if ((payLevel === '1' || payLevel === '2') && basicPay >= 24200) {
        baseTA = cityType === 'higher' ? 3600 : 1800;
    } else if (parseInt(payLevel) >= 3 && parseInt(payLevel) <= 8) {
        baseTA = cityType === 'higher' ? 3600 : 1800;
    } else if (parseInt(payLevel) >= 9) {
        baseTA = cityType === 'higher' ? 7200 : 3600;
    }
    // Add DA on TA
    const ta = baseTA + (baseTA * (daPercent / 100));
    return Math.round(ta);
} 