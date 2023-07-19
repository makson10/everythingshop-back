require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();

const customersRouter = require("./routes/customers");
const googleCustomersRouter = require("./routes/googleCustomers");
const productsRouter = require("./routes/products");
const productManagementRouter = require("./routes/productManagement");
const productCommentsManagement = require("./routes/productCommentsManagement");
const adminsRouter = require("./routes/admins");
const feedbacksRouter = require("./routes/feedbacks");

app.use(cors({
    origin: 'https://everythingshop.vercel.app',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/customers', customersRouter);
app.use('/googleCustomers', googleCustomersRouter);
app.use('/products', productsRouter);
app.use('/products', productManagementRouter);
app.use('/products', productCommentsManagement);
app.use('/admins', adminsRouter);
app.use('/feedbacks', feedbacksRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT} port`);
});
