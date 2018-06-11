// 点击登录按钮,弹出模态对话框
$(function () {
    $("#btn").click(function () {
        $(".mask-wrapper").show();
    });

    $(".close-btn").click(function () {
        $(".mask-wrapper").hide();
    });
});

$(function () {
    $(".switch").click(function () {
        var scrollWrapper = $(".scroll-wrapper");
        // currentLeft含有px的字符串,
        // 判断大小就需要解析为整形
        var currentLeft = scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if(currentLeft < 0){
            scrollWrapper.animate({"left": "0"});
        }else{
            scrollWrapper.animate({"left": "-400px"});
        }
    });
});