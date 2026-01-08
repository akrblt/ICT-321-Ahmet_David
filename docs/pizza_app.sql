-- ==========================================
-- DROP EXISTING STRUCTURE
-- ==========================================
-- Disable checks to ensure a clean drop if needed,
-- though correct ordering is usually sufficient.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Promotion;
DROP TABLE IF EXISTS composer;
DROP TABLE IF EXISTS Pizza;
DROP TABLE IF EXISTS Ingredient;

DROP DATABASE IF EXISTS PizzaApp;

SET FOREIGN_KEY_CHECKS = 1;

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

-- ==========================================
-- INSERT DATA
-- ==========================================

-- INSERT Ingredients
INSERT INTO Ingredient (name) VALUES
                                  ('Tomato Sauce'),
                                  ('Mozzarella'),
                                  ('Pepperoni'),
                                  ('Mushrooms'),
                                  ('Olives'),
                                  ('Onions'),
                                  ('Basil'),
                                  ('Ham'),
                                  ('Pineapple'),
                                  ('Parmesan');

-- INSERT Pizzas
INSERT INTO Pizza (name, description, prix, image, id_categorie) VALUES
                                                                     ('Margherita', 'Classic pizza with tomato sauce, mozzarella, and basil.', 12.50, NULL, NULL),
                                                                     ('Pepperoni', 'Spicy pepperoni with mozzarella cheese.', 14.00,NULL, NULL),
                                                                     ('Funghi', 'Mushroom pizza with mozzarella and tomato sauce.', 13.00, NULL, NULL),
                                                                     ('Hawaiian', 'Ham and pineapple with mozzarella.', 15.00, NULL, NULL),
                                                                     ('Quattro Formaggi', 'Four cheese blend with parmesan and mozzarella.', 16.00,NULL, NULL);

-- INSERT composer relations
-- Margherita
INSERT INTO composer (id_pizza, id_ingredient) VALUES
                                                   (1, 1),
                                                   (1, 2),
                                                   (1, 7);

-- Pepperoni
INSERT INTO composer (id_pizza, id_ingredient) VALUES
                                                   (2, 1),
                                                   (2, 2),
                                                   (2, 3);

-- Funghi
INSERT INTO composer (id_pizza, id_ingredient) VALUES
                                                   (3, 1),
                                                   (3, 2),
                                                   (3, 4);

-- Hawaiian
INSERT INTO composer (id_pizza, id_ingredient) VALUES
                                                   (4, 1),
                                                   (4, 2),
                                                   (4, 8),
                                                   (4, 9);

-- Quattro Formaggi
INSERT INTO composer (id_pizza, id_ingredient) VALUES
                                                   (5, 2),
                                                   (5, 10);

-- INSERT Promotions
INSERT INTO Promotion (id_pizza, date_start, date_finish, rabais) VALUES
                                                                      (1, '2024-01-01', '2024-01-15', 10.00),
                                                                      (2, '2024-02-01', '2024-02-10', 15.00),
                                                                      (4, '2024-03-05', '2024-03-20', 12.50);
