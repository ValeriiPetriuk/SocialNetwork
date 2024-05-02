from django.contrib import admin
from base.models import *
from mptt.admin import MPTTModelAdmin
# Register your models here.

admin.site.register(Posts)

admin.site.register(MyUser)

# admin.site.register(Message)
admin.site.register(Chat)
admin.site.register(ChatMessage)

admin.site.register(Comment)

admin.site.register(Notification)