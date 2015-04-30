var express = require('express');
var router = express.Router();
var functions = require('../functions');
var validator = require('validator');
var member = require('../models/member')

/* GET users listing. */
router.get('/', function (req, res, next)
{
    res.redirect('/');
});

// 회원가입 화면
router.get('/signup', function (req, res, next)
{
    res.render('member/signup', {title: "회원가입"});
});

// 회원가입 로직 처리
router.post('/signup', function (req, res, next)
{
    var id = req.body.id;
    var pw = req.body.pw;
    var pw_retype = req.body.pw_retype;
    var name = req.body.name;
    var email = req.body.email;

    var paramDatas = [id, pw, pw_retype, name, email];
    var datasForSQL = [id, pw, name, email];

    functions.isDataEmpty(paramDatas, ["id", "pw", "pw_retype", "name", "email"], function (resultJson)
    {

        if (resultJson.result == "success")
        {
            if (pw != pw_retype)
            {
                res.send(functions.getAlertScriptString("패스워드와 패스워드 재입력이 일치하지 않습니다."));
                return;
            }

            if (pw != pw_retype)
            {
                res.send(functions.getAlertScriptString("패스워드와 패스워드 재입력이 일치하지 않습니다."));
                return;
            }

            if (!validator.isEmail(email))
            {
                res.send(functions.getAlertScriptString("이메일 입력을 확인해 주세요"));
                return;
            }

            member.signupMember(datasForSQL, function (result)
            {
                console.log("signupMember result : ", result);

                if (result.result == "fail")
                {
                    res.send(functions.getAlertScriptString(result.message));
                }
                else
                {
                    res.send("<script>alert('회원가입에 성공하였습니다.');location.href='/';</script>");
                }
            });

        }
        else
        {
            res.send(functions.getAlertScriptString(resultJsojn.message));
            return;
        }
    });
});

router.get('/logout',function(req,res,next)
{
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
