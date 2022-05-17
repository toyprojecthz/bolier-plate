var express = require('express');
var app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const {
    User
} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(() => console.log('MONGODB Connected')).catch(err => console.log(err))


app.get('/', function (req, res) {
    res.send('Hello');
});

app.post('/register', (req, res) => {
    //회원가입할때 필요한 정보들을 클라이언트에서 가져오면 그것들을 디비에 넣어준다.
    const user = new User(req.body);
    //save
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

app.post('/login', (req, res) => {

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        //1. 요청된 이메일을 데이터베이스에서 찾기
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //2. 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 일치하는지 확인!
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                })
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에? 로컬스토리지 
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })

            });
        });
    })
})

app.listen(port, () => console.log(`listening on port ${port}`))