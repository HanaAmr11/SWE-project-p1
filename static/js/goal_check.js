document.getElementById("compareButton").onclick = function() {
    const currentWeight = parseFloat(document.getElementById("currentWeight").value);
    const goalWeight = parseFloat(document.getElementById("goalWeight").value);

    
    if (isNaN(currentWeight) || isNaN(goalWeight)) {
        alert("Please enter valid numbers for both current weight and goal weight.");
        return;
    }

    
    const resultMessage = document.getElementById("resultMessage");
    
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

 
    resultMessage.style.display = "block";
};
