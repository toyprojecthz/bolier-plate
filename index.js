var express = require('express');
var app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hz:rhdvkf21@bolierplate.cvtvm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => console.log('MONGODB Connected')).catch(err => console.log(err))


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('Hello');
});

app.listen(port, () => console.log(`listening on port ${port}`))