const API_BASE = '/api';

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const searchUsnInput = document.getElementById('search-usn');
const studentNameEl = document.getElementById('student-name');
const studentUsnEl = document.getElementById('student-usn');
const studentSectionEl = document.getElementById('student-section');

const subjectsListEl = document.getElementById('subjects-list');
const selectedSubjectNameEl = document.getElementById('selected-subject-name');
const marksDetailsContainer = document.getElementById('marks-details-container');
const noMarksMessage = document.getElementById('no-marks-message');

const cieBar = document.getElementById('cie-bar');
const cieScore = document.getElementById('cie-score');
const la1Bar = document.getElementById('la1-bar');
const la1Score = document.getElementById('la1-score');
const la2Bar = document.getElementById('la2-bar');
const la2Score = document.getElementById('la2-score');

let currentStudentMarks = [];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load default student
    loadStudentData('1NT19CS025');

    searchBtn.addEventListener('click', () => {
        const usn = searchUsnInput.value.trim();
        if (usn) {
            loadStudentData(usn);
        }
    });
});

async function loadStudentData(usn) {
    try {
        // Fetch student info
        const studentRes = await fetch(`${API_BASE}/students/${usn}`);
        if (!studentRes.ok) {
            throw new Error('Student not found');
        }
        const student = await studentRes.json();
        
        studentNameEl.textContent = student.name;
        studentUsnEl.textContent = student.usn;
        studentSectionEl.textContent = `Semester ${student.semester} | ${student.section}`;

        // Fetch marks
        const marksRes = await fetch(`${API_BASE}/marks/${usn}`);
        currentStudentMarks = await marksRes.json();

        // Populate Subjects List
        renderSubjectsList();
        
        // Hide details until clicked
        marksDetailsContainer.style.display = 'none';
        noMarksMessage.style.display = 'block';
        selectedSubjectNameEl.textContent = 'Select a Subject';
        
    } catch (error) {
        alert(error.message);
        studentNameEl.textContent = 'Not Found';
        studentUsnEl.textContent = '---';
        studentSectionEl.textContent = '---';
        subjectsListEl.innerHTML = '';
        marksDetailsContainer.style.display = 'none';
        noMarksMessage.style.display = 'block';
    }
}

function renderSubjectsList() {
    subjectsListEl.innerHTML = '';
    
    if (currentStudentMarks.length === 0) {
        subjectsListEl.innerHTML = '<div class="loading-text">No subjects found.</div>';
        return;
    }

    currentStudentMarks.forEach(markRecord => {
        const btn = document.createElement('button');
        btn.className = 'subject-btn';
        btn.textContent = markRecord.code;
        btn.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayMarks(markRecord);
        });
        subjectsListEl.appendChild(btn);
    });
}

function displayMarks(markRecord) {
    noMarksMessage.style.display = 'none';
    marksDetailsContainer.style.display = 'flex';
    selectedSubjectNameEl.textContent = markRecord.subject_name || markRecord.code;

    // Update CIE (Max 50)
    const cieVal = markRecord.cie_marks;
    const ciePercent = (cieVal / 50) * 100;
    cieScore.textContent = cieVal;
    
    // Tiny delay for animation effect
    setTimeout(() => {
        cieBar.style.width = `${Math.min(100, Math.max(10, ciePercent))}%`;
        // Position score correctly depending on width
        if (ciePercent < 20) {
            cieScore.style.left = '5px';
            cieScore.style.color = '#fff';
        } else {
            cieScore.style.left = '20%';
            cieScore.style.color = '#000';
        }
    }, 50);

    // Update LA 1 (Assuming Max 10, so visually 100% full when LA=10)
    const la1Val = markRecord.la1_marks;
    const la1Percent = (la1Val / 10) * 100;
    la1Score.textContent = la1Val;
    
    setTimeout(() => {
        la1Bar.style.width = `${Math.min(100, Math.max(10, la1Percent))}%`;
    }, 50);

    // Update LA 2 (Assuming Max 10)
    const la2Val = markRecord.la2_marks;
    const la2Percent = (la2Val / 10) * 100;
    la2Score.textContent = la2Val;
    
    setTimeout(() => {
        la2Bar.style.width = `${Math.min(100, Math.max(10, la2Percent))}%`;
    }, 50);
}
