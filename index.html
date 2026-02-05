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
  textarea.addEventListener('input', debounce(() => updateNoteText(noteData.id, textarea.value), 500));

  const createdAt = document.createElement('div');
  createdAt.className = 'created-at';
  createdAt.textContent = `Створено: ${new Date(noteData.createdAt).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })}`;

  const buttons = document.createElement('div');
  buttons.className = 'buttons';

  const copyIcon = document.createElement('i');
  copyIcon.setAttribute('data-feather', 'copy');
  copyIcon.title = "Копіювати";
  copyIcon.onclick = () => {
    navigator.clipboard.writeText(textarea.value).then(() => {
      alert("Скопійовано!");
    }).catch(() => {
      alert("Не вдалося скопіювати");
    });
  };

  const deleteIcon = document.createElement('i');
  deleteIcon.setAttribute('data-feather', 'trash-2');
  deleteIcon.title = "Видалити";
  deleteIcon.onclick = () => {
    if (confirm("У помічку?")) {
      deleteNote(noteData.id);
    }
  };

  buttons.appendChild(copyIcon);
  buttons.appendChild(deleteIcon);

  note.appendChild(textarea);
  note.appendChild(buttons);

  noteWrapper.appendChild(note);
  noteWrapper.appendChild(createdAt);

  // Drag & Drop на wrapper
  noteWrapper.addEventListener('dragstart', dragStart);
  noteWrapper.addEventListener('dragover', dragOver);
  noteWrapper.addEventListener('drop', drop);
  noteWrapper.addEventListener('dragend', dragEnd);

  return noteWrapper;
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

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes(searchInput.value);
}

searchInput.addEventListener('input', () => renderNotes(searchInput.value));

fontSizeSelect.addEventListener('change', applyFontSize);

function applyFontSize() {
  const size = fontSizeSelect.value + 'px';
  document.querySelectorAll('.note textarea').forEach(el => {
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
    const allWrappers = [...notesContainer.children];
    const draggedIdx = allWrappers.indexOf(dragged);
    const targetIdx = allWrappers.indexOf(this);

    if (draggedIdx < targetIdx) {
      notesContainer.insertBefore(dragged, this.nextSibling);
    } else {
      notesContainer.insertBefore(dragged, this);
    }

    // Оновлюємо порядок в масиві notes
    const newOrder = [...notesContainer.children].map(wrapper => {
      const id = wrapper.id.replace('wrapper-', '');
      return notes.find(n => n.id === id);
    });
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
