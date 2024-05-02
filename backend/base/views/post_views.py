from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Posts, Comment
from rest_framework import authentication, permissions
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from base.serializers import PostsSerializer
from base.models import Notification
from base.views.notification_views import create_notification


# Create your views here.


@api_view(['GET'])
def getPosts(request):
    posts = Posts.objects.all()
    serializer = PostsSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, pk):
    post = Posts.objects.get(pk=pk)
    if post.likes.filter(id=request.user.id):
        post.likes.remove(request.user)
        return Response({"message": "post unlike"})
    else:
        post.likes.add(request.user)
        create_notification(post, request.user, post.user, 1)
        return Response({"message": "post like"})


@api_view(['GET'])
def detailPost(request, pk):
    post = Posts.objects.get(id=pk)
    serializer = PostsSerializer(post, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyListPosts(request):
    user = request.user
    posts = user.posts_set.all()
    serializer = PostsSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createPost(request):
    user = request.user
    data = request.data
    try:
        image = request.FILES.get('image')
        post = Posts.objects.create(
            user=user,
            title=data['title'],
            description=data['description'],
            category=data['category'],
            image=image

        )
        serializer = PostsSerializer(post, many=False)
        return Response(serializer.data)
    except:
        message = {"datail": 'Упс щось пішло не так!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updatePost(request, pk):
    data = request.data
    user = request.user
    try:
        post = Posts.objects.get(pk=pk, user=user)
    except Posts.DoesNotExist:
        raise NotFound('Post not found')

    post.title = data['title']
    post.description = data['description']
    post.category = data['category']

    post.save()
    serializer = PostsSerializer(post, many=False)

    return Response(serializer.data)


@api_view(['POST'])
def updloadImage(request):
    data = request.data

    post_id = data['post_id']
    posts = Posts.objects.get(id=post_id)

    posts.image = request.FILES.get('image')
    posts.save()
    return Response('Image was uploaded')


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletePost(request, pk):
    user = request.user
    post = Posts.objects.get(pk=pk, user=user)
    post.delete()
    return Response('post was deleted')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createPostComment(request, pk):
    user = request.user
    post = Posts.objects.get(pk=pk)

    parent_comment_id = request.data.get('parent', None)  # Отримуємо id батьківського коментаря (якщо є)
    parent_comment = None
    comment_text = request.data.get('text', '')

    if parent_comment_id:
        parent_comment = Comment.objects.get(id=parent_comment_id)
        create_notification(post, request.user, parent_comment.author, 3, comment_text)

    Comment.objects.create(author=user, post=post, text=comment_text, parent=parent_comment)
    create_notification(post, request.user, post.user, 3, comment_text)
    return Response({"comments": "created"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def commentDelete(request, pk):
    comment = Comment.objects.get(pk=pk, author=request.user)
    comment.delete()
    return Response({"comments": "deleted"})
