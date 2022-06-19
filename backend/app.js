const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const chatRoutes = require('./routes/chat');
const clc = require("cli-color");
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log(clc.blue.bold('Connexion à MongoDB réussie !')))
    .catch(() => console.log(clc.red.bold('Connexion à MongoDB échouée !')));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;