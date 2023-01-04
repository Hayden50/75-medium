import express from 'express';

const app = express();
const port = 8421;

app.get("/", (_, res) => res.send("hello world"));
app.listen(port, () => console.log(`Listening on ${port}`));
