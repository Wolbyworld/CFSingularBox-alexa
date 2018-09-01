/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const RSSFeed = "http://fetchrss.com/rss/5b816db48a93f882278b4567560933858.xml";
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

// ------- From the old
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

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

const SKILL_NAME = 'Crossfit Singular Box - El WOD de hoy';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const ES_GET_FACT_MESSAGE = 'Aquí va la culturilla de salon: ';


const data = [
  'A year on Mercury is just 88 days long.',
  'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
  'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
  'On Mars, the Sun appears about half the size as it does on Earth.',
  'Earth is the only planet not named after a god.',
  'Jupiter has the shortest day of all the planets.',
  'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
  'The Sun contains 99.86% of the mass in the Solar System.',
  'The Sun is an almost perfect sphere.',
  'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
  'Saturn radiates two and a half times more energy into space than it receives from the sun.',
  'The temperature inside the Sun can reach 15 million degrees Celsius.',
  'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

const ESdata = [
  'Alvaro es el puto amo.',
  'Aloña es una mamuza.',
];


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    NuevaInformacionHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
