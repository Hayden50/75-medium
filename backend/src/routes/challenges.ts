import express, {Request, response, Response} from 'express';
import prisma from '../index';
import {z} from 'zod';

const challengeRouter = express.Router();

const CreateChallengeSchema = z.object({
  active: z.boolean(),
  usingPhoto: z.boolean(),
  challengeLength: z.number(),
  challengeStart: z.string().datetime(),
  objectives: z.array(z.string()),
  userId: z.string()
}) 

challengeRouter.get('/', async (_, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        user: true
      }
    });
    res.send(challenges);
  } catch (e) {
    res.send(e);
  }
})

challengeRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const challengeReq = CreateChallengeSchema.parse(req.body);
    const challenge = await prisma.challenge.create({ data: challengeReq });
    res.send(challenge);
  } catch (e) {
    res.send(e);
  }
})

challengeRouter.get('/:id', async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const challenge = await prisma.challenge.findUnique({
      where: { id: id }
    })
    res.send(JSON.stringify(challenge));
  } catch (e) {
    res.send(e);
  }
})

export default challengeRouter;
