const https = require("https");
const jose = require("node-jose");
const { UserPoolId, ClientId } = require("./config");

const keys_url = `https://cognito-idp.${
  process.env.REGION
}.amazonaws.com/${UserPoolId}/.well-known/jwks.json`;

module.exports = token => {
  return new Promise((resolve, reject) => {
    const sections = token.split(".");
    // get the kid from the headers prior to verification
    let header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    const kid = header.kid;
    // download the public keys
    https.get(keys_url, function(response) {
      if (response.statusCode == 200) {
        response.on("data", function(body) {
          const keys = JSON.parse(body)["keys"];
          // search for the kid in the downloaded public keys
          let key_index = -1;
          for (let i = 0; i < keys.length; i++) {
            if (kid == keys[i].kid) {
              key_index = i;
              break;
            }
          }
          if (key_index == -1) {
            reject("Public key not found in jwks.json");
            return;
          }
          // construct the public key
          jose.JWK.asKey(keys[key_index]).then(function(result) {
            // verify the signature
            jose.JWS.createVerify(result)
              .verify(token)
              .then(function(result) {
                // now we can use the claims
                const claims = JSON.parse(result.payload);
                // additionally we can verify the token expiration
                const current_ts = Math.floor(new Date() / 1000);
                if (current_ts > claims.exp) {
                  reject("Token is expired");
                  return;
                }
                // and the Audience (use claims.client_id if verifying an access token)
                if (claims.aud != ClientId) {
                  reject("Token was not issued for this audience");
                  return;
                }
                resolve(claims);
              })
              .catch(function() {
                reject("Signature verification failed");
              });
          });
        });
      }
    });
  });
};
