exports.handler = async (event) => {
    var index_body = {};
    var AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    var rekognition = new AWS.Rekognition();
    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
      host: 'YOUR VPC HOST'
    });
    var rekognitionParams = {
        Image: {
            S3Object: {
                Bucket: event.Records[0].s3.bucket.name,
                Name: event.Records[0].s3.object.key
            }
        },
        MaxLabels: 123,
        MinConfidence: 70
    };
    return rekognition.detectLabels(rekognitionParams).promise()
    .then((data)=>{
        var labels = [];
        data.Labels.forEach((element)=> {
            labels.push(element.Name);
        });
        index_body = {
            "objectKey": event.Records[0].s3.object.key,
            "bucket": event.Records[0].s3.bucket.name,
            "createdTimestamp": event.Records[0].eventTime,
            "labels": labels
        }
        console.log(index_body);
        return client.ping({requestTimeout: 30000});
    })
    .then(()=>{
        console.log("Elastic Search Cluster is running");
        return client.indices.exists({index: 'photos'});
    })
    .then((data)=>{
        if(data){
          console.log("Elastic Search Cluster photos index is present");
          return client.index({refresh: 'true',index: 'photos',type: 'posts',body:index_body});
        }
        else{
          console.log("Elastic Search Cluster photos index is not present");
          console.log("Creating Elastic Search Cluster photos index");
          return client.indices.create({index: 'photos'});
        }
    })
    .then((data)=>{
        console.log(data);
        if(!data.hasOwnProperty('_id')){
            return client.index({refresh: 'true',index: 'photos',type: 'posts',body:index_body});
        }
        return null;
    })
    .then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    })
};
