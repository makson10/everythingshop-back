/**
 * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const fs = require("fs");

// Initialize the database
const dbFile = "./.data/everythingshop.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

/* 
We're using the sqlite wrapper so that we can make async / await connections
- https://www.npmjs.com/package/sqlite
*/
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
                    "INSERT INTO `customers` (name, dateOfBirth, email, login, password) VALUES ('Maksim', '2006-12-25', 'pozitivmaks541@gmail.com', 'MaksonDev', 'MaksonDev'), ('maks again', '1990-10-10', 'maksbelyrabota1@gmail.com', 'dickdick', 'dickdick'), ('GIG', '2000-02-20', 'makson94021@gmail.com', 'fuckfuck', 'fuckfuck'), ('Максончик', '2000-02-20', 'pozitivmaks5@gmail.com', 'fuckfuckfuck', 'fuckfuckfuck')"
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
                    "CREATE TABLE `products` (title varchar(255) NOT NULL, description varchar(255) NOT NULL, photo_id varchar(255) NOT NULL, creator varchar(255) NOT NULL, price int(11) NOT NULL, uniqueProductId varchar(36) NOT NULL, comments mediumtext NOT NULL)"
                );

                await db.run(
                    "INSERT INTO `products` (title, description, photo_id, creator, price, uniqueProductId, comments) VALUES ('Банан', 'Большой, вкусный, желтый банан', '5MjsX6QOWMLtTR2yaMbCVreNKCagMwUXoK1bNjg6.png', 'Pozitiv_ Maks', 100, '416419da-dfc6-4dd1-b1fc-637c2379d2cd', '[]'), ('засосались сучки', 'ммммммммммммм какой засос', 'Sn2lWCe0gEWpRhEck0A9rc6XheI1dkFlCjtguM7z.png', 'Макс m', 2000, 'a1481bb8-556b-452f-a1c8-2857eae5c1e0', '[]')"
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
    }
};
