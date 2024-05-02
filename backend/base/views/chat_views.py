from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, ListCreateAPIView, DestroyAPIView
from base.permissions import HasChatPermissions
from base.serializers import ChatMessageSerializer, ChatSerializer
from base.models import ChatMessage, Chat
from django.db.models import Q

class ChatMessageListView(ListAPIView):
    permission_classes = [HasChatPermissions]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        return ChatMessage.objects.filter(chat__uuid=self.kwargs['chat_uuid']).order_by('date_sent')


class ChatListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer
    
    
    def get_last_message(self, chat):
        last_message = ChatMessage.objects.filter(chat=chat).order_by('-date_sent').first()
        if last_message:
            return last_message.message
        return "No messages yet"

    def get_queryset(self):
        chats = Chat.objects.filter(Q(user1=self.request.user) | Q(user2=self.request.user))
        
        for chat in chats:
            last_message = self.get_last_message(chat)
            chat.last_message = last_message  # Attach the last_message attribute to the chat instance
        return chats


class ChatDestroyView(DestroyAPIView):
    permission_classes = [HasChatPermissions]
    serializer_class = ChatSerializer
    lookup_field = 'uuid'
    lookup_url_kwarg = 'chat_uuid'

    def get_queryset(self):
        return Chat.objects.filter(Q(user1=self.request.user) | Q(user2=self.request.user))
    

