import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Gestion de la carte d'une pizzeria",
            description: 'API REST pour chercher, ajouter, mettre à jour, supprimer des pizzas, des ingrédients et des pizzas en promotion.',
            version: '1.0.0',
        },
        servers : [
            {
                url : 'http://localhost:3000',
            },
        ],
        "components":
            {
                "schemas":
                    {
                        "pizza":
                            {
                                "properties":
                                    {
                                        "id_pizza": { "type": "integer", "example" :1, "description":"id de la pizza" },
                                        "name": { "type": "string", "example" :"4 fromages", "description" : "nom de la pizza"  },
                                        "description" : { "type": "string", "example" :"?", "description" : ""  },
                                        "prix" : {"type": "float", "example" :"8.95", "description" : "prix de la pizza" },
                                        "image" : {"type": "?", "example" :"?", "description" : "image de la pizza" },
                                        "id_categorie" : {"type": "integer", "example" :2, "description" : "id de la catégorie de la pizza" }
                                    },
                            },
                        "ingredient":
                            {
                                "properties":
                                    {
                                        "id_ingredient": { "type": "integer", "example" :1, "description":"id de l'ingrédients" },
                                        "name": { "type": "string", "example" :"sucre", "description" : "nom de l'ingrédient"  }
                                    },
                            },
                        "composer":
                            {
                                "properties":
                                    {
                                        "id_pizza": { "type": "integer", "example" :1, "description":"id de la pizza" },
                                        "id_ingredient": { "type": "integer", "example" :1, "description":"id de l'ingrédient" }
                                    },
                            },
                        "promotion":
                            {
                                "properties":
                                    {
                                        "id_promotion": { "type": "integer", "example" :1, "description":"id de la promotion" },
                                        "id_pizza": { "type": "integer", "example" :1, "description":"id de la pizza en promotion" },
                                        "date_start": { "type": "integer", "example" :"2025-12-04", "description":"date du début de la promotion de la pizza" },
                                        "date_finish": { "type": "integer", "example" :"2025-12-31", "description":"date de fin de la promotion de la pizza" },
                                        "rabais": { "type": "float", "example" :5.00, "description":"rabais sur la pizza" },
                                    },
                            }
                    },
            }
    },
    apis: ['./routes/*.js'], // files containing annotations as above
};

const openApiSpecification = swaggerJsdoc(options);
export {openApiSpecification};