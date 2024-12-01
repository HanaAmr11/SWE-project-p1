document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calorieForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const age = parseFloat(document.getElementById('ageInput').value);
        const weight = parseFloat(document.getElementById('weightInput').value);
        const height = parseFloat(document.getElementById('heightInput').value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const activityLevel = parseFloat(document.getElementById('activityLevel').value);

        let bmr;
        if (gender === 'male') {
            bmr = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
        } else {
            bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        }
        let totalCalories = bmr * activityLevel;
        totalCalories = Math.floor(totalCalories);


        document.getElementById('calorieResult').textContent = `Your daily caloric needs are approximately ${totalCalories} calories.`;
    });
});
