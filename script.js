const addButton = document.querySelector('.add-button');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');
const fontSizeSelect = document.getElementById('font-size-select');

const STORAGE_KEY = 'notepug-notes';
let notes = loadNotes();

// Debounce
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
  const note = document.createElement('div');
  note.className = 'note';
  note.id = noteData.id;
  note.draggable = true;

  const textarea = document.createElement('textarea');
  textarea.value = noteData.text;
  textarea.placeholder = "Введіть текст нотатки...";
  textarea.addEventListener('input', debounce(() => updateNoteText(noteData.id, textarea.value), 500));

  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.innerHTML = marked.parse(noteData.text || '');
  preview.style.display = 'none';

  const createdAt = document.createElement('span');
  createdAt.className = 'created-at';
  createdAt.textContent = `Створено: ${new Date(noteData.createdAt).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })}`;

  const buttons = document.createElement('div');
  buttons.className = 'buttons';

  const toggleIcon = document.createElement('i');
  toggleIcon.setAttribute('data-feather', 'edit-3');
  toggleIcon.title = "Редагувати / Перегляд";
  toggleIcon.onclick = () => togglePreview(note, textarea, preview, toggleIcon);

  const copyIcon = document.createElement('i');
  copyIcon.setAttribute('data-feather', 'copy');
  copyIcon.title = "Копіювати";
  copyIcon.onclick = () => {
    navigator.clipboard.writeText(textarea.value);
    alert("Скопійовано!");
  };

  const deleteIcon = document.createElement('i');
  deleteIcon.setAttribute('data-feather', 'trash-2');
  deleteIcon.title = "Видалити";
  deleteIcon.onclick = () => {
    if (confirm("Видалити цю нотатку?")) {
      deleteNote(noteData.id);
    }
  };

  buttons.appendChild(toggleIcon);
  buttons.appendChild(copyIcon);
  buttons.appendChild(deleteIcon);

  note.appendChild(textarea);
  note.appendChild(preview);
  note.appendChild(createdAt);
  note.appendChild(buttons);

  note.addEventListener('dragstart', dragStart);
  note.addEventListener('dragover', dragOver);
  note.addEventListener('drop', drop);
  note.addEventListener('dragend', dragEnd);

  return note;
}

function renderNotes(filter = '') {
  notesContainer.innerHTML = '';
  notes.forEach(noteData => {
    const noteElem = createNote(noteData);
    if (filter && !noteData.text.toLowerCase().includes(filter.toLowerCase())) {
      noteElem.classList.add('hidden');
    }
    notesContainer.appendChild(noteElem);
  });
  feather.replace();
  applyFontSize();
}

addButton.onclick = () => {
  const newNote = {
    id: Date.now().toString(36),
    text: '',
    createdAt: Date.now()
  };
  notes.push(newNote);
  saveNotes();
  renderNotes(searchInput.value);
};

function updateNoteText(id, text) {
  const note = notes.find(n => n.id === id);
  if (note) note.text = text;
  saveNotes();
}

function togglePreview(note, textarea, preview, toggleIcon) {
  if (textarea.style.display === 'none') {
    textarea.style.display = 'block';
    preview.style.display = 'none';
    toggleIcon.setAttribute('data-feather', 'edit-3');
  } else {
    textarea.style.display = 'none';
    preview.style.display = 'block';
    preview.innerHTML = marked.parse(textarea.value);
    toggleIcon.setAttribute('data-feather', 'eye');
  }
  feather.replace();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes(searchInput.value);
}

searchInput.addEventListener('input', () => renderNotes(searchInput.value));

fontSizeSelect.addEventListener('change', applyFontSize);

function applyFontSize() {
  const size = fontSizeSelect.value + 'px';
  document.querySelectorAll('.note textarea, .note .preview').forEach(el => {
    el.style.fontSize = size;
  });
}

// Drag & Drop
let dragged;

function dragStart(e) {
  dragged = this;
  setTimeout(() => this.style.opacity = '0.4', 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (dragged !== this) {
    const allNotes = [...notesContainer.children];
    const draggedIdx = allNotes.indexOf(dragged);
    const targetIdx = allNotes.indexOf(this);
    if (draggedIdx < targetIdx) {
      notesContainer.insertBefore(dragged, this.nextSibling);
    } else {
      notesContainer.insertBefore(dragged, this);
    }
    // Оновлюємо порядок в масиві notes
    const newOrder = [...notesContainer.children].map(el => notes.find(n => n.id === el.id));
    notes = newOrder.filter(Boolean);
    saveNotes();
  }
  dragged.style.opacity = '1';
  dragged = null;
}

function dragEnd() {
  if (dragged) dragged.style.opacity = '1';
  dragged = null;
}

window.onbeforeunload = saveNotes;

// Початковий рендер
renderNotes();
