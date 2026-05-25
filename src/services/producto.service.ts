import { ProductoRepository } from '../repositories/producto.repository';
import { AppError } from '../utils/AppError';
import { Producto } from '@prisma/client';

export class ProductoService {
  private repository: ProductoRepository;

  constructor() {
    this.repository = new ProductoRepository();
  }

  async getAllProductos(): Promise<Producto[]> {
    return this.repository.findAll();
  }

  async getProductoById(id: number): Promise<Producto | null> {
    return this.repository.findById(id);
  }

  async createProducto(data: { nombre: string; descripcion?: string; precio: number }): Promise<Producto> {
    return this.repository.create(data);
  }

  async updateProducto(id: number, data: { nombre: string; descripcion?: string; precio: number }): Promise<Producto> {
    const existingProducto = await this.repository.findById(id);
    if (!existingProducto) {
      throw new AppError('Producto no encontrado', 404);
    }
    return this.repository.update(id, data);
  }

  async deleteProducto(id: number): Promise<Producto> {
    const existingProducto = await this.repository.findById(id);
    if (!existingProducto) {
      throw new AppError('Producto no encontrado', 404);
    }
    return this.repository.delete(id);
  }
}