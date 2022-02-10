function setSeverList(obj) {
    $('#sever_list').val('');
    $('#sever_list option').show();
    if ($("#a_list").val()) {
        $('#sever_list option[a_rel!=' + $("#a_list").val() + ']').hide();
        var objs = $('#sever_list option[a_rel=' + $("#a_list").val() + ']');
        $('#w_list option').hide();
        $.each(objs, function (n, v) {
            var w_v = $(v).attr('w_rel');
            $('#w_list option[value=' + w_v + ']').show();
        });
    } else {
        $('#w_list option').show();
    }
    if ($("#w_list").val()) {
        $('#sever_list option[w_rel!=' + $("#w_list").val() + ']').hide();
    }
}
function setProductAttr(obj) {
    var j_obj = $(obj);
    var img = j_obj.children("option:selected").attr('rel_img');
    var img_id = j_obj.children("option:selected").attr('rel_id');
    $("#product_img_" + img_id).attr('data-src', img);
    //$("#product_img_" + img_id).lazyload({effect: "fadeIn"});
}
function showProductContent(obj_id) {
    $("#page_product_des").find('.show_page_content').removeClass('show_page_content');
    $("#" + obj_id).parent().addClass('show_page_content');
}
function minQuantity(min, id) {
    var id_str = id ? "_" + id : '';
    var c_num = $("#c_num" + id_str).val();
    var n_value = $("#p_num" + id_str).val();
    if (n_value <= min) {
        return false;
    }
    var nn_val = Number(n_value) - Number(c_num);
    $("#p_num" + id_str).val(nn_val);
    getChangeData(id);
}
function setNumberValue(number, id) {
    var id_str = id ? "_" + id : '';
    $("#p_num" + id_str).val(number);
    getChangeData(id);
}
function checkQuantityInput(min, max, id) {
    var id_str = id ? "_" + id : '';
    var n_value = Number($("#p_num" + id_str).val());
    if (n_value <= min) {
        n_value = min;
    }
    if (n_value >= max) {
        n_value = min;
    }
    $("#p_num" + id_str).val(n_value);
    getChangeData(id);
}
function addQuantity(max, id) {
    var id_str = id ? "_" + id : '';
    var c_num = Number($("#c_num" + id_str).val());
    var n_value = Number($("#p_num" + id_str).val());
    if (n_value >= max) {
        alert("Can not max than " + n_value);
        return false;
    }
    var nn_val = Number(n_value) + Number(c_num);
    $("#p_num" + id_str).val(nn_val);
    getChangeData(id);
}
//function setPorduct(obj, server_id) {
//    if (!server_id) {
//        var jobj = $(obj);
//        server_id = jobj.val();
//    }
//    if (server_id) {
//        var get_url = "/getSeverData";
//        $("#product_content").html('<div class="gold-box-quantity"><div class="product_img_small"><div class="menu_loading"></div></div></div>');
//        $.get(get_url, {sid: server_id}, function (data) {
//            $("#product_content").html(data);
//        });
//    }
//}
function setPorduct(obj) {
    var url = "/getGoldPro";
    var server_id = $(obj).val();
    var p_num = $("#p_num").val();
    var params = {server_id: server_id, p_num: p_num};
    $("#save_span").html("");
    $("#price_span").html("Loading...");
    $("#amount").html("<span class=\'p_loading\'></span>");
    $("#avg_amount").html("<span class=\'p_loading\'></span>");
    $.post(url, params, function (data) {
        $("#price_span").html(data.price);
        $("#save_span").html(data.save);
        $("#amount").html(data.amount);
        $("#avg_amount").html(data.avg_amount);
    }, "json");
}
function setIndexProduct(obj) {
    var jobj = $(obj);
    var server_id = jobj.attr('type');
    jobj.parent().parent().find('.active').removeClass('active');
    jobj.addClass('active');
    setPorduct('', server_id);
}

function getChangeData(id) {
    if (id) {
        var url = "/getBasePro";
        var p_num = $("#p_num_" + id).val();
        var params = {p_id: id, p_num: p_num};
        $("#price_" + id).html("Loading...");
        $.post(url, params, function (data) {
            $("#price_" + id).html(data);
        });
    } else {
        var url = "/getGoldPro";
        var server_id = $("#server_id").val();
        var p_num = $("#p_num").val();
        var params = {server_id: server_id, p_num: p_num};
        $("#save_span").html("");
        $("#price_span").html("Loading...");
        $("#amount").html("<span class=\'p_loading\'></span>");
        $("#avg_amount").html("<span class=\'p_loading\'></span>");
        $.post(url, params, function (data) {
            $("#price_span").html(data.price);
            $("#save_span").html(data.save);
            $("#amount").html(data.amount);
            $("#avg_amount").html(data.avg_amount);
        }, "json");
    }
}
function showHideText(obj) {
    var c_id = $(obj).attr('rel_id');
    var type = $(obj).attr('rel_type');
    if (type == 'hide') {
        $(obj).attr('rel_type', 'show');
        $(obj).html("<span>Show Less -</span>");
        $("#" + c_id).css('max-height', '100%');
        $(obj).css('position', 'relative');
        $(obj).css('padding-top', '20px');
    } else {
        $(obj).attr('rel_type', 'hide');
        $(obj).html("<span>Show More +</span>");
        $("#" + c_id).css('max-height', '180px');
        $(obj).css('padding-top', '80px');
        $(obj).css('position', 'absolute');
    }

}
function loadingProduct(obj) {
    var type = $(obj).attr('data-type');
    var start = $(obj).attr('data-start');
    var num = $(obj).attr('data-num');
    var hold = $(obj).attr('data-hold');
    var d_params = $(obj).attr('data-params');
    if (d_params) {
        var params = {type: type, start: start, num: num, o_params: d_params};
    } else {
        var params = {type: type, start: start, num: num};
    }
    var url = "/getMoreProduct";
    $(obj).html('Loading...');
    $.post(url, params, function (data) {
        var start_now = Number(start) + Number(num);
        if (data && data != 0) {
            $(obj).attr('data-start', start_now);
            $("#" + hold).append(data);
            $(obj).html('Loading More +');
        } else {
            $(obj).remove();
        }
//        $("img.lazyload").lazyload({
//            effect: "fadeIn"
//        });
    });
}
function deleteCart(key, price) {
    var url = "/order/Remove";
    $.post(url, {key: key, type: 'ajax'}, function (data) {
        if (data == 1) {
            $("#c_" + key).remove();
            $("#m_c_" + key).remove();
            var n_price = $("#top_cart_total_price").html();
            var n_number = $("#cart_number").html();
            n_number = Number(n_number) - 1;
            n_price = Number(n_price) - Number(price);
            n_price = n_price.toFixed(2);
            $("#top_cart_total_price").html(n_price);
            $("#m_top_cart_total_price").html(n_price);
            $("#cart_number").html(n_number);
            $("#cart_number_m").html(n_number);
        } else {
            altert("Delete Faild");
        }
    });
}
function showLan() {
    $('#user_form').hide();
    $('#seach_form').hide();
    $('#shop_cart').hide();
    $('#shop_currency').hide();
    $('#web_lan').toggle();
}
function showMobileLan() {
    $('#web_mobile_lan').toggle();
}
function showCurrency() {
    $('#user_form').hide();
    $('#seach_form').hide();
    $('#shop_cart').hide();
    $('#web_lan').hide();
    $('#shop_currency').toggle();
}
function showShoppingcart() {
    var cart_num = $("#cart_number").html();
    cart_num = Number(cart_num);
    if (cart_num >= 5) {
        var top_price = $("#cart_total_price");
        var top_action = $("#action_cart");
        $("#shop_cart").prepend(top_price);
        $("#shop_cart").prepend(top_action);
    }
    $('#user_form').hide();
    $('#seach_form').hide();
    $('#shop_currency').hide();
    $('#web_lan').hide();
    $('#shop_cart').toggle();
}
function showUser() {
    $('#shop_cart').hide();
    $('#seach_form').hide();
    $('#shop_currency').hide();
    $('#web_lan').hide();
    $('#user_form').toggle();
}
function showSearch() {
    $('#shop_cart').hide();
    $('#user_form').hide();
    $('#shop_currency').hide();
    $('#web_lan').hide();
    $('#seach_form').toggle();
}
function showTopMenu(obj) {
    if ($(obj).attr('rel_val') == 'hide') {
        $("#pc_top_menu").show();
        $("#top_games").attr('rel_val', 'show');
        $("#top_games").addClass('top_games_down');
    } else {
        $("#pc_top_menu").hide();
        $("#top_games").attr('rel_val', 'hide');
        $("#top_games").removeClass('top_games_down');
    }
}
function setMenuSearch(Key, type) {
    var type = type ? type : 'ajax';
    var url = "/getTopMenu";
    if (type == 'ajax') {
        $("#pc_main_menus").html("<div class='menu_loading'></div>");
        $.post(url, {key: Key, type: type}, function (data) {
            $("#pc_main_menus").html(data);
        });
    } else {
        $("#mobile-games-list").html("<div class='menu_loading'></div>");
        $.post(url, {key: Key, type: type}, function (data) {
            $("#mobile-games-list").html(data);
        });
    }
}
function setMenuActive(obj) {
    var jObj = $(obj);
    jObj.parent().find('.active').removeClass('active');
    jObj.addClass('active');
}
function setCurrecy(obj) {
    var v_obj = $(obj).attr('code_value');
    window.location.href = "/site/setPayType?type=" + v_obj;
}
function showCmenu(obj) {
    $(".c_menu").find("ul ul").hide();
    $(obj).find("ul").show();
}
function setProduct(obj, game) {
    var form_obj = $(obj).parent().parent();
    if (!game) {
        var server_obj = form_obj.find('[name=server]');
        var server_id = server_obj.val();
    } else {
        var server_id = '';
    }
    var game_obj = form_obj.find('[name=game]');
    var game_id = game_obj.val();
    var num = form_obj.find('[name=p_num]').val();
    var url = "/getChangeProduct";
    form_obj.parent().parent().find('.price_num').addClass('p_loading');
    $.get(url, {'server_id': server_id, 'game_id': game_id, 'num': num}, function (data) {
        form_obj.parent().parent().html(data);
    });
}
function ShowMenu(obj) {
    var jObj = $(obj);
    var pobj = jObj.parent().parent();
    var rel = jObj.attr('rel');
    if (rel == 'All') {
        pobj.find("li.c_menu").slideDown();
    } else {
        pobj.find('li.c_menu').fadeOut();
        pobj.find('li.' + rel).fadeIn();
    }
}
function hideCart() {
    $("#pc_cart_div").removeClass('act_active');
}
function showCart() {
    var cart_num = $("#cart_number").html();
    cart_num = Number(cart_num);
    if (cart_num >= 5) {
        var b_action = $("#buy_action_button");
        $("#pc_cart").prepend(b_action);
    }
    $("#pc_cart_div").addClass('act_active');
}
function buyProduct(cobj) {
    var obj = $(cobj);
    var formData = obj.parents("form").serialize();
    var action = obj.attr('rel');
    var url = obj.parents("form").attr('action');
    $("#pc_cart_div").removeClass('act_active').addClass('act_active');
    var c_number = $("#cart_number").html();
    c_number = Number(c_number);
    if (c_number >= 9) {
        alert('Max add 9 items!');
        return false;
    }
    $.post(url, formData, function (data) {
        if (action == 'buy') {
            window.location.href = "/order/cart";
        } else {
            var m_value = c_number + 1;
            $("#cart_number").html(m_value);
            $("#cart_number_m").html(m_value);
            $("#cart_empty").hide();
            $("#m_cart_empty").hide();
            $("#pc_cart").prepend(data.str);
            $("#m_cart").prepend(data.str);
            var n_price = $('#top_cart_total_price').html();
            var t_price = Number(n_price) + Number(data.price);
            t_price = t_price.toFixed(2);
            $('#top_cart_total_price').html(t_price);
            $('#m_top_cart_total_price').html(t_price);
            if (c_number >= 5) {
                var b_action = $("#buy_action_button");
                $("#pc_cart").prepend(b_action);
            }
        }
    }, 'json');
}

function buyCustomProduct(cobj) {
    var top_ele = $('#custom');
    top_ele.find('select').each(function (i, n) {
        var s_val = $(n).val();
        if (s_val == '') {
            $('.haid').css('display', 'block');
            $(n).focus();
            return false;
        } else {
            $('.haid').css('display', 'none');
        }
    });
    buyProduct(cobj);
}
function changeType() {
    $("#base_contents").html('<div class="menu_loading"></div>');
    var form_obj = $("search_form");
    var url = form_obj.attr('action');
    var params = $("#search_form").serialize();
    $.get(url, params, function (data) {
        $("#base_contents").html(data);
//        $("img.lazyload").lazyload({
//            effect: "fadeIn"
//        });
    });
    $('.searchbox').typeahead('destroy');
    //$("#search_form").submit();
}
function setLiProduct(obj) {
    var jobj = $(obj);
    var server_id = jobj.attr('rel');
    $("#sever_list").val(server_id);
    jobj.parent().find('.active').removeClass('active');
    jobj.addClass('active');
    changeType();
}
function setSubCategory(value, type) {
    if (value === 'all') {
        $("#search_filter li.top").slideDown();
    } else {
        $("#search_filter li.top").fadeOut();
        $("#search_filter li." + type).fadeIn();
    }
}
function setSearchActive(obj) {
    var value = $(obj).attr('rel');
    var key = $(obj).attr('key');
    var type = $(obj).attr('type');
    $(obj).parent().find('.selected').removeClass('selected');
    $(obj).addClass('selected');
    $("#key_" + key).val(value);
    changeType();
    if (type !== 0) {
        setSubCategory(value, type);
    }
}
function setSearchActiveNew(obj) {
    var value = $(obj).attr('rel');
    var key = $(obj).attr('key');
    $("#search_filter").find('.product_search_box').hide();
    $("#search_filter").find("div[rell='Type']").show();
    $("#search_filter").find("div[rell='" + value + "']").show();
    $("#search_filter").find("div[rell='" + key + "']").show();
    $(obj).parent().find('.selected').removeClass('selected');
    $(obj).addClass('selected');
    $("#key_sort").val(value);
    changeType();
}
function setSearchActiveIndex(obj) {
    var value = $(obj).attr('rel');
    var key = $(obj).attr('key');
    var zone = $("#in_zone").find('.active').attr('rel');
    $("#search_filter").find('.product_search_box').hide();
    $("#search_filter").find("div[rell='Type']").show();
    $("#search_filter").find("div[rell='" + value + "']").show();
    $("#search_filter").find("div[rell='" + key + "']").show();
    $(obj).parent().find('.selected').removeClass('selected');
    $(obj).addClass('selected');
    $("#key_sort").val(value);
    var url = '/getIndexDatas';
    var sort = value;
    var datas = {'zone': zone, 'sort': sort};
    $("#index-hot-product").html('<div class="menu_loading"></div>');
    $.get(url, datas, function (data) {
        if (data) {
            $('#index-hot-product').html(data);
        }
//            $("img.lazyload").lazyload({
//                effect: "fadeIn"
//            });
    });
    //changeType();
}
function setNum(obj) {
    var par_obj = $(obj).parent().parent().parent().parent().parent();
    par_obj.find('input[name=goods_num]').val($(obj).val());
    var un_price = $(obj).attr('rel-price');
    var price = $(obj).val() * un_price * $(obj).find("option:selected").attr('rel');
    par_obj.find('.rel_price').html(price.toFixed(2));
}
function changeLevel(obj) {
    var jobj = $(obj);
    var sVal = Number($("#start_level").val());
    var eVal = Number($("#end_level").val());
    if (eVal <= sVal) {
        alert("Start level is not greater than end level!");
        jobj.focus();
    } else {
        getAjaxVal(sVal, eVal);
    }
}
function getAjaxVal(slevel, elevel) {
    var game_id = $("#game_id").val();
    var server_id = $("#sever_list").val();
    var sub_id = $("#sub_id").val();
    var url = "/getPowerLevelPrice";
    var slevel = slevel ? slevel : Number($("#start_level").val());
    var elevel = elevel ? elevel : Number($("#end_level").val());
    var params = {s_level: slevel, e_level: elevel, gid: game_id, server_id: server_id, sub_id: sub_id};
    $("#show_hour").html("Loading...");
    $("#show_price").html("Loading...");
    $.post(url, params, function (data) {
        $("#show_hour").html(data.hour);
        $("#show_price").html(data.price);
    }, "json");
}
function distinctList(inputArray) {
    var i;
    var length = inputArray.length;
    var outputArray = [];
    var temp = {};
    for (i = 0; i < length; i++) {
        temp[inputArray[i]] = 0;
    }
    for (i in temp) {
        outputArray.push(i);
    }
    return outputArray;
}
if ($('[name="payment"]').length > 0) {
    $('[name="payment"]').change(function () {
        var elem = $(this);
        $("#payment_mothed").find('.active').removeClass('active');
        if (elem.parent().attr('class') != 'active') {
            elem.parent().addClass('active');
            checkPayment();
        }
    });
}
function checkPayment() {
    var method = $("input[name='payment']:checked").val();
    var coupon = $("#coupon").val();
    var currency = $("#currency_tag").val();
    var params = {method: method, coupon: coupon, currency: currency}
    var url = "/order/setPayment";
    $("#payment_price_data").html('<div class="menu_loading"></div>');
    $.post(url, params, function (data) {
        if (data) {
            $("#payment_price_data").html(data);
            if ($("#final-price-air").length > 0) {
                var do_price = $("#final-price").attr('rel');
                $("#final-price-air").html(do_price);
            }
            if ($("#final-currency-air").length > 0) {
                var do_currency = $("#tag_currency").html();
                $("#final-currency-air").html(do_currency);
            }
        }
    });
}
function showProductPro(key) {
    $("#pro_" + key).toggle();
}
function setCurrecyAjax(obj) {
    var currency = $(obj).val();
    var url = "/site/setPayType";
    $.get(url, {currency: currency}, function (data) {
        if (data) {
            checkPayment();
        }
    });
}
function showPassWord(obj) {
    if ($(obj).is(':checked')) {
        var email = $("#mail").val();
        var url = "/order/checkEmail";
        $.get(url, {email: email}, function (data) {
            if (data == 1) {
                $("#create-account").show();
                $("#register_say").html("<font color=red>Please input your password and confirm the password!</font>");
            } else {
                $(obj).attr("checked", false);
                $("#register_say").html("<font color=red>" + email + " was already registered!</font>");
            }
        });
    } else {
        $("#create-account").hide();
    }
}
function handlePreloader() {
    if ($('.preloader').length) {
        $('.preloader').fadeIn(500);
    }
}
function checkForm(s_type) {
    var check = true;
    $.each($(".flowfVerify"), function (i, n) {
        var str = $(n).val();
        var verify = $(n).attr("rel-verify");
        switch (verify) {
            case 'required':
                if (str == "") {
                    $(n).focus();
                    check = false;
                    return false;
                }
                break;
        }
        if ($("#is_account").attr("checked") == 'checked') {
            if ($("#passwd1").val() == '') {
                $("#error").html("<font color='red'> Password must be enter.</font>");
                check = false;
                $("#passwd1").focus();
                return false;
            }
            if ($("#passwd2").val() == '') {
                $("#error").html("<font color='red'> Confirm Password must be enter.</font>");
                check = false;
                $("#passwd2").focus();
                return false;
            }
            if ($("#passwd2").val() != $("#passwd1").val()) {
                $("#error").html("<font color='red'>The password and confirmation password do not match .</font>");
                check = false;
                $("#passwd1").focus();
                return false;
            }
        }
    });
    if (s_type == 'air' && check) {
        return true;
    }
    var p_type = $("input[name='payment']:checked").val();
    if (p_type == 'paypal' && check) {
        handlePreloader();
        checkPPPay();
        return false;
    } else if (p_type == 'Airwallex') {
        return false;
    } else {
        //$("#order-check-buttom").attr('value', 'Loading..');
        return check;
    }
}
function checkPPPay(type) {
    var params = $("#cart_from").serialize();
    var post_url = '/order/addCookieOrder?ajax=1';
    $.post(post_url, params, function (payment_id) {
        if (payment_id && type !== 'Airwallex') {
            getPPPayLink(type);
        }
    });
}
function getPPPayLink(type) {
    type = type ? type : 'paypal';
    var payment_id = $("#do_payment_id").val();
    var do_url = "/order/payment";
    var air_status = $("#Airwallex_stauts").val();
    $.get(do_url, {payment: type, payment_id: payment_id, 'air_status': air_status}, function (rurl) {
        if (type != 'Airwallex') {
            window.location.href = rurl;
        }
    });
}
//check coupon
function checkCoupon() {
    var url = "/order/checkCoupon";
    var n_val = $("#coupon_discount").html();
    var n_final = $("#final-price").html();
    if ($("#coupon").val() != "") {
        checkPayment();
    } else {
        alert("Coupon Code Can Not Be Null!!");
    }
}
function showHidePayment() {
    if ($("#other_payment").attr('rel') == 'hide') {
        $("#more_payment_tag").addClass('more_payment_active');
        $("#other_payment_content").show();
        $("#other_payment").attr('rel', 'show');
    } else {
        $("#more_payment_tag").removeClass('more_payment_active');
        $("#other_payment_content").hide();
        $("#other_payment").attr('rel', 'hide');
    }
}
function setCurrencyServer(obj) {
    var server = $(obj).attr('rel');
    $(obj).parent().find('.active').removeClass('active');
    $(obj).addClass('active');
    $("#server").val(server);
    getCurrency();
}
function setCurrency(obj) {
    var trade_id = $(obj).attr('rel');
    $(obj).parent().find('.active').removeClass('active');
    $(obj).addClass('active');
    $("#trade_id").val(trade_id);
    getCurrency();
}
function getCurrency() {
    var trade_id = $("#trade_id").val();
    var server = $("#server").val();
    var params = {trade_id: trade_id, server: server};
    var url = "/site/getCurrencyWay";
    $("#exchange_mothed").html('<div class="menu_loading"></div>');
    $.post(url, params, function (data) {
        if (data) {
            $("#exchange_mothed").html(data);
        }
    });
}
function checkFormSubmit() {
    var select_min = $("#select_min").val();
    var type = $("#poll_type").val();
    var vselectLen = $("input[name='PollVote[choice_id][]']:checked").length;
    if (type == 2 && select_min) {
        if (vselectLen < select_min) {
            alert('Less Select ' + select_min + '！');
            return false;
        }
    }
    $('#poll-form').submit();
}
function showSearchDetail(obj) {
    $("#" + obj).toggle();
}
function ShowMobileSub(obj) {
    var jobj = $(obj);
    var status = jobj.attr('rel');
    if (status == 'hide') {
        jobj.attr('rel', 'show');
        jobj.html("-");
        jobj.parent().find('ul').show();
    } else {
        jobj.attr('rel', 'hide');
        jobj.html("+");
        jobj.parent().find('ul').hide();
    }
}
function ShowMobileTopSub(obj) {
    var jobj = $(obj).next();
    var status = jobj.attr('rel');
    if (status == 'hide') {
        jobj.attr('rel', 'show');
        jobj.html("-");
        jobj.parent().find('ul').show();
    } else {
        jobj.attr('rel', 'hide');
        jobj.html("+");
        jobj.parent().find('ul').hide();
    }
}
//jQuery.bt.options.closeWhenOthersOpen = true;
function showItemsDetail(obj) {
    var pid = $(obj).attr('rel_id');
    var type = $(obj).attr('rel_type');
    var rel_with = $(obj).attr('rel_with');
    rel_with = rel_with ? rel_with : 260;
    var geturl = '/showItemDetail?type=' + type + '&p_id=' + pid;
    $(obj).bt({
        positions: ['right', 'top'],
        width: rel_with,
        height: 280,
        cssStyles: {color: '#fff'},
        cornerRadius: 5,
        strokeWidth: 0,
        shadow: true,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 5,
        overlap: 0,
        shadowColor: 'rgba(0,0,0,.49)',
        shadowOverlap: false,
        ajaxPath: geturl,
        fill: '#243238',
        strokeStyle: '#333',
        spikeLength: 5,
        spikeGirth: 10,
        padding: 20
    }).btOn();
}
function showFastDetail(obj, postion) {
    $(obj).bt({
        positions: ['right', 'top'],
        width: 260,
        height: 280,
        contentSelector: "$(this).next().html()",
        cssStyles: {color: '#A38D6D'},
        cornerRadius: 5,
        fill: '#243238',
        strokeStyle: '#333',
        spikeLength: 5,
        spikeGirth: 10,
        padding: 0,
        strokeWidth: 2
    }).btOn();
}
function getSaveDataPrice() {
    var url = "/getSaveDataPrice";
    var params = $("#save_data_form").serialize();
    $('#show_price').html('Loading...');
    $.post(url, params, function (data) {
        $('#show_price').html(data);
    });
}
function setChildSaveData(obj) {
    var checkv = $(obj).is(":checked");
    if (checkv) {
        $(obj).attr('checked', true);
        $(obj).addClass('active');
    } else {
        $(obj).attr('checked', false);
        $(obj).removeClass('active');
    }
    getSaveDataPrice();
}
if ($("#start_sp_time").length > 0) {
    var st_time = $("#start_sp_time").val();
    $('.countdown').downCount({
        date: st_time, //'12/27/2018 00:00:00',
        offset: +10
    }, function () {});
}

if (window.location.href.indexOf('#') >= 0) {
    if ($(window.location.hash).length > 0) {
        $('html,body').animate({
            scrollTop: ($(window.location.hash).offset().top - 140) + "px"
        }, 300);
    }
}
$(document).ready(function () {
    if ($(".mr_frbox").length > 0) {
        $(".mr_frbox").slide({
            titCell: "",
            mainCell: ".mr_frUl ul",
            autoPage: true,
            effect: "leftLoop",
            autoPlay: false,
            vis: 4
        });
        $(".mr_zhe_hover").css("top", $('.mr_zhe').eq(0).height());
        $("li").mouseout(function (e) {
            if ((e.pageX < $(this).offset().left || e.pageX > ($(this).offset().left + $(this).width())) || (e.pageY < $(this).offset().top || e.pageY > ($(this).offset().top + $(this).height()))) {
                $(this).find('.mr_zhe_i').show();
                $(this).find('.mr_zhe_hover').hide().stop().animate({top: '190px'}, {queue: false, duration: 190});
                return false;
            }

        });
        $('.mr_zhe').mouseover(function (event) {
            $(this).find('.mr_zhe_i').hide();
            $(this).find('.mr_zhe_hover').show().stop().animate({top: '90px'}, {queue: false, duration: 190});
            return false;
        });
    }

    if ($("#top_go").length > 0) {
        $(function () {
            $("#goPageTop").on("click", function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 1000);
                return false;
            });
        });
    }
    $(window).scroll(function () {
        $("#pc_top_menu").hide();
        $("#top_games").attr('rel', 'hide');
        $("#top_games").removeClass('top_games_down');
        if ($(window).scrollTop() >= 100) {
            $('.actGotop').fadeIn(300);
        } else {
            $('.actGotop').fadeOut(300);
        }
    });
});
if ($("#menu-1").length > 0) {
    var offsideMenu1 = offside('#menu-1', {
        slidingElementsSelector: '#container',
        debug: true,
        buttonsSelector: '.menu-btn-1, .menu-btn-1--close',
        slidingSide: 'left',
        beforeOpen: function () {},
        beforeClose: function () {},
    });
}
if ($("#menu-2").length > 0) {
    var offsideMenu1 = offside('#menu-2', {
        slidingElementsSelector: '#container',
        debug: true,
        buttonsSelector: '.menu-btn-2, .menu-btn-2--close',
        slidingSide: 'right',
        beforeOpen: function () {},
        beforeClose: function () {},
    });
}
if ($("#menu-3").length > 0) {
    var offsideMenu1 = offside('#menu-3', {
        slidingElementsSelector: '#container',
        debug: true,
        buttonsSelector: '.menu-btn-3, .menu-btn-3--close',
        slidingSide: 'right',
        beforeOpen: function () {},
        beforeClose: function () {},
    });
}
if ($("#menu-4").length > 0) {
    var offsideMenu1 = offside('#menu-4', {
        slidingElementsSelector: '#container',
        debug: true,
        buttonsSelector: '.menu-btn-4, .menu-btn-4--close',
        slidingSide: 'right',
        beforeOpen: function () {},
        beforeClose: function () {},
    });
}
if ($("#menu-5").length > 0) {
    var offsideMenu1 = offside('#menu-5', {
        slidingElementsSelector: '#container',
        debug: true,
        buttonsSelector: '.menu-btn-5, .menu-btn-5--close',
        slidingSide: 'right',
        beforeOpen: function () {},
        beforeClose: function () {},
    });
}
var overlay = document.querySelector('.site-overlay').addEventListener('click', window.offside.factory.closeOpenOffside);
if (window.location.href.indexOf('#') >= 0) {
    if ($(window.location.hash).length > 0) {
        $('html,body').animate({
            scrollTop: ($(window.location.hash).offset().top - 140) + "px"
        }, 300);
    }
}
$(window).ready(function () {
    $("#tag_area").find('a').click(function () {
        if ($($(this).attr("href")).length > 0) {
            var height = $($(this).attr("href")).offset().top - 160;
        } else {
            var ahref = $(this).attr("href");
            var nhref = ahref.replace('#', '');
            var height = $("a[name='" + nhref + "']").offset().top - 160;
        }
        if (height > 0) {
            $("html, body").animate({
                scrollTop: height + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
        }
        return false;
    });
    $(".tag_links").find('a').click(function () {
        if ($($(this).attr("href")).length > 0) {
            var height = $($(this).attr("href")).offset().top - 160;
        } else {
            var ahref = $(this).attr("href");
            var nhref = ahref.replace('#', '');
            var height = $("a[name='" + nhref + "']").offset().top - 160;
        }
        if (height > 0) {
            $("html, body").animate({
                scrollTop: height + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
        }
        return false;
    });
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 95) {
            $('.actGotop').fadeIn(300);
            $('#pageTop').addClass('topfixed');
        } else {
            $('.actGotop').fadeOut(300);
            $('#pageTop').removeClass('topfixed');
        }
    });
});
var offsideMenu1 = offside('#menu-1', {
    slidingElementsSelector: '#container',
    debug: true,
    buttonsSelector: '.menu-btn-1, .menu-btn-1--close',
    slidingSide: 'left',
    beforeOpen: function () {},
    beforeClose: function () {},
});
var offsideMenu1 = offside('#menu-3', {
    slidingElementsSelector: '#container',
    debug: true,
    buttonsSelector: '.menu-btn-3, .menu-btn-3--close',
    slidingSide: 'right',
    beforeOpen: function () {},
    beforeClose: function () {},
});
var offsideMenu1 = offside('#menu-4', {
    slidingElementsSelector: '#container',
    debug: true,
    buttonsSelector: '.menu-btn-4, .menu-btn-4--close',
    slidingSide: 'right',
    beforeOpen: function () {},
    beforeClose: function () {},
});
var offsideMenu1 = offside('#menu-5', {
    slidingElementsSelector: '#container',
    debug: true,
    buttonsSelector: '.menu-btn-5, .menu-btn-5--close',
    slidingSide: 'right',
    beforeOpen: function () {},
    beforeClose: function () {},
});
var overlay = document.querySelector('.site-overlay').addEventListener('click', window.offside.factory.closeOpenOffside);

$(document).ready(function () {
    if ($("#top_go").length > 0) {
        $(function () {
            $("#goPageTop").on("click", function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 1000);
                return false;
            });
        });
    }
    if ($("#imageGallery").length > 0) {
        $('#imageGallery').lightSlider({
            gallery: true,
            item: 1,
            loop: true,
            thumbItem: 5,
            slideMargin: 0,
            enableDrag: false,
            currentPagerPosition: 'left',
            enableTouch: true,
            enableDrag:true,
                    freeMove: true,
            swipeThreshold: 40
        });
    }
    if ($("#sub_menus").length > 0) {
        $('#sub_menus').lightSlider({
            item: 5,
            loop: false,
            slideMove: 2,
            easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
            speed: 600,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        item: 3,
                        slideMove: 1,
                        slideMargin: 6,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        item: 2,
                        slideMove: 1
                    }
                }
            ]
        });
    }
});
if (window.location.href.indexOf('#') >= 0) {
    if ($(window.location.hash).length > 0) {
        $('html,body').animate({
            scrollTop: ($(window.location.hash).offset().top - 140) + "px"
        }, 300);
    }
}
$(window).ready(function () {
//    $("img.lazyload").lazyload({
//        effect: "fadeIn"
//    });
    $('.bt_tips').bt({
        trigger: ['focus', 'blur'],
        positions: ['right', 'top'],
        width: 280,
        cssStyles: {color: '#fff'},
        cornerRadius: 5,
        strokeWidth: 0,
        shadow: true,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 5,
        overlap: 0,
        shadowColor: 'rgba(0,0,0,.49)',
        shadowOverlap: false,
        fill: '#243238',
        strokeStyle: '#333',
        spikeLength: 5,
        spikeGirth: 10,
        padding: 20
    });
});
function getInCustDatas(obj) {
    var sid = $(obj).attr('rel');
    //console.log(sid); 
    $(obj).parent().parent().find('.active').removeClass('active');
    $(obj).addClass('active');
    //alert(type);
    getAjax(sid);
}
function getAjax(sid) {
    var url = '/cool/fastutcoins.com/getInCusData';
    var datas = {'sid': sid};
    $.post(url, datas, function (data) {
        if (data) {
            $('#custdatas').html(data);
        } else {
            alert('111');
        }
    });
}
// Start Large Servers Select
function showHideText(obj) {
    var c_id = $(obj).attr('rel_id');
    var type = $(obj).attr('rel_type');
    if (type == 'hide') {
        $(obj).attr('rel_type', 'show');
        $(obj).html("<span>Show Less -</span>");
        $("#" + c_id).css('max-height', '100%');
        $(obj).css('position', 'relative');
        $(obj).css('padding-top', '20px');
    } else {
        $(obj).attr('rel_type', 'hide');
        $(obj).html("<span>Show More +</span>");
        $("#" + c_id).css('max-height', '240px');
        $(obj).css('padding-top', '20px');
        $(obj).css('position', 'absolute');
    }
}
function setLeftServers(obj) {
    $(obj).parent().find('.active').removeClass('active');
    $(obj).addClass('active');
    var c_boj = $(obj).attr('rel');
    var left_str = $(obj).attr('l_str');
    var game_id = $("#game_id").val();
    var get_url = "/getSeverData";
    $("#server_list_sort").html('<div class="servers_loading"></div>');
    $.post(get_url, {left_str: left_str, pid: game_id}, function (data) {
        $("#server_list_sort").html(data);
    });
}
function autoHideServer() {
    $("#sever_list").css('max-height', '240px');
    $("#servers_sh").html("<span>Show More +</span>");
    $("#servers_sh").css('position', 'absolute');
    $("#servers_sh").css('padding-top', '20px');
    $("#servers_sh").attr('rel_type', 'hide');
}
function autoShowServer() {
    $("#sever_list").css('max-height', '100%');
    $("#servers_sh").attr('rel_type', 'show');
    $("#servers_sh").html("<span>Show Less -</span>");
    $("#servers_sh").css('position', 'relative');
    $("#servers_sh").css('padding-top', '20px');
}

function setWordSort(obj) {
    autoShowServer();
    $(obj).parent().find('.active').removeClass('active');
    $(obj).addClass('active');
    var select_world = $(obj).attr('d_value');
    if (select_world) {
        var objs = $('#sever_list').find('li');
        $.each(objs, function (n, v) {
            var w_v = $(v).attr('w_rel');
            if (w_v == select_world) {
                $(v).show();
            } else {
                $(v).hide();
            }
        });
    } else {
        $('#sever_list li').show();
    }
}
function setProductPlace() {
    var height = $("#product_hode").offset().top - 160;
    var n_height = $(window).scrollTop();
    if(n_height >= 580){
         $("html, body").animate({
            scrollTop: height + "px"
        }, {
            duration: 500,
            easing: "swing"
        });
    }
}
function setServerData(obj) {
    autoHideServer();
    setProductPlace();
    $(obj).parent().find('.active').removeClass('active');
    $(obj).addClass('active');
    var server_name = $(obj).attr('title');
    var server_id = $(obj).attr('server_id');
    $("#server_id").val(server_id);
    $("#procuct_name").html(server_name);
    getChangeData();
}
// Start Large End