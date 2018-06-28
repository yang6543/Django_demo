function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var cpajax = {
    'get': function (args) {
        args['method'] = 'get';
        this.ajax(args);
    },
    'post': function (args) {
        args['method'] = 'post';
        this._ajaxSetup();
        this.ajax(args);
    },
    'ajax': function (args) {
        // 封装登录和注册的cpajax.post
        // args等于执行cpajax.post里的字典(js:对象)
        // 也就是写的success
        var success = args['success'];
        // 重写success
        args['success'] = function (result) {
            if(result['code'] == 200){
                // 调用写的cpajax.post的success
                if(success){
                    success(result);
                }
            }else{
                var messageObject = result['message'];
                // 判断是否是字符串类型or构造函数是否是字符串
                if(typeof messageObject == 'string' || messageObject.constructor == String){
                    window.messageBox.show(messageObject);
                }else{
                    // {"password": ['xxx','xxx'], "telephone": ['xxx','xxx']}
                    for(var key in messageObject){
                        var messages = messageObject[key];
                        var message = messages[0];
                        window.messageBox.show(message);
                    }
                }
            }
        };
        args['fail'] = function (error) {
            console.log(error);
            window.messageBox.showError('服务器内部错误！');
        };
        $.ajax(args);
    },
    '_ajaxSetup': function () {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            }
        });
    }
};
