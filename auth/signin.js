const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const responseConstructor = require("../responseConstructor");
const { UserPoolId, ClientId } = require("./config");
global.fetch = require("node-fetch");

module.exports.main = (event, context, callback) => {
  const { username: Username, password: Password } = JSON.parse(event.body);
  const res = responseConstructor(callback);
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    { Username, Password }
  );
  const Pool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId,
    ClientId
  });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username,
    Pool
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: result => {
      const idToken = result.getIdToken();
      const refreshToken = result.getRefreshToken().getToken();

      res.success({
        username: Username,
        name: idToken.payload.name,
        idToken: idToken.getJwtToken(),
        refreshToken
      });
    },
    onFailure: err => res.error(err, err.message)
  });
};
