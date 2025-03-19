class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.cacheElements();
    this.init();
  }

  cacheElements() {
    this.el = {
      taskDate: document.getElementById('taskDate'),
      taskInput: document.getElementById('taskInput'),
      taskList: document.getElementById('taskList'),
      deleteButtons: document.getElementById('deleteButtons')
    };
  }

  init() {
    document.getElementById('addButton').addEventListener('click', () => this.addTask());
    document.getElementById('deleteSelected').addEventListener('click', () => this.deleteSelected());
    document.getElementById('deleteAll').addEventListener('click', () => this.deleteAll());
    this.el.taskList.addEventListener('change', (e) => e.target.matches('.checkbox') && this.toggleDeleteButtons());
    this.render();
  }

  addTask() {
    if (!this.el.taskDate.value || !this.el.taskInput.value.trim()) return alert('Lūdzu, ievadiet datumu un uzdevumu');
    
    this.tasks.push({
      id: Date.now(),
      date: this.el.taskDate.value,
      text: this.el.taskInput.value.trim()
    });
    
    this.save();
    this.render();
    this.el.taskDate.value = this.el.taskInput.value = '';
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  render() {
    this.el.taskList.innerHTML = this.tasks.map(task => `
      <li class="task-item" data-id="${task.id}">
        <input type="checkbox" class="checkbox">
        <span class="task-date">${task.date}</span>
        <span>${task.text}</span>
      </li>
    `).join('');
    
    this.toggleDeleteButtons();
  }

  toggleDeleteButtons() {
    this.el.deleteButtons.style.display = [...document.querySelectorAll('.checkbox')].some(c => c.checked) ? 'flex' : 'none';
  }

  deleteSelected() {
    this.tasks = this.tasks.filter(task => ![...document.querySelectorAll('.checkbox:checked')]
      .some(c => c.closest('.task-item').dataset.id == task.id));
    this.save();
    this.render();
  }

  deleteAll() {
    if(confirm('Vai tiešām vēlaties dzēst visus uzdevumus?')) {
      this.tasks = [];
      this.save();
      this.render();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());