// 用来处理导航条
function FrontBase() {

}

FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    // 移上去显示hover事件，
    // 移除隐藏hover事件
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    });
};

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

// 用来处理登录和注册
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
    self.listenImgCaptchaEvent();
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

Auth.prototype.listenImgCaptchaEvent = function () {
    var imgCaptcha = $(".img-captcha");
    imgCaptcha.click(function () {
        // 点击图形验证码，
        // 每次/account/img_captcha/?random=xxx不一样
        // 就可以获取不同的验证码
        imgCaptcha.attr("src", "/account/img_captcha/"+"?random="+Math.random());
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
                }else{
                    var messageObject = result['message'];
                    // 判断是否是字符串类型or构造函数是否是字符串
                    if(typeof messageObject == 'string' || messageObject.constructor == String){
                        window.messageBox.show(messageObject);
                    }else{
                        // {"password": ['xxx','xxx'], "telephone": ['xxx','xxx']}
                        for(var key in messageObject){
                            var messages = messageObject[key];
                            var message = messages[0];
                            window.messageBox.show(message);
                        }
                    }
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


$(function () {
    var frontBase = new FrontBase();
    frontBase.run();
});