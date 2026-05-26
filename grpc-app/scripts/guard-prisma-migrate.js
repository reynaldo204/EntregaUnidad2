console.error('No ejecutes Prisma migrations desde grpc-app.');
console.error('GraphQL es el proyecto responsable del esquema y de las migraciones.');
console.error('Ejecuta: cd graphql-app && npm run prisma:migrate');
process.exit(1);
