from django.urls import path
from base.views import post_views as views


urlpatterns = [
    path('', views.getPosts, name='posts'),
    path('mypost/', views.getMyListPosts, name='my-list_posts'),
    path('create/', views.createPost, name='create-post'),
    path('update/<str:pk>/', views.updatePost, name='update-post'),
    path('upload-image/', views.updloadImage, name='image-upload'),
    path('<str:pk>/', views.detailPost, name='detail-posts'),
    path('delete/<str:pk>/', views.deletePost, name='delete-post'),

    path('like_post/<str:pk>', views.like_post, name='like-post'),

    path('create_comment/<str:pk>', views.createPostComment, name='create-comment'),
    path('comment-delete/<str:pk>/', views.commentDelete, name='delete-comment'),
    #  path('create_reply_comment/<str:pk>', views.createCommentReply, name='create-reply-comment'),
]