const express = require('express');
const productCommentsManagement = express.Router();
const db = require("../db");

// -----------------------------------------------------

const validateNewCommentData = async (req, res, next) => {
    const { author, date, picture, text, uniqueCommentId } = req.body;

    if (!author || !date || !picture || !text || !uniqueCommentId) {
        res.status(404).json({ error: 'New comment data is not valid!' });
    } else next();
};

const getProductData = async (req, res, next) => {
    const { productId } = req.params;

    const [product] = await db.getProduct(productId);
    if (!product) {
        res.status(404).json({ success: false, errorMessage: 'Product with this uniqueProductId not found!' });
    } else {
        req.body.oldComments = product.comments;
        next();
    }
};

const addNewComment = async (req, res, next) => {
    const { oldComments, author, date, picture, text, uniqueCommentId } = req.body;
    const newComment = {
        author, date, picture, text, uniqueCommentId,
    };

    const newComments = [...oldComments, newComment];
    req.body.newComments = newComments;

    next();
};

const updateComments = async (req, res, next) => {
    const { productId } = req.params;
    const { newComments } = req.body;

    await db.updateProductComments(productId, newComments);
    res.status(200).json({ success: true });
};

productCommentsManagement.post(
    '/:productId/addComment',
    [
        validateNewCommentData,
        getProductData,
        addNewComment,
        updateComments
    ]
);

// -----------------------------------------------------

const checkIsThisCommentExist = async (req, res, next) => {
    const { commentId } = req.params;
    const { oldComments } = req.body;

    const isCommentExist = oldComments.some((comment) => comment.uniqueCommentId === commentId);

    if (!isCommentExist) {
        res.status(404).json({ error: 'Comment with this uniqueCommentId not found!' });
    } else next();
};

const removeComments = async (req, res, next) => {
    const { commentId } = req.params;
    const { oldComments } = req.body;

    const commentForDeleteIndex = oldComments.findIndex(comment => comment.uniqueCommentId === commentId);

    const newComments = [...oldComments];
    newComments.splice(commentForDeleteIndex, 1);

    req.body.newComments = newComments;
    next();
};

productCommentsManagement.delete(
    '/:productId/deleteComment/:commentId',
    [
        getProductData,
        checkIsThisCommentExist,
        removeComments,
        updateComments,
    ]
);


module.exports = productCommentsManagement;