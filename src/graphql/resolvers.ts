import { ProductoService } from '../services/producto.service';

const productoService = new ProductoService();

export const resolvers = {
  Query: {
    productos: async () => await productoService.getAllProductos(),
    producto: async (_: any, args: { id: number }) => await productoService.getProductoById(args.id),
  },
  Mutation: {
    createProducto: async (_: any, args: { nombre: string; descripcion?: string; precio: number }) => {
      const data: { nombre: string; descripcion?: string; precio: number } = { nombre: args.nombre, precio: args.precio };
      if (args.descripcion !== undefined) data.descripcion = args.descripcion;
      return await productoService.createProducto(data);
    },
    updateProducto: async (_: any, args: { id: number; nombre: string; descripcion?: string; precio: number }) => {
      const data: { nombre: string; descripcion?: string; precio: number } = { nombre: args.nombre, precio: args.precio };
      if (args.descripcion !== undefined) data.descripcion = args.descripcion;
      return await productoService.updateProducto(args.id, data);
    },
    deleteProducto: async (_: any, args: { id: number }) => await productoService.deleteProducto(args.id),
  },
};

export default resolvers;
