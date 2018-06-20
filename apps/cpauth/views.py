# encoding: utf-8

from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from django.http import JsonResponse


@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    # 设置默认过期时间(2周)
                    request.session.set_expiry(None)
                else:
                    # 浏览器关闭后过期
                    request.session.set_expiry(0)
                #  返回给前端的Json数据
                return JsonResponse({"code": 200, "message": "", "data": {}})
            else:
                return JsonResponse({"code": 405, "message": "您的账号已经被冻结了！", "data": {}})
        return JsonResponse({"code": 400, "message": "手机号码或密码错误！", "data": {}})
    else:
        errors = form.get_errors()
        return JsonResponse({"code": 400, "message": "", "data": errors})