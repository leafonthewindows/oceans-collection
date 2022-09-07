
// Password visibility button functionality
const passwordField = document.getElementById('password')
const eyeSlash = document.getElementById('eye-slash')
const eyeOpen = document.getElementById('eye-open')
const visibilityButton = document.getElementById('password-visibility')

if (visibilityButton) {
    visibilityButton.addEventListener('click', function () {
        if (eyeSlash.style.display == 'none') {
            passwordField.setAttribute('type', 'password');
            eyeSlash.style.display = 'block';
            eyeOpen.style.display = 'none';
        }
        else {
            passwordField.setAttribute('type', 'text');
            eyeSlash.style.display = 'none';
            eyeOpen.style.display = 'block';
        }
    })
}


// Disable login button once clicked
const loginButton = document.getElementById('login-button')
const loginForm = document.getElementById('login-form')

if (loginForm) {
    loginForm.addEventListener('submit', function () {
        if (loginForm.checkValidity()) {
            loginButton.disabled = true
        }
    })
}