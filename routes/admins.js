const db = require("../sqlite");
const express = require('express');
const adminsRouter = express.Router();


const validateAdminData = async (req, res, next) => {
    const adminData = req.body;
    const login = adminData.login;
    const password = adminData.password;

    if (!login || !password) {
        return res.status(404).json({ error: 'Admin data is not valid!' });
    } else next();
}

const checkIsAdminExist = async (req, res, next) => {
    const adminData = req.body;
    const login = adminData.login;
    const password = adminData.password;

    const allAdmins = await db.getAllAdmins();
    const isAdminExist = allAdmins.some((admin) => admin.login === login && admin.password === password);

    if (isAdminExist) {
        res.status(200).json({ 'success': true });
    } else {
        res.status(404).json({ error: 'Admin with this credentials doesn\'t already exists' });
    };
}

adminsRouter.post('/login', [validateAdminData, checkIsAdminExist]);


module.exports = adminsRouter;