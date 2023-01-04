import express from 'express';
import {PrismaClient} from '@prisma/client';

const port = 8421;
const prisma = new PrismaClient();
const app = express();

app.get("/", async (_, res) => {
  const users = await prisma.user.findMany();
  res.send(JSON.stringify(users));
  console.log(users);
});

app.listen(port, () => console.log(`Listening on ${port}`));
