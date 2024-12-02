How to Use
1. Clone the repository to your local machine
git clone [https://github.com/your-username/your-project-name.git
cd your-project-name](https://github.com/HanaAmr11/SWE-project-p1.git)

3. Create a virtual environment to isolate the project dependencies.
python -m venv venv

4. Activate the virtual environment.
venv\Scripts\activate

5.Create a .env file in the root directory of your project and add the following variables:
FLASK_SECRET_KEY=your_flask_secret_key
DATABASE_URL=sqlite:///users.db  # or your preferred database URI
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PASSWORD_RESET_SALT=your_reset_salt
Replace the placeholders with your actual credentials and secrets.

6. Run the following commands to initialize the database:
from app import db
db.create_all()
exit()

7. Run the application
flask run
The application will be available at http://127.0.0.1:5000/.
