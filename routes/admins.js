const express = require('express');
const adminsRouter = express.Router();
const db = require("../sqlite");

// -----------------------------------------------------

const validateAdminData = async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        res.status(404).json({ error: 'Admin data is not valid!' });
    } else next();
}

const checkIsAdminExist = async (req, res, next) => {
    const { login, password } = req.body;

    const allAdmins = await db.getAllAdmins();
    const isAdminExist = allAdmins.some((admin) => admin.login === login && admin.password === password);

    if (isAdminExist) {
        res.status(200).json({ success: true });
    } else {
        res.status(404).json({ error: "Admin with this credentials doesn't already exists" });
    };
}

adminsRouter.post('/login', [validateAdminData, checkIsAdminExist]);


module.exports = adminsRouter;