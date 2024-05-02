from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver
from base.models import Notification


@receiver(post_save, sender=Notification)
def notification_created_handler(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications_room',
            {
                "type": "send_notification",
                'id': instance.post.id,
                "post": instance.post.title,
                "sender": instance.sender.username,
                "user": instance.user.username,
                "notification_type": instance.notification_type,
                "text": instance.text_preview
            }
        )
