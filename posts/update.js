const AWS = require("aws-sdk");
const responseConstructor = require("../responseConstructor");

const documentClient = new AWS.DynamoDB.DocumentClient();
const EMPTY_STRING = "EMPTY_STRING";

module.exports.main = (event, context, callback) => {
  const { id, username, author, title, content } = JSON.parse(event.body);
  const res = responseConstructor(callback);
  const ExpressionAttributeNames = { "#u": "username" };
  const ExpressionAttributeValues = { ":u": username };
  let UpdateExpression = "set";

  if (title !== undefined) {
    UpdateExpression += " #t = :t,";
    ExpressionAttributeNames["#t"] = "title";
    ExpressionAttributeValues[":t"] = title === "" ? EMPTY_STRING : title;
  }

  if (content !== undefined) {
    UpdateExpression += " #c = :c";
    ExpressionAttributeNames["#c"] = "content";
    ExpressionAttributeValues[":c"] = content === "" ? EMPTY_STRING : content;
  }

  if (/,$/.test(UpdateExpression)) {
    UpdateExpression = UpdateExpression.replace(/,$/, "");
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: "#u = :u"
  };

  documentClient.update(params, err => {
    if (err) res.error(err, "Could not update an item.");
    else res.success({ id, username, author, title, content });
  });
};
