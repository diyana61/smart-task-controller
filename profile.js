document.addEventListener('DOMContentLoaded', function () {
    // Load user profile data
    function loadProfileData() {
        fetch('php/get_user.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update profile information
                    document.getElementById('profile-fullname').textContent = data.fullname;
                    document.getElementById('profile-email').textContent = data.email;

                    // Format joined date
                    const joinedDate = new Date(data.created_at);
                    const formattedDate = joinedDate.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    });
                    document.getElementById('profile-joined').textContent = `Member since ${formattedDate}`;

                    // Update form fields
                    document.getElementById('fullname').value = data.fullname;
                    document.getElementById('email').value = data.email;

                    if (data.phone) {
                        document.getElementById('phone').value = data.phone;
                    }

                    if (data.bio) {
                        document.getElementById('bio').value = data.bio;
                    }

                    // Update profile picture or display the first letter of the user's name
                    const profileInitialElement = document.getElementById('profile-initial');
                    const profilePictureElement = document.getElementById('profile-picture');

                    if (data.profile_picture) {
                        // If a profile picture is available, display it
                        profilePictureElement.src = data.profile_picture;
                        profilePictureElement.style.display = 'block';
                        profileInitialElement.style.display = 'none';
                    } else {
                        // If no profile picture, display the first letter of the user's name
                        const firstLetter = data.fullname.charAt(0).toUpperCase();
                        profileInitialElement.textContent = firstLetter;
                        profileInitialElement.style.display = 'flex';
                        profilePictureElement.style.display = 'none';
                    }

                    // Update username in header
                    const usernameElement = document.getElementById('username');
                    if (usernameElement) {
                        usernameElement.textContent = data.fullname;
                    }

                    // Load preferences if available
                    if (data.preferences) {
                        const preferences = JSON.parse(data.preferences);

                        if (preferences.theme) {
                            document.getElementById('theme').value = preferences.theme;
                        }

                        if (preferences.notifications) {
                            document.getElementById('notify-tasks').checked = preferences.notifications.tasks || false;
                            document.getElementById('notify-updates').checked = preferences.notifications.updates || false;
                            document.getElementById('notify-news').checked = preferences.notifications.news || false;
                        }
                    }
                } else {
                    console.error('Failed to load profile data');
                }
            })
            .catch(error => {
                console.error('Error loading profile data:', error);
            });
    }

    // Handle tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to selected button and pane
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle account info form submission
    const accountInfoForm = document.getElementById('account-info-form');

    if (accountInfoForm) {
        accountInfoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const bio = document.getElementById('bio').value;

            // Validate form
            if (!fullname || !email) {
                alert('Name and email are required.');
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('bio', bio);

            // Send update profile request
            fetch('php/update_profile.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reload profile data
                        loadProfileData();

                        // Show success message
                        alert('Profile updated successfully.');
                    } else {
                        // Display error message
                        alert(data.message || 'Failed to update profile. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error updating profile:', error);
                    alert('An error occurred while updating your profile. Please try again.');
                });
        });
    }

    // Handle password form submission
    const passwordForm = document.getElementById('password-form');

    if (passwordForm) {
        passwordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            // Reset error messages
            document.getElementById('current-password-error').style.display = 'none';
            document.getElementById('new-password-error').style.display = 'none';
            document.getElementById('confirm-new-password-error').style.display = 'none';

            // Validate form
            let hasError = false;

            if (!currentPassword) {
                document.getElementById('current-password-error').textContent = 'Current password is required';
                document.getElementById('current-password-error').style.display = 'block';
                hasError = true;
            }

            if (!newPassword) {
                document.getElementById('new-password-error').textContent = 'New password is required';
                document.getElementById('new-password-error').style.display = 'block';
                hasError = true;
            } else if (newPassword.length < 8) {
                document.getElementById('new-password-error').textContent = 'Password must be at least 8 characters long';
                document.getElementById('new-password-error').style.display = 'block';
                hasError = true;
            }

            if (newPassword !== confirmNewPassword) {
                document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
                document.getElementById('confirm-new-password-error').style.display = 'block';
                hasError = true;
            }

            if (hasError) {
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('current_password', currentPassword);
            formData.append('new_password', newPassword);

            // Send change password request
            fetch('php/change_password.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Clear form
                        passwordForm.reset();

                        // Show success message
                        alert('Password changed successfully.');
                    } else {
                        // Display error message
                        if (data.field === 'current_password') {
                            document.getElementById('current-password-error').textContent = data.message;
                            document.getElementById('current-password-error').style.display = 'block';
                        } else {
                            alert(data.message || 'Failed to change password. Please try again.');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error changing password:', error);
                    alert('An error occurred while changing your password. Please try again.');
                });
        });
    }

    // Handle preferences form submission
    const preferencesForm = document.getElementById('preferences-form');

    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const theme = document.getElementById('theme').value;
            const notifyTasks = document.getElementById('notify-tasks').checked;
            const notifyUpdates = document.getElementById('notify-updates').checked;
            const notifyNews = document.getElementById('notify-news').checked;

            // Prepare preferences object
            const preferences = {
                theme: theme,
                notifications: {
                    tasks: notifyTasks,
                    updates: notifyUpdates,
                    news: notifyNews
                }
            };

            // Prepare form data
            const formData = new FormData();
            formData.append('preferences', JSON.stringify(preferences));

            // Send update preferences request
            fetch('php/update_preferences.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        alert('Preferences updated successfully.');

                        // Apply theme if changed
                        if (theme === 'dark') {
                            document.body.classList.add('dark-theme');
                        } else {
                            document.body.classList.remove('dark-theme');
                        }
                    } else {
                        // Display error message
                        alert(data.message || 'Failed to update preferences. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error updating preferences:', error);
                    alert('An error occurred while updating your preferences. Please try again.');
                });
        });
    }

    // Handle profile picture change
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');

    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function () {
            alert('Profile picture upload functionality would be implemented here.');
            // In a real implementation, this would open a file picker and upload the selected image
        });
    }

    // Load profile data
    loadProfileData();
});