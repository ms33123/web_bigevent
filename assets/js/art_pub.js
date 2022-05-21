$(function() {
    var form = layui.form;
    var vm = new Vue({
        el: '#cate_lei',
        data: {
            cate: []
        }
    });


    cate();
    // 初始化富文本编辑器
    initEditor();


    function cateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                form.render();
            }
        });
    }

    //分类列表
    function cate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return;
                }
                vm.cate = res.data;
                cateList();
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击上传封面按钮
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    //监听coverFile的change事件
    $('#coverFile').on('change', function(e) {
        //获取用户选择的文件
        var files = e.target.files;
        //判断用户是否选择了文件
        if (files.length === 0) {
            return;
        }

        var newImgURL = URL.createObjectURL(files[0]);
        //为裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });



    //定义文章的状态
    var art_state = '已发布';


    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        //将文章的发布状态，存到fd中
        fd.append('state', art_state);

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，存储到fd中
                fd.append('cover_img', blob);
                //6.发起ajax请求
                publishArticle(fd);
            })
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据
            //必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功');
                location.href = '/article/art_list.html';
            }
        });
    }
});