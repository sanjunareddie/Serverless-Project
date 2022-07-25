import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import csv
from google.cloud import language_v1
from flask_cors import cross_origin

fileName="room.csv"
bucketName="bedtobreakfast"
projectId="serverless-a2-352802";

if not firebase_admin._apps:
    cred = credentials.Certificate("keys.json")
    default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

@cross_origin(allowed_methods=['POST'])
def room_booking(request):
    
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': "*",
            'Access-Control-Max-Age': '3600'
        }
        return ('',204, headers)
    
    data={}
    
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
        data = [el.to_dict() for el in doc]

        doc_ref3 = db.collection(u'user_data').where("email", "==", userEmail)
        doc2 = doc_ref3.get()
        data2 = [el.to_dict() for el in doc]

        if(len(data)>0): 
            for i in data:
                if (i["email"] == userEmail):
                    headers = {'Access-Control-Allow-Origin': '*'}
                    message={"message": "Email ID exists."}
                    return (message,400, headers)
        
        if(len(data2)>0): 
            for i in data2:
                if (i["email"] != userEmail):
                    headers = {'Access-Control-Allow-Origin': '*'}
                    message={"message": "User is not registered."}
                    return (message,404, headers)

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
  
            # update csv
            client = storage.Client(project=projectId)
            bucket = client.get_bucket(bucketName)
            blob_object = bucket.blob(fileName)

            if(blob_object.exists()):
                blob_object.download_to_filename('/tmp/' + fileName)
                f = open('/tmp/' + fileName, 'a', newline="")
                writer = csv.writer(f)
                writer.writerow([roomNumber, userEmail, adults, children])
                f.close()
                blob_object.upload_from_filename('/tmp/' + fileName)
            else:  
                f = open('/tmp/' + fileName, 'a', newline="")
                header = ['roomnumber', 'email', 'adults','childrens']
                writer = csv.writer(f)
                writer.writerow(header)
                writer.writerow([roomNumber, userEmail, adults, children])
                f.close()
                blob_object.upload_from_filename('/tmp/' + fileName)
        
            headers = {'Access-Control-Allow-Origin': '*'}
            data={"message": "Room booked succesfully."}
            
            return (data,200)
    except Exception as e:
        print(e)
        exceptionName= e.__class__.__name__
        return (exceptionName, 500)