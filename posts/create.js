const uuid = require("uuid");
const AWS = require("aws-sdk");
const responseConstructor = require("./responseConstructor");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = (event, context, callback) => {
  const { username, author, title, content } = JSON.parse(event.body);
  const res = responseConstructor(callback);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      username,
      author,
      title,
      content
    }
  };

  documentClient.put(params, err => {
    if (err) res.error(err, "Could not create an item.");
    else res.success(params.Item.id);
  });
};
