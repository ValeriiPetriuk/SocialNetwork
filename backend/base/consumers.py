import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from base.models import Chat, ChatMessage
from django.db.models import Q



class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_chat(self, chat_uuid, user_id):
        try:
            return Chat.objects.get(Q(uuid=chat_uuid), (Q(user1=user_id) | Q(user2=user_id)))
        except Chat.DoesNotExist:
            raise Chat.DoesNotExist(f"Chat with uuid={chat_uuid} and user_id={user_id} does not exist.")

    @database_sync_to_async
    def create_message(self, message, sender, uuid):
        return ChatMessage.objects.create(message=message, uuid=uuid, sender=sender,
                                          chat=self.chat)
    
 
    
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            user = self.scope['user']
            chat_uuid = self.scope['url_route']['kwargs'].get('chat_id')
            
            try:
                # authenticate user with chat
                self.chat = await self.get_chat(chat_uuid, user)
                self.room_name = f'chat.{chat_uuid}'

                # join channel group
                await self.channel_layer.group_add(self.room_name, self.channel_name)
                await self.accept()
            except Chat.DoesNotExist:
                await self.close()  
            except ValueError as e:
                print(str(e))
                await self.close()
       

    async def disconnect(self, code):
        # leave channel group if joined
        if hasattr(self, 'room_name'):
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        sender = self.scope['user']
        payload = json.loads(text_data)
        message = payload.get('message')
        uuid = payload.get('uuid')  

        if not message or message.isspace():
            await self.send(json.dumps({
                'type': 'error',
                'data': {'message': 'Please enter a message'}
            }))
        else:
            try:
                # create message then send to channel group
                msg_obj = await self.create_message(message, sender, uuid)
                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        'type': 'chat_recieved',
                        'message': message,
                        'uuid': str(msg_obj.uuid),
                        'sender': {
                            "id": sender.id,
                            "username": sender.username,
                            "avatar": f"http://127.0.0.1:8000/images/{sender.avatar}"
                        }, 
                        "date_sent": str(msg_obj.date_sent),
                        'sender_channel_name': self.channel_name,
                    }
                )
               
            except Exception as e:
                # TODO: log error here
                await self.send(json.dumps({
                    'type': 'error',
                    'data': {
                        'message': 'There was an error sending your message'
                    }
                }))

    async def chat_recieved(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'uuid': event['uuid'],
            "sender": event['sender'],
            "date_sent": event['date_sent'],
        }))


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()

        self.group_name = 'notifications_room'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):

        await self.send(text_data=json.dumps({
            'id': event['id'],
            'post': event['post'],
            'sender': event['sender'],
            'user': event['user'],
            "notification_type": event['notification_type'],
            'text': event['text']
        }))


#
# @database_sync_to_async
# def get_user(user_id):
#     try:
#         user = MyUser.objects.get(id=user_id)
#         return user
#     except:
#         return "user not found"
#
# class NotificationConsumer(AsyncWebsocketConsumer):
#     @database_sync_to_async
#     def create_notification(self, receiver, typeof="task_created", status="unread"):
#         notification_to_create = Notification.objects.create(user_revoker=receiver, type_of_notification=typeof)
#
#         return (notification_to_create.user_revoker.username, notification_to_create.type_of_notification)
#
    # async def connect(self):
    #     self.room_name='test_consumer'
    #     self.room_group_name='test_consumer_group'
    #     await self.channel_layer.group_add(self.room_group_name,self.channel_name)
    #     self.send({
    #         "type":"websocket.send",
    #         "text":"room made"
    #     })
    #     await self.accept()
#
#         await self.send(json.dumps({
#             "type":"websocket.send",
#             "text":"hello world"
#         }))
#
#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_name, self.channel_name)
#
#     async def receive(self, text_data):
#         data_to_get = json.loads(text_data)
#         user_to_get = await get_user(int(data_to_get))
#         print("user_to_get", user_to_get)
#         get_of= await self.create_notification(user_to_get)
#         # Call the send_notification function asynchronously.
#         await self.channel_layer.group_send(
#             self.room_name,
#             {
#                 "type": "send_notification",
#                 "value": json.dumps(get_of),
#             },
#         )
#         # await self.channel_layer.group_send(
#         #             self.room_name,
#         #             {
#         #                 "type":"send_notification",
#         #                 "value":json.dumps(get_of)
#         #             },
#
#         #         )
#
#
#     async def send_notification(self, event):
#         print("l am here")
#         await self.send(json.dumps({
#             "type":"websocket.send",
#             "data":event
#         }))
#         # message = event['message']
#         # await self.send(text_data=json.dumps({
#         #     'message': message
#         # }))

    