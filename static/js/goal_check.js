document.getElementById("compareButton").onclick = function() {
    // Get the values from the input fields
    const currentWeight = parseFloat(document.getElementById("currentWeight").value);
    const goalWeight = parseFloat(document.getElementById("goalWeight").value);

    // Check if both fields are filled and are valid numbers
    if (isNaN(currentWeight) || isNaN(goalWeight)) {
        alert("Please enter valid numbers for both current weight and goal weight.");
        return;
    }

    // Get the result message container
    const resultMessage = document.getElementById("resultMessage");
    
    // Compare the weights and display the appropriate message
    if (currentWeight === goalWeight) {
        resultMessage.textContent = "Congratulations! You have reached your goal weight!";
        resultMessage.className = "result-message success-message";
    } else if (currentWeight > goalWeight) {
        const difference = currentWeight - goalWeight;
        resultMessage.textContent = `You haven't reached your goal yet. You need to lose ${difference} kg! Keep it up!`;
        resultMessage.className = "result-message reminder-message";
    } else {
        const difference = goalWeight - currentWeight;
        resultMessage.textContent = `You haven't reached your goal yet. You need to gain ${difference} kg to reach your target.`;
        resultMessage.className = "result-message failure-message";
    }

    // Show the result message
    resultMessage.style.display = "block";
};
