from importlib.resources import Package
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from flask import jsonify
from flask_cors import cross_origin

@cross_origin(allowed_methods=['POST'])
def generateTour(request):

 
    request_json = request.get_json()
    global classesList
    global classList
    
    if request_json:
         dict={
             "stay_duration":request_json["stay_duration"],
             "max_budget":request_json["max_budget"]
             }
  
    predictionResponse=predict_tabular_classification_sample(project= "assignmen-356103",
    endpoint_id="9085968267754864640",
    instance_dict= dict,
    location= "us-central1",
    api_endpoint="us-central1-aiplatform.googleapis.com")
    maxResponse=max(zip(predictionResponse.values(), predictionResponse.keys()))[1]
    def responseP(maxResponse):
      if(maxResponse=="Super Delux"):
        return {
             "tourid": "1",
             "tourname":"Art Gallery of Nova Scotia",
             "price":"59.99",
             "duration":"1",
             "description":"The Art Gallery of Nova Scotia is a public provincial art museum based in Halifax,",
             }
      elif (maxResponse=="Delux"):
        return {
             "tourid": "2",
             "tourname":"Point Pleasant Park",
             "price":"49.99",
             "duration":"5",
             "description":"Point Pleasant Park is a large, mainly forested municipal park at the southern tip of the Halifax peninsula. ",      }
      elif (maxResponse=="Ultra Delux"):
        return {
             "tourid": "3",
             "tourname":"Peggys Cove",
             "price":"99.99",
             "duration":"6",
             "description":"Peggy's Cove is a small rural community located on the eastern shore of St. Margarets Bay in the Halifax Regional Municipality",
               }
      elif (maxResponse=="Basic"):
        return {
             "tourid": "4",
             "tourname":"Herring Cove",
             "price":"149.99",
             "duration":"3",
             "description":"Herring Cove is a Canadian suburban and former fishing community in Nova Scotia's Halifax Regional Municipality.", 
                 }
      elif (maxResponse=="Premium"):
        return {
             "tourid": "5",
             "tourname":"Citadel Hill",
             "price":"199.99",
             "duration":"1",
             "description":"Citadel Hill is a hill that is a National Historic Site in Halifax, Nova Scotia, Canada.",
             }
    package=responseP(maxResponse)
    print("Response=====",package)
    return package

    
    

def predict_tabular_classification_sample(
    project= "assignmen-356103",
    endpoint_id="9085968267754864640",
    instance_dict= dict,
    location= "us-central1",
    api_endpoint="us-central1-aiplatform.googleapis.com",
):
    aiplatform.init(project=project, location=location)
    final_response={}
    client_options = {"api_endpoint": api_endpoint}
    client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
    instance = json_format.ParseDict(instance_dict, Value())
    instances = [instance]
    parameters_dict = {}
    parameters = json_format.ParseDict(parameters_dict, Value())
    endpoint = client.endpoint_path(
        project=project, location=location, endpoint=endpoint_id
    )
    response = client.predict(
        endpoint=endpoint, instances=instances, parameters=parameters
    )
    final_response={}
    predictions = response.predictions
    for prediction in predictions:
        
        predictionResponse=dict(prediction)
        keyValue=list(predictionResponse.keys())[0]
        if(keyValue=="classes"):
            classesList=predictionResponse["classes"]
            scoreList=predictionResponse["scores"]
            combineDictionary=zip(classesList,scoreList)
        
            return dict(combineDictionary)
        else:
            scoreList=predictionResponse["scores"]
            classList=predictionResponse["classes"]   
            combineDictionary=zip(classList,scoreList)
            return dict(combineDictionary)

