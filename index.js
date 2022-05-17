var express = require('express');
var app = express();
const port = 5000;
const bodyParser = require('body-parser');
const config = require('./config/key')
const {
    User
} = require("./models/Uesr");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(() => console.log('MONGODB Connected')).catch(err => console.log(err))


app.get('/', function (req, res) {
    res.send('Hello');
});

app.post("/register", (req, res) => {
    //회원가입할때 필요한 정보들을 클라이언트에서 가져오면 그것들을 디비에 넣어준다.
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({
            success: false,
            err
        })
        return res.status(200).json({
            success: true
        })

    })
})

app.listen(port, () => console.log(`listening on port ${port}`))