from flask import Flask, request, render_template
import pandas as pd
import random

# Initialize Flask App
app = Flask(__name__, template_folder='templates', static_folder='static')

# Load dataset
file_path = 'Accurate_Daily_Meal_Plan_Dataset.csv'
df = pd.read_csv(file_path)

@app.route('/')
def home():
    return render_template('index.html')

def select_meal_by_type(meal_type, target_calories):
    """
    Select a meal of a specific type close to the target calories.
    """
    meals = df[df['meal_type'] == meal_type]
    meals['calorie_diff'] = abs(meals['calories'] - target_calories)
    meals = meals.sort_values(by='calorie_diff')

    if not meals.empty:
        return meals.iloc[0]
    else:
        # Fallback: Return any random meal of the type
        fallback_meals = df[df['meal_type'] == meal_type]
        if not fallback_meals.empty:
            return fallback_meals.sample(1).iloc[0]
        return None

@app.route('/generate_meal_plan', methods=['POST'])
def generate_meal_plan():
    try:
        calories = int(request.form.get('calories'))
        goal = request.form.get('goal')

        if not calories or not goal:
            return "Error: Calories and goal are required."

        # Adjust calories based on goal
        if goal == 'lose':
            calories -= 500
        elif goal == 'gain':
            calories += 500

        # Meal type and calorie distribution
        meal_distribution = {
            'Breakfast': 0.3,
            'Lunch': 0.3,
            'Dinner': 0.25,
            'Snack': 0.15
        }

        selected_meals = []
        total_calories = 0

        # Select meals for Breakfast, Lunch, and Dinner
        for meal_type, ratio in list(meal_distribution.items())[:-1]:
            target_calories = calories * ratio
            meal = select_meal_by_type(meal_type, target_calories)

            if meal is not None:
                selected_meals.append({
                    'meal_type': meal_type,
                    'meal_name': meal['meal_name'],
                    'calories': meal['calories'],
                    'protein': meal['protein'],
                    'carbohydrate': meal['carbohydrate'],
                    'fats': meal['fats']
                })
                total_calories += meal['calories']

        # Adjust Snack calories dynamically
        remaining_calories = calories - total_calories
        snack_meal = select_meal_by_type('Snack', remaining_calories)

        if snack_meal is not None:
            selected_meals.append({
                'meal_type': 'Snack',
                'meal_name': snack_meal['meal_name'],
                'calories': snack_meal['calories'],
                'protein': snack_meal['protein'],
                'carbohydrate': snack_meal['carbohydrate'],
                'fats': snack_meal['fats']
            })
            total_calories += snack_meal['calories']

        # Add varied snacks in weight gain condition
        if goal == 'gain':
            snack_types = ['Snack'] * 3  # Allow up to 3 varied snacks
            for snack_type in snack_types:
                extra_snack = select_meal_by_type(snack_type, random.randint(100, 300))
                if extra_snack is not None:
                    selected_meals.append({
                        'meal_type': snack_type,
                        'meal_name': extra_snack['meal_name'],
                        'calories': extra_snack['calories'],
                        'protein': extra_snack['protein'],
                        'carbohydrate': extra_snack['carbohydrate'],
                        'fats': extra_snack['fats']
                    })
                    total_calories += extra_snack['calories']

        # Ensure exact match in maintain condition with varied snacks
        if goal == 'maintain':
            while total_calories != calories:
                adjustment_snack = select_meal_by_type('Snack', random.randint(50, 150))
                if adjustment_snack is not None:
                    selected_meals.append({
                        'meal_type': 'Snack',
                        'meal_name': adjustment_snack['meal_name'],
                        'calories': adjustment_snack['calories'],
                        'protein': adjustment_snack['protein'],
                        'carbohydrate': adjustment_snack['carbohydrate'],
                        'fats': adjustment_snack['fats']
                    })
                    total_calories += adjustment_snack['calories']

        # Generate an HTML response as a centered table
        meal_plan_html = """
            <div style='display: flex; justify-content: center; align-items: center; flex-direction: column; min-height: 60vh;'>
                <h2 style='text-align:center; color:#2c3e50; margin-bottom: 20px;'>Your Meal Plan</h2>
                <table style='width: 60%; margin: 0 auto; border-collapse: collapse; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>
                    <thead>
                        <tr style='background-color: #007bff; color: white;'>
                            <th style='padding: 12px; border: 1px solid #ddd;'>Meal Type</th>
                            <th style='padding: 12px; border: 1px solid #ddd;'>Meal Name</th>
                            <th style='padding: 12px; border: 1px solid #ddd;'>Calories</th>
                            <th style='padding: 12px; border: 1px solid #ddd;'>Protein (g)</th>
                            <th style='padding: 12px; border: 1px solid #ddd;'>Carbs (g)</th>
                            <th style='padding: 12px; border: 1px solid #ddd;'>Fats (g)</th>
                        </tr>
                    </thead>
                    <tbody>
        """
        for i, meal in enumerate(selected_meals):
            background_color = '#f8f9fa' if i % 2 == 0 else '#ffffff'
            meal_plan_html += f"""
                        <tr style='background-color: {background_color};'>
                            <td style='padding: 10px; border: 1px solid #ddd;'>{meal['meal_type']}</td>
                            <td style='padding: 10px; border: 1px solid #ddd;'>{meal['meal_name']}</td>
                            <td style='padding: 10px; border: 1px solid #ddd;'>{meal['calories']}</td>
                            <td style='padding: 10px; border: 1px solid #ddd;'>{meal['protein']}</td>
                            <td style='padding: 10px; border: 1px solid #ddd;'>{meal['carbohydrate']}</td>
                            <td style='padding: 10px; border: 1px solid #ddd;'>{meal['fats']}</td>
                        </tr>
            """
        meal_plan_html += f"""
                    </tbody>
                    <tfoot>
                        <tr style='background-color: #e9ecef;'>
                            <td colspan='2'>Total Calories</td>
                            <td>{total_calories} kcal</td>
                            <td colspan='3'></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        """

        return meal_plan_html

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)