const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const responseConstrcutor = require("../responseConstructor");
const { UserPoolId, ClientId } = require("./config");
global.fetch = require("node-fetch");

module.exports.main = (event, context, callback) => {
  const { username: Username, token: RefreshToken } = JSON.parse(event.body);
  const res = responseConstrcutor(callback);
  const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
    RefreshToken
  });
  const Pool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId,
    ClientId
  });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username, Pool });

  cognitoUser.refreshSession(refreshToken, (err, session) => {
    if (err) res.error(err, err.message);
    else {
      const idToken = session.getIdToken();
      const refreshToken = session.getRefreshToken();

      res.success({
        username: Username,
        name: idToken.payload.name,
        idToken: idToken.getJwtToken(),
        refreshToken: refreshToken.getToken()
      });
    }
  });
};
