-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);
