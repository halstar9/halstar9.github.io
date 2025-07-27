const addTaskButton = document.querySelector('#addTaskButton');
const addTaskFormFields = document.querySelector('#addTaskFormFields');
const taskTextBox = document.querySelector('#taskTextBox');
const taskDueDate = document.querySelector('#taskDueDate');
const taskPriority = document.querySelector('#taskPriority');
const taskCategory = document.querySelector('#taskCategory');
const confirmAddTaskButton = document.querySelector('#confirmAddTaskButton');
const cancelAddTaskButton = document.querySelector('#cancelAddTaskButton')
const deleteTaskButton = document.querySelector('#deleteTaskButton');
const taskList = document.querySelector('#taskList');
const placeholder = document.querySelector('main p');
const updateTaskButton = document.querySelector('#updateTaskButton');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#SearchButton');
const mainContent = document.querySelector('.main-content');
const filterByDateButton = document.querySelector('#filterByDateButton');
const filterByPriorityButton = document.querySelector('#filterByPriorityButton');
const filterByCategoryButton = document.querySelector('#filterByCategoryButton');
const filterOptionsDiv = document.querySelector('.filter-options');

//Event Listeners
// Event listener for creating a text box for input when clicking the add task button
addTaskButton.addEventListener('click', () => {
    setFormFields();
    addTaskFormFields.style.display = 'block';
    confirmAddTaskButton.textContent = 'Confirm add';
    cancelAddTaskButton.textContent = 'Cancel';
    taskTextBox.focus();
    delete addTaskFormFields.dataset.updatingTaskId;
});

confirmAddTaskButton.addEventListener('click', addTask);

cancelAddTaskButton.addEventListener('click', () => {
    resetAddForm();
});

filterByDateButton.addEventListener('click', () => {
    filterOptionsDiv.innerHTML = '';

    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Due on or before: ';
    dateLabel.htmlFor = 'dueDateFilterInput';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'dueDateFilterInput';
    dateInput.classList.add('filter-input');

    filterOptionsDiv.appendChild(dateLabel);
    filterOptionsDiv.appendChild(dateInput);

    dateInput.addEventListener('change', filterTasks);

    const clearDateFilterButton = document.createElement('button');
    clearDateFilterButton.textContent = 'Clear date filter';
    clearDateFilterButton.classList.add('clear-filter-button');
    filterOptionsDiv.appendChild(clearDateFilterButton);

    clearDateFilterButton.addEventListener('click', () => {
        dateInput.value = '';
        filterTasks();
    });

    filterTasks();
});

filterByPriorityButton.addEventListener('click', () => {
    filterOptionsDiv.innerHTML = '';
    
    const prioritySelect = document.createElement('select');
    prioritySelect.id = 'priorityFilterSelect';
    prioritySelect.innerHTML = `
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
    `;
    filterOptionsDiv.appendChild(prioritySelect);
    
    prioritySelect.addEventListener('change', () => {
        filterTasks();
    });
});

filterByCategoryButton.addEventListener('click', () => {
    // Clear any existing filter options
    filterOptionsDiv.innerHTML = '';

    // Create a label
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Filter by Category: ';
    categoryLabel.htmlFor = 'categoryFilterInput';

    // Create a text input for category filter
    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'categoryFilterInput';
    categoryInput.placeholder = 'e.g., Work, Personal';
    categoryInput.classList.add('filter-input');

    // Append label and input
    filterOptionsDiv.appendChild(categoryLabel);
    filterOptionsDiv.appendChild(categoryInput);

    // Add an event listener for input changes (as user types)
    categoryInput.addEventListener('input', filterTasks); // Re-run filter on input

    // Optional: Add a "Clear Category Filter" button
    const clearCategoryFilterButton = document.createElement('button');
    clearCategoryFilterButton.textContent = 'Clear Category Filter';
    clearCategoryFilterButton.classList.add('clear-filter-button');
    filterOptionsDiv.appendChild(clearCategoryFilterButton);

    clearCategoryFilterButton.addEventListener('click', () => {
        categoryInput.value = ''; // Clear the input
        filterTasks(); // Re-run filter to show all
    });

    filterTasks(); // Immediately apply filter if input pre-filled (unlikely here)
});

// Event listener to handle task selection and deselection for the main content area
mainContent.addEventListener('click', function(event) {
    const clickedElement = event.target;
    const currentlySelected = document.querySelector('.selected');

    //Check if element is an 'LI'
    if (clickedElement && clickedElement.tagName === 'LI' && taskList.contains(clickedElement)) {
        //if clicked element is already selected, deselect it
        if (clickedElement === currentlySelected) {
            clickedElement.classList.remove('selected');
        } else {
            //If another task is currently selected, deselect it
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }
            //Select the newly clicked task
            clickedElement.classList.add('selected');
        }
    } else { //If the clicked element is not a 'LI'
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }
    }
});

//Event listener for deleting selected tasks
deleteTaskButton.addEventListener('click', deleteTask);


//Event listener for updating tasks
if (updateTaskButton) {
    updateTaskButton.addEventListener('click', updateTask);
}

//Event listener for searching through tasks
if (searchButton) {
    searchButton.addEventListener('click', searchTasks);
}

if (searchInput) {
    searchInput.addEventListener('keydown', function(event) {
        if (event.key == 'Enter') {
            searchTasks();
        }
    });
}

//Event listener for changing checkbox upon task completion
taskList.addEventListener('change', function(event) {
    if (event.target && event.target.classList.contains('task-checkbox')) {
        const checkbox = event.target;
        const listItem = checkbox.closest('li');

        if (listItem) {
            let task = JSON.parse(listItem.dataset.task);

            //update task complete status if box is checked
            task.completed = checkbox.checked;

            //save updated task to attribute
            listItem.dataset.task = JSON.stringify(task);


            if (task.completed) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('complete');
            }
            listItem.classList.remove('completed')
            saveTasks();
        }
    }
})


//Functions 
function setFormFields(task = {text: '', dueDate: '', priority: '', category: ''}) {
    taskTextBox.value = task.text;
    taskDueDate.value = task.dueDate;
    taskPriority.value = task.priority;
    taskCategory.value = task.category;
}

function resetAddForm() {
    setFormFields();
    addTaskFormFields.style.display = 'none';
    confirmAddTaskButton.textContent = 'Confirm Add';
    cancelAddTaskButton.textContent = 'Cancel';
    delete addTaskFormFields.dataset.updatingTaskId;
}


function addTask() {
    const taskText = taskTextBox.value.trim();
    const dueDate = taskDueDate.value;
    const priority = taskPriority.value;
    const category = taskCategory.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const updatingTaskId = addTaskFormFields.dataset.updatingTaskId;
    let taskToModify = null;
    let listItemToModify = null;

    if (updatingTaskId) {
        taskList.querySelectorAll('li').forEach(item => {
            const taskObj = JSON.parse(item.dataset.task);
            if (taskObj.text === updatingTaskId) {
                listItemToModify = item;
                taskToModify = taskObj;
            }
        });

        if (!listItemToModify) {
            console.error("Error: Could not find the task to update with ID:", updatingTaskId);
            alert("Error updating task. Please try again.");
            resetAddForm();
            return;
        }

        
        taskToModify.text = taskText;
        taskToModify.dueDate = dueDate;
        taskToModify.priority = priority;
        taskToModify.category = category;

        
        listItemToModify.querySelector('.task-text').textContent = taskToModify.text;

    
        const detailsDiv = listItemToModify.querySelector('.task-details') || document.createElement('div');
        detailsDiv.classList.add('task-details');
        detailsDiv.innerHTML = '';

        if (taskToModify.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('task-due-date');
            dueDateSpan.textContent = `Due: ${new Date(taskToModify.dueDate).toLocaleDateString()}`;
            detailsDiv.appendChild(dueDateSpan);
        }
        if (taskToModify.priority) {
            const prioritySpan = document.createElement('span');
            prioritySpan.classList.add('task-priority');
            prioritySpan.textContent = `Priority: ${taskToModify.priority.charAt(0).toUpperCase() + taskToModify.priority.slice(1)}`;
            detailsDiv.appendChild(prioritySpan);
        }
        if (taskToModify.category) {
            const categorySpan = document.createElement('span');
            categorySpan.classList.add('task-category');
            categorySpan.textContent = `Category: ${taskToModify.category}`;
            detailsDiv.appendChild(categorySpan);
        }

        
        if (detailsDiv.children.length > 0 && !listItemToModify.querySelector('.task-details')) {
             listItemToModify.appendChild(detailsDiv);
        } else if (detailsDiv.children.length === 0 && listItemToModify.querySelector('.task-details')) {
             listItemToModify.querySelector('.task-details').remove();
        }
        
        listItemToModify.dataset.task = JSON.stringify(taskToModify);
        
        listItemToModify.classList.remove('selected');

    } else {

        if (placeholder) {
            placeholder.style.display = 'none';
        }

        const task = {
            text: taskText,
            completed: false,
            dueDate: dueDate,
            priority: priority,
            category: category,
        };

        const listItem = document.createElement('li');
        listItem.dataset.task = JSON.stringify(task)

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.classList.add('task-text');

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('task-details');

        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('task-due-date');
            dueDateSpan.textContent = `Due: ${new Date(task.dueDate).toLocaleDateString()}`;
            detailsDiv.appendChild(dueDateSpan);
        }
        if (task.priority) {
            const prioritySpan = document.createElement('span');
            prioritySpan.classList.add('task-priority');
            prioritySpan.textContent = `Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
            detailsDiv.appendChild(prioritySpan);
        }
        if(task.category) {
            const categorySpan = document.createElement('span');
            categorySpan.classList.add('task-category');
            categorySpan.textContent = `Category: ${task.category}`;
            detailsDiv.appendChild(categorySpan);
        }

        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextSpan);
        if (detailsDiv.children.length > 0) {
            listItem.appendChild(detailsDiv);
        }
        if (task.completed) {
            listItem.classList.add('completed');
            checkbox.checked = true;
        }
        taskList.appendChild(listItem);
    }

    saveTasks();
    resetAddForm();
    filterTasks();

}

function deleteTask() {
    const taskToDelete = document.querySelector('#taskList .selected');

    if (taskToDelete) {
        taskToDelete.remove();
        saveTasks();
        filterTasks();
    } else {
        alert("Please select a task to delete.");
    }
}

function saveTasks() {
    const tasksToSave = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskData = taskItem.dataset.task;
        if (taskData) {
            try {
                tasksToSave.push(JSON.parse(taskData));
            } catch (e) {
                console.error("Error parsing task data from a list item, skipping:", taskData, e);
            }
        }
    });
    localStorage.setItem('nextup_tasks', JSON.stringify(tasksToSave));
}

function loadTasks() {
    const savedTasksRaw = localStorage.getItem('nextup_tasks');

    if (!savedTasksRaw || savedTasksRaw === '[]') {
        taskList.innerHTML = '';
        if (placeholder) {
            placeholder.style.display = 'block';
        }
        return;
    }

    let tasksParsed;
    try {
        tasksParsed = JSON.parse(savedTasksRaw);
    } catch (e) {
        console.error("Error parsing saved tasks from localStorage:", e);
        localStorage.removeItem('nextup_tasks');
        alert("Your saved tasks might be corrupted and have been cleared.");
        taskList.innerHTML = '';
        if (placeholder) {
            placeholder.style.display = 'block';
        }
        return;
    }

    taskList.innerHTML = '';
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    tasksParsed.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.task = JSON.stringify(task);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.classList.add('task-text');

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('task-details');

        if (task.dueDate && task.dueDate.trim() !== '') {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('task-due-date');
            try {
                dueDateSpan.textContent = `Due: ${new Date(task.dueDate).toLocaleDateString()}`;
            } catch (e) {
                console.warn("Could not format date for task:", task.text, e);
                dueDateSpan.textContent = `Due: ${task.dueDate}`;
            }
            detailsDiv.appendChild(dueDateSpan);
        }

        if (task.priority && task.priority.trim() !== '') {
            const prioritySpan = document.createElement('span');
            prioritySpan.classList.add('task-priority');
            prioritySpan.textContent = `Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
            detailsDiv.appendChild(prioritySpan);
        }

        if (task.category && task.category.trim() !== '') {
            const categorySpan = document.createElement('span');
            categorySpan.classList.add('task-category');
            categorySpan.textContent = `Category: ${task.category}`;
            detailsDiv.appendChild(categorySpan);
        }

        if (task.completed) {
            listItem.classList.add('completed');
        }

        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextSpan);
        if (detailsDiv.children.length > 0) {
            listItem.appendChild(detailsDiv);
        }

        taskList.appendChild(listItem);
    });

    if (taskList.children.length === 0 && placeholder) {
        placeholder.style.display = 'block';
    }
}

function updateTask() { 
    const taskToUpdate = document.querySelector('#taskList .selected');

    if (taskToUpdate) {
        const task = JSON.parse(taskToUpdate.dataset.task);

        setFormFields(task);
        addTaskFormFields.style.display = 'block';
        confirmAddTaskButton.textContent = 'Confirm Update';
        cancelAddTaskButton.textContent = 'Cancel Update';

        addTaskFormFields.dataset.updatingTaskId = taskToUpdate.dataset.id || task.text;
    } else {
        alert("Please select a task to update.")
    }
}

function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const tasks = taskList.querySelectorAll('li');

    if (searchTerm === "") {
        tasks.forEach(task => {
            task.style.display = '';
        });

        const currentlySelected = document.querySelector('.selected');
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }
        return;
    }

    tasks.forEach(taskItem => {
        const task = JSON.parse(taskItem.dataset.task);
        const textMatches = task.text.toLowerCase().includes(searchTerm);
        const categoryMatches = task.category ? task.category.toLowerCase().includes(searchTerm) : false;
        const priorityMatches = task.priority ? task.priority.toLowerCase().includes(searchTerm) : false;

        if (textMatches || categoryMatches || priorityMatches) {
            taskItem.style.display = '';
        } else {
            taskItem.style.display = 'none';
            if (taskItem.classList.contains('selected')) {
                taskItem.classList.remove('selected');
            }
        }
    });
}

// Modify your existing filterTasks function
function filterTasks() {
    const allTasks = taskList.querySelectorAll('li');

    // Get filter values
    const selectedPriority = document.querySelector('#priorityFilterSelect') ? document.querySelector('#priorityFilterSelect').value : 'all';
    const selectedDueDateRaw = document.querySelector('#dueDateFilterInput') ? document.querySelector('#dueDateFilterInput').value : '';
    const selectedCategory = document.querySelector('#categoryFilterInput') ? document.querySelector('#categoryFilterInput').value.toLowerCase().trim() : ''; // NEW


    // Convert selectedDueDateRaw to a Date object for comparison, if it exists
    const selectedDueDate = selectedDueDateRaw ? new Date(selectedDueDateRaw) : null;
    if (selectedDueDate) {
        selectedDueDate.setHours(23, 59, 59, 999);
    }

    // Determine if any filter is active
    let anyFilterActive = (selectedPriority !== 'all' || selectedDueDate !== null || selectedCategory !== ''); // NEW: Include category filter

    if (!anyFilterActive && allTasks.length > 0) {
        allTasks.forEach(listItem => {
            listItem.style.display = ''; // Ensure all tasks are visible
        });
        const currentlySelected = document.querySelector('.selected');
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }
        if (allTasks.length === 0 && placeholder) {
            placeholder.style.display = 'block';
        } else if (placeholder) {
            placeholder.style.display = 'none';
        }
        return;
    }


    allTasks.forEach(listItem => {
        const taskData = listItem.dataset.task;
        if (!taskData) {
            listItem.style.display = 'none';
            return;
        }

        let task;
        try {
            task = JSON.parse(taskData);
        } catch (e) {
            console.error("Error parsing task data-attribute:", taskData, e);
            listItem.style.display = 'none';
            return;
        }

        let isVisible = true; // Assume task is visible until a filter hides it

        // Priority Filter Logic (existing)
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
            isVisible = false;
        }

        // Due Date Filter Logic (existing)
        if (isVisible && selectedDueDate) {
            const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
            if (taskDueDate) {
                taskDueDate.setHours(23, 59, 59, 999);
                if (taskDueDate > selectedDueDate) {
                    isVisible = false;
                }
            } else {
                isVisible = false; // Hide tasks without a due date if filter is active
            }
        }

        // Category Filter Logic (NEW)
        if (isVisible && selectedCategory !== '') { // Only apply if currently visible and a category is typed
            const taskCategoryLower = task.category ? task.category.toLowerCase().trim() : '';
            if (!taskCategoryLower.includes(selectedCategory)) { // Check if task's category contains the typed string
                isVisible = false;
            }
        }


        // Apply visibility
        if (isVisible) {
            listItem.style.display = '';
        } else {
            listItem.style.display = 'none';
            if (listItem.classList.contains('selected')) {
                listItem.classList.remove('selected');
            }
        }
    });

    const visibleTasksInDOM = Array.from(allTasks).filter(item => item.style.display !== 'none');
    if (visibleTasksInDOM.length === 0 && placeholder) {
        placeholder.style.display = 'block';
    } else if (placeholder) {
        placeholder.style.display = 'none';
    }
}


//Load Tasks saved in local Storage on page load
loadTasks();
resetAddForm();
filterTasks();

