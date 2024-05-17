const express = require('express');
const app = express();
const portNum = 4000;

// Parse JSON bodies
app.use(express.json());

const userRoutes = require('./routes/loginRoute');
app.use('/api/login', userRoutes);

app.listen(portNum, () => {
  console.log(`Server is running on port ${portNum}.`);
});