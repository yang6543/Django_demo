// 面向对象

// function Banner() {
//     // 这个里面写的代码相当于
//     // Python中的__init__方法
//     console.log("构造函数");
//     // 1.添加属性
//     // this相当于Banner初始化的对象,类似Python的self
//     this.person = "cp";
// }
//
// // 2.添加方法
// // 给类绑定方法(原型链)
// Banner.prototype.greet = function (word) {
//     console.log("welcome", word);
// };
//
// var banner = new Banner();
// console.log(banner.person);
// banner.greet("carl");

function Banner() {
    this.bannerWidth = 798;
    this.bannerGroup = $("#banner-group");
    this.index = 0;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-ul");
    // 获取banner下的子元素li标签
    this.liList = this.bannerUl.children("li");
    // 获取li标签个数
    this.bannerCount = this.liList.length;
    this.listenBannerHover();
}

// 初始化banner
Banner.prototype.initBanner = function () {
    // 给css添加样式
    this.bannerUl.css({"width": this.bannerWidth*this.bannerCount});
};

// 初始化圆点
Banner.prototype.initPageControl = function () {
    var pageControl = $(".page-control");
    // 遍历所有的banner
    for(var i=0; i<this.bannerCount; i++){
        // 通过遍历banner自动创建li标签个数
        var circle = $("<li></li>");
        pageControl.append(circle);
        if(i === 0){
            // 默认让第一个圆点处于活动状态
            circle.addClass("active");
        }
    }
    pageControl.css({"width": this.bannerCount*12+8*2+(this.bannerCount-1)*16});
};

// toggle显示或隐藏
Banner.prototype.toggleArrow = function (isShow) {
    var self = this;
    if(isShow){
        self.leftArrow.show();
        self.rightArrow.show();
    }else{
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

// 监听bannerhover事件方法
Banner.prototype.listenBannerHover = function () {
    // 此时的this代表Banner的对象
    var self = this;
    this.bannerGroup.hover(function () {
        // 第一个函数,把鼠标移动到banner上会执行的函数
        // 这里的this代表的是当前该函数,
        // 故函数要想使用某个对象就应在
        // 函数外定义一个变量(var self = this;)
        // 鼠标移上去左右箭头显示
        self.toggleArrow(true);
        // 停止定时器
        clearInterval(self.timer);
    },function () {
        // 第二个函数,把鼠标从banner上移走会执行的函数
        // 鼠标移走左右箭头隐藏
        self.toggleArrow(false);
        self.loop();
    });
};

Banner.prototype.animate = function () {
    var self = this;
    this.bannerUl.animate({"left": -798*self.index}, 500);
};

// 轮播方法
Banner.prototype.loop = function () {
    var self = this;
    // css没有过渡过程,一步到位
    // bannerUl.css({"left": -798});
    // animate有个过渡过程,时间为2000ms
    // setInterval定时器
    this.timer = setInterval(function () {
        if(self.index >= self.bannerCount-1){
            self.index = 0;
        }else{
            self.index++;
        }
        self.animate();
    }, 2000);
};

Banner.prototype.listenArrowClick = function () {
    var self = this;
    this.leftArrow.click(function () {
        // js中==: 1 == '1',返回true(不管数据类型，
        // 内容一致就会返回true)
        // ===: 1 === 1(类型和内容均要保持一致)
        if(self.index === 0){
            self.index = self.bannerCount-1;
        }else{
            self.index--;
        }
        self.animate();
    });
    this.rightArrow.click(function () {
        if(self.index === self.bannerCount-1){
            self.index = 0;
        }else{
            self.index++;
        }
        self.animate();
    });
};

Banner.prototype.run = function () {
    this.initBanner();
    this.initPageControl();
    this.loop();
    this.listenArrowClick();
};

// 页面加载完成后在执行函数内的代码
$(function () {
    var banner = new Banner();
    banner.run();
});
