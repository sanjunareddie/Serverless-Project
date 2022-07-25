import firebase_admin
from firebase_admin import credentials, firestore
import uuid

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
    userid = request_data["userid"]
    duration= request_data["duration"]
    adults = request_data["adults"]
    children = request_data["children"]
    bookingid = str(uuid.uuid4())
    
    try:
        doc_ref = db.collection(u'tour_bookings').document(str(bookingid))
        doc_ref.set({
                        u'bookingid':bookingid,
                        u'tourid': tourid,
                        u'userid': userid,
                        u'duration': duration,
                        u'adults': adults,
                        u'children' : children
                    })

        headers = {'Access-Control-Allow-Origin': '*'}
        data={"message": "Booking successfully done."}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
