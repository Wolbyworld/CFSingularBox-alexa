
//Run locally: lambda-local -l createCarsTable.js -h handler -e input.json

var AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000",
 // accessKeyId: "test"
  //secretAccessKey: "test"
});

var dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "WorkoutsOfTheDay",
    KeySchema: [
        { AttributeName: "workout_id", KeyType: "HASH"},  //Partition key
],
    AttributeDefinitions: [
        { AttributeName: "workout_id", AttributeType: "N" },
        { AttributeName: "card_text", AttributeType: "N" },
        { AttributeName: "card_tittle", AttributeType: "N" },
        { AttributeName: "text2read", AttributeType: "N" },
],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};
dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

exports.handler = async (event) => {
    try{
        console.log("enteres here")
    }
    catch(error) {
        return error;
    }
};
