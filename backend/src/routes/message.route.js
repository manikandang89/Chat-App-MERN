import express from 'express';

import {getUserMessages, sendUserMessages, getUsersForSidebar} from '../controller/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/user', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getUserMessages);
router.post("/send/:id", protectRoute, sendUserMessages);


export default router;