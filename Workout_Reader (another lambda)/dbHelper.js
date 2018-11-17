
        //Init things
    const config = require('./configuration');
    const AWS = require('aws-sdk');
    const dateHelper = require('./dateHelper');
    const I_dateHelper = new dateHelper();
    const AWSregion = config.awsRegion;
    const dbTable = config.dynamoDBTableName;
    
    function dbHelper () {



        //Setting up entorno
        AWS.config.update({
            region: AWSregion
        });
        
        
        //DB Helper functions
        /**
         * Returns today´s CF workout from the database in an object form
         * */
        this.readTodaysCFWorkout = async function () {
            return await readTodaysWorkout("CF");
        }
        
        //DB Helper functions
        /**
         * Returns today´s CF workout from the database in an object form
         * */
        this.readTodaysCFFWorkout = async function () {
            return await readTodaysWorkout("CFF");
        }
        
        //DB Helper functions
        /**
         * Returns today´s CF workout from the database in an object form
         * */
        this.readTodaysPerformanceWorkout = async function () {
            return await readTodaysWorkout("Performance");
        }
        
        /**
         * Given an object _item, this is saved in dbTable
         * */
        this.writeDynamoItem = async function(_item) {
            try {
                let params = {
                    TableName: dbTable,
                    Item: _item
                };
                var AWS = require('aws-sdk');
                AWS.config.update({ region: AWSregion });
                var documentClient = new AWS.DynamoDB.DocumentClient();
                documentClient.put(params, function(err, data) {
                    if (err) console.log("error saving: " + err);
                    else console.log("success saving: " + data);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
  }
  module.exports = dbHelper;
  
    /**
     * Given an Sport, it reads the latest workout (today´s) of that sport. 
     * Returns the object needed by the Alexa skill
      **/
    async function readTodaysWorkout(_sport){
        try { 
            let date_Id = I_dateHelper.todayDateFormatted();
            if (config.verification==='TRUE'){
                date_Id = '20180925';
            }
            const params = {
                TableName: dbTable,
                Key: { workout_id:date_Id}
            };
            const docClient = new AWS.DynamoDB.DocumentClient();
            let data = await docClient.get(params).promise();
            return data["Item"][_sport+"Wod"];
        } catch (err) {
            console.log("readTodaysCFWorkout error" + err);
        }
    }
    
