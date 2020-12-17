require("dotenv").config();
const process = require('process');
const express = require('express');
const Router = require('./route');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World !');
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(Router);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
