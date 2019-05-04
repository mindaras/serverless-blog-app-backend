const AWS = require("aws-sdk");
const responseConstructor = require("../responseConstructor");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = (event, context, callback) => {
  const res = responseConstructor(callback);
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  documentClient.scan(params, (err, data) => {
    if (err) res.error(err, "Could not get items.");
    else res.success(data.Items);
  });
};
