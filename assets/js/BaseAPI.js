//注意每次调用$.get()或$.post()或$.ajax()的时候会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前统一的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})