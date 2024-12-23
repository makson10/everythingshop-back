import mongoose from 'mongoose';
import { FeedbackSchemaType } from '../../types/feedback.types';

const FeedbackSchema = new mongoose.Schema(FeedbackSchemaType);
const Feedback = mongoose.model('Feedback', FeedbackSchema, 'Feedback');

export default Feedback;
