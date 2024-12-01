// Initialize EmailJS with your Public Key
emailjs.init("qTTGV26hza4h4Hsvw"); // Replace with your EmailJS Public Key

// Feedback form submission handler
document.getElementById("feedbackForm").onsubmit = async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(event.target);

    // Map the data to EmailJS template variables
    const feedbackData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    };

    // Debugging: Log the data being sent
    console.log("Feedback Data:", feedbackData);

    try {
        // Send the email using EmailJS
        const response = await emailjs.send("service_qeg1ynf", "template_1nrldpo", feedbackData);
        console.log("Email sent successfully:", response.status, response.text);

        // Display success message and reset the form
        document.getElementById("feedbackSuccess").style.display = "block";
        document.getElementById("feedbackError").style.display = "none";
        event.target.reset(); // Reset the form
    } catch (error) {
        // Log the error and display an error message
        console.error("Failed to send email:", error);
        document.getElementById("feedbackSuccess").style.display = "none";
        document.getElementById("feedbackError").style.display = "block";
    }
};
