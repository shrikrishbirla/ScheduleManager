document.addEventListener("DOMContentLoaded", async () => {
    const teacher = await currentTeacher();
    if (!teacher || !teacher._id) {
        console.error("Teacher not found or not logged in");
        return;
    }

    const teacherId = teacher._id;
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

    document.querySelector(".leave-button")?.addEventListener("click", leaveRequest);
    document.querySelector(".save-button")?.addEventListener("click", saveLeave);
    document.querySelector(".cancel-button")?.addEventListener("click", cancelLeave);
});

async function currentTeacher() {
    try {
        const res = await fetch("/api/data/currentuser", {
            method: "GET",
            credentials: "include"
        });
        const user = await res.json();
        return user;
    } catch (err) {
        console.error("Error loading teacher:", err);
        return null;
    }
}

function leaveRequest() {
    const form = document.querySelector('.leave-body');
    const timeTable = document.querySelector('.timetable-body');

    form.classList.remove('hidden');
    timeTable.classList.add('hidden');
}

function showerrorMessage(msg) {
    const errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) return;

    errorMessage.innerText = msg;
    setTimeout(() => (errorMessage.innerText = ''), 1500);
}

async function saveLeave() {
    const form = document.querySelector('.leave-body');
    const timeTable = document.querySelector('.timetable-body');

    const dateofleave = document.getElementById('dateofleave').value;
    const reasonofleave = document.getElementById('reasonofleave').value;

    if (!dateofleave || !reasonofleave) {
        showerrorMessage("Please fill in all fields");
        return;
    }

    try {
        const res = await fetch("/leave-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ dateofleave: dateofleave, reasonofleave: reasonofleave, teacher: username})
        });

        if (res.ok) {
            cancelLeave();
        } else {
            showerrorMessage("Failed to request leave");
        }
    } catch (err) {
        console.error("Error saving lecture:", err);
        showerrorMessage("Server error");
    }

    form.classList.add('hidden');
    timeTable.classList.remove('hidden');
}

function cancelLeave() {
    const form = document.querySelector('.leave-body');
    const timeTable = document.querySelector('.timetable-body');

    ['dateofleave', 'reasonofleave'].forEach(id => {
        document.getElementById(id).value = '';
    });

    form.classList.add('hidden');
    timeTable.classList.remove('hidden');
}