let currentWater = 0; // Current water intake in liters
const goal = 2; // Daily goal in liters

const waterLevel = document.getElementById("waterLevel");
const progressText = document.getElementById("progressText");

// Bar chart for weekly progress
const weeklyProgress = [1.5, 2, 1.8, 1.2, 2, 2.5, 1.9];
const barChart = document.getElementById("barChart");

// Initialize weekly progress bar chart
function initializeBarChart() {
    barChart.innerHTML = "";
    weeklyProgress.forEach((value) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(value / goal) * 100}%`;
        barChart.appendChild(bar);
    });
}

// Add water to the bottle
function addWater(amount) {
    currentWater += amount;
    if (currentWater > goal) currentWater = goal;

    updateWaterLevel();
}

// Add custom water amount
function addCustomWater() {
    const customAmount = parseFloat(prompt("Enter amount of water (in liters):"));
    if (!isNaN(customAmount) && customAmount > 0) {
        addWater(customAmount);
    } else {
        alert("Please enter a valid amount.");
    }
}

// Update water level in the bottle
function updateWaterLevel() {
    const percentage = (currentWater / goal) * 100;
    waterLevel.style.height = `${percentage}%`;
    progressText.textContent = `${currentWater.toFixed(1)}L / ${goal}L`;

    if (currentWater === goal) {
        alert("🎉 Congratulations! You reached your hydration goal!");
    }
}

// Initialize
initializeBarChart();
updateWaterLevel();
