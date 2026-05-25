import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import productoRoutes from './routes/producto.routes';
import { errorHandler } from './middlewares/error.middleware';
import applyGraphql from './graphql';

const app = express();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Productos',
    version: '1.0.0',
    description: 'API REST para gestión de productos',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    schemas: {
      Producto: {
        type: 'object',
        required: ['id', 'nombre', 'precio'],
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del producto',
          },
          nombre: {
            type: 'string',
            description: 'Nombre del producto',
            minLength: 2,
          },
          descripcion: {
            type: 'string',
            description: 'Descripción del producto',
          },
          precio: {
            type: 'number',
            format: 'float',
            description: 'Precio del producto',
            minimum: 0,
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Productos',
    version: '1.0.0',
    endpoints: {
      docs: 'http://localhost:3000/api/docs',
      health: 'http://localhost:3000/api/health',
      productos: 'http://localhost:3000/api/productos',
    },
  });
});

app.use('/api/productos', productoRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Error handling middleware
app.use(errorHandler);

export default app;