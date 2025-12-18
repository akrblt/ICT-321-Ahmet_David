# ICT-321 – Ahmet & David Pizza API

This project is a simple **Node.js + Express REST API** designed for learning routing, database access, and API structure.
The application connects to a **MySQL** database and exposes endpoints for pizzas and ingredients.


## 1- Installation & Setup

Follow the steps below to install and run the project on your machine.

### 1.1- Install Node.js & npm

If you don’t have Node.js installed, download it from:
👉 [https://nodejs.org/](https://nodejs.org/)

Verify installation:

```bash
node -v
npm -v
```

### 1.2- Clone or Download the Project

You can use **IntelliJ IDEA**, **WebStorm**, or any other IDE to clone the project.

If using Git:

```bash
git clone https://github.com/your-repo/ICT-321-Ahmet_David.git
```

Open the terminal. You should see a file path similar to:

```text
PS C:\xxxxxxx\xxxxx\xxxxxx\xxxx\ICT-321-Ahmet_David>
```

Navigate to the API folder:

```bash
cd my-api
```

### 1.3- Install Dependencies

Inside the **my-api** folder, run:

```bash
npm install
```

This installs packages such as:

* express
* morgan
* mysql2

After installation, you should see a **node_modules/** folder.

### 1.4- Configure the Database Connection

Your API reads database configuration from:

```text
my-api/db/db.js
```

Database creation script:

```text
docs/app_pizza.sql
```

✔ Ensure your MySQL server is running
✔ Ensure the **pizza_app** database exists
✔ Ensure table names match the SQL file

### 1.5- Start the API

Start the application using one of the following commands:

```bash
npm start
```

or

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000/
```

## 2- Technologies Used

* Node.js
* Express.js
* MySQL2
* REST API

## 3- API Usage

You can find all the necessary API usage information at the link below:

👉 [https://github.com/akrblt/ICT-321-Ahmet_David/wiki](https://github.com/akrblt/ICT-321-Ahmet_David/wiki)

## 4- Swagger Documentation

The project includes **Swagger UI** for API route documentation.

First, install Swagger dependencies:

```bash
npm install swagger-jsdoc swagger-ui-express
```

Then start the API and open:

[Routage Documentation](http://localhost:3000/api-docs/)
