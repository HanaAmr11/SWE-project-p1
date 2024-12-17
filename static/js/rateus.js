document.addEventListener("DOMContentLoaded", () => {
    const openRateUs = document.getElementById("openRateUs");
    const ratingPopup = document.getElementById("ratingPopup");
    const stars = document.querySelectorAll(".star");
    const submitRating = document.getElementById("submitRating");
    const averageRatingDisplay = document.getElementById("averageRating");

    let selectedRating = 0;
    let ratings = [4, 5, 3, 4, 5]; // Example existing ratings

    // Show popup when "Rate Us" is clicked
    openRateUs.addEventListener("click", (e) => {
        e.preventDefault();
        ratingPopup.style.display = "flex";
    });

    // Handle star selection
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

    // Submit Rating
    submitRating.addEventListener("click", () => {
        if (selectedRating === 0) {
            alert("Please select a rating before submitting.");
            return;
        }

        // Adjust the rating based on custom weights
        let adjustedRating = calculateWeightedRating(selectedRating);
        ratings.push(adjustedRating);

        // Calculate the new average rating
        let averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        averageRatingDisplay.textContent = averageRating.toFixed(1);

        console.log(`Original Rating: ${selectedRating}`);
        console.log(`Weighted Rating: ${adjustedRating}`);
        console.log(`Updated Ratings Array: ${ratings}`);
        console.log(`New Average Rating: ${averageRating.toFixed(1)}`);

        // Hide popup
        ratingPopup.style.display = "none";
        selectedRating = 0;
        updateStars(0); // Reset stars
    });

    // Custom logic for weighted rating
    function calculateWeightedRating(rating) {
        switch (rating) {
            case 5: return rating + 8;  // Increase by 8
            case 4: return rating + 5;  // Increase by 5
            case 3: return rating + 4;  // Increase by 2
            case 2: return rating + 1;  // Increase by 1
            case 1: return rating - 5;  // Decrease by 5
            default: return rating;
        }
    }

    // Close popup if clicked outside
    ratingPopup.addEventListener("click", (e) => {
        if (e.target === ratingPopup) {
            ratingPopup.style.display = "none";
            selectedRating = 0;
            updateStars(0);
        }
    });

    // Display the initial average rating on load
    let initialAverage = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    averageRatingDisplay.textContent = initialAverage.toFixed(1);
});
