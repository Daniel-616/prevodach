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
