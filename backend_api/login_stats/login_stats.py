import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import csv
from google.cloud import language_v1
from flask_cors import cross_origin

fileName="reportgeneration.csv"
bucketName="bedtobreakfast"
projectId="serverless-a2-352802"

if not firebase_admin._apps:
    cred = credentials.Certificate("keys.json")
    default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

@cross_origin(allowed_methods=['POST'])
def login_stats(request):
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
        
        # update csv
        client = storage.Client(project=projectId)
        bucket = client.get_bucket(bucketName)
        blob_object = bucket.blob(fileName)
        
        if(blob_object.exists()):
            blob_object.download_to_filename('/tmp/' + fileName)
            f = open('/tmp/' + fileName, 'a', newline="")
            writer = csv.writer(f)
            writer.writerow([userEmail, logInTime, logOutTime])
            f.close()
            blob_object.upload_from_filename('/tmp/' + fileName)
        else:  
            f = open('/tmp/' + fileName, 'a', newline="")
            headers = ['customerid', 'login', 'logout']
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerow([userEmail, logInTime, logOutTime])
            f.close()
            blob_object.upload_from_filename('/tmp/' + fileName)
        
        headers = {'Access-Control-Allow-Origin': '*'}
        data={"message": "Logged Out succesfully."}
        return (data,200, headers)
    except Exception as e:
        exceptionName= e.__class__.__name__
        return (exceptionName)