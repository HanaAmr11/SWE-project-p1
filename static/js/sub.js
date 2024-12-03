
emailjs.init("qTTGV26hza4h4Hsvw"); 

document.getElementById("expertForm").onsubmit = async function(event) {
    event.preventDefault(); 

    const formData = new FormData(event.target);


    const formDataToSend = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        meeting_time: formData.get("meeting_time"),
        trainer_name: formData.get("trainer_name"),
    };

    
    console.log("Form Data:", formDataToSend);

    try {
       
        const response = await emailjs.send("service_qeg1ynf", "template_l2mwx34", formDataToSend);
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
