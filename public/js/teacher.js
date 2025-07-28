document.addEventListener("DOMContentLoaded", async () => {
    const heading = document.getElementById('heading');
    const username = sessionStorage.getItem("username");    

    if (heading && username) {
        heading.innerText = username;
    }

   try {
        const response = await fetch("/lectures", {credentials: "include"});
        const lectures = await response.json();
        document.querySelectorAll("td[id*='-']").forEach(cell => (cell.innerHTML = ""));
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

    document.querySelector(".leave-button")?.addEventListener("click", leaveRequest);
    document.querySelector(".save-button")?.addEventListener("click", saveLeave);
    document.querySelector(".cancel-button")?.addEventListener("click", cancelLeave);
});

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