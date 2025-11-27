# ICT-321 – Ahmet & David Pizza API

This project is a simple Node.js + Express REST API designed for learning routing, database access, and API structure.
The application connects to a MySQL database and exposes endpoints for pizzas and ingredients

## Installation & Setup

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

## 2- Project Structure
<img width="309" height="648" alt="Screen Shot 27 11 2025 at 10 18" src="https://github.com/user-attachments/assets/13c95746-7f47-4444-b8c4-b6ec18a40324" />

## 3- Available Routes
1. Index Routes
GET	/	Returns homepage
2. Pizza Routes
GET	/pizzas	Get all pizzas
GET	/pizzas/pizzadujour	Get “pizza of the day” (first pizza)
GET	/pizzas/:id	Get pizza by ID
3. Ingredient Routes
GET	/ingredients	Get all ingredients
GET	/ingredients/:id	Get ingredient by ID

## 4- Technologies Used

Node.js
Express.js
MySQL2
REST API




