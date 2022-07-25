import firebase_admin
from firebase_admin import credentials, firestore
import json

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
    
    try:
        doc_ref = db.collection(u'rooms_table').where("status", "==", "unbooked")
        doc = doc_ref.get()
        data={}
        data = [el.to_dict() for el in doc] 
        data=json.dumps(data)
        headers = {'Access-Control-Allow-Origin': '*'}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
