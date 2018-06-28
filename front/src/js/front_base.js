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
    self.smsCaptcha = $(".sms-captcha-btn");
}

Auth.prototype.run = function () {
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
    self.listenSignupEvent();
};

Auth.prototype.showEvent = function () {
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.hideEvent = function () {
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.smsSuccessEvent = function () {
    var self = this;
    messageBox.showSuccess('短信验证码发送成功！');
    self.smsCaptcha.addClass('disabled');
    var count = 60;
    // 倒计时之前取消点击事件
    self.smsCaptcha.unbind("click");
    // 定时器
    var timer = setInterval(function () {
        self.smsCaptcha.text(count+'s');
        count--;
        if(count <= 0){
            clearInterval(timer);
            self.smsCaptcha.removeClass('disabled');
            self.smsCaptcha.text('发送验证码');
            self.listenSmsCaptchaEvent();
        }
    // 1000ms
    }, 1000);
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

Auth.prototype.listenSmsCaptchaEvent = function () {
    var self = this;
    // 获取注册页面的手机号码输入框
    var telephoneInput = $(".signup-group input[name='telephone']");
    self.smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if(!telephone){
            messageBox.showInfo("请输入手机号码!");
        }
        cpajax.get({
            'url': '/account/sms_captcha/',
            'data': {
                'telephone': telephone
            },
            'success': function (result) {
                if(result['code'] == 200){
                    self.smsSuccessEvent();
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
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
                self.hideEvent();
                window.location.reload();
            }
        });
    })
};

Auth.prototype.listenSignupEvent = function () {
    var signupGroup = $(".signup-group");
    var submitBtn = signupGroup.find(".submit-btn");
    submitBtn.click(function (event) {
        event.preventDefault();
        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = smsCaptchaInput.val();

        cpajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function (result) {
                window.location.reload();
            }
        });
    });
};

$(function () {
    var auth = new Auth();
    auth.run();
});


$(function () {
    var frontBase = new FrontBase();
    frontBase.run();
});