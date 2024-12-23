import mongoose from 'mongoose';
import { AdminSchemaType } from '../../types/admin.types';

const AdminSchema = new mongoose.Schema(AdminSchemaType);
const Admin = mongoose.model('Admin', AdminSchema, 'Admin');

export default Admin;
