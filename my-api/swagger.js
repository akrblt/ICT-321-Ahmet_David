import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Gestion de la carte d'une pizzeria",
            description: 'API REST pour chercher, ajouter, mettre à jour, supprimer des pizzas, des ingrédients et des pizzas en promotion.',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            schemas: {
                pizza: {
                    type: "object",
                    properties: {
                        id_pizza: { type: "integer", example: 1, description: "ID unique de la pizza" },
                        name: { type: "string", example: "4 fromages", description: "Nom de la pizza" },
                        description: { type: "string", example: "Mélange de mozzarella, gorgonzola, chèvre et emmental", description: "Description des garnitures" },
                        prix: { type: "number", format: "float", example: 8.95, description: "Prix en euros" },
                        image: { type: "string", example: "4-fromages.jpg", description: "Nom du fichier image ou URL" },
                        id_categorie: { type: "integer", example: 2, description: "ID de la catégorie associée" }
                    },
                },
                ingredient: {
                    type: "object",
                    properties: {
                        id_ingredient: { type: "integer", example: 1, description: "ID de l'ingrédient" },
                        name: { type: "string", example: "Mozzarella", description: "Nom de l'ingrédient" }
                    },
                },
                composer: {
                    type: "object",
                    properties: {
                        id_pizza: { type: "integer", example: 1 },
                        id_ingredient: { type: "integer", example: 1 }
                    },
                },
                promotion: {
                    type: "object",
                    properties: {
                        id_promotion: { type: "integer", example: 1 },
                        id_pizza: { type: "integer", example: 1 },
                        date_start: { type: "string", format: "date", example: "2025-12-04", description: "Date de début (YYYY-MM-DD)" },
                        date_finish: { type: "string", format: "date", example: "2025-12-31", description: "Date de fin (YYYY-MM-DD)" },
                        rabais: { type: "number", format: "float", example: 2.50, description: "Montant à déduire du prix de base" },
                    },
                },
                pizzadujour: {
                    type: "object",
                    properties: {
                        id_promotion: { type: "integer", example: 1 },
                        id_pizza: { type: "integer", example: 1 },
                        name: { type: "string", example: "Margherita" },
                        prix: { type: "number", format: "float", example: 12.50, description: "Prix original" },
                        rabais: { type: "number", format: "float", example: 2.00 },
                        prix_final: { type: "number", format: "float", example: 10.50, description: "Prix après rabais" },
                        date_start: { type: "string", format: "date", example: "2025-12-18" },
                        date_finish: { type: "string", format: "date", example: "2025-12-25" },
                    },
                },
            },
        }
    },
    apis: ['./routes/*.js'],
};

const openApiSpecification = swaggerJsdoc(options);
export { openApiSpecification };