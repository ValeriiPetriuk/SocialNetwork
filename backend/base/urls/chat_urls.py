from django.urls import path
from base.views import chat_views as views

urlpatterns = [
    # path('', views.ChatRoomView.as_view(), name='chatRoom'),
    path('<chat_uuid>/', views.ChatMessageListView.as_view()),
    path('<chat_uuid>/delete/', views.ChatDestroyView.as_view()),
    path('', views.ChatListCreateView.as_view())
]