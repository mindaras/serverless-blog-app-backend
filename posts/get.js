const AWS = require("aws-sdk");
const responseConstructor = require("../responseConstructor");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = (event, context, callback) => {
  const { id } = event.pathParameters;
  const res = responseConstructor(callback);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id }
  };

  documentClient.get(params, (err, data) => {
    if (err) res.error(err, "Could not get an item.");
    else {
      if (!data.Item) res.error(404, "No item with the given id was found.");
      else res.success(data.Item);
    }
  });
};
