var apigClient = apigClientFactory.newClient();
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

// Checking if SpeechRecognition is supported by the browser
if ('SpeechRecognition' in window) {
  console.log("SpeechRecognition is Working");
} else {
  console.log("SpeechRecognition is Not Working");
}

// Setting Speech Recognition Properties
const recognition = new window.SpeechRecognition();
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
  console.log(speechToText);
  searchResults(speechToText);
}

function voiceSearchPhoto() {
  recognition.start();
  console.log("Ready to receive a voice command");
}

function textSearchPhoto() {
  var searchText = document.getElementById('search-input').value.trim().toLowerCase();
  if(searchText == "") {
    alert("Please enter valid text");
  } else {
    searchResults(searchText);
  }
}

function searchResults(searchText) {
  document.getElementById('output-box').innerHTML = "";
  document.getElementById('search-input').value = searchText;
  var searchResults = [];
  var params = {
    'q': searchText
  };
  var body = {};
  var additionalParams = {
    headers: {
      'x-api-key': 'YOUR API KEY'
    },
    queryParams: {}
  };
  return apigClient.searchGet(params,body,additionalParams)
  .then(function(result){
    result.data.body.forEach((element)=>{
      searchResults.push(element._source.objectKey);
    });
    searchResults.forEach((element) => {
      document.getElementById('output-box').innerHTML += "<img src=\"https://s3.amazonaws.com/photo-album-store/"+element+"\" width=\"50%\" height=\"50%\" style=\"border-radius: 10px\">";
    });
    if(searchResults.length == 0){
      document.getElementById('output-box').innerHTML = "<p align=\"center\"><STRONG>NO SEARCH RESULTS FOUND</STRONG></p>";
    }
  })
  .catch(function(error){
    console.log(error);
  });
}

function uploadPhoto() {
  var filePath = document.getElementById('file-input').value;
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  document.getElementById('file-input').value = "";
  if((filePath == "") || (!['png','jpg','jpeg'].includes(filePath.split(".")[1]))) {
    alert("Please upload a valid PNG/JPG file");
  } else {
    var params = {
      folder: 'photo-album-store',
      item: filePath.split("\\").slice(-1)[0],
      'Content-Type': 'image/***'
    };
    var body = {};
    var additionalParams = {
      headers: {
        'x-api-key': 'YOUR API KEY'
      },
      queryParams: {}
    };
    reader.onload = function (event) {
      body =  btoa(event.target.result);
      console.log(body);
      return apigClient.folderItemPut(params,body,additionalParams)
      .then(function(result){
        console.log(result);
      })
      .catch(function(error){
        console.log(error);
      });
    }
    reader.readAsBinaryString(file);
  }
}
