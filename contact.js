document.addEventListener('DOMContentLoaded', function() {
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !subject || !message) {
                document.getElementById('contact-error').textContent = 'Please fill in all fields';
                document.getElementById('contact-error').style.display = 'block';
                document.getElementById('contact-success').style.display = 'none';
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('contact-error').textContent = 'Please enter a valid email address';
                document.getElementById('contact-error').style.display = 'block';
                document.getElementById('contact-success').style.display = 'none';
                return;
            }
            
            // Hide error message
            document.getElementById('contact-error').style.display = 'none';
            
            // Prepare form data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            
            // Send contact form request
            fetch('php/contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    document.getElementById('contact-success').textContent = 'Thank you for your message! We will get back to you soon.';
                    document.getElementById('contact-success').style.display = 'block';
                    document.getElementById('contact-error').style.display = 'none';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Display error message
                    document.getElementById('contact-error').textContent = data.message || 'Failed to send message. Please try again.';
                    document.getElementById('contact-error').style.display = 'block';
                    document.getElementById('contact-success').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                document.getElementById('contact-error').textContent = 'An error occurred while sending your message. Please try again.';
                document.getElementById('contact-error').style.display = 'block';
                document.getElementById('contact-success').style.display = 'none';
            });
        });
    }
});