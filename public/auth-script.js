const login_link = document.getElementById('login-link');
const registeration_link = document.getElementById('registeration-link');
const login_form = document.querySelector('.form-box.login');
const registeration_form = document.querySelector('.form-box.register');
const signup_error = document.getElementById('message-signup');
const login_error = document.getElementById('login-message');

login_link.addEventListener('click', () => {
    login_form.classList.remove('hidden');
    registeration_form.classList.add('hidden');
});

registeration_link.addEventListener('click', () => {
    login_form.classList.add('hidden');
    registeration_form.classList.remove('hidden');
});

document.getElementById("registerAuthForm").addEventListener("submit", function (e) {
    e.preventDefault();
    signup();
});

document.getElementById("loginAuthForm").addEventListener("submit", function (e) {
    e.preventDefault();
    login();
});

async function signup() {
    const selectedRole = document.querySelector('input[name="role"]:checked');
    const signup_username = document.getElementById('signup-username').value;
    const signup_password = document.getElementById('signup-password').value;
    const user_email = document.getElementById('user-email').value;
    const confirm_password = document.getElementById('confirm-password').value;

    if (!signup_username || !signup_password || !user_email || !confirm_password || !selectedRole) {
        signup_Message("Please fill in all fields");
        return;
    }

    if (signup_password.length < 6) {
        signup_Message("Password should be at least 6 characters");
        return;
    }

    if (signup_password !== confirm_password) {
        signup_Message("Passwords do not match");
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(user_email)) {
        signup_Message("Invalid email format");
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", 
            body: JSON.stringify({
                username: signup_username,
                password: signup_password,
                email: user_email,
                role: selectedRole.value
            })
        });

        const result = await response.text();

        if (response.ok) {
            signup_Message(result);
            clearAllfields();
        } else {
            signup_Message(result);
        }

    } catch (err) {
        console.error("Signup error:", err);
        signup_Message("Server error");
    }
}

async function login() {
    const login_username = document.getElementById('login-username').value;
    const login_password = document.getElementById('login-password').value;

    if (!login_username || !login_password) {
        login_Message("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username: login_username,
                password: login_password
            })
        });

        const result = await response.json();

        if (response.ok) {
            login_Message("Login successful!");
            sessionStorage.setItem("username", login_username);
            sessionStorage.setItem("role", result.role);

            setTimeout(() => {
                if (result.role === "admin") {
                    window.location.href = "/admin";
                } else if (result.role === "teacher") {
                    window.location.href = "/teacher";
                } else {
                    alert("Unknown role: " + result.role);
                }
            }, 1000);
        } else {
            login_Message(result.message || "Login Failed");
        }

    } catch (err) {
        console.error("Login error:", err);
        login_Message("Server error");
    }
}

function signup_Message(msg) {
    signup_error.innerText = msg;
    setTimeout(removeMessage, 2000);
}

function login_Message(msg) {
    login_error.innerText = msg;
    setTimeout(removeMessage, 2000);
}

function removeMessage() {
    signup_error.innerText = '';
    login_error.innerText = '';
}

function clearAllfields() {
    document.getElementById('signup-username').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    const roleRadios = document.querySelectorAll('input[name="role"]');
    roleRadios.forEach(radio => {
        radio.checked = false;
    });
}