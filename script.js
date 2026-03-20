const notesContainer = document.getElementById('notes-container');
const searchInput    = document.getElementById('search-input');
const fontSizeSelect = document.getElementById('font-size-select');
const addButton      = document.querySelector('.add-button');

const STORAGE_KEY = 'notepug-notes';
let notes = loadNotes();

// Кнопка "Очистити все"
const clearAllBtn = document.createElement('button');
clearAllBtn.textContent = 'Очистити все';
clearAllBtn.className = 'clear-all-btn';
clearAllBtn.onclick = () => {
    if (confirm('Усі нотатки буде видалено. Продовжити?')) {
        notes = [];
        saveNotes();
        renderNotes(searchInput.value);
    }
};
document.querySelector('.controls').appendChild(clearAllBtn);

// ─── Утиліти ────────────────────────────────────────

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const debounceUpdate = debounce((id, text) => {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.text = text;
        saveNotes();
    }
}, 500);

function loadNotes() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// ─── Створення однієї нотатки ───────────────────────

function createNote(noteData) {
    const wrapper = document.createElement('div');
    wrapper.className = 'note-wrapper';
    wrapper.dataset.id = noteData.id;

    // Верхня частина — текст + дата
    const note = document.createElement('div');
    note.className = 'note';

    const createdAt = document.createElement('div');
    createdAt.className = 'created-at';
    createdAt.textContent = `Створено: ${new Date(noteData.createdAt).toLocaleString('uk-UA', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })}`;

    const textarea = document.createElement('textarea');
    textarea.value = noteData.text || '';
    textarea.placeholder = 'Введіть текст нотатки...';

    note.appendChild(createdAt);
    note.appendChild(textarea);

    // Нижня частина — кнопки + лічильник
    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'note-actions-wrapper';

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn copy-btn';
    copyBtn.textContent = 'Копіювати';
    copyBtn.title = 'Скопіювати текст';
    copyBtn.onclick = () => {
        const text = textarea.value.trim();
        if (text) {
            navigator.clipboard.writeText(text);
            copyBtn.textContent = 'Скопійовано!';
            setTimeout(() => copyBtn.textContent = 'Копіювати', 1400);
        }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.title = 'Видалити нотатку';
    deleteBtn.onclick = () => {
        if (confirm('Видалити цю нотатку?')) {
            notes = notes.filter(n => n.id !== noteData.id);
            saveNotes();
            renderNotes(searchInput.value);
        }
    };

    actions.appendChild(copyBtn);
    actions.appendChild(deleteBtn);

    const charCount = document.createElement('div');
    charCount.className = 'char-count';
    charCount.textContent = `${formatNumber(textarea.value.length)} ${textarea.value.length === 1 ? 'символ' : 'символів'}`;

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCount.textContent = `${formatNumber(len)} ${len === 1 ? 'символ' : 'символів'}`;
        debounceUpdate(noteData.id, textarea.value);
    });

    actionsWrapper.appendChild(actions);
    actionsWrapper.appendChild(charCount);

    wrapper.appendChild(note);
    wrapper.appendChild(actionsWrapper);

    return wrapper;
}

// ─── Рендер усіх нотаток ────────────────────────────

function renderNotes(filter = '') {
    notesContainer.innerHTML = '';

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

function applyFontSize() {
    const size = fontSizeSelect.value + 'px';
    document.querySelectorAll('.note textarea').forEach(el => {
        el.style.fontSize = size;
    });
}

// ─── Події ──────────────────────────────────────────

addButton.onclick = () => {
    const newNote = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text: '',
        createdAt: Date.now()
    };
    notes.unshift(newNote);
    saveNotes();
    renderNotes(searchInput.value);
};

searchInput.addEventListener('input', e => renderNotes(e.target.value));

fontSizeSelect.addEventListener('change', applyFontSize);

// Початковий рендер
renderNotes();
