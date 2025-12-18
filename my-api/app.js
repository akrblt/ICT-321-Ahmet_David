import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { openApiSpecification } from './swagger.js';
import indexRouter from './routes/index.js';
import pizzasRouter from './routes/pizzas.js';
import ingredientsRouter from './routes/ingredients.js';
import pizzadujourRouter from './routes/pizza-du-jour.js';

const app = express();

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger
//swaggerUI.serve : get the files (html, css, js) for the user interface
//swaggerUI.setup : takes our parameters with the specification openApiSpecification (see swagger.mjs)
//explorer : true : research possible in the swagger web page
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpecification, { explorer: true }));

// Routers
app.use('/', indexRouter);
app.use('/pizzas', pizzasRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/pizza-du-jour', pizzadujourRouter)

export default app;
