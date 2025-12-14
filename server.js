
const express = require('express');
const app = express();
const pool = require('./config/db');
const postRoutes = require('./routes/post.route');


app.use(express.json());


app.get('/', (req, res) => {
    res.send("Hello world");
});

app.use('/api/posts',postRoutes);

app.listen('3000', () => {
    console.log('This port is running 3000');
});