$(function()
{
    var writeBtn = $("#btnWrite");
    writeBtn.click(function(e)
    {
        var id  = $("input[name=title]");
        var content  = $("textarea");
        console.log("컨텐츠 : ",content.val());
        if(isDataEmpty(id,"제목을 입력해 주세요")) return;
        if(isDataEmpty(content,"내용을 입력해 주세요")) return;

        $("#writeForm").submit();
    });

    bindingEnterKey( $("input[name=title]") ,  writeBtn);
});