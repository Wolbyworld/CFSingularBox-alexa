// Following: https://github.com/alexa/alexa-cookbook/blob/master/aws/Amazon-DynamoDB/read/src/index.js
// run local: lambda-local -l index.js -h handler -e input.json -t 20
// change aws-sdk version: npm install aws-sdk@2.304.0

//Init things
const config = require('./configuration');
const AWS = require('aws-sdk');
const AWSregion = config.awsRegion;
const C_rsshelper = require('./FeedReaderHelper');
const rsshelper = new C_rsshelper();
const C_dbHelper = require('./dbHelper');
const dbhelper = new C_dbHelper();

//Setting up entorno
AWS.config.update({
    region: AWSregion
});


///Entry point
exports.handler = async(event) => {
    try {
        let allWods = await rsshelper.workouts();
        await  dbhelper.writeDynamoItem(allWods);
    }
    catch (error) {
        console.log(error)
        return error;
    }
    var oCF = await dbhelper.readTodaysCFWorkout();
    var oCFF = await dbhelper.readTodaysCFFWorkout();
    var oPerformance = await dbhelper.readTodaysPerformanceWorkout();
    console.log("CF " + oCF["cardTittle"]);
    console.log("CFF " + oCFF["cardTittle"]);
    console.log("Performance " + oPerformance["cardTittle"]);
};
