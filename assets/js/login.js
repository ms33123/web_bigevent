$(function() {
    //点击去注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //点击去登录账号
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });


    //从layui中获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位且不能出现空格'],
        // 检查两次密码是否一样
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });

    //监听注册表单提交
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录');
            $('#link_login').click();
        });
    });

    //监测登录表单提交
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_login [name=username]').val(),
            password: $('#form_login [name=password]').val()
        };
        $.post('/api/login', data, function(res) {
            if (res.status != 0) {
                return layer.msg('登录失败');
            }
            layer.msg('登录成功!');

            localStorage.setItem('token', res.token);

            //跳转主页
            location.href = '/index.html'
        });
    });
});