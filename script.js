const addButton = document.querySelector('.add-button');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');
const fontSizeSelect = document.getElementById('font-size-select');

// Кнопка "Очистити все"
const clearAllButton = document.createElement('button');
clearAllButton.textContent = 'Очистити все';
clearAllButton.className = 'action-btn clear-all-btn';
clearAllButton.title = 'Видалити всі нотатки';
clearAllButton.onclick = () => {
  if (confirm('Упевнений? Усі нотатки буде видалено.')) {
    notes = [];
    saveNotes();
    renderNotes(searchInput.value);
  }
};
document.querySelector('.controls').appendChild(clearAllButton);

const STORAGE_KEY = 'notepug-notes';
let notes = loadNotes();

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createNote(noteData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'note-wrapper';
  wrapper.id = 'wrapper-' + noteData.id;

  const note = document.createElement('div');
  note.className = 'note';

  const createdAt = document.createElement('div');
  createdAt.className = 'created-at';
  createdAt.textContent = `Створено: ${new Date(noteData.createdAt).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })}`;

  const textarea = document.createElement('textarea');
  textarea.value = noteData.text;
  textarea.placeholder = "Введіть текст нотатки...";
  textarea.addEventListener('input', debounce(() => {
    updateNoteText(noteData.id, textarea.value);
  }, 500));

  const actions = document.createElement('div');
  actions.className = 'note-actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'action-btn copy-btn';
  copyBtn.textContent = 'Копіювати';
  copyBtn.title = 'Скопіювати текст';
  copyBtn.onclick = () => {
    if (textarea.value.trim()) {
      navigator.clipboard.writeText(textarea.value);
      // можна додати сповіщення, наприклад alert або toast
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn delete-btn';
  deleteBtn.textContent = 'Видалити';
  deleteBtn.title = 'Видалити нотатку';
  deleteBtn.onclick = () => {
    deleteNote(noteData.id);
  };

  actions.appendChild(copyBtn);
  actions.appendChild(deleteBtn);

  note.appendChild(createdAt);
  note.appendChild(textarea);
  note.appendChild(actions);

  wrapper.appendChild(note);
  return wrapper;
}

function renderNotes(filter = '') {
  notesContainer.innerHTML = '';

  // Нові зверху
  const sorted = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  sorted.forEach(noteData => {
    const elem = createNote(noteData);
    if (filter && !noteData.text.toLowerCase().includes(filter.toLowerCase())) {
      elem.classList.add('hidden');
    }
    notesContainer.appendChild(elem);
  });

  applyFontSize();
}

addButton.onclick = () => {
  const newNote = {
    id: Date.now().toString(36),
    text: '',
    createdAt: Date.now()
  };
  notes.unshift(newNote);
  saveNotes();
  renderNotes(searchInput.value);
};

function updateNoteText(id, text) {
  const note = notes.find(n => n.id === id);
  if (note) note.text = text;
  saveNotes();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes(searchInput.value);
}

searchInput.addEventListener('input', e => renderNotes(e.target.value));

fontSizeSelect.addEventListener('change', applyFontSize);

function applyFontSize() {
  const size = fontSizeSelect.value + 'px';
  document.querySelectorAll('.note textarea').forEach(el => {
    el.style.fontSize = size;
  });
}

// Початковий рендер
renderNotes();
