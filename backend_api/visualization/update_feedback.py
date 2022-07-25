from google.cloud import storage
import csv
from google.cloud import language_v1

fileName="feedback.csv"
bucketName="bedtobreakfast"
projectId="serverless-a2-352802";

def feedback_csv(event, context):

    email = event["value"]["fields"]["email"]["stringValue"]
    feedback = event["value"]["fields"]["feedback"]["stringValue"]
    polarity = event["value"]["fields"]["polarity"]["stringValue"]
    sentiment_score = event["value"]["fields"]["sentiment_score"]["doubleValue"]

    print(email + " " + feedback + " " + polarity + " " + str(sentiment_score))

    # update csv
    client = storage.Client(project=projectId)
    bucket = client.get_bucket(bucketName)
    blob_object = bucket.blob(fileName)

    if(blob_object.exists()):
        blob_object.download_to_filename('/tmp/' + fileName)
        f = open('/tmp/' + fileName, 'a', newline="")
        writer = csv.writer(f)
        writer.writerow([email, feedback, polarity, sentiment_score])
        f.close()
        blob_object.upload_from_filename('/tmp/' + fileName)
    else:  
        f = open('/tmp/' + fileName, 'a', newline="")
        headers = ['userid', 'feedback', 'polarity','sentiment_score']
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerow([email, feedback, polarity, sentiment_score])
        f.close()
        blob_object.upload_from_filename('/tmp/' + fileName)
