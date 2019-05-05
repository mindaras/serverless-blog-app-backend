const uuid = require("uuid");
const AWS = require("aws-sdk");
const responseConstructor = require("../responseConstructor");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = (event, context, callback) => {
  const { username, author, idToken, title, content } = JSON.parse(event.body);
  const res = responseConstructor(callback);

  decodeVerify(idToken)
    .then(({ email }) => {
      if (email !== username) {
        res.error(401, "Unauthorized operation.");
        return;
      }

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
    })
    .catch(e => res.error(401, "Unauthorized operation."));
};
