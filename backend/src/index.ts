import express from 'express';
import {PrismaClient} from '@prisma/client';
import bodyParser from 'body-parser';
import router from './routes/router';

const port = 8421;
const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

app.use('/api', router);
app.listen(port, () => console.log(`Listening on ${port}`));

export default prisma;
