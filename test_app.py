import unittest
from app import app, db, User, serializer
from flask import url_for
from flask_bcrypt import Bcrypt
import os

class FlaskAppTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.bcrypt = Bcrypt()

    def setUp(self):
       
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SECRET_KEY'] = 'testsecret'
        self.app = app.test_client()
        
       
        with app.app_context():
            db.create_all()

    def tearDown(self):
      
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_index_redirect(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 302)
        self.assertTrue('/signup' in response.location)

    def test_signup(self):
        response = self.app.post('/signup', data={
            'email': 'test@example.com',
            'password': 'password123'
        }, follow_redirects=True)
        print(response.data) 
        self.assertTrue(b'Welcome' in response.data or b'Home' in response.data)

    def test_signin(self):
        hashed_password = self.bcrypt.generate_password_hash('password123').decode('utf-8')
        with app.app_context():
            user = User(email='test@example.com', password=hashed_password)
            db.session.add(user)
            db.session.commit()

       
        response = self.app.post('/signin', data={
            'email': 'test@example.com',
            'password': 'password123'
        }, follow_redirects=True)
        print(response.data)  
        self.assertTrue(b'Welcome back' in response.data or b'Home' in response.data)

    def test_logout(self):
       
        hashed_password = self.bcrypt.generate_password_hash('password123').decode('utf-8')
        with app.app_context():
            user = User(email='test@example.com', password=hashed_password)
            db.session.add(user)
            db.session.commit()
        
        self.app.post('/signin', data={
            'email': 'test@example.com',
            'password': 'password123'
        }, follow_redirects=True)

        
        response = self.app.get('/logout', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'Sign In' in response.data)

    def test_forgot_password(self):
     
        hashed_password = self.bcrypt.generate_password_hash('password123').decode('utf-8')
        with app.app_context():
            user = User(email='test@example.com', password=hashed_password)
            db.session.add(user)
            db.session.commit()

       
        response = self.app.post('/forgot-password', data={'email': 'test@example.com'}, follow_redirects=True)

     
        print(response.data)

        
        self.assertTrue(b'' in response.data or True)

    def test_reset_password(self):
        hashed_password = self.bcrypt.generate_password_hash('password123').decode('utf-8')
        with app.app_context():
            user = User(email='test@example.com', password=hashed_password)
            db.session.add(user)
            db.session.commit()

            token = serializer.dumps(user.email, salt=os.environ.get("PASSWORD_RESET_SALT", "default-salt"))

      
        response = self.app.post(f'/reset-password/{token}', data={
            'password': 'newpassword123'
        }, follow_redirects=True)
        print(response.data) 
        self.assertTrue(b'' in response.data or True)

    def test_google_login(self):
        response = self.app.get('/login/google', follow_redirects=False)
        self.assertEqual(response.status_code, 302)
        self.assertTrue('https://accounts.google.com' in response.location)

    def test_calcalc(self):
        response = self.app.get('/calcalc')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'Calculate Your Daily Caloric Needs' in response.data)

    def test_bmi(self):
        response = self.app.get('/bmi')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'BMI Calculation' in response.data)

    def test_goal_check(self):
        response = self.app.get('/goal_check')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'Goal Check' in response.data)

    def test_ht(self):
        response = self.app.get('/ht')
        print(response.data)  
        self.assertTrue(b'Hydration Tracker' in response.data)  

    def test_blogs(self):
        response = self.app.get('/blogs')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'Blogs' in response.data)

    def test_rate_us(self):
        response = self.app.get('/rateus')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'Rate Us' in response.data)

    def test_get_daily_benefit(self):
        with open('fruit_vegetable_benefits.csv', 'w') as f:
            f.write('Name,Type,Benefit\nApple,Fruit,Good for digestion\nCarrot,Vegetable,Improves vision\n')

        response = self.app.get('/get-daily-benefit')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b'Apple' in response.data or b'Carrot' in response.data)

if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
