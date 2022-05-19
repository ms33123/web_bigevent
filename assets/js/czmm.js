$(function() {
    //从layui中获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位且不能出现空格'],
        // 检查两次密码是否一样
        repwd: function(value) {
            var pwd = $('.layui-form [name=newPwd]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });

    //重置
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        $('.layui-form')[0].reset();
    });

    //修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败');
                }
                layui.layer.msg(res.message);
                $('.layui-form')[0].reset();
            }
        });
    });
});