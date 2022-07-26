from importlib.resources import Package
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from flask import jsonify
from flask_cors import cross_origin
#cors anotation
@cross_origin(allowed_methods=['POST'])
#function to suggest tour
def suggestTour(request):
    #get input in form of Json
    requestInput = request.get_json()

    if requestInput:input={"stay_duration":requestInput["stay_duration"],"max_budget":requestInput["max_budget"]}
    # call predictClassification using projectid, location, endpointid, apiendpoint and input
    machineLearningPrediction=predictClassification(projectId= "assignmen-356103",endpointId="9085968267754864640",input= input,location= "us-central1",apiEndpoint="us-central1-aiplatform.googleapis.com")
    # get the highest response classification
    highestResponce=max(zip(machineLearningPrediction.values(), machineLearningPrediction.keys()))[1]
    # return json response if highestResponse is super delux
    if(highestResponce=="Super Delux"):
        return {
             "tourid": "1",
             "tourname":"Art Gallery of Nova Scotia",
             "price":"59.99",
             "duration":"1",
             "description":"The Art Gallery of Nova Scotia is a public provincial art museum based in Halifax,",
             }
    # return json response if highestResponse is delux
    elif (highestResponce=="Delux"):
        return {
             "tourid": "2",
             "tourname":"Point Pleasant Park",
             "price":"49.99",
             "duration":"5",
             "description":"Point Pleasant Park is a large, mainly forested municipal park at the southern tip of the Halifax peninsula. ",      }
    # return json response if highestResponse is ultra delux
    elif (highestResponce=="Ultra Delux"):
        return {
             "tourid": "3",
             "tourname":"Peggys Cove",
             "price":"99.99",
             "duration":"6",
             "description":"Peggy's Cove is a small rural community located on the eastern shore of St. Margarets Bay in the Halifax Regional Municipality",
               }
    # return json response if highestResponse is basic           
    elif (highestResponce=="Basic"):
        return {
             "tourid": "4",
             "tourname":"Herring Cove",
             "price":"149.99",
             "duration":"3",
             "description":"Herring Cove is a Canadian suburban and former fishing community in Nova Scotia's Halifax Regional Municipality.", 
                 }
    # return json response if highestResponse is premium
    elif (highestResponce=="Premium"):
        return {
             "tourid": "5",
             "tourname":"Citadel Hill",
             "price":"199.99",
             "duration":"1",
             "description":"Citadel Hill is a hill that is a National Historic Site in Halifax, Nova Scotia, Canada.",
             }  
    
    
    

def predictClassification(projectId= "assignmen-356103",endpointId="9085968267754864640",input= input,location= "us-central1",apiEndpoint="us-central1-aiplatform.googleapis.com",):
    aiplatform.init(project=projectId, location=location)
    #set client option
    clientOptions = {"api_endpoint": apiEndpoint}
    #get client object for prediction
    predictionClient = aiplatform.gapic.PredictionServiceClient(client_options=clientOptions)
    #parse input into json format 
    input1 = json_format.ParseDict(input, Value())
    inputs = [input1]
    # parameter dictionary
    parametersDict = {}
    #parse parametersDict into json format 
    parameters = json_format.ParseDict(parametersDict, Value())
    # set an endpoint using project id , location and endpoint id
    endpoint = predictionClient.endpoint_path(project=projectId, location=location, endpoint=endpointId)
    # get prediction response using prediction client
    predictionResponse = predictionClient.predict(endpoint=endpoint, instances=inputs, parameters=parameters)
    # get all predictions
    allPredictions = predictionResponse.predictions
    # for loop to itterate each prediction
    for onePrediction in allPredictions:
        
        predictionResponse=dict(onePrediction)
        # some times {key, value} comes in the two different format 1) {classes,score} and 2) {score,classes}
        keyValue=list(predictionResponse.keys())[0]
        # set zip response in order {key, value} => {classes,score}
        if(keyValue=="classes"):
            #set class in classes variable
            classes=predictionResponse["classes"]
            #set score in confidenceScore variable
            confidenceScore=predictionResponse["scores"]
            zippedDictionary=zip(classes,confidenceScore)
            #return zipped dictionary
            return dict(zippedDictionary)

        else:
            #set score in confidenceScore variable
            confidenceScore=predictionResponse["scores"]
            #set class in classes variable
            classList=predictionResponse["classes"]   
            zippedDictionary=zip(classList,confidenceScore)
            #return zipped dictionary
            return dict(zippedDictionary)

