const AWS = require("aws-sdk");
const responseConstructor = require("../responseConstructor");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = (event, context, callback) => {
  const { id, username, idToken } = JSON.parse(event.body);
  const res = responseConstructor(callback);

  decodeVerify(idToken)
    .then(({ email }) => {
      if (email !== username) {
        res.error(401, "Unauthorized operation.");
        return;
      }

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id },
        ConditionExpression: "#u = :u",
        ExpressionAttributeNames: { "#u": "username" },
        ExpressionAttributeValues: { ":u": username }
      };

      documentClient.delete(params, err => {
        if (err) res.error(err, "Could not delete an item.");
        else res.success({ id });
      });
    })
    .catch(e => res.error(401, "Unauthorized operation."));
};
