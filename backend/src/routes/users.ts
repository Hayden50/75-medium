import express, {Request, Response} from 'express';
import {z} from 'zod';
import prisma from '../index';

const userRouter = express.Router();
userRouter.use(express.json());

const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string()
})

userRouter.get('/', async (_, res: Response) => {
  const users = await prisma.user.findMany();
  res.send(JSON.stringify(users));
});

userRouter.post('/create-user', async (req: Request, res: Response) => {
  try {
    res.send(CreateUserSchema.parse(req.body));
  } catch (e) {
    const error = e as Error;
    res.send(error.message);
  }
});

// const errorHandle = (e: unknown, res: Response) => {
//   if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
//     res.send('There is a unique constraint violation, a new user cannot be created with this email'); 
//   } else {
//     res.send('There was an unexpected error');
//   }
// } 

export default userRouter;
