document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('bmiForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const weight = parseFloat(document.getElementById('bmiWeight').value);
        const heightCm = parseFloat(document.getElementById('bmiHeight').value);
        const heightM = heightCm / 100;  
        const bmi = weight / (heightM * heightM);
        const roundedBmi = Math.round(bmi * 10) / 10;

        
        let category;
        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi < 25) {
            category = "Normal weight";
        } else if (bmi < 30) {
            category = "Overweight";
        } else {
            category = "Obese";
        }

     
        document.getElementById('bmiResult').textContent = `Your BMI is ${roundedBmi} (${category}).`;
    });
});
