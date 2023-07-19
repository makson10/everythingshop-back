const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

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
