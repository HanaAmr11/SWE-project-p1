// Initialize EmailJS with your Public Key
emailjs.init("qTTGV26hza4h4Hsvw"); // Replace with your EmailJS Public Key

// Form submission handler for expert meeting request
document.getElementById("expertForm").onsubmit = async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(event.target);

    // Map the form data to EmailJS template variables
    const formDataToSend = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        meeting_time: formData.get("meeting_time"),
        trainer_name: formData.get("trainer_name"),
    };

    // Debugging: Log the form data being sent
    console.log("Form Data:", formDataToSend);

    try {
        // Send the email using EmailJS
        const response = await emailjs.send("service_qeg1ynf", "template_l2mwx34", formDataToSend);
        console.log("Email sent successfully:", response.status, response.text);

        // Show success message and reset the form
        document.getElementById("feedbackSuccess").style.display = "block";
        document.getElementById("feedbackError").style.display = "none";
        event.target.reset(); // Reset the form
    } catch (error) {
        // Show error message
        console.error("Failed to send email:", error);
        document.getElementById("feedbackSuccess").style.display = "none";
        document.getElementById("feedbackError").style.display = "block";
    }
};
