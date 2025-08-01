document.addEventListener("DOMContentLoaded", () => {
    populateTeacher();

    const teacherSelect = document.getElementById("teacherSelect");
    const selectedTeacherInput = document.getElementById("selected-teacher");

    if (teacherSelect && selectedTeacherInput) {
        teacherSelect.addEventListener("change", function () {
            selectedTeacherInput.value = this.value;
            if (this.value) {
                populateTimetable(this.value);
            }
        });
    }

    document.querySelector(".save-button")?.addEventListener("click", save);
    document.querySelector(".cancel-button")?.addEventListener("click", cancel);
    document.querySelector(".add-timetable-details")?.addEventListener("click", addtimetable);
});

function populateTeacher() {
    fetch("/api/data/list")
    .then(res => res.json())
    .then(users => {
        const teachers = users.filter(u => u.role === "teacher");

        const teacherSelect = document.getElementById("teacherSelect");
        if (!teacherSelect) return;

        teacherSelect.innerHTML = '<option value="" selected hidden> Select Teacher </option>';
        teachers.forEach(teacher => {
            const option = document.createElement("option");
            option.value = teacher._id;
            option.textContent = `${teacher.username} (${teacher.email})`;
            teacherSelect.appendChild(option);
        });
    })
    .catch(err => console.error("Error loading teachers:", err));
}

async function populateTimetable(teacherId) {
    try {
        const response = await fetch(`/api/data/lectures/${teacherId}`, { credentials: "include" });
        const lectures = await response.json();

        document.querySelectorAll(".lecture-slot").forEach(cell => (cell.innerHTML = ""));

        lectures.forEach(lecture => {
            if (!lecture.day || !lecture.lectureNumber) return;
            const lectureNum = lecture.lectureNumber.split('-')[1];
            if (!lectureNum) return;
            const cellId = `${lecture.day.toLowerCase()}-${lectureNum}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                const subject = lecture.subjectName || "";
                const room = lecture.roomNumber || "";
                cell.innerHTML = `${subject}<br><small>${room}</small>`;
            }
        });

    } catch (err) {
        console.error("Error loading lectures:", err);
    }
}

async function save() {
    const form = document.querySelector(".form-body");
    const timeTable = document.querySelector(".timetable-body");

    const subjectName = document.getElementById('subject-name').value;
    const roomNumber = document.getElementById('room-number').value;
    const day = document.getElementById('day').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const lectureNumber = document.getElementById('lectureNumber').value;
    const teacher = document.getElementById('selected-teacher').value;

    if (!subjectName || !roomNumber || !day || !date || !lectureNumber || !teacher || !startTime || !endTime) {
        showerrorMessage("Please fill in all fields");
        return;
    }

    if (startTime >= endTime) {
        showerrorMessage("Start time must be before end time");
        return;
    }

    const lecture = {
        subjectName,
        roomNumber,
        day,
        date,
        startTime,
        endTime,
        lectureNumber,
        teacher
    };

    try {
        const res = await fetch("/api/data/add-lecture", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(lecture)
        });

        if (res.ok) {
            populateTimetable(teacher);
        } else {
            const { message } = await res.json();
            showerrorMessage(message || "Failed to save lecture");
        }
    } catch (err) {
        console.error("Error saving lecture:", err);
        showerrorMessage("Server error");
    }

    ['subject-name', 'room-number', 'day', 'date', 'lectureNumber'].forEach(id => {
        const erase = document.getElementById(id);
        if (erase) erase.value = '';
    });

    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
    
    populateTimetable(teacher);

    form.classList.add('hidden');
    timeTable.classList.remove('hidden');

}

function showerrorMessage(msg) {
    const errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) return;

    errorMessage.innerText = msg;
    setTimeout(() => (errorMessage.innerText = ''), 1500);
}

function cancel() {
    const form = document.querySelector('.form-body');
    const timeTable = document.querySelector('.timetable-body');

    ['subject-name', 'room-number', 'day', 'date', 'lectureNumber'].forEach(id => {
        const erase = document.getElementById(id);
        if (erase) erase.value = '';
    });

    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';

    form.classList.add('hidden');
    timeTable.classList.remove('hidden');
}

function addtimetable() {
    const selectedTeacher = document.getElementById("teacherSelect").value;
    if (!selectedTeacher) {
        alert("Please select a teacher first");
        return;
    }

    document.getElementById("selected-teacher").value = selectedTeacher;

    const form = document.querySelector('.form-body');
    const timeTable = document.querySelector('.timetable-body');

    form.classList.remove('hidden');
    timeTable.classList.add('hidden');
}
