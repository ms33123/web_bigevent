$(function() {
    var form = layui.form;
    var laypage = layui.laypage;
    var cateData = {
            pagenum: 1,
            pagesize: 2,
            cate_id: '',
            state: ''
        }
        //获取分类
    var vm1 = new Vue({
        el: '#cateSelect',
        data: {
            cate: []
        }
    });
    var vm = new Vue({
        el: '#art_list',
        data: {
            essay: []
        }
    });

    //获取文章列表

    cateList();
    cate();

    function cateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: cateData,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败');
                }
                vm.essay = res.data;
                layer.msg('获取文章成功');
                form.render();
                // form.render();
                //渲染分页
                renderPage(res.total);
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
                    return layer.msg('获取分类失败');
                }
                vm1.cate = res.data;
                layer.msg('获取分类成功');
            }
        });
    }


    //筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象cateData中对应的属性赋值
        cateData.cate_id = cate_id;
        cateData.state = state;
        cateList();
    });


    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: cateData.pagesize, //每页显示的数据
            curr: cateData.pagenum, //指定默认被选中的页面
            limits: [2, 5, 10, 20],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //分页发生切换的时候发生的回调
            //触发jump回调的方式:1.点击页码   2.只要调用了laypage.render就会触发回调
            jump: function(obj, first) {
                //拿到最新的页码值
                cateData.pagenum = obj.curr;
                //每页显示的条数重新赋值
                cateData.pagesize = obj.limit;
                //根据最新的cateDate渲染页面
                if (!first) {
                    cateList();
                }
            }
        });
    }

    //删除
    $('body').on('click', '#btnDelete', function() {
        let id = $(this).attr('data-id');
        layer.confirm('确定删除此文章?', function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    cateList();
                    layer.msg('删除文章成功');
                }
            });
        });
    });

    //编辑
    $('body').on('click', '#btnEdit', function() {
        var id = $(this).siblings().attr('data-id');
        localStorage.setItem('Id', id);
        location.href = '/article/art_edit.html';
    });
});