-- CreateTable
CREATE TABLE "Customer" (
    "name" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GoogleCustomer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "GoogleCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoIds" TEXT[],
    "creator" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "comments" JSONB[],
    "uniqueProductId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("uniqueProductId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Feedback" (
    "author" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "uniqueFeedbackId" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("uniqueFeedbackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCustomer_email_key" ON "GoogleCustomer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_password_key" ON "Admin"("password");
