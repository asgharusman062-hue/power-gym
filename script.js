// --- STICKY NAVBAR & MOBILE MENU ---
const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Smooth Scrolling for Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// --- COUNTDOWN TIMER ---
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 2);
targetDate.setHours(targetDate.getHours() + 14);

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if(difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('countdown-timer').innerText = "OFFER EXPIRED";
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- LIVE STATS COUNTER ---
const counters = document.querySelectorAll('.counter');
const speed = 200; // lower is slower

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer to trigger stats animation when scrolled into view
const observerOptions = { threshold: 0.5 };
const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.getElementById('stats-counter');
if(statsSection) statsObserver.observe(statsSection);

// --- TESTIMONIAL SLIDER ---
const slides = document.querySelectorAll('.testimonial-slide');
let currentSlide = 0;

document.getElementById('nextSlide')?.addEventListener('click', () => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
});

document.getElementById('prevSlide')?.addEventListener('click', () => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
});

// Auto slide every 5 seconds
setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 5000);


// --- TOOL TABS LOGIC ---
window.openTool = function(evt, toolName) {
    const tabContents = document.getElementsByClassName("tool-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].className = tabBtns[i].className.replace(" active", "");
    }
    document.getElementById(toolName).style.display = "block";
    evt.currentTarget.className += " active";
}

// --- BMI CALCULATOR ---
const bmiForm = document.getElementById('bmi-form');
if(bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('weight').value);
        const heightM = parseFloat(document.getElementById('height').value) / 100;
        
        if (weight > 0 && heightM > 0) {
            const bmi = (weight / (heightM * heightM)).toFixed(1);
            document.getElementById('bmi-value').textContent = bmi;
            
            const bmiStatus = document.getElementById('bmi-status');
            if (bmi < 18.5) { bmiStatus.textContent = 'Underweight'; bmiStatus.style.color = '#ff9800'; }
            else if (bmi <= 24.9) { bmiStatus.textContent = 'Normal'; bmiStatus.style.color = '#4CAF50'; }
            else if (bmi <= 29.9) { bmiStatus.textContent = 'Overweight'; bmiStatus.style.color = '#ff9800'; }
            else { bmiStatus.textContent = 'Obese'; bmiStatus.style.color = '#d32f2f'; }
            
            document.getElementById('bmi-result').classList.remove('hidden');
        }
    });
}

// --- CALORIES CALCULATOR ---
const calorieForm = document.getElementById('calorie-form');
if(calorieForm) {
    calorieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const age = parseFloat(document.getElementById('c-age').value);
        const gender = document.getElementById('c-gender').value;
        const weight = parseFloat(document.getElementById('c-weight').value);
        const height = parseFloat(document.getElementById('c-height').value);
        const activity = parseFloat(document.getElementById('c-activity').value);

        if (age > 0 && weight > 0 && height > 0) {
            // Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            
            const maintenance = Math.round(bmr * activity);
            const deficit = maintenance - 500; // standard fat loss deficit

            document.getElementById('cal-maint').innerText = maintenance;
            document.getElementById('cal-loss').innerText = deficit;
            document.getElementById('calorie-result').classList.remove('hidden');
        }
    });
}

// Contact form prevent default
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Request Sent! We will contact you regarding your free trial within 24 hours.');
});
