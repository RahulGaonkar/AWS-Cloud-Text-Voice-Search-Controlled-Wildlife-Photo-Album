exports.handler = async (event) => {
    console.log(event.params.querystring.q);
    var AWS = require('aws-sdk');
    var searchKeywords = [];
    var searchKeywordsCleaned = [];
    var searchQuery = '';
    AWS.config.update({region: 'us-east-1'});
    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
      host: 'YOUR VPC HOST'
    });
    var lexruntime = new AWS.LexRuntime();
    var lexChatbotParams = {
        botAlias: 'photo_album_lex_bot',
        botName: 'photo_album_lex_bot',
        inputText: event.params.querystring.q,
        userId: 'photo-album-user',
        requestAttributes: {},
        sessionAttributes: {}
    };
    var searchResult = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'

        },
        statusCode: 200,
        body: ""
    };

    return lexruntime.postText(lexChatbotParams).promise()
    .then((data) =>{
        console.log(data);
        if((data.intentName != null) && (data.slots.SearchIntentPhrases != null)){
            searchKeywords = data.slots.SearchIntentPhrases.split(" ");
            searchKeywords.forEach((element)=>{
                if((element.slice(-1) == 's') || (element.slice(-1) == 'S')){
                    searchKeywordsCleaned.push(element.slice(0,-1));
                }
                else{
                    searchKeywordsCleaned.push(element);
                }
            })
            searchKeywordsCleaned.forEach((element)=> {
                searchQuery+= 'labels:' + element + ' OR ';
            });
            searchQuery = searchQuery.slice(0, -4);
            console.log(searchQuery);
            return client.search({index: 'photos',type: 'posts',q: searchQuery});
        }
        else{
            return null;
        }
    })
    .then((data)=>{
        if(data == null){
            searchResult.body = [];
            console.log(searchResult);
            return searchResult;
        }
        else{
            searchResult.body = data.hits.hits;
            console.log(searchResult);
            return searchResult;
        }
    })
    .catch((err) =>{
        console.log(err);
    })
};
