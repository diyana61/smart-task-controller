document.addEventListener('DOMContentLoaded', function() {
    // Handle create task form submission
    const createTaskForm = document.getElementById('create-task-form');
    
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-description').value;
            const dueDate = document.getElementById('due-date').value;
            const priority = document.getElementById('task-priority').value;
            const status = document.getElementById('task-status').value;
            const category = document.getElementById('task-category').value;
            
            // Validate form
            let hasError = false;
            
            if (!title) {
                document.getElementById('title-error').textContent = 'Task title is required';
                document.getElementById('title-error').style.display = 'block';
                hasError = true;
            } else {
                document.getElementById('title-error').style.display = 'none';
            }
            
            if (!dueDate) {
                document.getElementById('due-date-error').textContent = 'Due date is required';
                document.getElementById('due-date-error').style.display = 'block';
                hasError = true;
            } else {
                document.getElementById('due-date-error').style.display = 'none';
            }
            
            if (hasError) {
                return;
            }
            
            // Prepare form data
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('due_date', dueDate);
            formData.append('priority', priority);
            formData.append('status', status);
            formData.append('category', category);
            
            // Send create task request
            fetch('php/create_task.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to dashboard on successful task creation
                    window.location.href = 'dashboard.html';
                } else {
                    // Display error message
                    alert(data.message || 'Failed to create task. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error creating task:', error);
                alert('An error occurred while creating the task. Please try again.');
            });
        });
    }
    
    // Set minimum date for due date picker to today
    const dueDateInput = document.getElementById('due-date');
    if (dueDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        
        // Format month and day to have leading zeros if needed
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        dueDateInput.min = `${year}-${month}-${day}`;
    }
    
    // Load user data for the page
    function loadUserData() {
        fetch('php/get_user.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update username in header
                    const usernameElement = document.getElementById('username');
                    if (usernameElement) {
                        usernameElement.textContent = data.fullname;
                    }
                    
                    // Update profile picture if available
                    if (data.profile_picture) {
                        const profilePics = document.querySelectorAll('.profile-toggle img');
                        profilePics.forEach(pic => {
                            pic.src = data.profile_picture;
                        });
                    }
                } else {
                    console.error('Failed to load user data');
                }
            })
            .catch(error => {
                console.error('Error loading user data:', error);
            });
    }
    
    // Load user data
    loadUserData();
});