document.addEventListener('DOMContentLoaded', function() {
    // Get task ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    if (!taskId) {
        // Redirect to dashboard if no task ID is provided
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Load task data
    function loadTaskData() {
        fetch(`php/get_task.php?id=${taskId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Populate form with task data
                    document.getElementById('task-id').value = data.task.id;
                    document.getElementById('task-title').value = data.task.title;
                    document.getElementById('task-description').value = data.task.description || '';
                    document.getElementById('due-date').value = data.task.due_date;
                    document.getElementById('task-priority').value = data.task.priority;
                    document.getElementById('task-status').value = data.task.status;
                    document.getElementById('task-category').value = data.task.category;
                } else {
                    // Display error and redirect to dashboard
                    alert('Task not found or you do not have permission to edit it.');
                    window.location.href = 'dashboard.html';
                }
            })
            .catch(error => {
                console.error('Error loading task data:', error);
                alert('An error occurred while loading the task. Please try again.');
                window.location.href = 'dashboard.html';
            });
    }
    
    // Handle edit task form submission
    const editTaskForm = document.getElementById('edit-task-form');
    
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const taskId = document.getElementById('task-id').value;
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
            formData.append('task_id', taskId);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('due_date', dueDate);
            formData.append('priority', priority);
            formData.append('status', status);
            formData.append('category', category);
            
            // Send update task request
            fetch('php/update_task.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to dashboard on successful task update
                    window.location.href = 'dashboard.html';
                } else {
                    // Display error message
                    alert(data.message || 'Failed to update task. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error updating task:', error);
                alert('An error occurred while updating the task. Please try again.');
            });
        });
    }
    
    // Handle delete task button
    const deleteTaskBtn = document.getElementById('delete-task-btn');
    
    if (deleteTaskBtn) {
        deleteTaskBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                // Get task ID
                const taskId = document.getElementById('task-id').value;
                
                // Prepare form data
                const formData = new FormData();
                formData.append('task_id', taskId);
                
                // Send delete task request
                fetch('php/delete_task.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Redirect to dashboard on successful task deletion
                        window.location.href = 'dashboard.html';
                    } else {
                        // Display error message
                        alert(data.message || 'Failed to delete task. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                    alert('An error occurred while deleting the task. Please try again.');
                });
            }
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
    
    // Load task data and user data
    loadTaskData();
    loadUserData();
});