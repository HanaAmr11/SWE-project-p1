let currentWater = 0; 
const goal = 3; 
const checkMarksTotal = 12; 
const checkMarksContainer = document.getElementById("checkMarksContainer");
const waterLevel = document.getElementById("waterLevel");
const progressText = document.getElementById("progressText");
let reminderInterval; 


function initializeCheckMarks() {
    checkMarksContainer.innerHTML = "";
    for (let i = 0; i < checkMarksTotal; i++) {
        const mark = document.createElement("span");
        mark.className = "check-mark";
        checkMarksContainer.appendChild(mark);
    }
}


function updateCheckMarks() {
    const marks = document.querySelectorAll(".check-mark");
    for (let mark of marks) {
        if (!mark.classList.contains("filled")) {
            mark.classList.add("filled");
            break; 
        }
    }
}


function startWaterReminder() {
    reminderInterval = setInterval(() => {
        if (currentWater < goal) {
            alert("Go and drink water!");
        } else {
            stopWaterReminder(); 
        }
    }, 7000); 
}


function stopWaterReminder() {
    clearInterval(reminderInterval);
}


function addWater(amount) {
    if (currentWater < goal) {
        currentWater += amount;
        if (currentWater > goal) currentWater = goal;

        updateWaterLevel();
        updateCheckMarks();

        
        if (currentWater === goal) {
            stopWaterReminder();
            alert("🎉 Congratulations! You've reached your hydration goal!");
        }
    }
}


function addCustomWater() {
    const customAmount = parseFloat(prompt("Enter amount of water (in liters):"));
    if (!isNaN(customAmount) && customAmount > 0) {
        addWater(customAmount);
    } else {
        alert("Please enter a valid amount.");
    }
}


function updateWaterLevel() {
    const percentage = (currentWater / goal) * 100;
    waterLevel.style.height = `${percentage}%`;
    progressText.textContent = `${currentWater.toFixed(1)}L / ${goal}L`;
}


initializeCheckMarks();
updateWaterLevel();
startWaterReminder();
