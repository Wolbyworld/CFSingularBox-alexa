//Execute with: lambda-local -l FeedReaderHelper.js -h handler -e input.json -t 20

  function FeedReaderHelper () {
  const C_dateHelper = require('./dateHelper');
  const dateHelper = new C_dateHelper();

  this.workouts = async function() {
    let rssText =await RSS2XML();
    //Prepare CF workout DB Object
    let CFWorkout = myreadFeed(rssText,CF)
    var CFWorkout_id = dateHelper.todayDateFormatted()+"CF"
    var CFCardTittle = CFWorkout[0]
    var CFCardText = CFWorkout[1]
    var CFText2Read = spokenResponseBuilder(CFWorkout[0],CFWorkout[1])
    var CFImgURL = selectRandomeImage();
    var CFobject = {
      workout_id:CFWorkout_id,
      cardTittle:CFCardTittle,
      cardText:CFCardText,
      text2read:CFText2Read,
      imgURL:CFImgURL
    }
    console.log("Workout Ready: " + CFobject.workout_id);
    //Prepare Performance workout DB Object
    let PerformanceWorkout = myreadFeed(rssText,"Performance")
    var PerformanceWorkout_id = dateHelper.todayDateFormatted()+"Performance"
    var PerformanceCardTittle = PerformanceWorkout[0]
    var PerformanceCardText = PerformanceWorkout[1]
    var PerformanceText2Read = spokenResponseBuilder(PerformanceWorkout[0],PerformanceWorkout[1])
    var PerformanceImgURL = selectRandomeImage();
    var Performanceobject = {
      workout_id:PerformanceWorkout_id,
      cardTittle:PerformanceCardTittle,
      cardText:PerformanceCardText,
      text2read:PerformanceText2Read,
      imgURL:PerformanceImgURL
    }
    //Prepare CFF workout DB Object
    let CFFWorkout = myreadFeed(rssText,"CFF")
    var CFFWorkout_id = dateHelper.todayDateFormatted()+"CFF"
    var CFFCardTittle = CFFWorkout[0]
    var CFFCardText = CFFWorkout[1]
    var CFFText2Read = spokenResponseBuilder(CFFWorkout[0],CFFWorkout[1])
    var CFFImgURL = selectRandomeImage();
    var CFFobject = {
      workout_id:CFFWorkout_id,
      cardTittle:CFFCardTittle,
      cardText:CFFCardText,
      text2read:CFFText2Read,
      imgURL:CFFImgURL
    }
    //Create global object
    var allWods = {
      workout_id:dateHelper.todayDateFormatted()
      ,CFWod:CFobject
      ,PerformanceWod:Performanceobject
      ,CFFWod:CFFobject
    }
    return allWods;
  }
}
module.exports = FeedReaderHelper;



//dependences
let Parser = require('rss-parser');
let config = require('./configuration');
const RSSFeed = config.rssURL;


/**
* Retrieves the XML from the RSSFeedURL
*/
async function RSS2XML(){
    let Parser = require('rss-parser');
    let parser = new Parser();
    let feed = await parser.parseURL(RSSFeed);
    return feed
}

/**
This function receives the information for the wod and turns it into the 
an spoken version. It gives entonation, and replaces english terms
**/
function spokenResponseBuilder (_wodTitle, _wod) {
  var temp = '';
  var wodClean = replaceEnglishTerms(_wod.toLowerCase()); 
  var titleClean = replaceEnglishTerms(_wodTitle.toLowerCase());
  //let wocClean = wodClean.replace('b:','<break time=\"1s\"/> B:');
//  temp = titleClean + "<break time=\"1s\"/>"+ wodClean + "<break time=\"1s\"/>" + config.rePromptText;
    temp = titleClean + ". "+ wodClean + ". " + config.rePromptText;
  return  temp;
}

/**
Given the XML of the feed and the sport you want to know, it returns
the string with the wod and the title of the wod
**/
function myreadFeed(_feed,_sport) {
  var sport ;
  var tempwod = new Array();
  var temptitle = new Array();
  var response = new Array();
  var tempdate;
  var i = 0;
  //Select the sport to look for
  switch (_sport){
    case CF:
      sport = "WOD";
      break;
    case CFF:
      sport = "CFF";
      break;
    case PERFORMANCE:
      sport = "Performance";
      break;
  }
  //Parse results
  _feed.items.forEach (item => {
    if (cleanString(item.title).search(sport)!= -1) {
      tempwod[i] = cleanString(item.content);
      temptitle[i]  = cleanString(item.title);
      i=i+1;
    }
  });
  //Prepare response
    response[0] = temptitle[0];
    response[1] = tempwod[0]        ;
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
Selects a random image to return with the cards. Returns URL
**/
function selectRandomeImage(){
    const ImgArr = motivationalImages;
    const RandImageIndex = Math.floor(Math.random() * ImgArr.length);
    return ImgArr[RandImageIndex];
}

//Variable definition
const CF = "Crossfit"
const CFF = "CFF"
const PERFORMANCE = "Performance"
var dic = []; // create an empty array
//** Dictionary of english terms to españoliar
dic['emom']="every minit on de minit"
dic['cff']="Crossfit Football"
dic['pullups'] ="pulaps"
dic['pull-ups']="pulaps"
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
dic['b:'] = '. b :'//'<break time=\"1s\"/>b: '
dic['c:'] = '. c :' //'<break time=\"1s\"/>c: '
dic['d-ball'] = 'dibol'
dic['d -ball'] = 'dibol'
dic['d- ball']='dibol'
dic['dball']='dibol'
dic[' air '] = ' er '
dic['situps']='sitaps'
dic['sit-ups']='sitaps'
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
dic[' m ']=' metros '
dic['handstand']='jandstan'
dic['\' ']=' minutos '
dic['for time'] = 'por tiempo'
dic['thrusters'] = 'zrasters'
dic['thruster']='zrasters'
dic['facing'] = 'faisin'
dic['lb']='libras'
dic['igyg']='ai gou yu gou'
dic['clean']='clin'
dic['strenght']='trabajo de fuerza'
dic['strecth']='estiramientos'
dic['stretch']='estiramientos'
dic['rounds']='rondas'
dic['deadlifts']='dedlifts'
dic['run']='ran'
dic['then']='luego'
dic['of']='de'
dic['meter']='metros'
dic['meters']='metros'
dic['bear crawl']='paso del oso'
dic['rest']='descansar'
dic['strenght']='fuerza'
dic['otm']='cada minuto'



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


