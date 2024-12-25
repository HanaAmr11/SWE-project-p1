# Use the official Python image
FROM python:3.9
# Set the working directory inside the container
WORKDIR /app
# Copy the requirements file to the container
COPY requirements.txt .
# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Copy the application code
COPY . .
# Expose the Flask port
EXPOSE 5000
# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV FLASK_RUN_HOST=0.0.0.0
# Command to run the application
CMD ["flask", "run"]