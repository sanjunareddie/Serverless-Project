import uuid
from datetime import date
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import csv
from google.cloud import language_v1

#set file name, bucket name and project id
fileName="foodorder.csv"
bucketName="bedtobreakfast"
projectId="serverless-a2-352802"

if not firebase_admin._apps:
    cred = credentials.Certificate("keys.json")
    default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

def order_food(request):
  
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': "*",
            'Access-Control-Max-Age': '3600'
        }
        return ('',204, headers)

    request_data = request.get_json()
    userEmail = request_data["userEmail"]
    orderId = str(uuid.uuid4())
    year = date.today().year
    orderAmount = int(request_data["1"]["price"])* int(request_data["1"]["quantity"])
    orderAmount += int(request_data["2"]["price"])* int(request_data["2"]["quantity"])
    orderAmount += int(request_data["3"]["price"])* int(request_data["3"]["quantity"])
    orderAmount += int(request_data["4"]["price"])* int(request_data["4"]["quantity"])

    try:
        doc_ref = db.collection(u'room_booking').where("email", "==", userEmail)
        doc = doc_ref.get()
        data={}
        data = [el.to_dict() for el in doc]
        if(len(data)==0): 
            for i in data:
                if (i["email"] == userEmail):
                    headers = {'Access-Control-Allow-Origin': '*'}
                    data={"message": "No booked user exists."}
                    return (data,400, headers)
        if(len(data)>0):
            doc_ref = db.collection(u'food_orders').document(str(userEmail))
            doc_ref.set(request_data)
            doc_ref.set({
                    u'orderID': orderId
                }, merge=True)

            doc_ref2 = db.collection(u'food_invoice').document(str(userEmail))
            doc_ref2.set({
                        u'email': userEmail,
                        u'orderid': orderId,
                        u'orderAmount': orderAmount,
                        u'year':year
                    })

            # update csv in cloud storage

            #create client object
            clientObject = storage.Client(project=projectId)
            #create bucket object
            bucketObject = clientObject.get_bucket(bucketName)
            #create file object
            fileObject = bucketObject.blob(fileName)
            # checks file exist or not
            if(fileObject.exists()):
                #download file to local machine
                fileObject.download_to_filename('/tmp/' + fileName)
                #open the file
                file = open('/tmp/' + fileName, 'a', newline="")
                #create file writer object
                fileWriter = csv.writer(file)
                #write in the file
                fileWriter.writerow([userEmail, userEmail, orderId, orderAmount])
                #close the file
                file.close()
                #upload the updated file
                fileObject.upload_from_filename('/tmp/' + fileName)
            else: 
                #open the file 
                file = open('/tmp/' + fileName, 'a', newline="")
                #create csv header
                CSVHeader = ['customerid', 'email', 'orderid','price']
                #create file writer object
                fileWriter = csv.writer(file)
                #add headers in csv
                fileWriter.writerow(CSVHeader)
                #write in the file
                fileWriter.writerow([userEmail, userEmail, orderId, orderAmount])
                #close the file
                file.close()
                #upload the updated file
                fileObject.upload_from_filename('/tmp/' + fileName)

            headers = {'Access-Control-Allow-Origin': '*'}
            data={"message": "Your order has been successfully placed."}
            
            return (data, 200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)