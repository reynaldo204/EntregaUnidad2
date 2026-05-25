import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductoSchema,
  updateProductoSchema,
  deleteProductoSchema,
} from '../schemas/producto.schema';

const router = Router();
const productoController = new ProductoController();

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Lista todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 */
router.get('/', productoController.getAllProductos);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 description: Nombre del producto
 *               descripcion:
 *                 type: string
 *                 description: Descripción del producto (opcional)
 *               precio:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Precio del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validate(createProductoSchema), productoController.createProducto);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto completo
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 description: Nombre del producto
 *               descripcion:
 *                 type: string
 *                 description: Descripción del producto (opcional)
 *               precio:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Precio del producto
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: Datos inválidos
 */
router.put('/:id', validate(updateProductoSchema), productoController.updateProducto);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', validate(deleteProductoSchema), productoController.deleteProducto);

export default router;