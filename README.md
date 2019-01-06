# AWS-Cloud-Text-Voice-Search-Controlled-Wildlife-Photo-Album
Wildlife Photo Album uses Lex, ElasticSearch, and Rekognition to create an intelligent search layer to query photos of animals using voice and text
## About
Wildlife Photo Album allows the user to upload new images (.png,.jpg,.jpeg) as well as search through text and voice the existing images in the photo album.

### Upload New Images
The PUT method in the API Gateway used for uploading new images is configured as Amazon S3 Proxy. AWS Rekognition is used to detect labels of the newly uploaded images which are stored along with the S3 object reference in the ElasticSearch Index

### Search Existing Images
Searching existing images is done with the help of Amazon Lex by training the following intent:

**SearchIntent:**<br>
It is used to disambiguate the user search query.For example it should disambiguate both keyword ("dogs","cats") and sentence ("show me dogs and cats","show me photos with dogs and cats in them") searches and yield keywords like dogs and cats which are then used to search in the ElasticSearch Index for getting results (existing image S3 object reference for which any detected Rekognition label matches the keyword used for searching) and then displaying the relevant images on the user interface using S3.
  
The ElasticSearchIndex instance and all the lambdas are deployed inside a VPC to prevent unauthorized internet access. The NAT Gateway is also configured so that the lambda can access the AWS services outside the VPC.    
 
## How to Setup
[AWS-Cloud-Text-Voice-Search-Controlled-Wildlife-Photo-Album-Instructions](AWS-Cloud-Text-Voice-Search-Controlled-Wildlife-Photo-Album-Instructions.pdf)
