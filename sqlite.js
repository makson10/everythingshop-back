const fs = require("fs");
const dbFile = process.cwd() + "/.data/everythingshop.db";
const exists = fs.existsSync(dbFile);
const dbWrapper = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
let db;

dbWrapper
    .open({
        filename: dbFile,
        driver: sqlite3.Database,
    })
    .then(async dBase => {
        db = dBase;

        try {
            if (!exists) {
                await db.run(
                    "CREATE TABLE `admins` (login varchar(255) NOT NULL, password varchar(255) NOT NULL)"
                );

                await db.run(
                    "INSERT INTO `admins` (login, password) VALUES ('MaksonAdmin', 'MaksonAdmin')"
                );

                await db.run(
                    "CREATE TABLE `customers` (name varchar(255) NOT NULL, dateOfBirth varchar(255) NOT NULL, email varchar(255) NOT NULL, login varchar(255) NOT NULL, password varchar(255) NOT NULL)"
                );

                await db.run(
                    "INSERT INTO `customers` (name, dateOfBirth, email, login, password) VALUES ('Maksim', '2006-12-25', 'pozitivmaks541@gmail.com', 'MaksonDev', 'MaksonDev')"
                );

                await db.run(
                    "CREATE TABLE `google_customers` (id varchar(255) NOT NULL, name varchar(255) NOT NULL, email varchar(255) NOT NULL, picture varchar(255) NOT NULL)"
                );

                await db.run(
                    "INSERT INTO `google_customers` (id, name, email, picture) VALUES ('104684886398385952212', 'Макс m', 'makson94021@gmail.com', 'https://lh3.googleusercontent.com/a/AGNmyxZTtA5onyRsnfgUXaqxIhygUmLl_ZOOPc8iR1sk=s96-c')"
                );

                await db.run(
                    "CREATE TABLE `feedback` (author varchar(255) NOT NULL, date bigint(20) NOT NULL, feedbackText mediumtext NOT NULL, uniqueFeedbackId varchar(255) NOT NULL)"
                );

                await db.run(
                    "CREATE TABLE `products` (title varchar(255) NOT NULL, description varchar(255) NOT NULL, photoIds varchar(255) NOT NULL, creator varchar(255) NOT NULL, price int(11) NOT NULL, uniqueProductId varchar(36) NOT NULL, comments mediumtext NOT NULL)"
                );

                await db.run(
                    `INSERT INTO products (title, description, photoIds, creator, price, uniqueProductId, comments) VALUES ('83 или 73', 'хороший вопрос', '["13Fat6avVV9Mrj9Bsp_spx303MB6dTF_z","1AV1mlTG64vgtsjaZotqSxlUJCduz4EeR"]', 'Макс m', 7383, '01bfecce-7804-41e0-87ee-ab905df445f1', '[]')`
                );
            }
        } catch (dbError) {
            console.error(dbError);
        }
    });

module.exports = {
    getAllCustomers: async () => {
        try {
            return await db.all("SELECT * from customers");
        } catch (dbError) {
            console.error(dbError);
        }
    },

    getAllGoogleCustomers: async () => {
        try {
            return await db.all("SELECT * from google_customers");
        } catch (dbError) {
            console.error(dbError);
        }
    },

    getAllProducts: async () => {
        try {
            return await db.all("SELECT * from products");
        } catch (dbError) {
            console.error(dbError);
        }
    },

    getProduct: async (uniqueProductId) => {
        try {
            return await db.all(`SELECT * from products WHERE uniqueProductId="${uniqueProductId}" LIMIT 1`);
        } catch (dbError) {
            console.error(dbError);
        }
    },

    getAllAdmins: async () => {
        try {
            return await db.all("SELECT * from admins");
        } catch (dbError) {
            console.error(dbError);
        }
    },

    getAllFeedbacks: async () => {
        try {
            return await db.all("SELECT * from feedback");
        } catch (dbError) {
            console.error(dbError);
        }
    },

    addNewCustomer: async ({ name, dateOfBirth, email, login, password }) => {
        try {
            await db.run(
                `INSERT INTO customers (name, dateOfBirth, email, login, password) VALUES ('${name}', '${dateOfBirth}', '${email}', '${login}', '${password}')`
            );
        } catch (error) {
            console.error(error);
        }
    },

    addNewGoogleCustomer: async ({ id, name, email, picture }) => {
        try {
            await db.run(
                `INSERT INTO google_customers (id, name, email, picture) VALUES ('${id}', '${name}', '${email}', '${picture}')`
            );
        } catch (error) {
            console.error(error);
        }
    },

    addNewProduct: async ({ photoFilesId, title, description, creator, price, uniqueProductId, comments }) => {
        try {
            await db.run(
                `INSERT INTO products (title, description, photoIds, creator, price, uniqueProductId, comments) VALUES ('${title}', '${description}', '${photoFilesId}', '${creator}', ${price}, '${uniqueProductId}', '${comments}')`
            );
        } catch (error) {
            console.error(error);
        }
    },

    addNewFeedback: async ({ author, date, feedbackText, uniqueFeedbackId }) => {
        try {
            await db.run(
                `INSERT INTO feedback (author, date, feedbackText, uniqueFeedbackId) VALUES ('${author}', ${date}, '${feedbackText}', '${uniqueFeedbackId}')`
            );
        } catch (error) {
            console.error(error);
        }
    },

    deleteProduct: async (productId) => {
        try {
            await db.run(
                `DELETE FROM products WHERE uniqueProductId = '${productId}'`
            );
        } catch (error) {
            console.error(error);
        }
    },

    deleteFeedback: async (feedbackId) => {
        try {
            await db.run(
                `DELETE FROM feedback WHERE uniqueFeedbackId = '${feedbackId}'`
            );
        } catch (error) {
            console.error(error);
        }
    },

    updateProductComments: async (productId, newComments) => {
        try {
            await db.run(
                `UPDATE products SET comments = '${newComments}' WHERE uniqueProductId = "${productId}"`
            );
        } catch (error) {
            console.error(error);
        }
    },
};
