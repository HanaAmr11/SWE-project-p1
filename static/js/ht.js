let currentWater = 0; // Current water intake in liters
const goal = 3; // Daily goal in liters
const checkMarksTotal = 12; // Total number of check marks
const checkMarksContainer = document.getElementById("checkMarksContainer");
const waterLevel = document.getElementById("waterLevel");
const progressText = document.getElementById("progressText");
let reminderInterval; // To store the interval ID for hydration reminders

// Initialize check marks
function initializeCheckMarks() {
    checkMarksContainer.innerHTML = "";
    for (let i = 0; i < checkMarksTotal; i++) {
        const mark = document.createElement("span");
        mark.className = "check-mark";
        checkMarksContainer.appendChild(mark);
    }
}

// Fill only one additional check mark per button press
function updateCheckMarks() {
    const marks = document.querySelectorAll(".check-mark");
    for (let mark of marks) {
        if (!mark.classList.contains("filled")) {
            mark.classList.add("filled");
            break; // Fill only one mark
        }
    }
}

// Start alerts to remind the user to drink water
function startWaterReminder() {
    reminderInterval = setInterval(() => {
        if (currentWater < goal) {
            alert("Go and drink water!");
        } else {
            stopWaterReminder(); // Stop reminders once the goal is reached
        }
    }, 7000); // Every 7 seconds
}

// Stop reminders when the goal is reached
function stopWaterReminder() {
    clearInterval(reminderInterval);
}

// Add water to the bottle
function addWater(amount) {
    if (currentWater < goal) {
        currentWater += amount;
        if (currentWater > goal) currentWater = goal;

        updateWaterLevel();
        updateCheckMarks();

        // If the goal is reached, stop reminders and show a congratulatory alert
        if (currentWater === goal) {
            stopWaterReminder();
            alert("🎉 Congratulations! You've reached your hydration goal!");
        }
    }
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
}

// Initialize
initializeCheckMarks();
updateWaterLevel();
startWaterReminder();
