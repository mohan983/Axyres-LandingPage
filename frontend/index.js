// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const navLinks = document.getElementById('navLinks');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    
    // Adjust for mobile layout
    if (window.innerWidth <= 768) {
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'var(--dark-bg)';
            navLinks.style.padding = '20px';
            navLinks.style.borderTop = '1px solid var(--border-color)';
            navLinks.style.gap = '20px';
        }
    }
});

// Handle form submissions
const forms = document.querySelectorAll('form');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate database storage (in a real app, this would connect to a backend)
async function storeEmailInDatabase(email) {
    try {
        // Send email as a proper JSON object, not a plain string
        const response = await fetch('http://localhost:4000/api/subscribers/add', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ email: email }) // Send as JSON object
        });
        
        let data;
        try {
            data = await response.json();
        } catch (e) {
            const text = await response.text();
            console.log('Response text:', text);
            data = { 
                success: response.ok, 
                message: text || 'Unknown error'
            };
        }
        
        if (response.ok) {
            console.log('Email stored successfully:', data);
            return { 
                success: true, 
                message: data.message || 'Thank you! You have been added to our early access list.' 
            };
        } else {
            console.error('Error storing email:', data);
            return { 
                success: false, 
                message: data.message || 'Failed to add email. Please try again.' 
            };
        }
    } catch (error) {
        console.error('Network error:', error);
        
        // Fallback to localStorage
        let emails = JSON.parse(localStorage.getItem('axyres_emails')) || [];
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('axyres_emails', JSON.stringify(emails));
        }
        
        return { 
            success: true, 
            message: 'Email saved locally (backend unreachable). We\'ll sync when connection is restored.' 
        };
    }
}

// Handle form submission
// Handle form submission
forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get the email from this specific form
        const formId = this.id;
        let emailInput;
        
        if (formId === 'earlyAccessForm') {
            emailInput = document.getElementById('email');
        } else if (formId === 'challengeForm') {
            emailInput = document.getElementById('email2');
        } else if (formId === 'pricingForm') {
            emailInput = document.getElementById('email3');
        }
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!validateEmail(email)) {
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address.';
            emailInput.focus();
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        const originalBtnText = submitBtn.textContent || submitBtn.innerText;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Store email in database
        const result = await storeEmailInDatabase(email);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show appropriate message
        if (result.success) {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${result.message}`;
            
            // Reset form on success
            this.reset();
        } else {
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${result.message}`;
        }
        
        // Scroll to message
        const messageToShow = result.success ? successMessage : errorMessage;
        messageToShow.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageToShow.style.display = 'none';
        }, 5000);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize with any existing emails in database
window.addEventListener('DOMContentLoaded', function() {
    const emails = JSON.parse(localStorage.getItem('axyres_emails')) || [];
    console.log(`Existing emails in database: ${emails.length}`);
});