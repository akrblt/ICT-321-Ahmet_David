-- ==========================================
-- CREATE DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS PizzaApp
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

USE PizzaApp;

-- ==========================================
-- TABLE: Ingredient
-- ==========================================
CREATE TABLE Ingredient (
    id_ingredient INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- ==========================================
-- TABLE: Pizza
-- ==========================================
CREATE TABLE Pizza (
    id_pizza INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    prix DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    id_categorie INT
);

-- ==========================================
-- TABLE: composer
-- (relation N-N Pizza <-> Ingredient)
-- ==========================================
CREATE TABLE composer (
    id_pizza INT NOT NULL,
    id_ingredient INT NOT NULL,
    PRIMARY KEY (id_pizza, id_ingredient),
    FOREIGN KEY (id_pizza) REFERENCES Pizza(id_pizza)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES Ingredient(id_ingredient)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==========================================
-- TABLE: Promotion
-- ==========================================
CREATE TABLE Promotion (
    id_promotion INT PRIMARY KEY AUTO_INCREMENT,
    id_pizza INT NOT NULL,
    date_start DATE NOT NULL,
    date_finish DATE NOT NULL,
    rabais DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_pizza) REFERENCES Pizza(id_pizza)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
