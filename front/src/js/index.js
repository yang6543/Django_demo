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
    this.index = 1;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-ul");
    // 获取banner下的子元素li标签
    this.liList = this.bannerUl.children("li");
    // 获取li标签个数
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");
}

// 初始化banner
Banner.prototype.initBanner = function () {
    // 克隆第一张和最后一张banner
    var firstBanner = this.liList.eq(0).clone();
    var lastBanner = this.liList.eq(this.bannerCount-1).clone();
    this.bannerUl.append(firstBanner);
    // 将最后一张banner添加到第一张banner前
    this.bannerUl.prepend(lastBanner);
    // 给css添加样式
    // 因为第一张banner前有最后一张banner
    // 故left为-this.bannerWidth(-798)
    this.bannerUl.css({"width": this.bannerWidth*(this.bannerCount+2), "left": -this.bannerWidth});
};

// 初始化圆点
Banner.prototype.initPageControl = function () {
    // 遍历所有的banner
    for(var i=0; i<this.bannerCount; i++){
        // 通过遍历banner自动创建li标签个数
        var circle = $("<li></li>");
        this.pageControl.append(circle);
        if(i === 0){
            // 默认让第一个圆点处于活动状态
            circle.addClass("active");
        }
    }
    this.pageControl.css({"width": this.bannerCount*12+8*2+(this.bannerCount-1)*16});
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

Banner.prototype.animate = function () {
    this.bannerUl.animate({"left": -798*this.index}, 500);
    var index = this.index;
    if(index === 0){
        index = this.bannerCount-1;
    }else if(index === this.bannerCount+1){
        index = 0;
    }else{
        index = this.index-1;
    }
    // eq方法是获取到的当前第几个li标签
    this.pageControl.children("li").eq(index).addClass("active").siblings().removeClass("active");
};

// 轮播方法
Banner.prototype.loop = function () {
    var self = this;
    // css没有过渡过程,一步到位
    // bannerUl.css({"left": -798});
    // animate有个过渡过程,时间为2000ms
    // setInterval定时器
    this.timer = setInterval(function () {
        // bannerCount在第一张和最后一张克隆之后
        // 还是保持之前的banner张数,
        // 故index=bannerCount+1
        if(self.index >= self.bannerCount+1){
            // 此时第一张前是最后一张,
            // 相对于父标签
            // 故宽度为-798
            self.bannerUl.css({"left": -self.bannerWidth});
            // index为2,执行animate才会
            // 从当前位置轮播到下一张
            self.index = 2;
        }else{
            self.index++;
        }
        self.animate();
    }, 2000);
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

// 监听箭头点击事件
Banner.prototype.listenArrowClick = function () {
    var self = this;
    this.leftArrow.click(function () {
        // js中==: 1 == '1',返回true(不管数据类型，
        // 内容一致就会返回true)
        // ===: 1 === 1(类型和内容均要保持一致)
        if(self.index === 0){
            self.bannerUl.css({"left": -self.bannerCount*self.bannerWidth});
            self.index = self.bannerCount-1;
        }else{
            self.index--;
        }
        self.animate();
    });
    this.rightArrow.click(function () {
        if(self.index === self.bannerCount+1){
            self.bannerUl.css({"left": -self.bannerWidth});
            self.index = 2;
        }else{
            self.index++;
        }
        self.animate();
    });
};

Banner.prototype.listenPageControl = function () {
    var self = this;
    // 获取pageControl下的子节点li元素
    // 再通过each方法遍历它
    // 将其下标index(即点击第几个圆点-1)和对象传进去
    this.pageControl.children("li").each(function (index, obj) {
        // 将js对象(obj)封装成jq对象
        $(obj).click(function () {
            self.index = index;
            self.animate();
            // 通过obj对象添加active
            // 并找到兄弟元素再移除active状态
            // $(obj).addClass("active").siblings().removeClass("active");
        });
    });
};

Banner.prototype.run = function () {
    this.initBanner();
    this.initPageControl();
    this.loop();
    this.listenBannerHover();
    this.listenArrowClick();
    this.listenPageControl();
};

// 页面加载完成后在执行函数内的代码
$(function () {
    var banner = new Banner();
    banner.run();
});
