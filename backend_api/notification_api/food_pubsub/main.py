import json
from google.cloud import pubsub_v1
import time

# this class is to sed notification to pub/sub
def foodOrder_firestore(event, context):
    
  resource_string = context.resource
 
  topic_name = "projects/assignment4-355202/topics/OrderFood"
  subscriber = pubsub_v1.SubscriberClient()
  publisher = pubsub_v1.PublisherClient()
  project_id = "assignment4-355202"
  
  request_json = event.get('value', {}).get('fields')
  print(request_json)

    
  if request_json != None:
    #checking if email is not null
    if request_json.get('email', {}).get('stringValue') != None:
      print(request_json.get('email', {}).get('stringValue'))
      subscriptionss = request_json.get('email', {}).get('stringValue')
      amountVlaue = request_json.get('orderAmount', {}).get('integerValue')
        
      #getting the subscription id that will be email of the user
      subscription_id = subscriptionss.split('@')[0]
            
      #subscribing user to topic
      subscription_path = subscriber.subscription_path(project_id, subscription_id)
      print(subscription_path)
      with subscriber:
        subscription = subscriber.create_subscription(request={"name": subscription_path, "topic": topic_name})
        print('subscription created')
            
      # publish the message to the topic
      future = publisher.publish(topic_name, 'Hi {} We have received your order and your total amount is {}!'.format(subscriptionss, amountVlaue).encode('utf-8'), origin="FoodOrder")
      print("Published messages with custom attributes to {}.".format(topic_name))
            
      response = dict({"status": 200,  "success":"Notification send. "})
      return response
  
  else:
    response = dict({
        "status":400,
        "error": "cannot send the data"
    })
    return response
