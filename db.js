const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

// const fs = require("fs");
// const dbFile = process.cwd() + "/.data/everythingshop.db";
// const exists = fs.existsSync(dbFile);
// const dbWrapper = require("sqlite");
// const sqlite3 = require("sqlite3").verbose();
// let db;

// dbWrapper
//     .open({
//         filename: dbFile,
//         driver: sqlite3.Database,
//     })
//     .then(async dBase => {
//         db = dBase;

//         try {
//             if (!exists) {
//                 await db.run(
//                     "CREATE TABLE `admins` (login varchar(255) NOT NULL, password varchar(255) NOT NULL)"
//                 );

//                 await db.run(
//                     "INSERT INTO `admins` (login, password) VALUES ('MaksonAdmin', 'MaksonAdmin')"
//                 );

//                 await db.run(
//                     "CREATE TABLE `customers` (name varchar(255) NOT NULL, dateOfBirth varchar(255) NOT NULL, email varchar(255) NOT NULL, login varchar(255) NOT NULL, password varchar(255) NOT NULL)"
//                 );

//                 await db.run(
//                     "INSERT INTO `customers` (name, dateOfBirth, email, login, password) VALUES ('Maksim', '2006-12-25', 'pozitivmaks541@gmail.com', 'MaksonDev', 'MaksonDev')"
//                 );

//                 await db.run(
//                     "CREATE TABLE `google_customers` (id varchar(255) NOT NULL, name varchar(255) NOT NULL, email varchar(255) NOT NULL, picture varchar(255) NOT NULL)"
//                 );

//                 await db.run(
//                     "INSERT INTO `google_customers` (id, name, email, picture) VALUES ('104684886398385952212', 'Макс m', 'makson94021@gmail.com', 'https://lh3.googleusercontent.com/a/AGNmyxZTtA5onyRsnfgUXaqxIhygUmLl_ZOOPc8iR1sk=s96-c')"
//                 );

//                 await db.run(
//                     "CREATE TABLE `feedback` (author varchar(255) NOT NULL, date bigint(20) NOT NULL, feedbackText mediumtext NOT NULL, uniqueFeedbackId varchar(255) NOT NULL)"
//                 );

//                 await db.run(
//                     "CREATE TABLE `products` (title varchar(255) NOT NULL, description varchar(255) NOT NULL, photoIds varchar(255) NOT NULL, creator varchar(255) NOT NULL, price int(11) NOT NULL, uniqueProductId varchar(36) NOT NULL, comments mediumtext NOT NULL)"
//                 );

//                 await db.run(
//                     `INSERT INTO products (title, description, photoIds, creator, price, uniqueProductId, comments) VALUES ('83 или 73', 'хороший вопрос', '["13Fat6avVV9Mrj9Bsp_spx303MB6dTF_z","1AV1mlTG64vgtsjaZotqSxlUJCduz4EeR"]', 'Макс m', 7383, '01bfecce-7804-41e0-87ee-ab905df445f1', '[]')`
//                 );
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     });

module.exports = {
    getAllCustomers: async () => {
        try {
            const users = await prisma.customer.findMany();
            return users;
        } catch (error) {
            console.error(error);
        }
    },

    getAllGoogleCustomers: async () => {
        try {
            const googleCustomers = await prisma.googleCustomer.findMany();
            return googleCustomers;
        } catch (error) {
            console.error(error);
        }
    },

    getAllProducts: async () => {
        try {
            const product = await prisma.product.findMany();
            return product;
        } catch (error) {
            console.error(error);
        }
    },

    getProduct: async (uniqueProductId) => {
        try {
            const product = await prisma.product.findMany({
                where: {
                    uniqueProductId: uniqueProductId,
                }
            });
            return product;
        } catch (error) {
            console.error(error);
        }
    },

    getAllAdmins: async () => {
        try {
            const admins = await prisma.admin.findMany();
            return admins;
        } catch (error) {
            console.error(error);
        }
    },

    getAllFeedbacks: async () => {
        try {
            const feedbacks = await prisma.feedback.findMany();

            feedbacks.map(feedback => {
                feedback.date = +feedback.date;
            });

            return feedbacks;
        } catch (error) {
            console.error(error);
        }
    },

    doesProductExist: async (productId) => {
        try {
            const products = await prisma.product.findMany();
            const requestedProduct = products.some(product => product.uniqueProductId === productId);
            return !!requestedProduct;
        } catch (error) {
            console.error(error);
        }
    },

    isAdminExist: async ({ login, password }) => {
        try {
            const admins = await prisma.admin.findMany();
            const isAdminExist = admins.some((admin) => admin.login === login && admin.password === password);
            return isAdminExist;
        } catch (error) {
            console.error(error);
        }
    },

    addNewCustomer: async ({ name, dateOfBirth, email, login, password }) => {
        try {
            await prisma.customer.create({
                data: {
                    name, dateOfBirth, email, login, password,
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    addNewGoogleCustomer: async ({ id, name, email, picture }) => {
        try {
            await prisma.googleCustomer.create({
                data: {
                    id, name, email, picture
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    addNewProduct: async ({ photoIds, title, description, creator, price, uniqueProductId, comments }) => {
        try {
            await prisma.product.create({
                data: {
                    photoIds, title, description, creator, price, uniqueProductId, comments
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    addNewFeedback: async ({ author, date, feedbackText, uniqueFeedbackId }) => {
        try {
            date = date.toString();

            await prisma.feedback.create({
                data: {
                    author, date, feedbackText, uniqueFeedbackId
                }
            });
            console.log(await prisma.feedback.findMany());
        } catch (error) {
            console.error(error);
        }
    },

    deleteProduct: async (productId) => {
        try {
            await prisma.product.delete({
                where: {
                    uniqueProductId: productId,
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    deleteFeedback: async (feedbackId) => {
        try {
            await prisma.feedback.delete({
                where: {
                    uniqueFeedbackId: feedbackId,
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    updateProductComments: async (productId, newComments) => {
        try {
            await prisma.product.update({
                where: {
                    uniqueProductId: productId,
                },
                data: {
                    comments: newComments,
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
};
