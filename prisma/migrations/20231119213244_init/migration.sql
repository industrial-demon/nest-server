-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
