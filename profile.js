// ============================================
// Barangay E-Portal - Profile JS (with MySQL)
// ============================================

window.addEventListener("DOMContentLoaded", () => {
    const userStr = sessionStorage.getItem('loggedInUser');

    if (!userStr) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(userStr);

    // Populate profile info from session (which came from DB on login)
    document.getElementById("profileUsername").textContent = user.username;
    document.getElementById("profileFullName").textContent = user.fullName;
    document.getElementById("profileEmail").textContent    = user.email;

    if (user.profilePicture) {
        const idImg = document.getElementById("profileIdCard");
        idImg.src = user.profilePicture;
        idImg.alt = "Profile Picture";
    }
});

// Logout
function logout() {
    sessionStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = "login.html";
}
