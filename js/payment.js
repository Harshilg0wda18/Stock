function showMethod(method) {
  document.querySelectorAll('.pay-method').forEach(div => div.classList.remove('active'));
  document.querySelectorAll('.payment-options button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${method}-form`).classList.add('active');
  event.target.classList.add('active');
}

function initiatePayment() {
  document.getElementById('processing-modal').classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('processing-modal').classList.add('hidden');
    document.getElementById('success-modal').classList.remove('hidden');
  }, 3000);
}

function closeSuccess() {
  document.getElementById('success-modal').classList.add('hidden');
  
  // Get the selected plan and stored email
  const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'auth-message error';
    errorMessage.textContent = 'User email not found. Please login again.';
    document.querySelector('.checkout-box').appendChild(errorMessage);
    return;
  }
  
  // Send data to backend
  fetch('http://localhost:3000/api/save-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      plan: selectedPlan
    })
  })
  .then(res => res.json())
  .then(data => {
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'auth-message success';
    successMessage.textContent = 'Plan updated successfully';
    document.querySelector('.checkout-box').appendChild(successMessage);
    
    // Clear the stored email after successful plan update
    localStorage.removeItem('userEmail');
    
    // Wait for 2.5 seconds then redirect
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2500);
  })
  .catch(error => {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'auth-message error';
    errorMessage.textContent = 'Failed to update plan. Please try again.';
    document.querySelector('.checkout-box').appendChild(errorMessage);
  });
}

function selectPlan(plan) {
    // Update radio button
    document.getElementById(plan).checked = true;
    
    // Update summary
    const planPrices = {
        'starter': 9,
        'pro': 29,
        'premium': 99
    };
    
    const planNames = {
        'starter': 'Starter Plan',
        'pro': 'Pro Plan',
        'premium': 'Premium Plan'
    };
    
    const basePrice = planPrices[plan];
    const tax = basePrice * 0.18; // 18% tax
    const total = basePrice + tax;
    
    // Update summary display
    document.getElementById('selectedPlan').textContent = planNames[plan];
    document.getElementById('planPrice').textContent = `$${basePrice}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    
    // Update pay button
    document.querySelector('.pay-button').textContent = `Pay $${total.toFixed(2)}`;
}

// Initialize with starter plan
document.addEventListener('DOMContentLoaded', function() {
    selectPlan('starter');
});
