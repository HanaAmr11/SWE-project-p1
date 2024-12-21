from flask import Blueprint, request, render_template, jsonify, session, redirect, url_for, flash
import pandas as pd
import random
meal_plan_bp = Blueprint('meal_plan', __name__, template_folder='templates', static_folder='static')
file_path = 'Accurate_Daily_Meal_Plan_Dataset.csv'
df = pd.read_csv(file_path)

def select_meal_by_type(meal_type, target_calories):
    meals = df[df['meal_type'] == meal_type].copy()  
    meals['calorie_diff'] = abs(meals['calories'] - target_calories)
    meals = meals.sort_values(by='calorie_diff')
    if not meals.empty:
        return meals.iloc[0]
    else:
        fallback_meals = df[df['meal_type'] == meal_type]
        if not fallback_meals.empty:
            return fallback_meals.sample(1).iloc[0]
        return None
@meal_plan_bp.route('/')
def home():
    return render_template('meal.html')
@meal_plan_bp.route('/generate_meal_plan', methods=['POST'])
def generate_meal_plan():
    try:
        calories = int(request.form.get('calories'))
        goal = request.form.get('goal')

        if goal == 'lose':
            calories -= 500
        elif goal == 'gain':
            calories += 500

        meal_distribution = {
            'Breakfast': 0.3,
            'Lunch': 0.3,
            'Dinner': 0.25,
            'Snack': 0.15
        }

        selected_meals = []
        total_calories = 0

        for meal_type, ratio in meal_distribution.items():
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

        return render_template('meal.html', selected_meals=selected_meals, total_calories=total_calories)

    except Exception as e:
        flash(f"Error generating meal plan: {str(e)}", "danger")
        return redirect(url_for('meal_plan.home'))
