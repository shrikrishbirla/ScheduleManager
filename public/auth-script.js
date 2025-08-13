document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("redirect")?.addEventListener("click", redirect);
    const login_link = document.getElementById('login-link');
    const login_link_forgot = document.getElementById('login-link-forgot');
    const login_form = document.querySelector('.form-box.login');

    const registeration_link = document.getElementById('registeration-link');
    const registeration_form = document.querySelector('.form-box.register');

    const forgot_link = document.getElementById('forgot-link');
    const forgot_form = document.querySelector('.form-box.forgot');
    
    const signup_error = document.getElementById('message-signup');
    const login_error = document.getElementById('login-message');
    const forgot_error = document.getElementById('forgot-message');

    if (login_link) {
        login_link.addEventListener('click', () => {
            login_form.classList.remove('hidden');
            registeration_form.classList.add('hidden');
            forgot_form.classList.add('hidden');
        });
    }

    if (login_link_forgot) {
        login_link_forgot.addEventListener('click', () => {
            login_form.classList.remove('hidden');
            registeration_form.classList.add('hidden');
            forgot_form.classList.add('hidden');
        });
    }

    if (registeration_link) {
        registeration_link.addEventListener('click', () => {
            login_form.classList.add('hidden');
            registeration_form.classList.remove('hidden');
            forgot_form.classList.add('hidden');
        });
    }

    if (forgot_link) {
        forgot_link.addEventListener('click', () => {
            login_form.classList.add('hidden');
            registeration_form.classList.add('hidden');
            forgot_form.classList.remove('hidden');
        });
    }

    document.getElementById("registerAuthForm")?.addEventListener("submit", e => e.preventDefault());
    document.getElementById("loginAuthForm")?.addEventListener("submit", e => e.preventDefault());
    document.getElementById("forgotAuthForm")?.addEventListener("submit", e => e.preventDefault());

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
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(user_email)) {
            signup_Message("Invalid email format");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: signup_username,
                    password: signup_password,
                    email: user_email,
                    role: selectedRole.value
                })
            });

            const result = await response.json();
            signup_Message(result.message);
            if (response.ok) clearAllfields();
        } catch (err) {
            signup_Message("Server error");
        }
    }
    function redirect() {
        window.location.href = "/";
    }

    async function login() {
        const login_username = document.getElementById('login-username').value;
        const login_password = document.getElementById('login-password').value;

        if (!login_username || !login_password) {
            login_Message("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({ username: login_username, password: login_password })
            });

            const result = await response.json();

            if (response.ok) {
                login_Message("Login successful!");
                document.cookie = `username=${login_username}; path=/; max-age=${60 * 60 * 24}`;
                setTimeout(() => {
                    if (result.role === "admin") {
                        window.location.href = "/role/admin";
                    } else if (result.role === "teacher") {
                        window.location.href = "/role/teacher";
                    } else {
                        alert("Unknown role: " + result.role);
                    }
                }, 1000);
            } else {
                login_Message(result.message || "Login Failed");
            }
        } catch (err) {
            login_Message("Server error");
        }
    }

    async function requestOtp() {
        const email = document.getElementById('forgot-email').value;
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
            forgot_Message("Invalid email format");
            return;
        }

        try {
            const response = await fetch("api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            forgot_Message(result.message);
            window.location.href = "/auth/verify-otp"
        } catch {
            forgot_Message("Server error");
        }
    }

    async function verifyOtp() {
        const email = document.getElementById('forgot-email').value;
        const otp = document.getElementById('forgot-otp').value;

        if (!email || !otp) {
            forgot_Message("Enter email & OTP");
            return;
        }

        try {
            const response = await fetch("api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();
            forgot_Message(result.message);
            window.location.href = "/auth/password-reset"
        } catch {
            forgot_Message("Server error");
        }
    }

    async function resetPassword() {
        const email = document.getElementById('forgot-email').value;
        const password = document.getElementById('forgot-password-input').value;
        const confirm = document.getElementById('forgot-confirm-password').value;

        if (!email || !password || !confirm) {
            forgot_Message("Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            forgot_Message("Password should be at least 6 characters");
            return;
        }
        if (password !== confirm) {
            forgot_Message("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, confirm })
            });

            const result = await response.json();
            forgot_Message(result.message);

            if (response.ok) {
                clearAllfields();
                setTimeout(() => {
                    login_form.classList.remove('hidden');
                    forgot_form.classList.add('hidden');
                }, 1500);
                window.location.href = "/";
            }
        } catch {
            forgot_Message("Server error");
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

    function forgot_Message(msg) {
        forgot_error.innerText = msg;
        setTimeout(removeMessage, 2000);
    }

    function removeMessage() {
        signup_error.innerText = '';
        login_error.innerText = '';
        if (forgot_error) forgot_error.innerText = '';
    }

    function clearAllfields() {
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }

    window.signup = signup;
    window.login = login;
    window.requestOtp = requestOtp;
    window.verifyOtp = verifyOtp;
    window.resetPassword = resetPassword;
});