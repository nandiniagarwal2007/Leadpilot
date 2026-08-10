const loginBtn = document.getElementById("loginBtn");
const demoBtn = document.getElementById("demoBtn");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");

// ===============================
// NORMAL LOGIN
// ===============================

loginBtn.addEventListener("click", () => {

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === "admin" && password === "admin123") {

        window.location.href = "/dashboard";

    } else {

        showError("Invalid Username or Password");

    }

});

// ===============================
// DEMO ACCOUNT
// ===============================

demoBtn.addEventListener("click", () => {

    usernameInput.value = "admin";
    passwordInput.value = "admin123";

    // Automatically login with demo account
    window.location.href = "/dashboard";

});

// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ===============================
// ERROR MESSAGE
// ===============================

function showError(message) {

    let errorMessage = document.getElementById("errorMessage");

    if (!errorMessage) {

        errorMessage = document.createElement("div");

        errorMessage.id = "errorMessage";
        errorMessage.className = "error";

        loginBtn.insertAdjacentElement(
            "afterend",
            errorMessage
        );

    }

    errorMessage.textContent = message;

}

// ===============================
// ENTER KEY LOGIN
// ===============================

document.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        loginBtn.click();

    }

});