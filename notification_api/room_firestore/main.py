import base64
from google.cloud import firestore
import json
from google.cloud import pubsub_v1


client = firestore.Client(project='assignment4-355202')

def storeBookedRoom(event, context):
  pubsub_message = base64.b64decode(event['data']).decode('utf-8')
  print(pubsub_message)
  message_list = pubsub_message.split(' ')
  username = message_list[1]
  project_path = f'projects/assignment4-355202'
  topic_id = "projects/assignment4-355202/topics/BookHotel"
    
  publisher = pubsub_v1.PublisherClient()
  subscriber = pubsub_v1.SubscriberClient()   
  
  subscription_list = []

  # retrieving all the subscription from the pub/sub
  response = publisher.list_topic_subscriptions(request={"topic": topic_id})

  for subscription in response:
    # fetching only the valid user who has booked the room
    if subscription.split('/')[3] == username.split('@')[0]:
      print(subscription)
      subscription_list.append(subscription)

  #iterating through all the subscribers list 
  for subscibers_s  in subscription_list:
      
    notification_list = []
    doc3 = client.collection('HotelBook').document(subscibers_s.split('/')[3].split('@')[0]) 
    value  = doc3.get().to_dict()
    old_notification = {}  
    if value !=None:      
      notify = value['notification']
      print(notify)

      for val in notify:
        for key, value in val.items():
          print(type(value))
          notification_list.append({key : value})
      notification_list.append({context.timestamp : pubsub_message })

      notification_dict = {
        'username_url': subscibers_s,
        'username': subscibers_s.split('/')[3] ,
        'notification': notification_list
      }
            
    else:
      notification_list.append({context.timestamp : pubsub_message })
      notification_dict = {
        'username_url': subscibers_s,
        'username': subscibers_s.split('/')[3] ,
        'notification': notification_list
      }

    #add data to th firestore 
    doc3.set(notification_dict, merge=True)
    
  # delete the subscription in pub/sub
  for sub in subscription_list:
    subscriber.delete_subscription(request={"subscription": subscibers_s})
  print(f"Subscription deleted.")
      
