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
    roomNumber = request_data["roomnumber"]
    fromDate= request_data["fromDate"]
    toDate = request_data["toDate"]
    roomType = request_data["roomType"]
    bedRooms=request_data["bedrooms"]
    price = request_data["price"]
    status = "unbooked"
    
    try:
        doc_ref = db.collection(u'rooms_table').document(str(roomNumber))
        doc_ref.set({
                        u'roomnumber':roomNumber,
                        u'fromDate': fromDate,
                        u'toDate': toDate,
                        u'roomType': roomType,
                        u'bedrooms': bedRooms,
                        u'status' : status,
                        u'price' : price
                    })
        headers = {'Access-Control-Allow-Origin': '*'}
        data={"message": "Room added succesfully."}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
