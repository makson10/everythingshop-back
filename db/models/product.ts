import mongoose from 'mongoose';
import { ProductSchemaType } from '../../types/product.types';

const ProductSchema = new mongoose.Schema(ProductSchemaType);
const Product = mongoose.model('Product', ProductSchema, 'Product');

export default Product;
