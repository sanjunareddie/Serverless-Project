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

    request_data = request.get_json()
    userEmail = request_data["email"]
    logInTime = request_data["login"]
    logOutTime = datetime.datetime.now()

    
    try:
        doc_ref = db.collection(u'login_statistics').document()
        doc_ref.set({
                    u'email':userEmail,
                    u'login': logInTime,
                    u'logout': logOutTime,
                        })
        headers = {'Access-Control-Allow-Origin': '*'}
        data={"message": "Logged Out succesfully."}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
