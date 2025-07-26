const addTaskButton = document.querySelector('#addTaskButton');
const deleteTaskButton = document.querySelector('#deleteTaskButton')
const taskTextBox = document.querySelector('#taskTextBox');
const taskList = document.querySelector('#taskList');
const placeholder = document.querySelector('main p');
const updateTaskButton = document.querySelector('#updateTaskButton');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#SearchButton');
const mainContent = document.querySelector('.main-content');

//Event Listeners
addTaskButton.addEventListener('click', () => {
    taskTextBox.style.display = 'block';
    taskTextBox.focus();
});

taskTextBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
});

mainContent.addEventListener('click', function(event) {
    const clickedElement = event.target;
    const currentlySelected = document.querySelector('.selected');

    if (clickedElement && clickedElement.tagName === 'LI' && taskList.contains(clickedElement)) {
        if (clickedElement === currentlySelected) {
            clickedElement.classList.remove('selected');
        } else {
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }

            clickedElement.classList.add('selected');
        }
    } else {
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }
    }
});

deleteTaskButton.addEventListener('click', deleteTask);

if (updateTaskButton) {
    updateTaskButton.addEventListener('click', updateTask);
}

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

taskList.addEventListener('change', function(event) {
    if (event.target && event.target.classList.contains('task-checkbox')) {
        const checkbox = event.target;
        const listItem = checkbox.closest('li');

        if (listItem) {
            let task = JSON.parse(listItem.dataset.task);
            task.completed = checkbox.checked;
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
function addTask() {
    const taskText = taskTextBox.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    if (placeholder) {
        placeholder.style.display = 'none';
    }

    const task = {
        text: taskText,
        completed: false
    };

    const listItem = document.createElement('li');
    listItem.dataset.task = JSON.stringify(task)

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    taskTextSpan.classList.add('task-text');

    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextSpan);
    taskList.appendChild(listItem);
    
    taskTextBox.value = '';
    taskTextBox.style.display = 'none';

    saveTasks();

}

function deleteTask() {
    const taskToDelete = document.querySelector('#taskList .selected');

    if (taskToDelete) {
        taskToDelete.remove();
        saveTasks();
    } else {
        alert("Please select a task to delete.");
    }

    if (taskList.children.length === 0 && placeholder) {
        placeholder.style.display = 'block';
    }
}

function saveTasks() {
    const tasks = [];

    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskData = taskItem.dataset.task;
        if (taskData) {
            tasks.push(JSON.parse(taskData));
        }
    });
    localStorage.setItem('nextup_tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('nextup_tasks');

    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        if (tasks.length > 0) {
            if (placeholder){
                placeholder.style.display = 'none';
            }
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.dataset.task = JSON.stringify(task);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('task-checkbox');
                checkbox.checked = task.completed;

                const taskTextSpan = document.createElement('span');
                taskTextSpan.textContent = task.text;
                taskTextSpan.classList.add('task-text');

                if (task.completed) {
                    listItem.classList.add('completed');
                }
                listItem.appendChild(checkbox);
                listItem.appendChild(taskTextSpan);
                taskList.appendChild(listItem);
            });
        }
    }
    if (taskList.children.length === 0 && placeholder) {
        placeholder.style.display = 'block';
    }
}

function updateTask() { 
    const taskToUpdate = document.querySelector('#taskList .selected');

    if (taskToUpdate) {
        const taskTextSpan = taskToUpdate.querySelector('.task-text');
        if(!taskTextSpan) {
            alert("Could not find task to update.")
            return;
        }

        let task = JSON.parse(taskToUpdate.dataset.task);
        const newText = prompt("Update Task:", task.text);

        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();
            taskTextSpan.textContent = task.text;
            taskToUpdate.dataset.task = JSON.stringify(task);
            taskToUpdate.classList.remove('selected');
            
            saveTasks();
        } else if (newText != null) {
            alert("Task cannot be empty.")
        }
    } else {
        alert("Pleast select a task to update.")
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

    tasks.forEach(task => {
        const taskText = task.textContent.toLowerCase();

        if (taskText.includes(searchTerm)) {
            task.style.display = '';
        } else {
            task.style.display = 'none'; 
            if (task.classList.contains('selected')) {
                task.classList.remove('selected');
            }
        }
    });
}


//Load Tasks saved in local Storage on page load
loadTasks();

