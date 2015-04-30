$(function()
{
    var joinBtn = $("input[type=button]");
    // 회원가입 버튼 클릭 시 로직 정의
    joinBtn.click(function()
    {

        var id = $("input[name=id]");
        var pw = $("input[name=pw]");
        var pw_retype = $("input[name=pw_retype]");
        var name = $("input[name=name]");
        var email = $("input[name=email]");

        var errMsg = "";
        if(isDataEmpty(id,"아이디를 입력해 주세요")) return;
        if(isDataEmpty(pw,"패스워드를 입력해 주세요")) return;
        if(isDataEmpty(pw_retype,"패스워드 재입력란을 입력해 주세요")) return;
        if(isDataEmpty(name,"이름을 입력해 주세요")) return;
        if(isDataEmpty(email,"이메일을 입력해 주세요")) return;

        else if(pw.val() != pw_retype.val())
        {
            errMsg = "패스워드와 패스워드 재입력이 일치하지 않습니다.";
            pw_retype.focus();
        }

        if(errMsg != "")
        {
            alert(errMsg);

            return ;
        }
        $("#signupForm").submit();
    });

    // input  키에서 Enter 키 감지 시 행동 정의
    bindingEnterKey($("input"),joinBtn);


});