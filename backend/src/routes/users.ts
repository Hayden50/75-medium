import express, {Request, Response} from 'express';
import {z} from 'zod';
import prisma from '../index';
import {Prisma} from '@prisma/client'

const userRouter = express.Router();
userRouter.use(express.json());

const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string()
})

userRouter.get('/', async (_, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.send(JSON.stringify(users));
  } catch (e) {
    errorHandle(e, res);
  }
});

userRouter.get('/:id', async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: id }
    })
    res.send(JSON.stringify(user));
  } catch (e) {
    errorHandle(e, res);
  }
})

userRouter.post('/create-user', async (req: Request, res: Response) => {
  try {
    res.send(CreateUserSchema.parse(req.body));
  } catch (e) {
    errorHandle(e, res);
  }
});

const errorHandle = (e: unknown, res: Response) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    res.send('There is a unique constraint violation, a new user cannot be created with this email'); 
  } else {
    const error = e as Error;
    res.send(error.message);
  }
} 

export default userRouter;
