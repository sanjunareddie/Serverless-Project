import boto3
import uuid
import firebase_admin
from firebase_admin import credentials, firestore
import json

if not firebase_admin._apps:
    cred = credentials.Certificate("keys.json")
    default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

ACCESS_KEY = 'AKIAY7XSIHEW64RIELOK'
SECRET_KEY = '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'

cognito = boto3.client('cognito-idp',
                    region_name='us-east-1')

dynamodb= boto3.client("dynamodb", aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY,region_name="us-east-1")

UserPoolId = "us-east-1_bh2uOggDc"    
ClientId = "14g6sbl7astgt5eictc19gmpvl"

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
    userName = request_data["fullname"]
    userEmail= request_data["email"].lower()
    userType = request_data["type"].lower()
    securityQuestion = request_data["question"]
    securityAnswer=request_data["answer"].lower()
    userPassword= request_data["password"]
    encyKey = request_data["encyKey"]
    myuuid = str(uuid.uuid4())
    
    try:
        cognito.sign_up(
                Username = userEmail, 
                Password = userPassword, 
                ClientId = ClientId,
                UserAttributes = [
                    {'Name': 'email', 'Value': userEmail}
                    ]
                )
        # dynamodb.put_item(TableName='user_data',
        #     Item = { 
        #         'email': {'S':userEmail},
        #         'name':{'S': userName},
        #         'user': {'S':userType},
        #         'customerid':{'S':myuuid},
        #         'question':{'S':securityQuestion},
        #         'answer':{'S':securityAnswer},
        #         'password':{'S': userPassword}
        #         }
        #     )
        doc_ref = db.collection(u'user_data').document(userEmail)
        doc_ref.set({
                    u'name': userName,
                    u'email': userEmail,
                    u'user': userType,
                    u'customerid': myuuid,
                    u'password': userPassword,
                    u'question': securityQuestion,
                    u'answer': securityAnswer,
                    u'key': encyKey,

                })
        headers = {'Access-Control-Allow-Origin': '*'}

        return ("User added successfully",200, headers)
    except Exception as e:
        if (e.__class__.__name__ == "UsernameExistsException"):
            return ("User ID already exists.")
