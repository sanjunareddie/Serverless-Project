import base64
import json
from google.cloud import pubsub_v1
from google.cloud import firestore

client = firestore.Client(project='assignment4-355202')

def hello_pubsub(event, context):
  
  pubsub_message = base64.b64decode(event['data']).decode('utf-8')
  print(pubsub_message)

    
  project_path = f'projects/assignment4-355202'
  topic_id = "projects/assignment4-355202/topics/OrderFood"
    
  publisher = pubsub_v1.PublisherClient()
  subscriber = pubsub_v1.SubscriberClient()   
  
  subscription_list = []
  response = publisher.list_topic_subscriptions(request={"topic": topic_id})
  print(response)
  
  for subscription in response:
    print(subscription.split('/')[3])
    print(pubsub_message.split(' ')[1])
    if subscription.split('/')[3] == pubsub_message.split(' ')[1].split('@')[0]:
      print(subscription)
      subscription_list.append(subscription)
  
  print(subscription_list)
    
  for subscibers_s  in subscription_list:    
    notification_list = []
    doc3 = client.collection('FoodBook').document(subscibers_s.split('/')[3]) 
    value  = doc3.get().to_dict()
    old_notification = {}

    if value !=None:      
      notify = value['notification']
      for msg in notify:
        for key, value in val.items():
          notification_list.append({key : value})
      notification_list.append({context.timestamp : pubsub_message })

      notification_dict = {
        'username_url': subscibers_s,
        'username': subscibers_s.split('/')[3] ,
        'notification': notification_list
      }
          
    else:
      notification_list.append({context.timestamp : pubsub_message})
      notification_dict = {
        'username_url': subscibers_s,
        'username': subscibers_s.split('/')[3] ,
        'notification': notification_list
      }
      
    doc3.set(notification_dict, merge=True)
 
  # delete the notification
  for sub in subscription_list:   
    subscriber.delete_subscription(request={"subscription": subscibers_s})
    print(f"Subscription deleted.")
      