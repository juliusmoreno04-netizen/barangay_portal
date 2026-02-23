// Navigation functions
function showRegister() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("forgotForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("forgotForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
}

function showForgot() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("forgotForm").classList.remove("hidden");
}

// ---- REGISTER FUNCTION ----
async function register() {
    const username = document.getElementById("registerUsername").value.trim();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("registerPassword").value;
    const idCardFile = document.getElementById("idCard").files[0];

    if (!username || !fullName || !email || !password || !idCardFile) {
        alert("Please fill in all fields and upload your profile picture.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const profilePic = reader.result;
        try {
            // Updated to Absolute URL to prevent path errors
            const response = await fetch('http://localhost/barangay_portal/auth.php?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, fullName, email, password, profilePic })
            });

            // If the server returns something that isn't JSON, this line will trigger the 'catch' block
            const result = await response.json();
            
            alert(result.message);
            if (result.success) showLogin();

        } catch (error) {
            console.error("Detailed Error:", error);
            alert('Failed to connect to server. Check Console (F12) for the real error.');
        }
    };
    reader.readAsDataURL(idCardFile);
}

// ---- LOGIN FUNCTION ----
async function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    try {
        const response = await fetch('http://localhost/barangay_portal/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        if (result.success) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(result.user));
            alert(result.message);
            window.location.href = "index.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Detailed Error:", error);
        alert('Failed to connect to server. Check if Apache is running in XAMPP.');
    }
}
async function resetPassword() {
    const username = document.getElementById("forgotUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value;

    if (!username || !newPassword) {
        alert("Please enter both username and your new password.");
        return;
    }

    try {
        const response = await fetch('http://localhost/barangay_portal/auth.php?action=reset_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, newPassword })
        });

        const result = await response.json();
        alert(result.message);

        if (result.success) {
            // Clear fields and go back to login form
            document.getElementById("forgotUsername").value = "";
            document.getElementById("newPassword").value = "";
            showLogin();
        }
    } catch (error) {
        console.error("Reset Error:", error);
        alert("Failed to connect to server. Check your connection.");
    }
}