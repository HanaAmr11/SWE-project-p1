from flask import Flask, request, render_template
import pandas as pd
import random


app3 = Flask(__name__, template_folder='templates', static_folder='static')


file_path = 'Accurate_Daily_Meal_Plan_Dataset.csv'
df = pd.read_csv(file_path)

@app3.route('/')
def home_weekly():
    return render_template('index2.html')

def select_meal_by_type(meal_type, target_calories, used_meals):
    """
    Select a meal of a specific type close to the target calories, avoiding duplicates.
    """
    meals = df[(df['meal_type'] == meal_type) & (~df['meal_name'].isin(used_meals))]
    meals['calorie_diff'] = abs(meals['calories'] - target_calories)
    meals = meals.sort_values(by='calorie_diff')

    if not meals.empty:
        return meals.iloc[0]
    else:
        fallback_meals = df[(df['meal_type'] == meal_type) & (~df['meal_name'].isin(used_meals))]
        if not fallback_meals.empty:
            return fallback_meals.sample(1).iloc[0]
        return None

def generate_daily_plan(calories, goal, used_meals):
    """
    Generate a daily meal plan based on target calories and goal, avoiding duplicates.
    """
    if goal == 'lose':
        calories -= 500
    elif goal == 'gain':
        calories += 500
        extra_calories = 300 
        calories += extra_calories

    meal_distribution = {
        'Breakfast': 0.3,
        'Lunch': 0.3,
        'Dinner': 0.25
    }

    selected_meals = []
    total_calories = 0

    for meal_type, ratio in meal_distribution.items():
        target_calories = calories * ratio
        meal = select_meal_by_type(meal_type, target_calories, used_meals)
        if meal is not None:
            selected_meals.append({
                'meal_type': meal_type,
                'meal_name': meal['meal_name'],
                'calories': meal['calories'],
                'protein': meal['protein'],
                'carbohydrate': meal['carbohydrate'],
                'fats': meal['fats']
            })
            used_meals.add(meal['meal_name'])
            total_calories += meal['calories']

    
    if goal == 'gain':
        snack_options = df[(df['meal_type'] == 'Snack') & (~df['meal_name'].isin(used_meals))]
        snack_count = 0
        while snack_count < 2:
            if snack_options.empty:
                break
            snack = snack_options.nlargest(1, 'calories').iloc[0]
            selected_meals.append({
                'meal_type': 'Snack',
                'meal_name': snack['meal_name'],
                'calories': snack['calories'],
                'protein': snack['protein'],
                'carbohydrate': snack['carbohydrate'],
                'fats': snack['fats']
            })
            used_meals.add(snack['meal_name'])
            total_calories += snack['calories']
            snack_options = snack_options[snack_options['meal_name'] != snack['meal_name']]
            snack_count += 1

    return selected_meals, total_calories

@app3.route('/generate_weekly_plan', methods=['POST'])
def generate_weekly_plan():
    try:
        calories = int(request.form.get('calories'))
        goal = request.form.get('goal')

        if not calories or not goal:
            return "Error: Calories and goal are required."

        weekly_plan = []
        used_meals = set()

        for day in range(7):
            daily_plan, total_calories = generate_daily_plan(calories, goal, used_meals)
            weekly_plan.append({
                'day': f'Day {day + 1}',
                'meals': daily_plan,
                'total_calories': total_calories
            })

        
        weekly_plan_html = """
            <div style='display: flex; justify-content: center; align-items: center; flex-direction: column; min-height: 60vh;'>
                <h2 style='text-align:center; color:#2c3e50; margin-bottom: 20px;'>Your Weekly Meal Plan</h2>
        """
        for day_plan in weekly_plan:
            weekly_plan_html += f"""
                <h3 style='text-align:center; margin-top: 20px;'> {day_plan['day']} </h3>
                <table style='width: 60%; margin: 0 auto; border-collapse: collapse; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>
                    <thead>
                        <tr style='background-color: #007bff; color: white;'>
                            <th>Meal Type</th>
                            <th>Meal Name</th>
                            <th>Calories</th>
                            <th>Protein (g)</th>
                            <th>Carbs (g)</th>
                            <th>Fats (g)</th>
                        </tr>
                    </thead>
                    <tbody>
            """
            for meal in day_plan['meals']:
                background_color = '#f8f9fa' if random.choice([True, False]) else '#ffffff'
                weekly_plan_html += f"""
                        <tr style='background-color: {background_color};'>
                            <td>{meal['meal_type']}</td>
                            <td>{meal['meal_name']}</td>
                            <td>{meal['calories']}</td>
                            <td>{meal['protein']}</td>
                            <td>{meal['carbohydrate']}</td>
                            <td>{meal['fats']}</td>
                        </tr>
                """
            weekly_plan_html += f"<tfoot><tr><td>Total Calories</td><td>{day_plan['total_calories']} kcal</td></tr></tfoot></table>"
        weekly_plan_html += "</div>"

        return weekly_plan_html

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    app3.run(host='0.0.0.0', port=5000, debug=True)