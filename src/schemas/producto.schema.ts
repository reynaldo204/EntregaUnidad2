import { z } from 'zod';

export const createProductoSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: z.string().optional(),
    precio: z.number().positive('El precio debe ser mayor a 0'),
  }),
});

export const updateProductoSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: z.string().optional(),
    precio: z.number().positive('El precio debe ser mayor a 0'),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe ser un número').transform(val => parseInt(val)),
  }),
});

export const deleteProductoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe ser un número').transform(val => parseInt(val)),
  }),
});

export type CreateProductoInput = z.infer<typeof createProductoSchema>;
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;
export type DeleteProductoInput = z.infer<typeof deleteProductoSchema>;