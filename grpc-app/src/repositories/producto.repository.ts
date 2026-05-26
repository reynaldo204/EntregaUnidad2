import prisma from '../config/prisma';

export type ProductoCreateInput = {
  nombre: string;
  descripcion?: string;
  precio: number;
};

export class ProductoRepository {
  async findAll() {
    return prisma.producto.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.producto.findUnique({
      where: { id },
    });
  }

  async create(data: ProductoCreateInput) {
    return prisma.producto.create({
      data,
    });
  }

  async update(id: number, data: ProductoCreateInput) {
    return prisma.producto.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.producto.delete({
      where: { id },
    });
  }
}
