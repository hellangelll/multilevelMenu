/**
 * Created by hellangel on 2017/10/21.
 */

(function () {
    if (!HAT) {
        HAT = function () {
        };
    }
})();

function HAT(jqObj) {
    this.version = '0.0.0.1';
    this.id = new Date().getTime();
    this.menuDate = [];
    this.dataList = [[],[],[]];

    this.init = function () {
        localStorage.setItem("qmAccount", 15011680072);
        localStorage.setItem("ticketMsgCount", 6);
        localStorage.setItem("GUIDE_STEP", 999);
        localStorage.setItem("msgCount", 0);
        localStorage.setItem("sysTalkCount", 0);
        localStorage.setItem("wares-standard-category:lastSelectedCat", '');
        sessionStorage.setItem("QM_ROLE_VALUE", 281);

        //$.cookie('NTKF_T2D_CLIENTID', null);
        //$.cookie('SSOEXPIRES', null);
        //$.cookie('SSOTHRESHOLD', null);
        //$.cookie('SSOTICKET', null);
        //$.cookie('_ga', null);
        //$.cookie('_gat', null);
        //$.cookie('_gid', null);
        //$.cookie('a9a68f4fefd3b693f10be4a89799dc48', null);
        //$.cookie('cxuid', null);
        //$.cookie('id', null);
        //$.cookie('nTalk_CACHE_DATA', null);
        //$.cookie('qmuid', null);
        //$.cookie('roleId', null);
        //$.cookie('sxuid', null);

        //$.cookie('NTKF_T2D_CLIENTID', 'guestFDBD682D-14C0-E35C-7884-3D84533A2831', {path: '/'});
        //$.cookie('SSOEXPIRES', '', {path: '/'});
        //$.cookie('SSOTHRESHOLD', '', {path: '/'});
        //$.cookie('SSOTICKET', '', {path: '/'});
        //$.cookie('_ga', 'GA1.2.1614316855.1508565586', {path: '/'});
        //$.cookie('_gat', '1', {path: '/'});
        //$.cookie('_gid', 'GA1.2.1595015964.1508565586', {path: '/'});
        //$.cookie('a9a68f4fefd3b693f10be4a89799dc48', '3222ab1307c54a26811b6ca7acfb0f37', {path: '/'});
        //$.cookie('cxuid', '1755699724', {path: '/'});
        //$.cookie('id', '2269cd817b1d006a||t=1490537645|et=730|cs=002213fd481e26ecef145d04e8', {path: '/'});
        //$.cookie('nTalk_CACHE_DATA', '{uid:kf_9575_ISME9754_guestFDBD682D-14C0-E3,tid:1508565603130953}', {path: '/'});
        //$.cookie('qmuid', '1500072', {path: '/'});
        //$.cookie('roleId', '281', {path: '/'});
        //$.cookie('sxuid', '-514654387', {path: '/'});

        jqObj.addClass(this.id + '');
        //this.authData();
        this.getMenuData(this.initPage);
    };

    //this.authData = function () {
    //    $.ajax({
    //        data: "",
    //        type: 'GET',
    //        async: false,
    //        dataType: 'json',
    //        contentType: 'application/json;charset=utf-8',
    //        url: 'https://app-api.1000.com/api/common/auth',
    //        timeout: 10000,
    //        xhrFields: {
    //            withCredentials: true
    //        },
    //        crossDomain: true,
    //        success: function (data, textStatus) {
    //        },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) {
    //            if (textStatus == "timeout") {
    //                console.log("访问超时:" + errorThrown);
    //            }
    //            console.log("连接错误:" + errorThrown);
    //        }
    //    });
    //};

    this.getMenuData = function (callback) {
        var that = this;
        var data_url = 'data.json';

        $.ajax({
            //data: '{"channel":"d2c"}',
            type: 'get',
            async: true,
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            url: data_url,
            timeout: 10000,
            //xhrFields: {
            //    withCredentials: true
            //},
            //crossDomain: true,
            success: function (data, textStatus) {
                if (!data) {
                    alert('获取数据异常');
                }
                that.menuDate = data.data;
                if (callback && data) {
                    callback.call(that);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (textStatus == "timeout") {
                    console.log("访问超时:" + errorThrown);
                }
                console.log("连接错误:" + errorThrown);
            }
        });
    };

    //return Array
    this.grepMeunWithPid = function (pid) {
        if (this.menuDate instanceof Array) {
            pid = /^[0-9]+$/.test(pid) ? pid : 0;
            return $.map(this.menuDate, function (value) {
                if (value.parentId == pid) {
                    return value;
                }
            });
        }
    };

    //level-级别0-3,pid-父节点id
    this.fillData = function (level, pid, subCatIds) {
        var arr = [], objList = $('.' + this.id + ' .classify-standard-item-list'), obj = $('.' + this.id + ' .classify-standard-item'), that = this;
        obj.eq(level>0?(level-1):0).nextAll().find('.classify-standard-item-list').html('');
        //$('.' + this.id + ' .ant-input-search').val('');

        //区分是init调用还是click调用  如果是click,则判断该pid下是否还有子节点
        if (typeof subCatIds == 'undefined' || subCatIds.length > 0) {
            objList.eq(level).html('');
            //obj.eq(level).nextAll().find('.classify-standard-item-list').html('');
            var values = this.dataList[level] = this.grepMeunWithPid(pid);
            $.each(values, function (i, val) {
                arr.push('<li><a href="javascript:;" class="' + (i == 0 ? 'active' : '') + '" catId=' + val.catId + '><span>' +
                    val.catName + '</span>'+(val.subCatIds.length>0?'<i class="anticon anticon-right"></i>':'')+'</a></li>');
            });
            objList.eq(level).html(arr.join('')).unbind('click').on('click', 'li a', function () {
                $(this).addClass('active').parent().siblings().find('a').removeClass('active');
                var o = that.getMenuItenById($(this).attr('catId'));
                $('.' + that.id + ' .classify-row-toolbar span').html('您当前选择的是： ' + o.fullPathName).attr('catId', o.catId);
                that.fillData(o.depth, o.catId, o.subCatIds);
            });

            $('.' + that.id + ' .classify-standard-products').html('<div class="classify-standard-item-tip"><p>亲，再往下选择试试，<br>有示例图片哟！</p><i class="qmIcon expression-hopeful"></i></div>');
        } else {
            this.getImgUrl(pid);
        }
    };

    this.getImgUrl = function (id) {
        var obj = $('.' + this.id + ' .classify-standard-products'), arr = [];
        obj.html('<img style="float: left;margin:49% 0 0 45%;" src="images/loading.gif" />');
        var data = this.getMenuItenById(id);
        $.each(data.image, function (i, val) {
            arr.push('<li><img class="ant-table-row-img" src="' + val + '"></li>');
        });
        obj.html("<h4>该分类下标准商品示例：</h4><ul>" + (arr.length > 0 ? arr.join('') : '暂无商品示例图片') + "</ul>");

        //var that = this;
        //var obj = $('.' + that.id + ' .classify-standard-products'), arr = [];
        //obj.html('<img style="float: left;margin:49% 0 0 45%;" src="images/loading.gif" />');
        //$.ajax({
        //    data: '{"channel":"d2c"}',
        //    type: 'POST',
        //    async: true,
        //    dataType: 'json',
        //    contentType: 'application/json;charset=utf-8',
        //    url: 'https://item-admin-api.1000.com/api/spu/standard/images/' + id,
        //    timeout: 10000,
        //    xhrFields: {
        //        withCredentials: true
        //    },
        //    crossDomain: true,
        //    success: function (data, textStatus) {
        //        if (!data) {
        //            alert('获取数据异常');
        //            return;
        //        }
        //        $.each(data.data, function (i, val) {
        //            arr.push('<li><img class="ant-table-row-img" src="//img.1000.com/qm-a-img/prod/' + val + '@50w_50h.png"></li>');
        //        });
        //        obj.html("<h4>该分类下标准商品示例：</h4><ul>" + (arr.length > 0 ? arr.join('') : '暂无商品示例图片') + "</ul>");
        //    },
        //    error: function (XMLHttpRequest, textStatus, errorThrown) {
        //        if (textStatus == "timeout") {
        //            console.log("访问超时:" + errorThrown);
        //        }
        //        console.log("连接错误:" + errorThrown);
        //    }
        //});
    };

    //根据id返回指定菜单项
    this.getMenuItenById = function (id) {
        var obj = {};
        if (this.menuDate.length > 0) {
            $.each(this.menuDate, function (i, v) {
                if (id == v.catId) {
                    obj = v;
                    return false;
                }
            });
        }
        return obj;
    };

    //根据idcatName模糊匹配返回指定菜单项列表
    this.getMenuItenByName = function (keyWords) {
        var obj = [];
        if (this.menuDate.length > 0) {
            $.each(this.menuDate, function (i, v) {
                //只查询最后一级菜单节点
                if (v.subCatIds.length == 0 && v.catName.indexOf(keyWords) >= 0) {
                    obj.push(v);
                }
            });
        }
        return obj;
    };

    //给指定级别菜单区域填充值 level:0-2
    this.assignData = function (level, id) {
        var arr = [], objList = $('.' + this.id + ' .classify-standard-item-list'), that = this, objParent = $('.' + this.id + ' .classify-standard-item');
        var obj = this.getMenuItenById(id);
        if (obj === {}) return false;

        objList.eq(level).html('');
        var values = this.dataList[level] = this.grepMeunWithPid(obj.parentId);
        $.each(values, function (i, val) {
            arr.push('<li><a href="javascript:;" class="' + (val.catId == id ? 'active' : '') + '" catId=' + val.catId + '><span>' +
                val.catName + '</span>'+(val.subCatIds.length>0?'<i class="anticon anticon-right"></i>':'')+'</a></li>');
        });

        objList.eq(level).html(arr.join('')).unbind('click').on('click', 'li a', function () {
            $(this).addClass('active').parent().siblings().find('a').removeClass('active');
            var o = that.getMenuItenById($(this).attr('catId'));
            $('.' + that.id + ' .classify-row-toolbar span').html('您当前选择的是： ' + o.fullPathName).attr('catId', o.catId);
            that.fillData(o.depth, o.catId, o.subCatIds);
        });

        //判断是最后一级菜单
        if (obj.subCatIds.length == 0) {
            objParent.eq(level).nextAll().find('.classify-standard-item-list').html('');
            this.getImgUrl(id);
        }
    };

    //初始化页面
    this.initPage = function () {
        var that = this;
        this.fillData(0, 0);

        $('.' + this.id + ' .form-input-search').on('click', function () {
            var key = $(this).prev().val();
            $('.' + that.id + ' .normal-div').hide();
            var listObj = $('.' + that.id + ' .search-div').show();
            listObj.find('.t-red').html(0);
            listObj.find('.classify-standard-item-list').html('');
            var arr = that.getMenuItenByName(key);
            if (arr.length) {
                listObj.find('.t-red').html(arr.length);
                var listArr = [];
                $.each(arr, function (i, val) {
                    listArr.push('<li><a href="javascript:;" catId=' + val.catId + '><span>' + val.fullPathName + '</span></a></li>');
                });
                listObj.find('.classify-standard-item-list').html(listArr.join('')).unbind('click').on('click', 'li a', function () {
                    var o = that.getMenuItenById($(this).attr('catId'));
                    $('.' + that.id + ' .classify-row-toolbar span').html('您当前选择的是： ' + o.fullPathName).attr('catId', o.catId);
                    if(o.path != null && o.path != '' ){
                        var arrPath = o.path.split(',');
                        if ( arrPath.length ){
                            $.each(arrPath,function(i,val){
                                that.assignData(i, val);
                            });
                        }
                    }
                    that.assignData(o.depth-1, o.catId);

                    //隐藏搜索栏目
                    $('.' + that.id + ' .normal-div').show();
                    $('.' + that.id + ' .search-div').hide();
                });
            } else {
                listObj.find('.classify-standard-item-list').html('<p class="t-center">没有搜索到相关类目！</p>');
            }
        });

        //绑定自动匹配筛选事件
        $('.' + this.id + ' .ant-input-search').keyup(function(event){
            var keywords = $(this).val(),level = $(this).attr('objId'),arr=[];
            if(level<0) return false;

            $.each(that.dataList[level],function(i,val){
                if( keywords != '' ){
                    if(val.pinyin.indexOf(keywords) >=0 || val.spinyin.indexOf(keywords) >= 0 || val.catName.indexOf(keywords) >=0 ){
                        //console.log(keywords+' '+val.pinyin+' '+val.spinyin);
                        arr.push('<li><a href="javascript:;" class="" catId=' + val.catId + '><span>' +
                            val.catName + '</span>'+(val.subCatIds.length>0?'<i class="anticon anticon-right"></i>':'')+'</a></li>');
                    }
                }else{
                    arr.push('<li><a href="javascript:;" class="" catId=' + val.catId + '><span>' +
                        val.catName + '</span>'+(val.subCatIds.length>0?'<i class="anticon anticon-right"></i>':'')+'</a></li>');
                }
            });

            $(this).closest('.ant-input-search-wrapper').next('ul').html(arr.join(''));
        });

        //隐藏搜索栏目
        $('.' + this.id + ' .close-search').on('click', function () {
            $('.' + that.id + ' .normal-div').show();
            $('.' + that.id + ' .search-div').hide();
        });

        //绑定下一步事件
        $('.ant-btn-primary').on('click',function(){
            var obj = $('.' + that.id + ' .classify-row-toolbar span');
            alert(obj.html()+' ID: '+obj.attr('catId'));
        });
    };
}