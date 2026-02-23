// ============================================
// Barangay E-Portal - Services JS (Unified)
// Matches Table: service_requests
// ============================================

// Submit form to the unified service_requests table
async function submitRequest(serviceTypeLabel) {
    const userStr = sessionStorage.getItem('loggedInUser');
    if (!userStr) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return;
    }

    const user      = JSON.parse(userStr);
    const purpose   = document.getElementById("purpose")?.value;
    const name      = document.getElementById("name")?.value.trim();
    const address   = document.getElementById("address")?.value.trim();
    const email     = document.getElementById("email")?.value.trim();
    const photoFile = document.getElementById("photo")?.files[0];

    if (!purpose || !name || !address || !email) {
        alert("Please fill in all required fields.");
        return;
    }

    // Convert photo to base64 if uploaded
    let photoData = '';
    if (photoFile) {
        photoData = await toBase64(photoFile);
    }

    // Prepare data to match your unified SQL columns
    const requestData = {
        user_id:      user.id,        // From session (mapped from user_id in DB)
        service_type: serviceTypeLabel, // e.g., 'Barangay ID'
        full_name:    name,
        address:      address,
        email:        email,
        purpose:      purpose,
        photo:        photoData
    };

    try {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) {
            btn.textContent = 'Submitting...';
            btn.disabled = true;
        }

        // Always point to the same action: submit_request
        const response = await fetch(`requests.php?action=submit_request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        // Check if response is valid JSON
        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            throw new Error("Server sent invalid response: " + text.substring(0, 100));
        }

        alert(result.message);

        if (result.success) {
            document.querySelector("form").reset();
            const preview = document.getElementById("preview");
            if (preview) { preview.src = ""; preview.style.display = "none"; }
        }

        if (btn) {
            btn.textContent = 'Submit Request';
            btn.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
        const btn = document.querySelector('button[type="submit"]');
        if (btn) {
            btn.textContent = 'Submit Request';
            btn.disabled = false;
        }
    }
}

// Convert file to base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = () => reject('File read error');
        reader.readAsDataURL(file);
    });
}

// Image preview
function previewImage(input) {
    const preview = document.getElementById("preview");
    if (input.files && input.files[0] && preview) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialization
window.addEventListener("DOMContentLoaded", () => {
    const userStr = sessionStorage.getItem('loggedInUser');
    if (!userStr) {
        // Only redirect if they are on a page that actually requires a form
        if (document.getElementById("purpose")) {
            alert("You must log in first!");
            window.location.href = "login.html";
        }
        return;
    }

    const photoInput = document.getElementById("photo");
    if (photoInput) {
        photoInput.addEventListener("change", function () {
            previewImage(this);
        });
    }
});