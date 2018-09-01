/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const RSSFeed = "http://fetchrss.com/rss/5b816db48a93f882278b4567560933858.xml";

//Variable definition
const SKILL_NAME = 'Crossfit Singular Box - El WOD de hoy';
const HELP_MESSAGE = 'Puedes decir, dime entreno del dia';
const HELP_REPROMPT = '¿Cómo te puedo ayudar?';
const STOP_MESSAGE = 'Adios gerrero';

var speechOutput = ''
var string2read = ''


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
  
    let Parser = require('rss-parser');
    let parser = new Parser();
    let feed = await parser.parseURL(RSSFeed);
    string2read = readFeed(feed)
    return handlerInput.responseBuilder
    .speak(string2read)
    //.speak(myFunction(2,3))
    .withSimpleCard(SKILL_NAME + "\n" + string2read)
    .getResponse();
  },
};



// My functions
function readFeed(_feed) {
  var tempwod = new Array()
  var temptitle = new Array()
  var tempdate
  var i = 0

  _feed.items.forEach (item => {
    if (cleanString(item.title).search("WOD")!= -1) {
      tempwod[i] = cleanString(item.content)
      temptitle[i]  = cleanString(item.title)
    }
    i=i+1
  })              
  return temptitle[0] + " " + tempwod[0]
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

