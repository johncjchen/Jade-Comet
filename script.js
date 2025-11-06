// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.2)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.75)';
        navbar.style.boxShadow = '0 2px 20px rgba(16, 185, 129, 0.15)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
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

// Observe app cards and sections
document.querySelectorAll('.app-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact Form Handling with FormSubmit
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Check if redirected back with success message
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname + '#contact');
    }
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Add hover effects to app cards
document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Shooting Stars / Comets Animation
const canvas = document.getElementById('comets-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        // Start from random position on top or left edge
        this.x = Math.random() * canvas.width;
        this.y = -50;

        // Speed and angle (going down-right)
        this.speed = 3 + Math.random() * 4;
        this.angle = Math.PI / 4; // 45 degrees
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Visual properties
        this.length = 60 + Math.random() * 80;
        this.opacity = 0;
        this.fadeIn = true;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 100;
    }

    update() {
        // Move the star
        this.x += this.vx;
        this.y += this.vy;

        // Update opacity for fade in/out
        this.life++;
        if (this.life < 20) {
            this.opacity = this.life / 20;
        } else if (this.life > this.maxLife - 20) {
            this.opacity = (this.maxLife - this.life) / 20;
        } else {
            this.opacity = 1;
        }

        // Reset if off screen or life ended
        if (this.x > canvas.width + 100 || this.y > canvas.height + 100 || this.life > this.maxLife) {
            this.reset();
        }
    }

    draw() {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Calculate tail end point
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        // Draw the tail with gradient
        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // Draw the bright head
        const headGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 4);
        headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        headGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
        headGradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Create multiple shooting stars
const shootingStars = [];
for (let i = 0; i < 5; i++) {
    const star = new ShootingStar();
    // Stagger the initial positions
    star.life = -i * 50;
    shootingStars.push(star);
}

// Animation loop
function animate() {
    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear completely for crisp stars
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw all stars
    shootingStars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate();

// Console message
console.log('%c🚀 Jade Comet', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilding the future of mobile apps', 'font-size: 14px; color: #6b7280;');
