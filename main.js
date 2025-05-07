document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Testimonial slider
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialDots.length > 0 && testimonialCards.length > 0) {
        testimonialDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                
                // Remove active class from all dots and cards
                testimonialDots.forEach(d => d.classList.remove('active'));
                testimonialCards.forEach(card => card.classList.remove('active'));
                
                // Add active class to selected dot and card
                this.classList.add('active');
                testimonialCards[index].classList.add('active');
            });
        });

        // Auto-rotate testimonials every 5 seconds
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            
            // Remove active class from all dots and cards
            testimonialDots.forEach(d => d.classList.remove('active'));
            testimonialCards.forEach(card => card.classList.remove('active'));
            
            // Add active class to next dot and card
            testimonialDots[currentIndex].classList.add('active');
            testimonialCards[currentIndex].classList.add('active');
        }, 5000);
    }

    // Animate counter for stats
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const animateCounter = (counter, target) => {
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounter(counter, target), 10);
            } else {
                counter.innerText = target;
            }
        };
        
        // Intersection Observer to start counter animation when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = counter.getAttribute('data-target');
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Check if user is logged in
    function checkLoginStatus() {
        fetch('php/check_login.php')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // If on homepage or public pages, add a "Go to Dashboard" button
                    const isPublicPage = ['index.html', 'about.html'].some(page => 
                        window.location.pathname.endsWith(page)
                    );
                    
                    if (isPublicPage) {
                        const ctaButtons = document.querySelector('.cta-buttons');
                        if (ctaButtons) {
                            // Clear existing buttons
                            ctaButtons.innerHTML = '';
                            
                            // Add dashboard button
                            const dashboardBtn = document.createElement('a');
                            dashboardBtn.href = 'dashboard.html';
                            dashboardBtn.className = 'btn btn-primary btn-large';
                            dashboardBtn.innerText = 'Go to Dashboard';
                            ctaButtons.appendChild(dashboardBtn);
                        }
                        
                        // Update navigation
                        const navLoginBtn = document.querySelector('.nav a[href="login.html"]');
                        const navSignupBtn = document.querySelector('.nav a[href="signup.html"]');
                        
                        if (navLoginBtn && navSignupBtn) {
                            navLoginBtn.href = 'dashboard.html';
                            navLoginBtn.innerText = 'Dashboard';
                            
                            navSignupBtn.href = 'php/logout.php';
                            navSignupBtn.innerText = 'Logout';
                        }
                    }
                } else {
                    // If on dashboard or other protected pages, redirect to login
                    const isProtectedPage = ['dashboard.html', 'profile.html', 'create-task.html', 'edit-task.html'].some(page => 
                        window.location.pathname.endsWith(page)
                    );
                    
                    if (isProtectedPage) {
                        window.location.href = 'login.html';
                    }
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }
    
    // Call login status check
    checkLoginStatus();

    // Add event listeners to header links to toggle the 'active' class
    const headerLinks = document.querySelectorAll('.nav a');

    headerLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove 'active' class from all links
            headerLinks.forEach(link => link.classList.remove('active'));

            // Add 'active' class to the clicked link
            link.classList.add('active');
        });
    });
});