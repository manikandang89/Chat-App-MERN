import { v2 as cloudinary} from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
    cloud_name: process.env.CLOUDIARY_CLOUD_NAME,
    api_key: process.env.CLOUDIARY_API_KEY,
    api_secret: process.env.CLOUDIARY_API_SECRET
});

export default cloudinary;
