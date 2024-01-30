import express from 'express';

const app = express();

app.get('/hello', (_req, res) => {
  res.json({ message: 'hello world' });
});

export { app };
