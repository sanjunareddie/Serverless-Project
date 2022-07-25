from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials, firestore

#this function is to retrieve the Hotel Management subscriber notification
def get_notification(request):

    if not firebase_admin._apps:
      cred = credentials.Certificate("keys.json")
      default_app = firebase_admin.initialize_app(cred)

    db = firestore.client()

    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': "*",
            'Access-Control-Max-Age': '3600'
        }
        return ('',204, headers)

    #connecting with the firestore in data
    db = firestore.Client(project='assignment4-355202')
    customerId = request.json['email'].split('@')[0]
    print(customerId)
    docs_hotel = db.collection(u'HotelBook').stream()
    docs_food = db.collection(u'FoodBook').stream()
    print(docs_food)
    # appending into the list for all the user notification
    message_list = []

    if docs_hotel != None:
      for doc in docs_hotel:
        if(doc.id == customerId):
          customerId = doc.id 
          notify_hotel = doc.to_dict()
          hotel_notification_lst = notify_hotel.get('notification')
          message_list.append(hotel_notification_lst)

    if docs_food != None:
      for doc in docs_food:
        print(doc)
        if(doc.id == customerId):
          print(doc.id)
          notify_food = doc.to_dict()
          food_notification_lst = notify_food.get('notification')
          # print(f'{doc.id} => {doc.to_dict()}')  
          message_list.append(food_notification_lst)
    print(message_list)
    headers = {'Access-Control-Allow-Origin': '*'}
    data={"notification": message_list}
    return (data,200, headers)
   
