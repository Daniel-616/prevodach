// Toggle the hamburger menu
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
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

// Get the relevant elements
const elements = {
  welcome: document.getElementById('welcome'),
  description: document.getElementById('description'),
};

// Function to load the JSON file and update the text
async function loadLanguage(lang) {
  try {
    const response = await fetch(`./languages/${lang}.json`);
    const translations = await response.json();

    // Update elements with translations
    elements.welcome.textContent = translations.welcome;
    elements.description.textContent = translations.description;
  } catch (error) {
    console.error("Error loading language file:", error);
  }
}

// Handle language change
document.getElementById('languageSwitcher').addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  loadLanguage(selectedLanguage);

  // Optionally, save the user's choice
  localStorage.setItem('language', selectedLanguage);
});

// Load the saved language or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';
document.getElementById('languageSwitcher').value = savedLanguage;
loadLanguage(savedLanguage);