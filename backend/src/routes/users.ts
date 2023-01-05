import express, {Request, Response} from 'express';
import {z} from 'zod';
import prisma from '../index';
import {Prisma} from '@prisma/client'

const userRouter = express.Router();
userRouter.use(express.json());

const CreateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string()
})

const LoginSchema = z.object({
  email: z.string(),
  password: z.string()
})

userRouter.get('/', async (_, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        challenge: true
      }
    });
    res.send(users);
  } catch (e) {
    errorHandle(e, res);
  }
});

userRouter.get('/:id', async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: id } });
    res.send(user);
  } catch (e) {
    errorHandle(e, res);
  }
})

userRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const userReq = CreateUserSchema.parse(req.body);
    const user = await prisma.user.create({ data: userReq });
    res.send(user);
  } catch (e) {
    errorHandle(e, res);
  }
});

userRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const loginReq = LoginSchema.parse(req.body);
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: loginReq.email,
        password: loginReq.password 
      },
    });
    res.send(user);
  } catch (e) {
    errorHandle(e, res);
  }
})

userRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.user.delete({ where: { id: id } });
    res.send('Successfully deleted user');
  } catch (e) {
    errorHandle(e, res);
  }
});

const errorHandle = (e: unknown, res: Response) => {
  const error = e as Prisma.PrismaClientKnownRequestError; 
  
  switch(error.code) {
    case 'P2002':
      res.send('There is a unique constraint violation, a new user cannot be created with this email.'); 
      break;
    case 'P2025':
      res.send('User cannot be found in the database');
      break;
    default:
      res.send(error.message);
  }
} 

export default userRouter;
