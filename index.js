// ============================================
// Barangay E-Portal - Index JS (with MySQL)
// ============================================

window.addEventListener("DOMContentLoaded", async () => {
    const userStr = sessionStorage.getItem('loggedInUser');

    if (!userStr) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(userStr);

    // Set username in navbar
    document.getElementById("profileUsername").textContent = user.username;

    // Set avatar
    const avatar = document.getElementById("profileAvatar");
    if (user.profilePicture) {
        avatar.style.backgroundImage = `url(${user.profilePicture})`;
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";
        avatar.textContent = "";
    } else {
        avatar.textContent = user.username[0].toUpperCase();
    }

    // Load announcements from database
    await loadAnnouncements();
});

// Load announcements from MySQL
async function loadAnnouncements() {
    try {
        const response = await fetch('requests.php?action=announcements');
        const result = await response.json();

        if (result.success && result.announcements.length > 0) {
            const container = document.querySelector('.announcements');
            const heading = container.querySelector('h3');

            // Clear existing cards
            container.innerHTML = '';
            container.appendChild(heading);

            // Render from DB
            result.announcements.forEach(ann => {
                const card = document.createElement('div');
                card.className = 'announcement-card';
                card.innerHTML = `<strong>${ann.title}</strong><p>${ann.content}</p>`;
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.warn('Could not load announcements from DB:', error);
        // Falls back to static HTML announcements
    }
}

// Navigate to profile page
document.addEventListener("DOMContentLoaded", () => {
    const profileSection = document.getElementById("profileSection");
    if (profileSection) {
        profileSection.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }
});

// Logout
function logout() {
    sessionStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = "login.html";
}
