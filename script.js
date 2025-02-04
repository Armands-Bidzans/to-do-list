class TodoApp {
  constructor() {
      this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      this.cacheElements();
      this.initEventListeners();
      this.renderTasks();
  }

  cacheElements() {
      this.elements = {
          taskDate: document.getElementById('taskDate'),
          taskInput: document.getElementById('taskInput'),
          addButton: document.getElementById('addButton'),
          taskList: document.getElementById('taskList'),
          deleteButtons: document.getElementById('deleteButtons'),
          deleteSelected: document.getElementById('deleteSelected'),
          deleteAll: document.getElementById('deleteAll')
      };
  }

  initEventListeners() {
      this.elements.addButton.addEventListener('click', () => this.addTask());
      this.elements.deleteSelected.addEventListener('click', () => this.deleteSelected());
      this.elements.deleteAll.addEventListener('click', () => this.deleteAll());
      this.elements.taskList.addEventListener('change', (e) => {
          if(e.target.classList.contains('checkbox')) this.toggleDeleteButtons();
      });
  }

  saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask() {
      const { taskDate, taskInput } = this.elements;

      if (!taskDate.value || !taskInput.value.trim()) {
          alert('Lūdzu, ievadiet datumu un uzdevumu');
          return;
      }

      this.tasks.push({
          id: Date.now(),
          date: taskDate.value,
          text: taskInput.value.trim()
      });

      this.saveTasks();
      this.renderTasks();

      taskDate.value = '';
      taskInput.value = '';
  }

  renderTasks() {
      this.elements.taskList.innerHTML = this.tasks
          .map(task => `
              <li class="task-item" data-id="${task.id}">
                  <input type="checkbox" class="checkbox">
                  <span class="task-date">${task.date}</span>
                  <span>${task.text}</span>
              </li>
          `).join('');

      this.toggleDeleteButtons();
  }

  toggleDeleteButtons() {
      const checkboxes = document.querySelectorAll('.checkbox');
      const hasChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
      this.elements.deleteButtons.style.display = hasChecked ? 'flex' : 'none';
  }

  deleteSelected() {
      const checkboxes = document.querySelectorAll('.checkbox');
      const idsToDelete = [];

      checkboxes.forEach((checkbox, index) => {
          if(checkbox.checked) {
              idsToDelete.push(Number(checkbox.closest('.task-item').dataset.id));
          }
      });

      this.tasks = this.tasks.filter(task => !idsToDelete.includes(task.id));
      this.saveTasks();
      this.renderTasks();
  }

  deleteAll() {
      if(confirm('Vai tiešām vēlaties dzēst visus uzdevumus?')) {
          this.tasks = [];
          this.saveTasks();
          this.renderTasks();
      }
  }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());