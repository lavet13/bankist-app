require('dotenv').config();

const admin = require('firebase-admin');

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

exports.handler = async event => {
  try {
    console.log(event);
    console.log('yo');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    return { statusCode: 200, body: JSON.stringify({ admin }) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error }) };
  }
};
