// 引入 gulp及组件
var gulp=require('gulp'),  //gulp基础库
//  minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    jshint=require('gulp-jshint'),   //js检查
    notify=require('gulp-notify');   //提示
    babel=require('gulp-babel');//使用ES6写的，需要先用 gulp-babel 编译一下再uglify

//语法检查
gulp.task('jshint', function () {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
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

gulp.task('default',['jshint'],function() {
    gulp.start('minifyjs'); 
});