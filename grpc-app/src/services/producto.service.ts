import { ProductoRepository, type ProductoCreateInput } from '../repositories/producto.repository';
import { NotFoundError, ValidationError } from '../utils/errors';

export type ProductoDTO = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
};

export class ProductoService {
  private repository: ProductoRepository;

  constructor() {
    this.repository = new ProductoRepository();
  }

  private normalizeNombre(nombre: string) {
    const normalized = nombre?.trim();
    if (!normalized) {
      throw new ValidationError('El nombre es obligatorio');
    }
    return normalized;
  }

  private normalizePrecio(precio: number) {
    if (!Number.isFinite(precio) || precio < 0) {
      throw new ValidationError('El precio debe ser un número mayor o igual a 0');
    }
    return precio;
  }

  private normalizeId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('El id debe ser un entero mayor a 0');
    }
    return id;
  }

  private toDTO(producto: {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: { toNumber: () => number } | number;
  }): ProductoDTO {
    const dto: ProductoDTO = {
      id: producto.id,
      nombre: producto.nombre,
      precio: typeof producto.precio === 'number' ? producto.precio : producto.precio.toNumber(),
    };

    if (producto.descripcion) {
      dto.descripcion = producto.descripcion;
    }

    return dto;
  }

  async getAllProductos(): Promise<ProductoDTO[]> {
    const productos = await this.repository.findAll();
    return productos.map((producto) => this.toDTO(producto));
  }

  async getProductoById(id: number): Promise<ProductoDTO> {
    const normalizedId = this.normalizeId(id);
    const producto = await this.repository.findById(normalizedId);
    if (!producto) {
      throw new NotFoundError(`Producto con id ${normalizedId} no encontrado`);
    }
    return this.toDTO(producto);
  }

  async createProducto(data: { nombre: string; descripcion?: string; precio: number }): Promise<ProductoDTO> {
    const nombre = this.normalizeNombre(data.nombre);
    const precio = this.normalizePrecio(data.precio);

    const payload: ProductoCreateInput = {
      nombre,
      precio,
    };

    if (data.descripcion?.trim()) {
      payload.descripcion = data.descripcion.trim();
    }

    const producto = await this.repository.create(payload);

    return this.toDTO(producto);
  }

  async updateProducto(id: number, data: { nombre: string; descripcion?: string; precio: number }): Promise<ProductoDTO> {
    const normalizedId = this.normalizeId(id);
    const existingProducto = await this.repository.findById(normalizedId);
    if (!existingProducto) {
      throw new NotFoundError(`Producto con id ${normalizedId} no encontrado`);
    }

    const payload: ProductoCreateInput = {
      nombre: this.normalizeNombre(data.nombre),
      precio: this.normalizePrecio(data.precio),
    };

    if (data.descripcion?.trim()) {
      payload.descripcion = data.descripcion.trim();
    }

    const producto = await this.repository.update(normalizedId, payload);
    return this.toDTO(producto);
  }

  async deleteProducto(id: number): Promise<ProductoDTO> {
    const normalizedId = this.normalizeId(id);
    const existingProducto = await this.repository.findById(normalizedId);
    if (!existingProducto) {
      throw new NotFoundError(`Producto con id ${normalizedId} no encontrado`);
    }

    const deleted = await this.repository.delete(normalizedId);
    return this.toDTO(deleted);
  }
}
