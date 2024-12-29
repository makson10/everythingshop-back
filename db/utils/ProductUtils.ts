import { CommentType, ProductType } from '../../types/product.types';
import Product from '../models/product';

class ProductUtils {
	static async getAllProducts() {
		return await Product.find();
	}

	static async getProduct(_id: string) {
		return await Product.findOne({ _id });
	}

	static async getProductByUniqueId(uniqueProductId: string) {
		return await Product.findOne({ uniqueProductId });
	}

	static async doesProductExist(productId: string) {
		try {
			const products = await Product.find({});
			const requestedProduct = products.some(
				(product) => product.uniqueProductId === productId
			);
			return !!requestedProduct;
		} catch (error) {
			console.error(error);
		}
	}

	static async addNewProduct({
		photoIds,
		title,
		description,
		creator,
		price,
		comments,
		uniqueProductId,
	}: ProductType) {
		await Product.create({
			photoIds,
			title,
			description,
			creator,
			price,
			uniqueProductId,
			comments,
		});
	}

	static async deleteProduct(uniqueProductId: string) {
		await Product.deleteOne({ uniqueProductId });
	}

	static async updateProductComments(
		uniqueProductId: string,
		newComments: CommentType[]
	) {
		await Product.updateOne({ uniqueProductId }, { comments: newComments });
	}
}

export default ProductUtils;
