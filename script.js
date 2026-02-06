// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simulate sending (replace with actual backend call)
    setTimeout(() => {
        contactMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        contactMessage.className = 'form-message success';
        contactForm.reset();
        
        setTimeout(() => {
            contactMessage.className = 'form-message';
        }, 5000);
    }, 1000);
});

// Donation Amount Selection
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');
const donateAmountDisplay = document.getElementById('donate-amount');
let selectedAmount = 0;

amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        amountButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedAmount = parseInt(button.dataset.amount);
        customAmountInput.value = '';
        updateDonateButton();
    });
});

customAmountInput.addEventListener('input', () => {
    amountButtons.forEach(btn => btn.classList.remove('active'));
    selectedAmount = parseInt(customAmountInput.value) || 0;
    updateDonateButton();
});

function updateDonateButton() {
    if (selectedAmount > 0) {
        donateAmountDisplay.textContent = `KSh ${selectedAmount.toLocaleString()}`;
    } else {
        donateAmountDisplay.textContent = 'KSh 0';
    }
}

// ============================================
// STRIPE PAYMENT INTEGRATION
// ============================================
// IMPORTANT: Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual Stripe publishable key
// Sign up at https://stripe.com to get your API keys

// Initialize Stripe (uncomment and add your key)
// const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// For demonstration without actual Stripe key:
const paymentForm = document.getElementById('payment-form');
const paymentMessage = document.getElementById('payment-message');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const spinner = document.getElementById('spinner');

// Simulate Stripe Elements (replace with actual Stripe Elements when you have a key)
const cardElementDiv = document.getElementById('card-element');
cardElementDiv.innerHTML = '<div style="padding: 10px; background: #f8f9fa; border-radius: 5px;">Card payment form will appear here when Stripe is configured</div>';

// When you have a Stripe account, uncomment this code:
/*
const elements = stripe.elements();
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
        }
    }
});
cardElement.mount('#card-element');

cardElement.on('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});
*/

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (selectedAmount < 100) {
        paymentMessage.textContent = 'Please select or enter a donation amount (minimum KSh 100).';
        paymentMessage.className = 'form-message error';
        return;
    }
    
    const donorName = document.getElementById('donorName').value;
    const donorEmail = document.getElementById('donorEmail').value;
    
    if (!donorName || !donorEmail) {
        paymentMessage.textContent = 'Please fill in your name and email.';
        paymentMessage.className = 'form-message error';
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.classList.add('hidden');
    spinner.classList.remove('hidden');
    
    // Simulate payment processing (replace with actual Stripe payment)
    setTimeout(() => {
        // Success message
        paymentMessage.textContent = `Thank you ${donorName} for your generous donation of KSh ${selectedAmount.toLocaleString()}! Your support makes a real difference.`;
        paymentMessage.className = 'form-message success';
        
        // Reset form
        paymentForm.reset();
        amountButtons.forEach(btn => btn.classList.remove('active'));
        selectedAmount = 0;
        updateDonateButton();
        
        // Reset button state
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
        
        // Hide message after 10 seconds
        setTimeout(() => {
            paymentMessage.className = 'form-message';
        }, 10000);
    }, 2000);
    
    /* 
    When you have Stripe configured, replace the above simulation with:
    
    try {
        // Create payment intent on your server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: selectedAmount * 100, // Convert to cents
                name: donorName,
                email: donorEmail
            })
        });
        
        const { clientSecret } = await response.json();
        
        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: donorName,
                    email: donorEmail
                }
            }
        });
        
        if (error) {
            paymentMessage.textContent = error.message;
            paymentMessage.className = 'form-message error';
        } else if (paymentIntent.status === 'succeeded') {
            paymentMessage.textContent = `Thank you for your donation of KSh ${selectedAmount.toLocaleString()}!`;
            paymentMessage.className = 'form-message success';
            paymentForm.reset();
            cardElement.clear();
        }
    } catch (error) {
        paymentMessage.textContent = 'Payment failed. Please try again.';
        paymentMessage.className = 'form-message error';
    } finally {
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
    */
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(section);
});
// Newsletter Form Handler
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        
        // Simulate sending (replace with actual backend)
        newsletterMessage.textContent = 'Thank you for subscribing! Check your email for confirmation.';
        newsletterMessage.className = 'form-message success';
        newsletterForm.reset();
        
        setTimeout(() => {
            newsletterMessage.className = 'form-message';
        }, 5000);
    });
}
// Testimonials Slider
let currentTestimonialIndex = 0;

function showTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (index >= cards.length) currentTestimonialIndex = 0;
    if (index < 0) currentTestimonialIndex = cards.length - 1;
    
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    cards[currentTestimonialIndex].classList.add('active');
    dots[currentTestimonialIndex].classList.add('active');
}

function changeTestimonial(direction) {
    currentTestimonialIndex += direction;
    showTestimonial(currentTestimonialIndex);
}

function currentTestimonial(index) {
    currentTestimonialIndex = index;
    showTestimonial(currentTestimonialIndex);
}

// Auto-play testimonials
setInterval(() => {
    changeTestimonial(1);
}, 5000);
// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});
// Volunteer Form Handler
const volunteerForm = document.getElementById('volunteerForm');
const volunteerMessage = document.getElementById('volunteerMessage');

if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('volName').value,
            email: document.getElementById('volEmail').value,
            phone: document.getElementById('volPhone').value,
            interest: document.getElementById('volInterest').value,
            availability: document.getElementById('volAvailability').value,
            message: document.getElementById('volMessage').value
        };
        
        // Simulate sending (replace with actual backend)
        volunteerMessage.textContent = 'Thank you for your interest! We will contact you within 2-3 business days.';
        volunteerMessage.className = 'form-message success';
        volunteerForm.reset();
        
        setTimeout(() => {
            volunteerMessage.className = 'form-message';
        }, 8000);
    });
}
// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});
// Animated Progress Bar
function updateProgressBar() {
    // Replace these with actual values from your database
    const raised = 3250000; // KSh 3,250,000
    const goal = 5000000;   // KSh 5,000,000
    const donors = 127;
    
    const percentage = (raised / goal) * 100;
    
    setTimeout(() => {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const raisedAmount = document.getElementById('raisedAmount');
        const donorCount = document.getElementById('donorCount');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressText.textContent = Math.round(percentage) + '%';
            raisedAmount.textContent = 'KSh ' + raised.toLocaleString();
            donorCount.textContent = donors;
        }
    }, 500);
}

// Call when page loads
window.addEventListener('load', updateProgressBar);
// Lightbox for Gallery
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const galleryItems = document.querySelectorAll('.gallery-item');
let currentLightboxIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentLightboxIndex = index;
        openLightbox(index);
    });
});

function openLightbox(index) {
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay p');
    
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption.textContent;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= galleryItems.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryItems.length - 1;
    openLightbox(currentLightboxIndex);
}

// Close lightbox when clicking on background
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with close button
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
        closeLightbox();
    }
    if (e.key === 'ArrowLeft' && lightbox.style.display === 'block') {
        changeLightboxImage(-1);
    }
    if (e.key === 'ArrowRight' && lightbox.style.display === 'block') {
        changeLightboxImage(1);
    }
});
// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});