// 点击登录按钮,弹出模态对话框
// $(function () {
//     $("#btn").click(function () {
//         $(".mask-wrapper").show();
//     });
//
//     $(".close-btn").click(function () {
//         $(".mask-wrapper").hide();
//     });
// });

// 构造函数
function Auth() {
    var self = this;
    self.maskWrapper = $(".mask-wrapper");
    self.scrollWrapper = $(".scroll-wrapper");
}

Auth.prototype.run = function () {
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
};

Auth.prototype.showEvent = function () {
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.hideEvent = function () {
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.listenShowHideEvent = function () {
    var self = this;
    var signinBtn = $(".signin-btn");
    var signupBtn = $(".signup-btn");
    var closeBtn = $(".close-btn");
    signinBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": 0});
    });

    signupBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": -400});
    });

    closeBtn.click(function () {
        self.hideEvent();
    });
};

Auth.prototype.listenSwitchEvent = function () {
    var self = this;
    var switcher = $(".switch");
    switcher.click(function () {
        // currentLeft含有px的字符串,
        // 判断大小就需要解析为整形
        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if(currentLeft < 0){
            self.scrollWrapper.animate({"left": "0"});
        }else{
            self.scrollWrapper.animate({"left": "-400px"});
        }
    });
};

Auth.prototype.listenSigninEvent = function () {
    var self = this;
    var signinGroup = $(".signin-group");
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = signinGroup.find(".submit-btn");
    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        // 拿到勾选框
        var remember = rememberInput.prop("checked");

        cpajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                // 有remember给1否则给0
                'remember': remember?1:0
            },
            // 成功执行的回调函数
            'success': function (result) {
                if(result['code'] == 200){
                    self.hideEvent();
                    window.location.reload();
                }
            },
            // 失败执行的回调函数
            'fail': function (error) {
                console.log(error);
            }
        });
    })
};

$(function () {
    var auth = new Auth();
    auth.run();
});
