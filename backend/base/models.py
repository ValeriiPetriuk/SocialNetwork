

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.validators import MinLengthValidator
from uuid import uuid4

from django.utils import timezone
from rest_framework.exceptions import ValidationError


class MyUser(AbstractUser):
    avatar = models.ImageField(upload_to='user/avatar/', blank=True, null=True, default="not_avatar.jpg")

class Posts(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    category =  models.CharField(max_length=200, null=True, blank=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="likes_posts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def number_of_likes(self):
        return self.likes.count()

    def __str__(self) -> str:
        return self.title
    

class Comment(models.Model):
    post = models.ForeignKey(Posts, on_delete=models.CASCADE,related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments_author")
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey(
        'self',  on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.author} comments post {self.post}"



class Chat(models.Model):
    """
    A chat between two users.
    """

    uuid = models.UUIDField(default=uuid4, null=False)
    date_created = models.DateTimeField(auto_now_add=True, null=False)
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, related_name='user1',
                              on_delete=models.CASCADE)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, related_name='user2',
                              on_delete=models.CASCADE)
    last_message = models.TextField(blank=True, default="No messages yet")

    # class Meta:
    #     unique_together = ('user1', 'user2')

    def __str__(self) -> str:
        return f'<Chat {self.uuid}>'
    
       

class ChatMessage(models.Model):
    """
    An individual message between two users in a chat. Messages must have at
    least one character.
    """

    uuid = models.UUIDField(default=uuid4, null=False)
    date_sent = models.DateTimeField(auto_now_add=True, null=False)
    message = models.CharField(max_length=300, null=False, validators=[
                               MinLengthValidator(1)])
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, related_name='sender',
                               on_delete=models.CASCADE)
    chat = models.ForeignKey('Chat', null=False, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'<ChatMessage chat={self.chat.uuid} sender={self.sender.username}>'
    

class Notification(models.Model):
    NOTIFICATION_TYPES = ((1, 'Like'), (2, 'Dislike'), (3, 'Comment'))

    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='notify_post', blank=True, null=True)
    sender = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='notify_from_user')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='notify_to_user')
    notification_type = models.IntegerField(choices=NOTIFICATION_TYPES)
    text_preview = models.CharField(max_length=120, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)

    def clean(self):
        super().clean()
        if self.sender == self.user:
            raise ValidationError("Sender and user cannot be the same.")


    def __str__(self):
        return f"notification {self.sender} or {self.user}"





    
 

