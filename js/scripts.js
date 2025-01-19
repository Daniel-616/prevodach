// Toggle the hamburger menu
document.addEventListener("DOMContentLoaded", () => {
	// Handle the menu dropdown
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mobileDropdown = document.querySelector(".mobile-dropdown-content");

    mobileMenuBtn.addEventListener("click", () => {
      const isDisplayed = mobileDropdown.style.display === "block";
      mobileDropdown.style.display = isDisplayed ? "none" : "block";
    });
  
    // Handle form submission with CAPTCHA validation
    const form = document.getElementById("contactForm");
    const responseMessage = document.getElementById("responseMessage");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const captcha = document.getElementById("captcha").value;
        if (captcha !== "42") { // Simple CAPTCHA question
            responseMessage.textContent = "CAPTCHA validation failed. Please try again.";
            responseMessage.style.color = "red";
            return;
        }

        const formData = new FormData(form);

        try {
            const response = await fetch("https://formsubmit.co/YOUR_EMAIL", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                responseMessage.textContent = "Message sent successfully!";
                responseMessage.style.color = "green";
                form.reset();
            } else {
                responseMessage.textContent = "Error sending message.";
                responseMessage.style.color = "red";
            }
        } catch (error) {
            responseMessage.textContent = "An error occurred. Please try again.";
            responseMessage.style.color = "red";
        }
    });
});

document.getElementById('contactForm2').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
		const token = await grecaptcha.execute('6LcBvLsqAAAAAJQXK7jREspBgaWm_r8PwDit5i_A', { action: 'submit' });
		formData.append('g-recaptcha-response', token);
			
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Email sent successfully!';
            form.reset();
        } else {
            document.getElementById('responseMessage').innerText = `Error: ${result.error}`;
        }
    } catch (error) {
        document.getElementById('responseMessage').innerText = 'Failed to send email.';
    }
});

// Get the relevant elements
const elements = {
  welcome: document.getElementById('welcome'),
  description: document.getElementById('description'),
  contactHeading: document.getElementById('contactHeading'),
};

// Function to load the JSON file and update the text
async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    const translations = await response.json();
	
	// Update both menus
	document.getElementById('languageSelector').value = lang;
	document.getElementById('languageSelector2').value = lang;
	
    // Update elements with translations
    elements.welcome.textContent = translations.welcome;
    elements.description.textContent = translations.description;
    elements.contactHeading.textContent = translations.contactHeading;	
  } catch (error) {
    console.error("Error loading language file:", error);
  }
}

// Handle language change for the large menu
document.getElementById('languageSelector').addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  loadLanguage(selectedLanguage);

  // Save the user's choice
  localStorage.setItem('language', selectedLanguage);
});

// Handle language change for the mobile menu
document.getElementById('languageSelector2').addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  loadLanguage(selectedLanguage);

  // Save the user's choice
  localStorage.setItem('language', selectedLanguage);
});

// Load the saved language or default to 'de'
const savedLanguage = localStorage.getItem('language') || 'de';
document.getElementById('languageSelector').value = savedLanguage;
document.getElementById('languageSelector2').value = savedLanguage;
loadLanguage(savedLanguage);