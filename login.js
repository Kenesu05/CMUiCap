const form = document.getElementById("f");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pw");
const toggleButton = document.getElementById("eye");
const errorMessage = document.getElementById("err");

if (toggleButton && passwordInput) {
  toggleButton.addEventListener("click", () => {
    const showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    toggleButton.textContent = showing ? "Show" : "Hide";
    toggleButton.setAttribute("aria-pressed", String(!showing));
    toggleButton.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    passwordInput.focus();
  });
}

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const users = Array.isArray(DEMO_USERS) ? DEMO_USERS : [];
    const user = users.find(item =>
      String(item.email).trim().toLowerCase() === email &&
      String(item.password) === password
    );

    if (!user) {
      errorMessage.textContent = "Incorrect email or password. Check your CMU-CCS account details and try again.";
      passwordInput.focus();
      return;
    }

    // Credentials are valid. Keep the user pending until OTP is verified.
    localStorage.setItem("cmuicapPendingUser", JSON.stringify(user));
    localStorage.removeItem("cmuicapCurrentUser");

    errorMessage.textContent = "";
    window.location.replace("otp.html");
  });
}
