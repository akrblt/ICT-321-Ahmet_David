import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { openApiSpecification } from './swagger.js';
import indexRouter from './routes/index.js';
import pizzasRouter from './routes/pizzas.js';
import ingredientsRouter from './routes/ingredients.js';

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpecification, { explorer: true }));

// Routers
app.use('/', indexRouter);
app.use('/pizzas', pizzasRouter);
app.use('/ingredients', ingredientsRouter);

export default app;
