const addTaskButton = document.querySelector('#addTaskButton');
const deleteTaskButton = document.querySelector('#deleteTaskButton')
const taskTextBox = document.querySelector('#taskTextBox');
const taskList = document.querySelector('#taskList');
const placeholder = document.querySelector('main p');

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

taskList.addEventListener('click', function(event) {
    if (event.target && event.target.tagName === 'LI') {
        const clickedTask = event.target;
        const currentlySelected = document.querySelector('.selected');

        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }

        clickedTask.classList.add('selected');
    }
});

deleteTaskButton.addEventListener('click', deleteTask);

function addTask() {
    const taskText = taskTextBox.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    if (placeholder) {
        placeholder.style.display = 'none';
    }

    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    taskList.appendChild(listItem);

    taskTextBox.value = '';

    taskTextBox.style.display = 'none';

}

function deleteTask() {
    const taskToDelete = document.querySelector('#taskList .selected');

    if (taskToDelete) {
        taskToDelete.remove();
    } else {
        alert("Please select a task to delete.");
    }

    if (taskList.children.length === 0 && placeholder) {
        placeholder.style.display = 'block';
    }
}