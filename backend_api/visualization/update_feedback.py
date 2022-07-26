from google.cloud import storage
import csv
from google.cloud import language_v1

fileName="feedback.csv"
bucketName="bedtobreakfast"
projectId="serverless-a2-352802"

def feedback_csv(event, context):

    email = event["value"]["fields"]["email"]["stringValue"]
    feedback = event["value"]["fields"]["feedback"]["stringValue"]
    polarity = event["value"]["fields"]["polarity"]["stringValue"]
    sentiment_score = event["value"]["fields"]["sentiment_score"]["doubleValue"]

    print(email + " " + feedback + " " + polarity + " " + str(sentiment_score))

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
        fileWriter.writerow([email, feedback, polarity, sentiment_score])
        #close the file
        file.close()
        #upload the updated file
        fileObject.upload_from_filename('/tmp/' + fileName)
    else:  
        #download file to local machine
        file = open('/tmp/' + fileName, 'a', newline="")
        #create csv header
        headers = ['userid', 'feedback', 'polarity','sentiment_score']
        #create file writer object
        fileWriter = csv.writer(file)
        #add headers in csv
        fileWriter.writerow(headers)
        #write in the file
        fileWriter.writerow([email, feedback, polarity, sentiment_score])
        #close the file
        file.close()
        #upload the updated file
        fileObject.upload_from_filename('/tmp/' + fileName)
