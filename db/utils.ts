import CustomerUtils from './utils/CustomerUtils';
import GoogleCustomerUtils from './utils/GoogleCustomerUtils';
import AdminUtils from './utils/AdminUtils';
import ProductUtils from './utils/ProductUtils';
import FeedbackUtils from './utils/FeedbackUtils';

class DatabaseUtils {
	static customer = CustomerUtils;
	static googleCustomer = GoogleCustomerUtils;
	static admin = AdminUtils;
	static product = ProductUtils;
	static feedback = FeedbackUtils;
}

export default DatabaseUtils;
