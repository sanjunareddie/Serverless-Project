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
    tourid = request_data["tourid"]
    tourname= request_data["tourname"]
    description = request_data["description"]
    duration = request_data["duration"]
    price = request_data["price"]
    
    try:
        doc_ref = db.collection(u'tours').document(str(tourid))
        doc_ref.set({
                        u'tourid':tourid,
                        u'tourname': tourname,
                        u'description': description,
                        u'duration': duration,
                        u'price': price,
                    })
        headers = {'Access-Control-Allow-Origin': '*'}
        data={"message": "Tour added succesfully."}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
