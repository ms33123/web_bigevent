$(function() {
    var form = layui.form;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间';
            }
        }
    });

    //初始化用户信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            methods: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg('获取用户信息失败');
                }
                //调用form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        });
    }

    //重置
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });


    //监听表单的提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败');
                }
                layui.layer.msg('更新用户信息成功');
                //调用父页面的方法，重新渲染用户信息
                parent.getUserInfo();
            }
        });
    });
});