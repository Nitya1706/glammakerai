const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    registerMessage.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match.";
        return;
    }

    const submitButton = registerForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const result = await response.json();
        registerMessage.textContent = result.message || "Registration failed.";

        if (response.ok) {
            registerForm.reset();
        }
    } catch (error) {
        registerMessage.textContent =
            "Could not connect to GlamMaker. Make sure the backend is running.";
        console.error("Registration request failed:", error);
    } finally {
        submitButton.disabled = false;
    }
});
