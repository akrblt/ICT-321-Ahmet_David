# ICT-321 – Ahmet & David Pizza API

This project is a simple Node.js + Express REST API designed for learning routing, database access, and API structure.
The application connects to a MySQL database and exposes endpoints for pizzas and ingredients

## 1- Installation & Setup

Follow the steps below to install and run the project on your machine.

### 1- Install Node.js & npm

If you don’t have Node.js installed, download it from: <br>
👉 https://nodejs.org/ <br>
Verify installation: <br>
node -v <br>
npm -v <br>

### 2- Clone or Download the Project
You can use IntelliJ IDEA or WebStorm or another IDE  to clone the project. <br> 
If using Git: <br>
git clone https://github.com/your-repo/ICT-321-Ahmet_David.git <br>
Open the terminal <br>
You must see a file path similar to this PS C:\xxxxxxx\xxxxx\xxxxxx\xxxx\ICT-321-Ahmet_David> <br>
cd my-api <br>

### 3- Install Dependencies

Inside the my-api folder, run: <br>
npm install  <br>
This installs packages such as: <br>
express ,morgan ,mysql2 <br>
After installation, you should see a node_modules/ folder.

### 4- Configure the Database Connection

Your API reads database config from: <br>
📁 my-api/db/db.js <br> 
📁 docs/app_pizza.sql => You can find database create script <br> 
✔ Ensure your MySQL server is running <br>
✔ Ensure pizza_app database exists <br> 
✔ Ensure table names match your SQL file <br>

### 5- Start the API

npm start <br>
or <br>
npm run dev <br>
http://localhost:3000/

## 2- Technologies Used

Node.js <br>
Express.js <br>
MySQL2 <br>
REST API <br>

## 3- API Usage
You can find all the necessary information at this link. <br>
### 👉 https://github.com/akrblt/ICT-321-Ahmet_David/wiki





