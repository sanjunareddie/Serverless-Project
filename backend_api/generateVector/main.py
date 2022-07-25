from google.cloud import storage
import re
import os
import csv
import Levenshtein as lev
import pandas as pd
from io import StringIO

def hello_gcs(event, context):

     file = event
     fileName = file['name']
     csvFile = "testVector.csv"
     bucket = storage.Client().bucket("testbucketb00895691")
     stats = storage.Blob(bucket=bucket, name=csvFile).exists(storage.Client())

     if stats == False:
          blob = bucket.blob(csvFile)
          blob.upload_from_string("firstWord,secondWord,distance")
          blob.make_public()
     else:
          print("File exists.")
     bucket2 = storage.Client().get_bucket("sourcedatab00895691")
     blob2 = bucket2.get_blob(fileName)
     document = blob2.download_as_string()
     document = document.decode('utf-8')
     document=document.replace("\n\n"," ")
     document=document.replace("\n", " ")
     cleanString = re.sub('\W+',' ', document )
     cleanString.lower()
     tokens = cleanString.split(" ")
     cleanedText=[]
     distanceList=[]
     stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]


     for t in tokens:
          if not t in stopwords:
                if t:
                    cleanedText.append(t)
     
     for i, item in enumerate(cleanedText):
          currentWord= item
          if i < len(cleanedText)-1:
               nextWord= cleanedText[i+1]
          distance= lev.distance(str(currentWord) , str(nextWord) )
          data = [currentWord,nextWord,distance]
          distanceList.append(data)

     print(distanceList)

     uploadString=""
     existingData=[]
     blob = bucket.blob(csvFile)
     csvData = blob.download_as_string()
     csvData = csvData.decode('utf-8')
     csvData = StringIO(csvData)  #tranform bytes to string here
     names = list(csv.reader(csvData))  #then use csv library to read the content
     print(names)
     for name in names:
          existingData.append(name)
     print(existingData)
     newData = existingData + distanceList
     print("............................")
     print(newData) #list
     df = pd.DataFrame(newData)
     uploadString = df.to_csv(index=False, header=False)
     blob.upload_from_string(uploadString)
     blob.make_public()
     print(uploadString)



    
