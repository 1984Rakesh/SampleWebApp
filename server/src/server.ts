import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (_req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
