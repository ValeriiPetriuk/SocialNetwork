from rest_framework import serializers
from base.models import Posts, MyUser, ChatMessage, Chat, Comment, Notification
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from logging import getLogger
from rest_framework.exceptions import APIException, ValidationError 
from base.models import MyUser
from django.db.models import Q


logger = getLogger('chat_serializers')





class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'avatar']


    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name
    
    



class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
  
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'token', "avatar"]
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    replies = serializers.SerializerMethodField()
        
    class Meta:
        model = Comment
        fields = "__all__"

    def get_replies(self, obj):
        # Використовуйте той самий серіалізатор CommentSerializer для серіалізації відповідей
        replies = Comment.objects.filter(parent=obj)
        serializer = CommentSerializer(replies, many=True)
        return serializer.data


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    sender = UserSerializer()
    
    class Meta:
        model = Notification
        fields = "__all__"
 
    
class PostsSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    likes = UserSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    # comments = CommentSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Posts
        fields = "__all__"

    def get_like_count(self, obj):
        return len(obj.likes.all())
    
    def get_is_liked(self, obj):
        try:
            user = self.context['request'].user
            return True if user in obj.likes.all() else False
        except KeyError as e:
            pass
        
    def get_comments(self, obj):
        # Використовуйте метод get_comments з CommentSerializer для фільтрації коментарів
        comments = Comment.objects.filter(post=obj, parent__isnull=True)
        # Серіалізуйте фільтровані коментарі за допомогою CommentSerializer
        return CommentSerializer(comments, many=True).data
    
   

    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=128)
    password = serializers.CharField(max_length=128)




class ChatMessageSerializer(serializers.ModelSerializer):
    recieved = serializers.SerializerMethodField('is_reciever')
    sender = UserSerializer()
    
    def is_reciever(self, obj):
        """
        Returns true if this chat message was recieved by the user getting the 
        messages.
        """
        try:
            user = self.context['request'].user
            return user != obj.sender
        except KeyError:
            logger.exception('Request not passed to context')
            raise APIException()

    class Meta:
        model = ChatMessage
        fields = ('uuid', 'date_sent', 'message', 'recieved', 'sender')


class ChatSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField('get_other_user')
    recipient = serializers.CharField(max_length=150, write_only=True)
    last_message = serializers.SerializerMethodField() 

    def get_other_user(self, obj):
        """
        Returns the other users model.
        """
        try:
            if obj.user1_id == self.context['request'].user.id:
                return UserSerializer(obj.user2).data

            return UserSerializer(obj.user1).data
        except KeyError:
            logger.exception('Request not passed to context')
            raise APIException()

    def validate_recipient(self, recipient):
        """
        Checks if recipient is a valid user and not the current user.
        """
        if recipient == self.context['request'].user.username:
            raise ValidationError('Не вдається розпочати чат сам із собою') 

        try:
            user2 = MyUser.objects.get(username=recipient)
        except MyUser.DoesNotExist:
            print(f'{recipient} такого користувача не існує')
            raise serializers.ValidationError(f'{recipient} такого користувача не існує')
        except Exception as e:
            logger.exception('Recipient validation error')
            raise APIException('Could not validated chat recipient', 500)
        
        user1 = self.context['request'].user

        existing_chat = Chat.objects.filter(
            Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
            ).first()
        
        if existing_chat:
            raise serializers.ValidationError('Чат між цими користувачами вже існує')
        return user2

    def create(self, validated_data):
        user1 = self.context['request'].user
        user2 = validated_data['recipient']

        return Chat.objects.create(user1=user1, user2=user2)

    class Meta:
        model = Chat
        fields = ('uuid', 'date_created', 'user', 'recipient', 'last_message')
        read_only_fields = ('uuid', 'date_created', 'user')

    def get_last_message(self, obj):
        return obj.last_message



