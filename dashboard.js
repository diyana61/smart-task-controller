document.addEventListener("DOMContentLoaded", () => {
    const statCards = document.querySelectorAll(".stat-card");
    const taskList = document.getElementById("task-list");
    const editButtons = document.querySelectorAll(".btn-outline");
    const editTaskModal = document.getElementById("edit-task-modal");
    const closeEditModalButton = editTaskModal.querySelector(".close-button");
    const dropdowns = document.querySelectorAll(".dropdown");
    const themeToggle = document.getElementById('theme-toggle');

    // Example tasks (replace with tasks fetched from the backend)
    const tasks = [
        { id: 1, title: "Finish the project report", description: "Complete the final report for the project.", due_date: "2025-05-02", priority: "High", status: "today" },
        { id: 2, title: "Team meeting", description: "Discuss project updates.", due_date: "2025-05-01", priority: "Medium", status: "completed" },
        { id: 3, title: "Submit assignment", description: "Submit the assignment to the professor.", due_date: "2025-04-30", priority: "Low", status: "overdue" }
    ];

    // Function to display tasks
    function displayTasks(filter = null) {
        taskList.innerHTML = ""; // Clear the task list

        const filteredTasks = filter ? tasks.filter(task => task.status === filter) : tasks;

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<p>No tasks available.</p>`;
            return;
        }

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");

            taskItem.innerHTML = `
                <div class="task-content">
                    <h4>${task.title}</h4>
                    <p>Due: ${task.due_date}</p>
                </div>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
                <div class="task-actions">
                    <a href="#" class="btn btn-outline" data-task-id="${task.id}"><i class="fas fa-edit"></i> Edit</a>
                </div>
            `;

            taskList.appendChild(taskItem);
        });

        
        attachEditButtonListeners();
    }

    function attachEditButtonListeners() {
        const editButtons = document.querySelectorAll(".btn-outline");
        editButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const taskId = button.getAttribute("data-task-id");
                openEditTaskModal(taskId);
            });
        });
    }

    function openEditTaskModal(taskId) {
        const taskData = tasks.find(task => task.id == taskId);

        if (!taskData) {
            alert("Task not found!");
            return;
        }

        document.getElementById("task-id").value = taskData.id;
        document.getElementById("task-title").value = taskData.title;
        document.getElementById("task-description").value = taskData.description || "";
        document.getElementById("due-date").value = taskData.due_date;
        document.getElementById("task-priority").value = taskData.priority.toLowerCase();

        // Show the modal
        editTaskModal.style.display = "block";
    }


    closeEditModalButton.addEventListener("click", () => {
        editTaskModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
        if (event.target === editTaskModal) {
            editTaskModal.style.display = "none";
        }
    });

    statCards.forEach(card => {
        card.addEventListener("click", () => {
            const filter = card.getAttribute("data-filter");
            displayTasks(filter);
        });
    });
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector("a");
        const menu = dropdown.querySelector(".dropdown-menu");

        link.addEventListener("click", (event) => {
            event.preventDefault();
            if (menu.style.display === "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        });

        document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target)) {
                menu.style.display = "none";
            }
        });
    });
    const viewAllTasksLink = document.querySelector(".view-tasks");
    viewAllTasksLink.addEventListener("click", (event) => {
        event.preventDefault();
        displayTasks(); 
    });

    
    const completedTasksLink = document.querySelector('.completed-tasks');
    const completedStatCard = document.querySelector('.stat-card[data-filter="completed"]');
    if (completedTasksLink && completedStatCard) {
        completedTasksLink.addEventListener('click', function() {
            completedStatCard.classList.add('shake');
            setTimeout(() => completedStatCard.classList.remove('shake'), 200);
        });
    }

    // Initial display of tasks (e.g., today's tasks)
    displayTasks("today");
});