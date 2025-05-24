// Authentication JavaScript for StockSense

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', function() {
        const passwordInput = this.parentElement.querySelector('input');
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          this.classList.add('visible');
        } else {
          passwordInput.type = 'password';
          this.classList.remove('visible');
        }
      });
    });
    
    // Password strength meter
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (passwordInput && strengthBar && strengthText) {
      passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // If password is empty, reset the strength meter
        if (password.length === 0) {
          strengthBar.className = 'strength-progress';
          strengthBar.style.width = '0';
          strengthText.textContent = 'Password strength';
          return;
        }
        
        // Check password length
        if (password.length > 6) {
          strength += 1;
        }
        if (password.length > 10) {
          strength += 1;
        }
        
        // Check for mixed-case characters
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
          strength += 1;
        }
        
        // Check for numbers
        if (password.match(/\d/)) {
          strength += 1;
        }
        
        // Check for special characters
        if (password.match(/[^a-zA-Z\d]/)) {
          strength += 1;
        }
        
        // Update the strength meter
        switch (strength) {
          case 0:
          case 1:
            strengthBar.className = 'strength-progress';
            strengthBar.style.width = '25%';
            strengthBar.style.backgroundColor = 'var(--color-error)';
            strengthText.textContent = 'Weak';
            break;
          case 2:
            strengthBar.className = 'strength-progress';
            strengthBar.style.width = '50%';
            strengthBar.style.backgroundColor = 'var(--color-warning)';
            strengthText.textContent = 'Medium';
            break;
          case 3:
          case 4:
            strengthBar.className = 'strength-progress';
            strengthBar.style.width = '75%';
            strengthBar.style.backgroundColor = 'var(--color-info)';
            strengthText.textContent = 'Strong';
            break;
          case 5:
            strengthBar.className = 'strength-progress';
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = 'var(--color-success)';
            strengthText.textContent = 'Very strong';
            break;
        }
      });
    }
    
    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const authMessage = document.getElementById('authMessage');

            // Reset error messages
            emailError.textContent = '';
            passwordError.textContent = '';
            authMessage.className = 'auth-message';
            authMessage.textContent = '';

            let hasErrors = false;

            // Validate email
            if (!email) {
                emailError.textContent = 'Email is required';
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                hasErrors = true;
            }

            // Validate password
            if (!password) {
                passwordError.textContent = 'Password is required';
                hasErrors = true;
            }

            if (!hasErrors) {
                try {
                    const response = await fetch('https://stock-back-bh40.onrender.com/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    const result = await response.json();
                    console.log(result);
                    if (response.ok) {
                        authMessage.className = 'auth-message success';
                        authMessage.textContent = result.message;
                        // Store email in localStorage during login
                        localStorage.setItem('userEmail', email);
                        window.location.href = 'dashboard.html';
                    } else {
                        authMessage.className = 'auth-message error';
                        authMessage.textContent = result.message;
                    }
                } catch (err) {
                    authMessage.className = 'auth-message error';
                    authMessage.textContent = 'Error: ' + err.message;
                }
            }
        });
    }
    
    // Form validation
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
      signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAgreement = document.getElementById('termsAgreement').checked;
        
        const firstNameError = document.getElementById('firstNameError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const termsError = document.getElementById('termsError');
        const authMessage = document.getElementById('authMessage');
        
        // Reset error messages
        firstNameError.textContent = '';
        lastNameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        termsError.textContent = '';
        authMessage.className = 'auth-message';
        authMessage.textContent = '';
        
        let hasErrors = false;
        
        // Validate first name
        if (!firstName) {
          firstNameError.textContent = 'First name is required';
          hasErrors = true;
        }
        
        // Validate last name
        if (!lastName) {
          lastNameError.textContent = 'Last name is required';
          hasErrors = true;
        }
        
        // Validate email
        if (!email) {
          emailError.textContent = 'Email is required';
          hasErrors = true;
        } else if (!isValidEmail(email)) {
          emailError.textContent = 'Please enter a valid email address';
          hasErrors = true;
        }
        
        // Validate password
        if (!password) {
          passwordError.textContent = 'Password is required';
          hasErrors = true;
        } else if (password.length < 8) {
          passwordError.textContent = 'Password must be at least 8 characters long';
          hasErrors = true;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
          confirmPasswordError.textContent = 'Please confirm your password';
          hasErrors = true;
        } else if (password !== confirmPassword) {
          confirmPasswordError.textContent = 'Passwords do not match';
          hasErrors = true;
        }

        // Validate terms agreement
        if (!termsAgreement) {
          termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy';
          hasErrors = true;
        }

        if (!hasErrors) {
          try {
            const response = await fetch('https://stock-back-bh40.onrender.com/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ firstName, lastName, email, password })
            });
            
            const result = await response.json();
            //console.log(result);
            if (result.success) {
              //console.log("success");
              // Store email in localStorage
              localStorage.setItem('userEmail', email);
              
              // Show success message
              authMessage.className = 'auth-message success';
              authMessage.textContent = 'Registration successful.';
              
              // Redirect to payment page after delay
              setTimeout(() => {
                window.location.href = 'https://bharath-070.github.io/stock/payment.html';
              }, 2000);
            } else {
              authMessage.className = 'auth-message error';
              authMessage.textContent = result.message || 'Registration failed. Please try again.';
            }
          } catch (err) {
            console.error('Signup error:', err);
            authMessage.className = 'auth-message error';
            authMessage.textContent = 'Error: ' + err.message;
          }
        }
      });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Extract and apply URL parameters (for pricing plan selection)
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Handle plan parameter if present
    const planParam = getUrlParameter('plan');
    if (planParam && document.getElementById('selectedPlan')) {
      document.getElementById('selectedPlan').value = planParam;
      
      // Update the UI to show selected plan
      const planDisplay = document.getElementById('planDisplay');
      if (planDisplay) {
        planDisplay.textContent = planParam.charAt(0).toUpperCase() + planParam.slice(1);
      }
    }
  });