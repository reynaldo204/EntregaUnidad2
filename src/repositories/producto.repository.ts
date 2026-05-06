import prisma from '../config/prisma';
import { Producto } from '@prisma/client';

export class ProductoRepository {
  async findAll(): Promise<Producto[]> {
    return prisma.producto.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number): Promise<Producto | null> {
    return prisma.producto.findUnique({
      where: { id },
    });
  }

  async create(data: { nombre: string; descripcion?: string; precio: number }): Promise<Producto> {
    return prisma.producto.create({
      data,
    });
  }

  async update(id: number, data: { nombre: string; descripcion?: string; precio: number }): Promise<Producto> {
    return prisma.producto.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Producto> {
    return prisma.producto.delete({
      where: { id },
    });
  }
}