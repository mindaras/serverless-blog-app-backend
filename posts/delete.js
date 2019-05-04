const AWS = require("aws-sdk");
const responseConstructor = require("./responseConstructor");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = (event, context, callback) => {
  const { id, username } = JSON.parse(event.body);
  const res = responseConstructor(callback);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
    ConditionExpression: "#u = :u",
    ExpressionAttributeNames: { "#u": "username" },
    ExpressionAttributeValues: { ":u": username }
  };

  documentClient.delete(params, err => {
    if (err) res.error(err, "Could not delete an item.");
    else res.success(id);
  });
};
