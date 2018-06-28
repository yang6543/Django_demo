# encoding: utf-8

from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from django.http import JsonResponse, HttpResponse
from utils import restful
from django.shortcuts import redirect, reverse
from utils.captcha.cpcaptcha import Captcha
from io import BytesIO
from utils.aliyunsdk import aliyunsms
from django.core.cache import cache
# get_user_model会去读取settings下的AUTH_USER_MODEL = 'cpauth.User'
from django.contrib.auth import get_user_model

User = get_user_model()


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
                return restful.ok()
            else:
                return restful.unauth(message="您的账号已经被冻结了！")
        else:
            return restful.params_error(message="手机号码或密码错误！")
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)

def logout_view(request):
    logout(request)
    return redirect(reverse('index'))

@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone, username=username,
                                        password=password)
        login(request, user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())

def img_captcha(request):
    text, image = Captcha.gene_code()
    # BytesIO:相当于一个管道，存储bytes数据，把图片写到内存中，生成流对象
    out = BytesIO()
    # 将image对象保存到BytesIO中
    image.save(out, 'png')
    # 将BytesIO的文件指针移动到最开始位置
    out.seek(0)

    # HttpResponse默认存储的是字符串，将其改为图片类型
    response = HttpResponse(content_type='image/png')
    # 从BytesIO的管道中，读取出图片数据并将其保存到response对象上
    response.write(out.read())
    # tell方法：从开始位置到最后位置，图片大小
    response['Content-length'] = out.tell()

    # 将图形验证码当成key和value存储到memcached
    # 过期时间5分钟
    cache.set(text.lower(), text.lower(), 5*60)

    return response

def sms_captcha(request):
    telephone = request.GET.get("telephone")
    code = Captcha.gene_text()
    cache.set(telephone, code, 5*60)
    print("短信验证码：", code)
    # result = aliyunsms.send_sms(telephone, code)
    return restful.ok()

def cache_test(request):
    cache.set('username', 'carl', 60)
    result = cache.get('username')
    print(result)
    return HttpResponse('success')
