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
    userEmail = request_data["userEmail"]
    fromDate= request_data["fromDate"]
    toDate = request_data["toDate"]
    adults = request_data["adults"]
    children=request_data["children"]
    status = "booked"
    
    try:
        doc_ref = db.collection(u'room_booking').where("email", "==", userEmail)
        doc = doc_ref.get()
        data={}
        data = [el.to_dict() for el in doc]
        if(len(data)>0): 
            for i in data:
                if (i["email"] == userEmail):
                    headers = {'Access-Control-Allow-Origin': '*'}
                    data={"message": "Email ID exists."}
                    return (data,400, headers)
        if(len(data)==0):
            doc_ref = db.collection(u'room_booking').document(str(roomNumber))
            doc_ref.set({
                            u'roomnumber':roomNumber,
                            u'fromDate': fromDate,
                            u'toDate': toDate,
                            u'email': userEmail,
                            u'adults': adults,
                            u'children' : children
                        })
            
            doc_ref1 = db.collection(u'rooms_table').document(str(roomNumber))
            doc_ref1.update({u'status':status})

            headers = {'Access-Control-Allow-Origin': '*'}
            data={"message": "Room booked succesfully."}
            return (data,200, headers)

    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)
