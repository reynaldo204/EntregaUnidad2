import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Producto {
    id: Int!
    nombre: String!
    descripcion: String
    precio: Float!
  }

  type Query {
    productos: [Producto!]!
    producto(id: Int!): Producto
  }

  type Mutation {
    createProducto(nombre: String!, descripcion: String, precio: Float!): Producto!
    updateProducto(id: Int!, nombre: String!, descripcion: String, precio: Float!): Producto!
    deleteProducto(id: Int!): Producto!
  }
`;

export default typeDefs;
