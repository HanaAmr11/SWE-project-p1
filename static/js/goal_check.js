const weights = [];
const timestamps = [];

document.getElementById("compareButton").onclick = function() {
    const currentWeight = parseFloat(document.getElementById("currentWeight").value);
    const goalWeight = parseFloat(document.getElementById("goalWeight").value);


    if (isNaN(currentWeight) || isNaN(goalWeight) || currentWeight <= 0 || goalWeight <= 0) {
        alert("Please enter valid positive numbers for both current weight and goal weight.");
        return;
    }

    const resultMessage = document.getElementById("resultMessage");
    const progressFill = document.getElementById("progressFill");
    const progress = Math.min((goalWeight / currentWeight) * 100, 100);

   
    progressFill.style.width = `${progress}%`;

    if (currentWeight === goalWeight) {
        resultMessage.textContent = "🎉 Congratulations! You have reached your goal weight!";
        resultMessage.className = "result-message success-message";
        resultMessage.style.display = "block";
        launchConfetti();
    } else if (currentWeight > goalWeight) {
        const difference = currentWeight - goalWeight;
        resultMessage.textContent = `You need to lose ${difference} kg to reach your goal. Keep going!`;
        resultMessage.className = "result-message reminder-message";
    } else {
        const difference = goalWeight - currentWeight;
        resultMessage.textContent = `You need to gain ${difference} kg to reach your goal. Keep it up!`;
        resultMessage.className = "result-message failure-message";
    }

    resultMessage.style.display = "block";

    
    weights.push(currentWeight);
    timestamps.push(new Date().toLocaleString());

    updateChart();
};


function launchConfetti() {
    const body = document.body;
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.animationDelay = Math.random() * 2 + "s";
        confetti.style.backgroundColor = getRandomColor();
        body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timestamps,
        datasets: [{
            label: 'Weight Progress (kg)',
            data: weights,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true, 
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight (kg)'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

function updateChart() {
    progressChart.data.labels = timestamps;
    progressChart.data.datasets[0].data = weights;
    progressChart.update();
}
