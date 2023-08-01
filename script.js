const addButton = document.querySelector('.add-button');
const container = document.querySelector('.container');



function generateUniqueId () {
  return Date.now().toString(36);
}

function copyContent (id) {
  console.log(id)
}

function createNewInput () {
  const notepad = document.createElement('div');
        notepad.className = 'input-area';
        notepad.id = generateUniqueId();
        notepad.onclick = onClick
  const textArea = document.createElement('textarea');
  textArea.oninput = autoHeight;
  const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
  const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        
  notepad.appendChild(textArea);
  notepad.appendChild(copyButton);
  notepad.appendChild(deleteButton);
  container.appendChild(notepad);

  function autoHeight() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  }

  function onClick() {
    const id = this.id;
    event.target.className === 'copy-button' ? copyText(id)
    : event.target.className === 'delete-button' ? deleteNotepad(id) : null
  }
}

function copyText(id) {
  const textarea = document.querySelector(`#${id} > textarea`);
  navigator.clipboard.writeText(textarea.value);
}

function deleteNotepad(id) {
  const notepad = document.querySelector(`#${id}`);
  container.removeChild(notepad);
}

addButton.onclick = createNewInput;