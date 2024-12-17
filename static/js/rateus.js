document.addEventListener("DOMContentLoaded", () => {
    const openRateUs = document.getElementById("openRateUs");
    const ratingPopup = document.getElementById("ratingPopup");
    const stars = document.querySelectorAll(".star");
    const submitRating = document.getElementById("submitRating");
    const averageRatingDisplay = document.getElementById("averageRating");

    let selectedRating = 0;
    let ratings = [4, 5, 3, 4, 5]; 


    openRateUs.addEventListener("click", (e) => {
        e.preventDefault();
        ratingPopup.style.display = "flex";
    });

    
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.getAttribute("data-value"));
            updateStars(selectedRating);
        });
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            star.classList.toggle("active", index < rating);
        });
    }


    submitRating.addEventListener("click", () => {
        if (selectedRating === 0) {
            alert("Please select a rating before submitting.");
            return;
        }

        
        let adjustedRating = calculateWeightedRating(selectedRating);
        ratings.push(adjustedRating);

       
        let averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        averageRatingDisplay.textContent = averageRating.toFixed(1);

        console.log(`Original Rating: ${selectedRating}`);
        console.log(`Weighted Rating: ${adjustedRating}`);
        console.log(`Updated Ratings Array: ${ratings}`);
        console.log(`New Average Rating: ${averageRating.toFixed(1)}`);

        
        ratingPopup.style.display = "none";
        selectedRating = 0;
        updateStars(0); 
    });

    
    function calculateWeightedRating(rating) {
        switch (rating) {
            case 5: return rating + 8;  
            case 4: return rating + 5;  
            case 3: return rating + 4;  
            case 2: return rating + 1;  
            case 1: return rating - 5;  
            default: return rating;
        }
    }

   
    ratingPopup.addEventListener("click", (e) => {
        if (e.target === ratingPopup) {
            ratingPopup.style.display = "none";
            selectedRating = 0;
            updateStars(0);
        }
    });

    
    let initialAverage = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    averageRatingDisplay.textContent = initialAverage.toFixed(1);
});
