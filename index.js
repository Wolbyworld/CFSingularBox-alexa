/* eslint-disable  func-names */
/* eslint-disable  no-console */

//dependences
const Alexa = require('ask-sdk');
const C_dbHelper = require('./dbHelper');
const dbHelper = new C_dbHelper();
const config = require('./configuration');

//Variable definition
const SKILL_NAME = 'Crossfit Singular Box - El WOD de hoy';
const HELP_MESSAGE = 'Puedes decir, dime entreno del dia';
const HELP_REPROMPT = '¿Cómo te puedo ayudar?';
const STOP_MESSAGE = 'Adios crossfitero';
const ERROR_MESSAGE = 'Todavía no hemos recibido el entreno de hoy. Vuelve a intentar en un rato. ¡Gracias';
const CF = "Crossfit";
const CFF = "CFF";
const PERFORMANCE = "Performance";

let userTestingID1 = config.userTestingID1;
let userTestingID2= config.userTestingID2;
/**

MY HANDLERS

**/

const CrossfitHandler = {
  //Define when this handler should take the request
  //Crossfit requests and 
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const locale = request.locale;
    return ( request.type === 'LaunchRequest'
      && request.locale === 'es-ES')
      || (request.type === 'IntentRequest'
        && request.intent.name === 'CrossfitHandler');
  },

  //If this handler handle it, then what to do
  async handle(handlerInput) {
    console.log(handlerInput.requestEnvelope.session.user.userId);
    var userID = handlerInput.requestEnvelope.session.user.userId;
    let testMode = config.verification;
    if(userID === userTestingID1 || userID === userTestingID2){
      testMode=false;
      console.log("Here")
    }
    var workout = await dbHelper.readTodaysCFWorkout(testMode);
    return handlerInput.responseBuilder
      .speak(workout["text2read"])
      .withStandardCard(workout["cardTittle"], workout["cardText"], workout["imgURL"], workout["imgURL"])
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
    var userID = handlerInput.requestEnvelope.session.user.userId;
    let testMode = config.verification;
    if(userID === userTestingID1 || userID === userTestingID2){
      testMode=false;
      console.log("Here")
    }
    var workout = await dbHelper.readTodaysCFFWorkout(testMode);
    return handlerInput.responseBuilder
      .speak(workout["text2read"])
      .withStandardCard(workout["cardTittle"], workout["cardText"], workout["imgURL"], workout["imgURL"])
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
    var userID = handlerInput.requestEnvelope.session.user.userId;
    let testMode = config.verification;
    if(userID === userTestingID1 || userID === userTestingID2){
      testMode=false;
      console.log("Here")
    }
    var workout = await dbHelper.readTodaysPerformanceWorkout(testMode);
    return handlerInput.responseBuilder
      .speak(workout["text2read"])
      .withStandardCard(workout["cardTittle"], workout["cardText"], workout["imgURL"], workout["imgURL"])
      .reprompt('¿Quieres saber otro entreno? Di Crossfit, Football o Performance')
      .getResponse(); 
  },
};


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

