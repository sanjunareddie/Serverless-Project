import datetime
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("keys.json")
    default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

def hello_world(request):
  if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': "*",
            'Access-Control-Max-Age': '3600'
        }
        return ('',204, headers)

  result=""

  request_data = request.get_json()
  userEmail = request_data["userEmail"]
  text= request_data["text"]
  decyCode = request_data["decrypt"]
  logInTime = datetime.datetime.now()

  doc_ref = db.collection(u'user_data').where("email", "==", userEmail)
  doc = doc_ref.get()
  data = [el.to_dict() for el in doc]
  keyValue =int(data[0]["key"])
  
  for i in range(len(text)):
    char = text[i]
    if (char.isupper()):
      result += chr((ord(char) + keyValue-65) % 26 + 65)
    else:
      result += chr((ord(char) + keyValue - 97) % 26 + 97)

  headers = {'Access-Control-Allow-Origin': '*'}
  
  if(result == decyCode):
    return ({"data":"Cipher matched","timeStamp":logInTime},200, headers) 
  else:
    return({"data":"Cipher mismatched"},200, headers)     
    

