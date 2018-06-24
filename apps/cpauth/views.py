# encoding: utf-8

from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from django.http import JsonResponse
from utils import restful
from django.shortcuts import redirect, reverse
from utils.captcha.cpcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse


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

    return response
