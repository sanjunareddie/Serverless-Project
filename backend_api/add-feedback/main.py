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
    userid = request_data["customerid"]
    feedback = request_data["feedback"]
    
    try:
        doc_ref = db.collection(u'feedback').document(str(userid))
        doc_ref.set({
                        u'customerid':userid,
                        u'feedback': feedback
                    })

        headers = {'Access-Control-Allow-Origin': '*'}
        data={"message": "Feedback submitted."}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
