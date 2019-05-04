const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { UserPoolId, ClientId } = require("./config");
const responseConstructor = require("../responseConstructor");
global.fetch = require("node-fetch");

module.exports.main = (event, context, callback) => {
  const { username, password, name } = JSON.parse(event.body);
  const res = responseConstructor(callback);
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId,
    ClientId
  });
  const attributes = [
    { Name: "email", Value: username },
    { Name: "name", Value: name }
  ];
  const attributeList = attributes.map(
    attribute => new AmazonCognitoIdentity.CognitoUserAttribute(attribute)
  );

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) res.error(err, err.message);
    else res.success(result.user);
  });
};
