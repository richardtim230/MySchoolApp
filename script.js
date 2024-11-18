// Pop-up functionality
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');

// Notes Management
const notesList = document.getElementById('notes-list');
const newNoteContent = document.getElementById('new-note-content');
const addNoteButton = document.getElementById('add-note');
const clearNotesButton = document.getElementById('clear-notes');
const uploadImage = document.getElementById('upload-image');

// Timetable Management
const saveButton = document.getElementById('save-button');
const addRowButton = document.getElementById('add-row');
const tableBody = document.querySelector('#timetable tbody');

// Show pop-up on page load
window.addEventListener('load', () => {
    popup.classList.add('show');
    loadNotes();
    loadTimetable();
});

// Close pop-up when button clicked
closePopup.addEventListener('click', () => {
    popup.classList.remove('show');
});

// Load notes from local storage
function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => createNoteCard(note.text, note.image));
}

// Save all notes to local storage
function saveNotes() {
    const notes = Array.from(notesList.children).map(noteCard => ({
        text: noteCard.querySelector('p').textContent.trim(),
        image: noteCard.querySelector('img') ? noteCard.querySelector('img').src : null,
    }));
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Add a new note
addNoteButton.addEventListener('click', () => {
    const noteContent = newNoteContent.value.trim();
    const file = uploadImage.files[0];

    if (!noteContent && !file) {
        alert('Note content or image is required!');
        return;
    }

    let imageSrc = null;
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imageSrc = reader.result;
            createNoteCard(noteContent, imageSrc);
            saveNotes();
        };
        reader.readAsDataURL(file);
    } else {
        createNoteCard(noteContent, imageSrc);
        saveNotes();
    }

    newNoteContent.value = '';
    uploadImage.value = '';
});

// Clear all notes
clearNotesButton.addEventListener('click', () => {
    notesList.innerHTML = '';
    localStorage.removeItem('notes');
    alert('All notes cleared!');
});

// Create a note card
function createNoteCard(content, imageSrc) {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';

    noteCard.innerHTML = `
        <p>${content}</p>
        ${imageSrc ? `<img src="${imageSrc}" alt="Note Image">` : ''}
        <button onclick="deleteNoteCard(this)">Delete</button>
    `;

    notesList.appendChild(noteCard);
}

// Delete a note card
function deleteNoteCard(button) {
    const noteCard = button.parentElement;
    notesList.removeChild(noteCard);
    saveNotes();
}

// Load timetable from local storage
function loadTimetable() {
    const savedData = JSON.parse(localStorage.getItem('timetable')) || [];
    tableBody.innerHTML = ''; // Clear existing rows

    savedData.forEach(rowData => {
        const newRow = createTableRow(rowData);
        tableBody.appendChild(newRow);
    });
}

// Save timetable to local storage
saveButton.addEventListener('click', () => {
    const rows = Array.from(tableBody.children);
    const timetableData = rows.map(row => {
        return Array.from(row.children).slice(0, -1).map(cell => cell.textContent.trim());
    });

    localStorage.setItem('timetable', JSON.stringify(timetableData));
    alert('Timetable saved successfully!');
});

// Add a new row to the timetable
addRowButton.addEventListener('click', () => {
    const newRow = createTableRow(['New Course', 'New Title', 'New Day', 'New Time', 'New Venue']);
    tableBody.appendChild(newRow);
});

// Create a new row for the timetable
function createTableRow(rowData) {
    const row = document.createElement('tr');

    rowData.forEach(cellData => {
        const cell = document.createElement('td');
        cell.contentEditable = 'true';
        cell.textContent = cellData;
        row.appendChild(cell);
    });

    const actionCell = document.createElement('td');
    actionCell.innerHTML = '<button class="delete-row" onclick="deleteTableRow(this)">Delete</button>';
    row.appendChild(actionCell);

    return row;
}

// Delete a row from the timetable
function deleteTableRow(button) {
    const row = button.parentElement.parentElement;
    tableBody.removeChild(row);
}
// Timer Variables
let timerInterval;
let timerSeconds = 0;
let timerRunning = false;

// Stopwatch Variables
let stopwatchInterval;
let stopwatchSeconds = 0;
let stopwatchRunning = false;

// Timer Elements
const timerMinutesElement = document.getElementById('timer-minutes');
const timerSecondsElement = document.getElementById('timer-seconds');

// Stopwatch Elements
const stopwatchMinutesElement = document.getElementById('stopwatch-minutes');
const stopwatchSecondsElement = document.getElementById('stopwatch-seconds');

// Timer Functions
document.getElementById('start-timer').addEventListener('click', () => {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
});

document.getElementById('stop-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerRunning = false;
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerSeconds = 0;
    timerRunning = false;
    updateTimerDisplay();
});

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerMinutesElement.textContent = minutes.toString().padStart(2, '0');
    timerSecondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Stopwatch Functions
document.getElementById('start-stopwatch').addEventListener('click', () => {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchSeconds++;
            updateStopwatchDisplay();
        }, 1000);
    }
});

document.getElementById('stop-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;
});

document.getElementById('reset-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchSeconds = 0;
    stopwatchRunning = false;
    updateStopwatchDisplay();
});

function updateStopwatchDisplay() {
    const minutes = Math.floor(stopwatchSeconds / 60);
    const seconds = stopwatchSeconds % 60;
    stopwatchMinutesElement.textContent = minutes.toString().padStart(2, '0');
    stopwatchSecondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Calendar Initialization
function loadCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    calendar.textContent = `Today is: ${today.toDateString()}`;
}

window.addEventListener('load', () => {
    loadCalendar();
});
// Render Weekly Calendar
function renderWeeklyCalendar() {
    const calendar = document.getElementById("calendar");
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Get current day index
    const todayDate = currentDate.getDate();

    // Clear existing calendar
    calendar.innerHTML = "";

    // Create weekly calendar structure
    const calendarTable = document.createElement("table");
    calendarTable.className = "weekly-calendar";

    // Table header for weekdays
    const headerRow = document.createElement("tr");
    weekDays.forEach((day, index) => {
        const dayCell = document.createElement("th");
        dayCell.textContent = day;

        // Highlight current day
        if (index === currentDay) {
            dayCell.classList.add("highlight-day");
        }

        headerRow.appendChild(dayCell);
    });

    calendarTable.appendChild(headerRow);

    // Table row for dates (assumes current week based on the current day)
    const dateRow = document.createElement("tr");
    weekDays.forEach((_, index) => {
        const dateCell = document.createElement("td");
        const diff = index - currentDay; // Difference from the current day
        const date = new Date(currentDate);
        date.setDate(todayDate + diff); // Adjust to correct date for the week
        dateCell.textContent = date.getDate();

        // Highlight current day
        if (index === currentDay) {
            dateCell.classList.add("highlight-date");
        }

        dateRow.appendChild(dateCell);
    });

    calendarTable.appendChild(dateRow);

    // Append calendar to the section
    calendar.appendChild(calendarTable);
}

// Initialize Weekly Calendar on Page Load
window.onload = function () {
    startAutoTimer(); // Auto Timer
    renderTimetable(); // Render Timetable
    renderNotes(); // Render Notes
    renderWeeklyCalendar(); // Render Calendar
};
