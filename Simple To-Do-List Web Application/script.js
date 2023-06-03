var taskForm = document.getElementById('task-form');
var taskInput = document.getElementById('task-input');
var deadlineInput = document.getElementById('deadline-input');
var taskList = document.getElementById('task-list');
var clearButton = document.getElementById('clear');
var viewAllButton = document.getElementById('view-all');

// Retrieve tasks from local storage when the page loads
window.addEventListener('load', function () {
  var savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    taskList.innerHTML = savedTasks;
    attachTaskListeners();
  }
});

taskForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var taskText = taskInput.value;
  var deadline = deadlineInput.value;
  if (taskText !== '') {
    if (!isValidDate(deadline)) {
      alert('Wrong date format. Please enter the date in dd-mm-yyyy format.');
    } else {
      addTask(taskText, deadline);
      taskInput.value = '';
      deadlineInput.value = '';
      saveTasks();
    }
  }
});

function isValidDate(dateString) {
  var regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (!regex.test(dateString)) {
    return false;
  }
  var parts = dateString.split('-');
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  if (year < 1000 || year > 9999 || month === 0 || month > 12) {
    return false;
  }

  var maxDays = new Date(year, month, 0).getDate();
  return day <= maxDays;
}

function addTask(taskText, deadline) {
  var taskItem = document.createElement('li');
  taskItem.className = 'list-group-item d-flex align-items-center justify-content-between task-item';

  var taskDetailsDiv = document.createElement('div');
  taskDetailsDiv.className = 'task-details';

  var taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  taskDetailsDiv.appendChild(taskTextSpan);

  var deadlineSpan = document.createElement('span');
  deadlineSpan.textContent = deadline;
  deadlineSpan.className = 'deadline ml-2';
  taskDetailsDiv.appendChild(deadlineSpan);

  taskItem.appendChild(taskDetailsDiv);

  var buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'buttons';

  var updateButton = document.createElement('button');
  updateButton.textContent = 'Update';
  updateButton.className = 'btn btn-info';
  updateButton.addEventListener('click', function () {
    var newTask = prompt('Enter the new task:');
    if (newTask !== null) {
      var newDeadline = prompt('Enter the new deadline (dd-mm-yyyy):');
      if (newDeadline !== null) {
        if (!isValidDate(newDeadline)) {
          alert('Wrong date format. Please enter the date in dd-mm-yyyy format.');
        } else {
          taskTextSpan.textContent = newTask;
          deadlineSpan.textContent = newDeadline;
          saveTasks();
        }
      }
    }
  });
  buttonsDiv.appendChild(updateButton);

  var removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'btn btn-danger';
  removeButton.addEventListener('click', function () {
    taskItem.remove();
    saveTasks();
  });
  buttonsDiv.appendChild(removeButton);

  var markDoneButton = document.createElement('button');
  markDoneButton.textContent = 'Mark as Done';
  markDoneButton.className = 'btn btn-success';
  markDoneButton.addEventListener('click', function () {
    taskItem.classList.toggle('completed');
    saveTasks();
  });
  buttonsDiv.appendChild(markDoneButton);

  taskItem.appendChild(buttonsDiv);

  taskList.appendChild(taskItem);
}

clearButton.addEventListener('click', function (event) {
  event.preventDefault();
  clearAllTasks();
});

function clearAllTasks() {
  taskList.innerHTML = '';
  saveTasks();
}

viewAllButton.addEventListener('click', function (event) {
  event.preventDefault();
  var tasks = document.querySelectorAll('.task-item');
  tasks.forEach(function (task) {
    task.style.display = 'flex';
  });
});

function saveTasks() {
  localStorage.setItem('tasks', taskList.innerHTML);
}

function attachTaskListeners() {
  var updateButtons = document.querySelectorAll('.task-item .buttons button:nth-child(1)');
  var removeButtons = document.querySelectorAll('.task-item .buttons button:nth-child(2)');
  var markDoneButtons = document.querySelectorAll('.task-item .buttons button:nth-child(3)');

  updateButtons.forEach(function (updateButton) {
    updateButton.addEventListener('click', updateTask);
  });

  removeButtons.forEach(function (removeButton) {
    removeButton.addEventListener('click', removeTask);
  });

  markDoneButtons.forEach(function (markDoneButton) {
    markDoneButton.addEventListener('click', markTaskAsDone);
  });
}

function updateTask(event) {
  var updateButton = event.target;
  var taskItem = updateButton.closest('.task-item');
  var taskTextSpan = taskItem.querySelector('.task-details span:first-child');
  var deadlineSpan = taskItem.querySelector('.task-details .deadline');

  var newTask = prompt('Enter the new task:');
  if (newTask !== null) {
    var newDeadline = prompt('Enter the new deadline (dd-mm-yyyy):');
    if (newDeadline !== null) {
      if (!isValidDate(newDeadline)) {
        alert('Wrong date format. Please enter the date in dd-mm-yyyy format.');
      } else {
        taskTextSpan.textContent = newTask;
        deadlineSpan.textContent = newDeadline;
        saveTasks();
      }
    }
  }
}

function removeTask(event) {
  var removeButton = event.target;
  var taskItem = removeButton.closest('.task-item');
  taskItem.remove();
  saveTasks();
}

function markTaskAsDone(event) {
  var markDoneButton = event.target;
  var taskItem = markDoneButton.closest('.task-item');
  taskItem.classList.toggle('completed');
  saveTasks();
}
