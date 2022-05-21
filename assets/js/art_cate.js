Vue.config.productionTip = false;

//使用vue渲染
var vm = new Vue({
    el: '#tpl-table',
    data: {
        item: []
    }
});

$(function() {
    var form = layui.form;

    initArtCateList();
    //获取文章分类
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                vm.item = res.data;
            }
        });
    }

    //为弹出层设置索引
    var indexAdd = null;
    $('#btnadd').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });


    //通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('新增分类失败');
                }
                initArtCateList();
                layer.msg('新增分类成功');
                //根据索引关闭弹出层
                layer.close(indexAdd);
            }
        });
    });

    //通过代理的形式，为btn-edit绑定事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val("form-edit", res.data);
            }
        });
    });

    //通过代理的形式，为form-edit添加提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败');
                }
                initArtCateList();
                layer.msg('修改文章分类成功');
                layer.close(indexEdit);
            }
        });
    })

    var indexRemove = null;
    //通过代理的形式，为form-remove添加删除事件
    $('tbody').on('click', '.btn-remove', function() {
        var id = $(this).siblings().attr('data-id');
        layer.confirm('确认删除文章分类？', function() {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败');
                    }
                    initArtCateList();
                    layer.msg('删除文章分类成功');
                }
            });
        });
    });
});