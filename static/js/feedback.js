
emailjs.init("qTTGV26hza4h4Hsvw"); 


document.getElementById("feedbackForm").onsubmit = async function (event) {
    event.preventDefault(); 
   
    const formData = new FormData(event.target);

    
    const feedbackData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    };

    
    console.log("Feedback Data:", feedbackData);

    try {
       
        const response = await emailjs.send("service_qeg1ynf", "template_1nrldpo", feedbackData);
        console.log("Email sent successfully:", response.status, response.text);

        
        document.getElementById("feedbackSuccess").style.display = "block";
        document.getElementById("feedbackError").style.display = "none";
        event.target.reset(); 
    } catch (error) {
       
        console.error("Failed to send email:", error);
        document.getElementById("feedbackSuccess").style.display = "none";
        document.getElementById("feedbackError").style.display = "block";
    }
};
