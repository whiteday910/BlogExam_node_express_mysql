$(function(){


    $("#goBlogBtn").click(function(e)
    {
            var id = $("#selecBloger").val();
            location.href="/blog/"+id+"/list/1";
    });

    var loginBtn = $("#btnLogin");
    loginBtn.click(function()
    {
        var id = $("input[name=id]");
        var pw = $("input[name=pw]");

        if(isDataEmpty(id,"아이디를 입력해 주세요")) return;
        if(isDataEmpty(pw,"패스워드를 입력해 주세요")) return;

        $("form").submit();

    });

    $("#selecBloger").change(function(e)
    {
        var selectedId = $("option:selected").val();
        location.href="/blog/"+selectedId;
    });

    bindingEnterKey($("input"),loginBtn);

});
