/* eslint-disable  func-names */
/* eslint-disable  no-console */

//dependences
const Alexa = require('ask-sdk');
let Parser = require('rss-parser');
const config = require('./configuration');


//Variable definition
const RSSFeed = "https://politepol.com/feed/24728";
//const RSSFeed = "http://fetchrss.com/rss/5b816db48a93f882278b4567560933858.xml"
var imageUrl = 'https://image.boxrox.com/2015/12/fi1.png'
const SKILL_NAME = 'Crossfit Singular Box - El WOD de hoy';
const HELP_MESSAGE = 'Puedes decir, dime entreno del dia';
const HELP_REPROMPT = '¿Cómo te puedo ayudar?';
const STOP_MESSAGE = 'Adios crossfitero';
const ERROR_MESSAGE = 'Disculpas ha ocurrido un error. Espartanos! <break time=\"1s\"/> au <break time=\"1s\"/> au <break time=\"1s\"/> au'
const CF = "Crossfit"
const CFF = "CFF"
const PERFORMANCE = "Performance"
const rePromptText1 = "¿Quieres saber otro entreno? Di Crossfit, Football o Performance"
const rePromptText2 = "¿Otro entreno?"

var nreprompts = 0
var speechOutput = ''
var string2read = new Array()

var dic = []; // create an empty array

/**

MY HANDLERS

**/

const CrossfitHandler = {
  //Define when this handler should take the request
  //Crossfit requests and 
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const locale = request.locale
    return ( request.type === 'LaunchRequest'
      && request.locale === 'es-ES')
      || (request.type === 'IntentRequest'
        && request.intent.name === 'CrossfitHandler');
  },

  //If this handler handle it, then what to do
  async handle(handlerInput) {
  
    console.log(config.s3BucketName);
    imageUrl = selectRandomeImage();
    let parser = new Parser();
    let feed = await parser.parseURL(RSSFeed);
    string2read = myreadFeed(feed,CF)
    return handlerInput.responseBuilder
    .speak(spokenResponseBuilder(string2read[0],string2read[1]))
    .withStandardCard(string2read[0], string2read[1], imageUrl, imageUrl)
    .reprompt('¿Quieres saber otro entreno? Di Crossfit, Football o Performance')
    .getResponse(); 
  },
};

const FootballHandler = {
  //Define when this handler should take the request
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const locale = request.locale
    return (request.type === 'IntentRequest'
        && request.intent.name === 'FootbalInfo');
  },
  //If this handler handle it, then what to do
  async handle(handlerInput) {
  
    imageUrl = selectRandomeImage();
    let Parser = require('rss-parser');
    let parser = new Parser();
    let feed = await parser.parseURL(RSSFeed);
    string2read = myreadFeed(feed,CFF)
    return handlerInput.responseBuilder
    .speak(spokenResponseBuilder(string2read[0],string2read[1]))
    .withStandardCard(string2read[0], string2read[1], imageUrl, imageUrl)
    .reprompt('¿Quieres saber otro entreno? Di Crossfit, Football o Performance')
    .getResponse(); 
  },
};

const PerformanceHandler = {
  //Define when this handler should take the request
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const locale = request.locale
    return (request.type === 'IntentRequest'
        && request.intent.name === 'PerformanceInfo');
  },
  //If this handler handle it, then what to do
  async handle(handlerInput) {
    imageUrl = selectRandomeImage();
    let Parser = require('rss-parser');
    let parser = new Parser();
    let feed = await parser.parseURL(RSSFeed);
    string2read = myreadFeed(feed,PERFORMANCE);
    return handlerInput.responseBuilder
      .speak(spokenResponseBuilder(string2read[0],string2read[1]))
      .withStandardCard(string2read[0], string2read[1], imageUrl, imageUrl)
      .reprompt('¿Quieres saber otro entreno? Di Crossfit, Football o Performance')
      .getResponse(); 
  },
};

/**

MY FUNCTIONS

**/

/**
This function receives the information for the wod and turns it into the 
an spoken version. It gives entonation, and replaces english terms
**/
function spokenResponseBuilder (_wodTitle, _wod) {
  var temp = ''
  var wodClean = replaceEnglishTerms(_wod.toLowerCase()); 
  var titleClean = replaceEnglishTerms(_wodTitle.toLowerCase())
  wocClean = wodClean.replace('b:','<break time=\"1s\"/> B:')
  console.log(wodClean.search("b:"))
  if (nreprompts = 0) {
      temp = titleClean + "<break time=\"1s\"/>"+ wodClean + "<break time=\"1s\"/>" + rePromptText1
      nreprompts = nreprompts + 1
  } else {
      temp = titleClean + "<break time=\"1s\"/>"+ wodClean + "<break time=\"1s\"/>" + rePromptText2
      nreprompts = nreprompts + 1
  }
  return  temp
}

/**
Goes thru the wod changing those terms that are not easy to understand when pronounced in 
english in Alexa: i.e: EMOM
**/
function replaceEnglishTerms(_wod){
  var temp = _wod
  for (var key in dic){
    var i;
    for (i = 0; i < 5; i++) { 
        temp = temp.replace(key,dic[key])
    }
    
  }
  return temp
}

/**
Selects a random image to return with the cards
**/
function selectRandomeImage(){
    const ImgArr = motivationalImages;
    const RandImageIndex = Math.floor(Math.random() * ImgArr.length);
    return ImgArr[RandImageIndex];
}

/**
Given the XML of the feed and the sport you want to know, it returns
the string with the wod and the title of the wod
**/
function myreadFeed(_feed,_sport) {
  var sport 
  var tempwod = new Array()
  var temptitle = new Array()
  var response = new Array()
  var tempdate
  var i = 0

  //Select the sport to look for
  switch (_sport){
    case CF:
      sport = "WOD"
      break;
    case CFF:
      sport = "CFF"
      break;
    case PERFORMANCE:
      sport = "Performance"
      break;
  }

  //Parse results
  _feed.items.forEach (item => {
    if (cleanString(item.title).search(sport)!= -1) {
      tempwod[i] = cleanString(item.content)
      temptitle[i]  = cleanString(item.title)
      i=i+1
    }
    
  })

  //Prepare response

    response[0] = temptitle[0]
    response[1] = tempwod[0]        
  return response
}


/**
Cleans the string from weird characters associated with the XML. 
Add more lines if things continue appearing
**/
function cleanString(_text) {
  var temp
  temp = _text;
  temp= temp.replace('<p>','');
  temp= temp.replace('<br />','');
  temp= temp.replace('<span style="font-size:12px; color: gray;">(RSS generated with <a href="http://fetchrss.com" target="_blank">FetchRss</a>)</span>','')
  temp= temp.replace('</p>','');
  temp= temp.replace(/\n/g, '')
  temp= temp.replace('<br />','');
  temp= temp.replace(/&/g, "and"); 
  return  temp;
}

/**
Big variables init
**/
//** Foto library
const motivationalImages = [
'https://visualhunt.com/photos/5/crossfit-sports-fitness-training-exercise-athlete.jpg?s=l'
,'https://visualhunt.com/photos/2/crossfit_0132.jpg?s=l'
,'https://images.pexels.com/photos/931324/pexels-photo-931324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
,'https://images.pexels.com/photos/116077/pexels-photo-116077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
,'https://cdn.pixabay.com/photo/2015/02/13/22/10/runners-635906_960_720.jpg'
,'https://cdn.pixabay.com/photo/2014/10/22/17/25/stretching-498256_960_720.jpg'
,'https://media.defense.gov/2014/May/16/2000849981/-1/-1/0/140515-F-OC707-601.JPG'
,'https://upload.wikimedia.org/wikipedia/commons/d/da/Nano_Action.JPG'
,'https://media.defense.gov/2013/Jun/13/2000025304/-1/-1/0/120531-M-XY007-001.JPG'
,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4TIv6oflVD5Ti6h2pzQLPLEVV3RlJ6SdtKwR5H96U_9C8MIar'
]


//** Dictionary of english terms to españoliar
dic['emom']="every minit on de minit"
dic['cff']="Crossfit Football"
dic['pullups'] ="pulaps"
dic['gymanstic']="gimnástico"
dic['gymnastic']="gimnástico"
dic['muscleups']='máselaps'
dic['toes']='tous'
dic['burpees']='burpis'
dic['jerk']='yerk'
dic['lunges']='lanches'
dic[' db ' ]=' dambel '
dic['push ups'] = 'pushaps'
dic['pushups'] = 'pushaps'
dic['seg '] = 'segundos '
dic['seg.'] = 'segundos.'
dic['sec '] = 'segundos '
dic['sec.'] = 'segundos.'
dic[' b:'] = '<break time=\"1s\"/>b: '
dic[' c:'] = '<break time=\"1s\"/>c: '
dic['d-ball'] = 'dibal'
dic[' air '] = ' er '
dic['situps']='sitaps'
dic['dumbbell']='dambel'
dic['dumbell']='dambel'
dic['jump']='yamp'
dic['candj']='clean and yerk'
dic['hspu']='jand stan pushaps'
dic['unders']='anders'
dic['ot2m']='cada dos minutos'
dic[' min ']=' minutos '
dic[' min.']=' minutos '
dic['tandg']='tach and go'
dic['rope climb']='rop claimb'
dic[' m ']='metros'
dic['handstand']='jandstan'
dic['\' ']=' minutos '
dic['for time'] = 'por tiempo'


/**
Built in Handlers and variables. NOT TO TOUCH Excepto to add new handlers
**/
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
      .speak(ERROR_MESSAGE)
      .reprompt(ERROR_MESSAGE)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    CrossfitHandler,
    PerformanceHandler,
    FootballHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

