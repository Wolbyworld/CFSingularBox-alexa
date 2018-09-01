/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const RSSFeed = "http://fetchrss.com/rss/5b816db48a93f882278b4567560933858.xml";
var imageUrl = 'https://image.boxrox.com/2015/12/fi1.png'
//Variable definition
const SKILL_NAME = 'Crossfit Singular Box - El WOD de hoy';
const HELP_MESSAGE = 'Puedes decir, dime entreno del dia';
const HELP_REPROMPT = '¿Cómo te puedo ayudar?';
const STOP_MESSAGE = 'Adios gerrero';

var speechOutput = ''
var string2read = new Array()


const NuevaInformacionHandler = {
  //Define when this handler should take the request
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const locale = request.locale
    return ( request.type === 'LaunchRequest'
      && request.locale === 'es-ES')
      || (request.type === 'IntentRequest'
        && request.intent.name === 'NuevaInformacion');
  },

  //If this handler handle it, then what to do
  async handle(handlerInput) {
  
    imageUrl = selectRandomeImage();
    let Parser = require('rss-parser');
    let parser = new Parser();
    let feed = await parser.parseURL(RSSFeed);
    string2read = readFeed(feed)
    return handlerInput.responseBuilder
    .speak(string2read[0] + ' ' + string2read[1])
    .withStandardCard(string2read[0], string2read[1], imageUrl, imageUrl)
    .getResponse(); 
  },
};



function selectRandomeImage(){
    const ImgArr = motivationalImages;
    const RandImageIndex = Math.floor(Math.random() * ImgArr.length);
    return ImgArr[RandImageIndex];
}

// My functions
function readFeed(_feed) {
  var tempwod = new Array()
  var temptitle = new Array()
  var response = new Array()
  var tempdate
  var i = 0

  _feed.items.forEach (item => {
    if (cleanString(item.title).search("WOD")!= -1) {
      tempwod[i] = cleanString(item.content)
      temptitle[i]  = cleanString(item.title)
    }
    i=i+1
  })     
  response[0] = temptitle[0]
  response[1] = tempwod[0]        
  return response
}



function cleanString(_text) {
  var temp
  temp = _text;
  temp= temp.replace('<p>','');
  temp= temp.replace('<br />','');
  temp= temp.replace('<span style="font-size:12px; color: gray;">(RSS generated with <a href="http://fetchrss.com" target="_blank">FetchRss</a>)</span>','')
  temp= temp.replace('</p>','');
  temp= temp.replace(/\n/g, '')
  temp= temp.replace('<br />','');
  return  temp;
}

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const motivationalImages = [
'https://visualhunt.com/photos/5/crossfit-sports-fitness-training-exercise-athlete.jpg?s=l'
,'https://visualhunt.com/photos/2/crossfit_0132.jpg?s=l'
,'https://images.pexels.com/photos/931324/pexels-photo-931324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
,'https://images.pexels.com/photos/116077/pexels-photo-116077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    NuevaInformacionHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

