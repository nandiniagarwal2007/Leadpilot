const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "admin123"){

        document.getElementById("errorMessage").textContent = "";
        
        window.location.href = "/dashboard";

    }else{

        document.getElementById("errorMessage").textContent =
"Invalid Username or Password";

    }

});
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});
const demoBtn = document.getElementById("demoBtn");

demoBtn.addEventListener("click", () => {

    document.getElementById("username").value = "admin";
    document.getElementById("password").value = "admin123";

});

document.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        loginBtn.click();
    }

});