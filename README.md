# ICT-321 – Ahmet & David Pizza API

This project is a simple Node.js + Express REST API designed for learning routing, database access, and API structure.
The application connects to a MySQL database and exposes endpoints for pizzas and ingredients

## 1- Installation & Setup

Follow the steps below to install and run the project on your machine.

### 1- Install Node.js & npm

If you don’t have Node.js installed, download it from:
👉 https://nodejs.org/
Verify installation:
node -v
npm -v

### 2- Clone or Download the Project

If using Git:
git clone https://github.com/your-repo/ICT-321-Ahmet_David.git
cd ICT-321-Ahmet_David/my-api

### 3- Install Dependencies

Inside the my-api folder, run:
npm install 
This installs packages such as:
express ,morgan ,mysql2
After installation, you should see a node_modules/ folder.

### 4- Configure the Database Connection

Your API reads database config from:
📁 my-api/db/db.js
✔ Ensure your MySQL server is running
✔ Ensure pizza_app database exists
✔ Ensure table names match your SQL file

### 5- Start the API

npm start
or
bash
node app.js



## 2- Technologies Used

Node.js
Express.js
MySQL2
REST API




