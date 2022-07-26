import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import csv
from google.cloud import language_v1
from flask_cors import cross_origin

#set file name, bucket name and project id
fileName="room.csv"
bucketName="bedtobreakfast"
projectId="serverless-a2-352802"

if not firebase_admin._apps:
    cred = credentials.Certificate("keys.json")
    default_app = firebase_admin.initialize_app(cred)

database = firestore.client()

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
    #get the user input
    request_data = request.get_json()
    roomNumber = request_data["roomnumber"]
    userEmail = request_data["userEmail"]
    fromDate= request_data["fromDate"]
    toDate = request_data["toDate"]
    adults = request_data["adults"]
    children=request_data["children"]
    status = "booked"
    
    try:
        document_reference = database.collection(u'room_booking').where("email", "==", userEmail)
        document = document_reference.get()
        data = [al.to_dict() for al in document]

        document_reference_2 = database.collection(u'user_data').where("email", "==", userEmail)
        doc2 = document_reference_2.get()
        data1 = [doc.to_dict() for doc in document]

        if(len(data)>0): 
            for singleData in data:
                if (singleData["email"] == userEmail):
                    headers = {'Access-Control-Allow-Origin': '*'}
                    message={"message": "Email ID exists."}
                    return (message,400, headers)
        
        if(len(data1)>0): 
            for singleData in data1:
                if (singleData["email"] != userEmail):
                    headers = {'Access-Control-Allow-Origin': '*'}
                    message={"message": "User is not registered."}
                    return (message,404, headers)

        if(len(data)==0):
            document_reference = database.collection(u'room_booking').document(str(roomNumber))
            document_reference.set({
                            u'roomnumber':roomNumber,
                            u'fromDate': fromDate,
                            u'toDate': toDate,
                            u'email': userEmail,
                            u'adults': adults,
                            u'children' : children
                        })
            
            document_reference_1 = database.collection(u'rooms_table').document(str(roomNumber))
            document_reference_1.update({u'status':status})
  
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
                fileWriter.writerow([roomNumber, userEmail, adults, children])
                #close the file
                file.close()
                #upload the updated file
                fileObject.upload_from_filename('/tmp/' + fileName)
            else:  
                #open the file
                file = open('/tmp/' + fileName, 'a', newline="")
                #create csv header
                CSVHeaders = ['roomnumber', 'email', 'adults','childrens']
                 #create file writer object
                fileWriter = csv.writer(file)
                #add headers in csv
                fileWriter.writerow(CSVHeaders)
                #write in the file
                fileWriter.writerow([roomNumber, userEmail, adults, children])
                #close the file
                file.close()
                #upload the updated file
                fileObject.upload_from_filename('/tmp/' + fileName)
        
            headers = {'Access-Control-Allow-Origin': '*'}
            data={"message": "Room booked succesfully."}
            
            return (data,200)
    except Exception as e:
        print(e)
        exceptionName= e.__class__.__name__
        return (exceptionName, 500)