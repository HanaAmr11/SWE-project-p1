from flask import Blueprint, request, render_template
import pandas as pd
import random

weekly_meal_plan_bp = Blueprint('weekly_meal_plan', __name__, template_folder='templates', static_folder='static')
file_path = 'Accurate_Daily_Meal_Plan_Dataset.csv'
df = pd.read_csv(file_path)
def select_meal_by_type(meal_type, target_calories, used_meals):
    """
    Select a meal of a specific type close to the target calories, avoiding duplicates.
    """
    meals = df[(df['meal_type'] == meal_type) & (~df['meal_name'].isin(used_meals))].copy()
    meals.loc[:, 'calorie_diff'] = abs(meals['calories'] - target_calories)
    meals = meals.sort_values(by='calorie_diff')

    if not meals.empty:
        return meals.iloc[0]
    else:
        fallback_meals = df[(df['meal_type'] == meal_type) & (~df['meal_name'].isin(used_meals))].copy()
        if not fallback_meals.empty:
            return fallback_meals.sample(1).iloc[0]
        return None


def generate_daily_plan(calories, goal, used_meals):
    if goal == 'lose':
        calories -= 500
    elif goal == 'gain':
        calories += 500

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
        for _ in range(2):
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

    return selected_meals, total_calories

@weekly_meal_plan_bp.route('/')
def home_weekly():
    return render_template('weekly_plan.html')

@weekly_meal_plan_bp.route('/generate_weekly_plan', methods=['POST'])
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

        print(weekly_plan)
        return render_template('weekly_plan.html', weekly_plan=weekly_plan)

    except Exception as e:
        return f"Error: {str(e)}"
