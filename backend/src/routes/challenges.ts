import express, {Request, Response} from 'express';
import prisma from '../index';
import {z} from 'zod';

const challengeRouter = express.Router();

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) {
    return new Date(arg);
  }
}, z.date());

const CreateChallengeSchema = z.object({
  active: z.boolean(),
  usingPhoto: z.boolean(),
  challengeLength: z.number(),
  challengeStart: dateSchema,
  objectives: z.array(z.string()),
  userId: z.string()
}); 

challengeRouter.get('/', async (_, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        active: true,
        challengeLength: true,
        objectives: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        } 
      }
    });
    res.send(challenges);
  } catch (e) {
    res.send(e);
  }
});

challengeRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const challengeReq = CreateChallengeSchema.parse(req.body);
    const challenge = await prisma.challenge.create({ data: challengeReq });
    res.send(challenge);
  } catch (e) {
    res.send(e);
  }
});

challengeRouter.get('/:id', async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const challenge = await prisma.challenge.findUnique({ where: { id: id } })
    res.send(challenge);
  } catch (e) {
    res.send(e);
  }
}); 

export default challengeRouter;
