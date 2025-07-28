document.addEventListener("DOMContentLoaded", () => {
    const heading = document.getElementById('heading');
    const username = sessionStorage.getItem("username");
    if (heading && username) {
        heading.innerText = `${username}` || 'Admin';
    }

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
    fetch("/users")
        .then(res => res.json())
        .then(users => {
            const teachers = users.filter(u => u.role === "teacher");
            

            const teacherSelect = document.getElementById("teacherSelect");
            if (!teacherSelect) return;

            teacherSelect.innerHTML = '<option value="" selected hidden> Select Teacher </option>';
            teachers.forEach(teacher => {
                const option = document.createElement("option");
                option.value = teacher.username;
                option.textContent = `${teacher.username} (${teacher.email})`;
                teacherSelect.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading teachers:", err));
}

async function populateTimetable(username) {
    try {
        const response = await fetch("/lectures", {credentials: "include"});
        const lectures = await response.json();
        document.querySelectorAll(".lecture-slot").forEach(cell => (cell.innerHTML = ""));
        lectures.forEach(lecture => {
            if (lecture.teacher === username) {
                const slotNumber = lecture.slot.split('-')[1];
                const cellId = `${lecture.day}-${slotNumber}`;
                const cell = document.getElementById(cellId);
                if (cell) {
                    cell.innerHTML = `${lecture.subject}<br><small>${lecture.roomNumber}</small>`;
                }
            }
        });
    } catch (err) {
        console.error("Error loading lectures:", err);
    }
}

async function save() {
    const form = document.querySelector('.form-body');
    const timeTable = document.querySelector('.timetable-body');

    const subject = document.getElementById('subject').value;
    const roomNumber = document.getElementById('room-number').value;
    const day = document.getElementById('day').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const slot = document.getElementById('slot').value;
    const teacher = document.getElementById('selected-teacher').value;

    if (!subject || !roomNumber || !day || !date || !slot || !teacher || !startTime || !endTime) {
        showerrorMessage("Please fill in all fields");
        return;
    }

    if (startTime >= endTime) {
        showerrorMessage("Start time must be before end time");
        return;
    }

    const lecture = { subject, roomNumber, day, date, startTime, endTime, slot, teacher };

    try {
        const res = await fetch("/add-lecture", {
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
    
    ['subject', 'room-number', 'day', 'date', 'slot'].forEach(id => {
        document.getElementById(id).value = '';
    });
    
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';

    form.classList.add('hidden');
    timeTable.classList.remove('hidden');

    populateTimetable(teacher);
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

    ['subject', 'room-number', 'day', 'date', 'slot'].forEach(id => {
        document.getElementById(id).value = '';
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