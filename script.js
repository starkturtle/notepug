const addButton = document.querySelector('.add-button');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');
const fontSizeSelect = document.getElementById('font-size-select');

const STORAGE_KEY = 'notepug-notes';
let notes = loadNotes();

// Debounce function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Load notes from localStorage
function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Create a new note element
function createNote(noteData) {
  const note = document.createElement('div');
  note.className = 'note';
  note.id = noteData.id;
  note.draggable = true;

  const textarea = document.createElement('textarea');
  textarea.value = noteData.text;
  textarea.addEventListener('input', debounce(() => updateNoteText(noteData.id, textarea.value), 500));

  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.innerHTML = marked.parse(noteData.text);
  preview.style.display = 'none';

  const createdAt = document.createElement('span');
  createdAt.className = 'created-at';
  createdAt.textContent = `Created: ${new Date(noteData.createdAt).toLocaleString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}`;

  const buttons = document.createElement('div');
  buttons.className = 'buttons';

  const toggleIcon = document.createElement('i');
  toggleIcon.setAttribute('data-feather', 'edit');
  toggleIcon.onclick = () => togglePreview(note, textarea, preview, toggleIcon);

  const copyIcon = document.createElement('i');
  copyIcon.setAttribute('data-feather', 'copy');
  copyIcon.onclick = () => copyText(noteData.text);

  const deleteIcon = document.createElement('i');
  deleteIcon.setAttribute('data-feather', 'trash-2');
  deleteIcon.onclick = () => deleteNote(noteData.id);

  buttons.appendChild(toggleIcon);
  buttons.appendChild(copyIcon);
  buttons.appendChild(deleteIcon);

  note.appendChild(textarea);
  note.appendChild(preview);
  note.appendChild(createdAt);
  note.appendChild(buttons);

  // Drag events
  note.addEventListener('dragstart', dragStart);
  note.addEventListener('dragover', dragOver);
  note.addEventListener('drop', drop);
  note.addEventListener('dragend', dragEnd);

  return note;
}

// Render all notes
function renderNotes(filter = '') {
  notesContainer.innerHTML = '';
  notes.forEach(noteData => {
    const noteElem = createNote(noteData);
    if (filter && !noteData.text.toLowerCase().includes(filter.toLowerCase())) {
      noteElem.classList.add('hidden');
    }
    notesContainer.appendChild(noteElem);
  });
  feather.replace(); // Init feather icons
  applyFontSize();
}

// Add new note
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

// Update note text
function updateNoteText(id, text) {
  const note = notes.find(n => n.id === id);
  if (note) {
    note.text = text;
    saveNotes();
  }
}

// Toggle edit/preview
function togglePreview(note, textarea, preview, toggleIcon) {
  if (textarea.style.display === 'none') {
    textarea.style.display = 'block';
    preview.style.display = 'none';
    toggleIcon.setAttribute('data-feather', 'edit');
  } else {
    textarea.style.display = 'none';
    preview.style.display = 'block';
    preview.innerHTML = marked.parse(textarea.value);
    toggleIcon.setAttribute('data-feather', 'eye');
  }
  feather.replace();
}

// Copy text
function copyText(text) {
  navigator.clipboard.writeText(text);
}

// Delete note
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes(searchInput.value);
}

// Search filter
searchInput.addEventListener('input', () => renderNotes(searchInput.value));

// Font size change
fontSizeSelect.addEventListener('change', applyFontSize);

function applyFontSize() {
  const size = fontSizeSelect.value + 'px';
  document.querySelectorAll('.note textarea, .note .preview').forEach(el => {
    el.style.fontSize = size;
  });
}

// Drag & drop
let dragged;

function dragStart(e) {
  dragged = this;
  e.dataTransfer.effectAllowed = 'move';
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
  e.preventDefault();
  if (dragged !== this) {
    const draggedIndex = notes.findIndex(n => n.id === dragged.id);
    const targetIndex = notes.findIndex(n => n.id === this.id);
    [notes[draggedIndex], notes[targetIndex]] = [notes[targetIndex], notes[draggedIndex]];
    saveNotes();
    renderNotes(searchInput.value);
  }
}

function dragEnd() {
  dragged = null;
}

// Auto-save on unload
window.onbeforeunload = saveNotes;

// Initial render
renderNotes();
