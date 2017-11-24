// 引入 gulp及组件
var gulp=require('gulp'),  //gulp基础库
	imageMin = require('gulp-imagemin'), 	//图片压缩
    minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    jshint=require('gulp-jshint'),   //js检查
    notify=require('gulp-notify'),   //提示
    babel=require('gulp-babel'),//使用ES6写的，需要先用 gulp-babel 编译一下再uglify
//  browserSync = require('browser-sync').create()//打开浏览器
	webserver = require('gulp-webserver')//打开浏览器

//语法检查
gulp.task('jshint', function () {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//css处理
gulp.task('minifycss',function(){
   return gulp.src('src/css/*.css')      //需要操作的文件
       .pipe(concat('style.css'))      //合并css文件到"order_query"
       .pipe(gulp.dest('dist/styles'))           //设置输出路径
       .pipe(rename({suffix:'.min'}))         //修改文件名
       .pipe(minifycss())                    //压缩文件
       .pipe(gulp.dest('dist/'))            //输出文件目录
       .pipe(notify({message:'css task ok'}));   //提示成功
});

//压缩,合并 js
gulp.task('minifyjs', function() {
    return gulp.src(['src/**/*.js'])      //需要操作的文件
        .pipe(concat('app.js'))    //合并所有js到main.js
        .pipe(gulp.dest('./dist/js'))       //输出到文件夹
        .pipe(babel())
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('./dist'));  //输出
});

//压缩，图片images
gulp.task('image',function(){
    gulp.src('src/images/*.*')
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest('dist/images'))
})

//启动服务
gulp.task('server',function(){
  	gulp.src('./dist').pipe(webserver({
      host: 'localhost',
      port: '9527',
      livereload: true,
      open: 'http://localhost:9527'
    }));
})

gulp.task('default',['jshint'],function() {
    gulp.start('image','minifycss','minifyjs'); 
});