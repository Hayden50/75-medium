import express from 'express'
import userRouter from './users';
import challengeRouter from './challenges';

const router = express.Router();

router.use('/users', userRouter);
router.use('/challenges', challengeRouter);

export default router;
