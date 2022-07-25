
import boto3
import uuid

ACCESS_KEY = ''
SECRET_KEY = ''

cidp = boto3.client('cognito-idp',
                    region_name='us-east-1')

UserPoolId = ""    
clientId = ""

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
    userEmail= request_data["email"]
    userPassword= request_data["password"]
    
    try:
        response = cidp.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': userEmail,
                'PASSWORD': userPassword},
                ClientId=clientId)
        accessToken = response['AuthenticationResult']['AccessToken']
        headers = {'Access-Control-Allow-Origin': '*'}

        auth = { "token": accessToken, "email": userEmail }
        return (auth,200,headers)
    except Exception as e:
        if (e.__class__.__name__ == "NotAuthorizedException"):
            return ("User credentials are invalid.")
      

