import { loadPackageDefinition, Server, ServerCredentials, status } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { ProductoService } from '../services/producto.service';
import { NotFoundError, ValidationError } from '../utils/errors';

const productoService = new ProductoService();

const protoPath = join(process.cwd(), 'src', 'proto', 'producto.proto');

const packageDefinition = loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = loadPackageDefinition(packageDefinition) as any;
const productoPackage = grpcObject.producto;

const toGrpcProducto = (producto: {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
}) => ({
  id: producto.id,
  nombre: producto.nombre,
  descripcion: producto.descripcion ?? '',
  precio: producto.precio,
});

const mapError = (error: unknown) => {
  if (error instanceof ValidationError) {
    return {
      code: status.INVALID_ARGUMENT,
      details: error.message,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      code: status.NOT_FOUND,
      details: error.message,
    };
  }

  return {
    code: status.INTERNAL,
    details: error instanceof Error ? error.message : 'Error interno del servidor',
  };
};

const handleUnary = async <TRequest, TResponse>(
  action: () => Promise<TResponse>,
  callback: sendUnaryData<TResponse>,
) => {
  try {
    const response = await action();
    callback(null, response);
  } catch (error) {
    const grpcError = mapError(error);
    callback({
      code: grpcError.code,
      details: grpcError.details,
    } as unknown as Error, null);
  }
};

export function createGrpcServer() {
  const server = new Server();

  server.addService(productoPackage.ProductoService.service, {
    CreateProducto: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
      handleUnary(
        async () => ({
          producto: toGrpcProducto(
            await productoService.createProducto({
              nombre: call.request.nombre,
              descripcion: call.request.descripcion,
              precio: Number(call.request.precio),
            }),
          ),
        }),
        callback,
      );
    },

    GetProducto: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
      handleUnary(
        async () => ({
          producto: toGrpcProducto(await productoService.getProductoById(Number(call.request.id))),
        }),
        callback,
      );
    },

    ListProductos: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
      handleUnary(
        async () => ({
          productos: (await productoService.getAllProductos()).map((producto) => toGrpcProducto(producto)),
        }),
        callback,
      );
    },

    UpdateProducto: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
      handleUnary(
        async () => ({
          producto: toGrpcProducto(
            await productoService.updateProducto(Number(call.request.id), {
              nombre: call.request.nombre,
              descripcion: call.request.descripcion,
              precio: Number(call.request.precio),
            }),
          ),
        }),
        callback,
      );
    },

    DeleteProducto: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
      handleUnary(
        async () => ({
          producto: toGrpcProducto(await productoService.deleteProducto(Number(call.request.id))),
        }),
        callback,
      );
    },
  });

  return server;
}

export function startGrpcServer(port = 50051) {
  const server = createGrpcServer();

  server.bindAsync(`0.0.0.0:${port}`, ServerCredentials.createInsecure(), (error, boundPort) => {
    if (error) {
      console.error('Error al iniciar el servidor gRPC:', error);
      process.exit(1);
    }

    console.log(`Servidor gRPC escuchando en 0.0.0.0:${boundPort}`);
    server.start();
  });
}
