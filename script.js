const addButton = document.querySelector('.add-button');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');
const fontSizeSelect = document.getElementById('font-size-select');

// Новая кнопка "Очистити все"
const clearAllButton = document.createElement('button');
clearAllButton.textContent = 'Очистити все';
clearAllButton.className = 'action-btn clear-all-btn';
clearAllButton.title = 'Видалити всі нотатки';
clearAllButton.onclick = () => {
  if (confirm('У помоєчку?')) {
    notes = [];
    saveNotes();
    renderNotes(searchInput.value);
  }
};
// Добавляем кнопку в блок controls
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
  const noteWrapper = document.createElement('div');
  noteWrapper.className = 'note-wrapper';
  noteWrapper.id = 'wrapper-' + noteData.id;
  noteWrapper.draggable = true;

  const note = document.createElement('div');
  note.className = 'note';
  note.id = noteData.id;

  const textarea = document.createElement('textarea');
  textarea.value = noteData.text;
  textarea.placeholder = "Введіть текст нотатки...";
  textarea.addEventListener('input', debounce(() => {
    updateNoteText(noteData.id, textarea.value);
  }, 500));

  const createdAt = document.createElement('div');
  createdAt.className = 'created-at';
  createdAt.textContent = `Створено: ${new Date(noteData.createdAt).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })}`;

  const buttons = document.createElement('div');
  buttons.className = 'buttons';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'action-btn copy-btn';
  copyBtn.textContent = 'Копіювати';
  copyBtn.title = 'Скопіювати текст';
  copyBtn.onclick = () => {
    if (textarea.value.trim() !== '') {
      navigator.clipboard.writeText(textarea.value);
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn delete-btn';
  deleteBtn.textContent = 'Видалити';
  deleteBtn.title = 'Видалити нотатку';
  deleteBtn.onclick = () => {
    deleteNote(noteData.id);
  };

  buttons.appendChild(copyBtn);
  buttons.appendChild(deleteBtn);

  note.appendChild(textarea);
  note.appendChild(buttons);

  noteWrapper.appendChild(note);
  noteWrapper.appendChild(createdAt);

  noteWrapper.addEventListener('dragstart', dragStart);
  noteWrapper.addEventListener('dragover', dragOver);
  noteWrapper.addEventListener('drop', drop);
  noteWrapper.addEventListener('dragend', dragEnd);

  return noteWrapper;
}

function renderNotes(filter = '') {
  notesContainer.innerHTML = '';
  
  // Сортируем заметки по дате создания (новые сверху)
  const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  sortedNotes.forEach(noteData => {
    const noteElem = createNote(noteData);
    if (filter && !noteData.text.toLowerCase().includes(filter.toLowerCase())) {
      noteElem.classList.add('hidden');
    }
    notesContainer.appendChild(noteElem);
  });
  
  applyFontSize();
}

addButton.onclick = () => {
  const newNote = {
    id: Date.now().toString(36),
    text: '',
    createdAt: Date.now()
  };
  // Добавляем в начало массива
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

searchInput.addEventListener('input', (e) => {
  renderNotes(e.target.value);
});

fontSizeSelect.addEventListener('change', applyFontSize);

function applyFontSize() {
  const size = fontSizeSelect.value + 'px';
  document.querySelectorAll('.note textarea').forEach(el => {
    el.style.fontSize = size;
  });
}

// Drag & Drop
let dragged = null;

function dragStart(e) {
  dragged = this;
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => this.style.opacity = '0.5', 0);
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
  e.preventDefault();
  if (dragged && dragged !== this) {
    const all = Array.from(notesContainer.children);
    const fromIndex = all.indexOf(dragged);
    const toIndex = all.indexOf(this);

    if (fromIndex !== -1 && toIndex !== -1) {
      if (fromIndex < toIndex) {
        notesContainer.insertBefore(dragged, this.nextSibling);
      } else {
        notesContainer.insertBefore(dragged, this);
      }

      // Обновляем порядок в массиве notes
      const newOrder = Array.from(notesContainer.children).map(wrapper => {
        const id = wrapper.id.replace('wrapper-', '');
        return notes.find(n => n.id === id);
      });
      notes = newOrder.filter(Boolean);
      saveNotes();
    }
  }
}

function dragEnd() {
  if (dragged) dragged.style.opacity = '1';
  dragged = null;
}

window.onbeforeunload = saveNotes;

// Начальный рендер
renderNotes();
