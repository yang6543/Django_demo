// js导入包
var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var cache = require("gulp-cache");
var imagemin = require("gulp-imagemin");
// 创建个服务器
var bs = require("browser-sync").create();
// sass能让css像js拥有逻辑处理的能力
// (导入其他css，使用变量，嵌套等功能)
// sass文件要将其转为css才能被网页识别
// gulp-sass将sass文件转化为css
var sass = require("gulp-sass");
// gulp-util这个插件中有一个方法log,
// 可以打印当前js错误的信息
var util = require("gulp-util");
// gulp-sourcemaps当.min.js文件出错时
// 可以通过该插件找到没压缩js文件出错的地方
var sourcemaps = require("gulp-sourcemaps");


// 保存路径
var path = {
    // **表示templates下有多个目录
    'html': './templates/**/',
    'css': './src/css/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};

// 定义处理html文件的任务
gulp.task("html", function () {
    gulp.src(path.html + '*.html')
        // 查找完所有html文件后重新加载即可
        .pipe(bs.stream())
});

// 定义处理css文件的任务
gulp.task("css", function () {
    // 找到所有的css文件
    gulp.src(path.css + '*.scss')
        // 将scss(sass一种后缀名)转换为css，
        // 若出错，通过logError抛出错误并不会终止任务
        .pipe(sass().on("error", sass.logError))
        // cssnano压缩文件
        .pipe(cssnano())
        // 重命名文件
        .pipe(rename({"suffix": ".min"}))
        // 将重命名后的css文件保存到处理后的dist文件里
        .pipe(gulp.dest(path.css_dist))
        // 所有css文件修改完后页面重新加载
        .pipe(bs.stream())
});

// 定义处理js文件的任务
gulp.task("js", function () {
    gulp.src(path.js + '*.js')
        .pipe(sourcemaps.init())
        // 将所有js文件进行简化
        // 且当js出错时打印错误信息，
        // 而不是直接退出
        .pipe(uglify().on("error", util.log))
        .pipe(rename({"suffix": ".min"}))
        // 当js出错时就会在具体的位置打印错误信息
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});

// 定义处理图片文件的任务
gulp.task("images", function () {
    gulp.src(path.images + '*.*')
        // 将图片压缩处理后并缓存
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
});

// 定义监听文件修改的任务
gulp.task("watch", function () {
    // 监听所有css文件，若有修改则执行css任务（['css']）
    gulp.watch(path.html + '*.html', ['html']);
    gulp.watch(path.css + '*.scss', ['css']);
    gulp.watch(path.js + '*.js', ['js']);
    gulp.watch(path.images + '*.*', ['images']);
});

// 初始化browser-sync的任务
gulp.task("bs", function () {
    // 初始化后浏览器可以看到效果
    bs.init({
        "server": {
            "baseDir": "./"
        }
    });
});

// 创建一个默认的任务
// 执行默认任务前，首先要执行bs,watch任务
gulp.task("default", ["bs", "watch"]);
