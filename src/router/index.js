import express from "express";
import viewRouter from './views.router.js';
import userRouter from './user.route.js';
import productRouter from './product.route.js';
import cartRouter from './cart.route.js';

const router = express.Router();

router.use('/', viewRouter);
router.use('/', userRouter);
router.use('/api/users', userRouter);
router.use('/api/products', productRouter);
router.use('/api/carts', cartRouter);

export default router;