const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) =>{

  //const id = "60994fb5edf2c4a10d5aa89d";

  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  const session = Buffer.from(JSON.stringify(sessionObject))
    .toString("base64");

  const sig = keygrip.sign("session="+ session);

  return { session, sig };
};