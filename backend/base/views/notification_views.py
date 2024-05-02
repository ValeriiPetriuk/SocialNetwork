from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from base.models import Notification
from base.serializers import NotificationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notification(request):
    user = request.user
    notification = user.notify_to_user
    serializer = NotificationSerializer(notification, many=True)
    return Response(serializer.data)


def create_notification(post, sender, user, notification_type, text=None):
    if text:
        notification = Notification(
            post=post,
            sender=sender,
            user=user,
            notification_type=notification_type,
            text_preview=text,
        )
    else:
        notification = Notification(
            post=post,
            sender=sender,
            user=user,
            notification_type=notification_type
        )
    try:
        notification.clean()
        notification.save()
    except ValidationError as e:
        pass
