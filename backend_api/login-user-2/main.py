import boto3
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
    userEmail= request_data["email"].lower()
    securityQuestion = request_data["question"]
    securityAnswer=request_data["answer"].lower()

    try:
        doc_ref = db.collection(u'user_data').document(userEmail)
        doc = doc_ref.get().to_dict()
        fetchedQuestion= doc["question"]
        fetchedAnswer= doc["answer"]
        fetchedId = doc["customerid"]
        fetchedUserType = doc["user"]

        data = { "customerid": fetchedId, "userType": fetchedUserType}
        headers = {'Access-Control-Allow-Origin': '*'}

        if (fetchedQuestion== securityQuestion):
            if(fetchedAnswer == securityAnswer):
                return (data,200,headers)
        else:
            return ({"error": "Invalid User Credentials"})
    except:
        return ("Server side error occurred. Please try again.")
        
