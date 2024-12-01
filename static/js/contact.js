// Initialize EmailJS with your Public Key
emailjs.init("qTTGV26hza4h4Hsvw"); // Replace with your EmailJS Public Key

// Contact form submission handler
document.getElementById("contactform").onsubmit = async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(event.target);

    // Map the data to EmailJS template variables
    const contactData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    };

    // Debugging: Log the data being sent
    console.log("Contact Data:", contactData);

    try {
        // Send the email using EmailJS
        const response = await emailjs.send("service_qeg1ynf", "template_1nrldpo", contactData);
        console.log("Email sent successfully:", response.status, response.text);

        // Display success message and reset the form
        document.getElementById("contactresult").innerHTML = "<p class='success-message'>Your submition has been done successfully!</p>";
        document.getElementById("contactresult").style.display = "block";
        event.target.reset(); // Reset the form
    } catch (error) {
        // Log the error and display an error message
        console.error("Failed to send email:", error);
        document.getElementById("contactresult").innerHTML = "<p class='error-message'>Oops! Something went wrong. Please try again later.</p>";
        document.getElementById("contactresult").style.display = "block";
    }
};
