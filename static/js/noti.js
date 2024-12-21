
document.addEventListener("DOMContentLoaded", function () {
    const waterNotificationHistory = [];
    const benefitNotificationHistory = [];

 
    const waterReminderInterval = setInterval(function () {
        const message = "💧 Remember to drink water and stay hydrated!";
        const timestamp = new Date().toLocaleString();
        waterNotificationHistory.push({ message, timestamp });

        const userConfirmed = confirm(`${message}\n\nWould you like to stop these reminders?`);
        if (userConfirmed) {
            clearInterval(waterReminderInterval);
            alert("✅ Stay hydrated and healthy!");
        }
    }, 7000);

  
    function fetchDailyBenefit() {
        console.log("🔄 Fetching daily benefit...");
        fetch('/get-daily-benefit')
            .then(response => response.json())
            .then(data => {
                if (data.Name && data.Type && data.Benefit) {
                    const benefitText = `${data.Name} (${data.Type}): ${data.Benefit}`;
                    document.getElementById('benefit-display').innerText = benefitText;
                    const timestamp = new Date().toLocaleString();
                    benefitNotificationHistory.push({
                        message: `🌟 Today's Benefit: ${benefitText}`,
                        timestamp: timestamp
                    });

                    alert("🎉 A new benefit is available for today!");
                    const myModal = new bootstrap.Modal(document.getElementById('newBenefitModal'));
                    myModal.show();
                } else {
                    document.getElementById('benefit-display').innerText =
                        'No benefit available for today. Please check again later.';
                }
            })
            .catch(error => {
                console.error('🚨 Error fetching daily benefit:', error);
                document.getElementById('benefit-display').innerText =
                    'Failed to load today’s benefit.';

                const timestamp = new Date().toLocaleString();
                benefitNotificationHistory.push({
                    message: '🚨 Failed to load today’s benefit.',
                    timestamp: timestamp
                });
            });
    }

    setInterval(fetchDailyBenefit, 60000);

    
    document.getElementById("viewNotificationHistory").addEventListener("click", function () {
        const historyList = document.getElementById("notificationHistoryList");
        historyList.innerHTML = "";

        
        const waterHeader = document.createElement("li");
        waterHeader.className = "list-group-item active";
        waterHeader.textContent = "💧 Water Reminders:";
        historyList.appendChild(waterHeader);

        if (waterNotificationHistory.length === 0) {
            const emptyWaterItem = document.createElement("li");
            emptyWaterItem.className = "list-group-item";
            emptyWaterItem.textContent = "No water reminders yet.";
            historyList.appendChild(emptyWaterItem);
        } else {
            waterNotificationHistory.forEach((notification, index) => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.textContent = `${index + 1}. ${notification.message} (at ${notification.timestamp})`;
                historyList.appendChild(listItem);
            });
        }

        const separator = document.createElement("hr");
        historyList.appendChild(separator);

        
        const benefitHeader = document.createElement("li");
        benefitHeader.className = "list-group-item active";
        benefitHeader.textContent = "🌟 Daily Benefits:";
        historyList.appendChild(benefitHeader);

        if (benefitNotificationHistory.length === 0) {
            const emptyBenefitItem = document.createElement("li");
            emptyBenefitItem.className = "list-group-item";
            emptyBenefitItem.textContent = "No benefit notifications yet.";
            historyList.appendChild(emptyBenefitItem);
        } else {
            benefitNotificationHistory.forEach((notification, index) => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.textContent = `${index + 1}. ${notification.message} (at ${notification.timestamp})`;
                historyList.appendChild(listItem);
            });
        }

        const historyModal = new bootstrap.Modal(document.getElementById("notificationHistoryModal"));
        historyModal.show();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const saveButton = document.getElementById('saveGoals');
    const successMessage = document.getElementById('goalsSuccess');

    
    function loadGoals() {
        checkboxes.forEach((checkbox) => {
            const isChecked = localStorage.getItem(checkbox.id) === 'true';
            checkbox.checked = isChecked;
        });
    }

 
    function saveGoals() {
        checkboxes.forEach((checkbox) => {
            localStorage.setItem(checkbox.id, checkbox.checked);
        });
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 2000);
    }

    saveButton.addEventListener('click', saveGoals);
    loadGoals();
});
