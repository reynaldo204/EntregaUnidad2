import app from './app';
import prisma from './config/prisma';
import applyGraphql from './graphql';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Conectado a la base de datos PostgreSQL');

    // Apply GraphQL apollo
    await applyGraphql(app);
    console.log('GraphQL endpoint disponible en /api/graphql');

    app.use('*', (req: any, res: any) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
      });
    });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Documentación Swagger: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();