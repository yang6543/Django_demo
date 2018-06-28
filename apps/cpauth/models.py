# encoding: utf-8

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# shortuuidfield: pip install django-shortuuidfield
from shortuuidfield import ShortUUIDField
from django.db import models


class UserManager(BaseUserManager):
    def _create_user(self, telephone, username, password, **kwargs):
        if not telephone:
            raise ValueError('请传入手机号码！')
        if not username:
            raise ValueError('请传入用户名！')
        if not password:
            raise ValueError('请传入密码！')

        # self: User实例
        user = self.model(telephone=telephone, username=username, **kwargs)
        user.set_password(password)
        user.save()
        return user

    # 创建普通用户
    def create_user(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = False
        return self._create_user(telephone, username, password, **kwargs)

    # 创建超级用户
    def create_superuser(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = True
        return self._create_user(telephone, username, password, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    # 不使用默认自增长的主键
    uid = ShortUUIDField(primary_key=True)
    telephone = models.CharField(max_length=11, unique=True)
    password = models.CharField(max_length=200)
    email = models.EmailField(unique=True, null=True)
    username = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # USERNAME_FIELD = 'telephone',默认是username
    # 重写该属性将telephone设置为唯一认证字段
    USERNAME_FIELD = 'telephone'
    # create_superuser: REQUIRED_FIELDS需要填写的字段
    # telephone,username,password
    REQUIRED_FIELDS = ['username']
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username
