import { Request, Response, NextFunction } from 'express';
import { ProductoService } from '../services/producto.service';

export class ProductoController {
  private service: ProductoService;

  constructor() {
    this.service = new ProductoService();
  }

  getAllProductos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productos = await this.service.getAllProductos();
      res.status(200).json({
        success: true,
        data: productos.map(p => ({
          ...p,
          precio: parseFloat(p.precio.toString()),
        })),
      });
    } catch (error) {
      next(error);
    }
  };

  createProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const producto = await this.service.createProducto(req.body);
      res.status(201).json({
        success: true,
        data: {
          ...producto,
          precio: parseFloat(producto.precio.toString()),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const producto = await this.service.updateProducto(parseInt(id!), req.body);
      res.status(200).json({
        success: true,
        data: {
          ...producto,
          precio: parseFloat(producto.precio.toString()),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.deleteProducto(parseInt(id!));
      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };
}