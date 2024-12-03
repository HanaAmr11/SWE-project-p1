
emailjs.init("qTTGV26hza4h4Hsvw"); 


document.getElementById("contactform").onsubmit = async function (event) {
    event.preventDefault(); 
  
    const formData = new FormData(event.target);

    const contactData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    };

    
    console.log("Contact Data:", contactData);

    try {
       
        const response = await emailjs.send("service_qeg1ynf", "template_1nrldpo", contactData);
        console.log("Email sent successfully:", response.status, response.text);

       
        document.getElementById("contactresult").innerHTML = "<p class='success-message'>Your submition has been done successfully!</p>";
        document.getElementById("contactresult").style.display = "block";
        event.target.reset(); 
    } catch (error) {
        
        console.error("Failed to send email:", error);
        document.getElementById("contactresult").innerHTML = "<p class='error-message'>Oops! Something went wrong. Please try again later.</p>";
        document.getElementById("contactresult").style.display = "block";
    }
};
