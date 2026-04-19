const { generateQuestions } = require('./generateQuestions');
const genrateOTP = require('./genrateOTP');
const limiter = require('./limiter');
const sendMail = require('./sendMail');

module.exports = {
  limiter,
  sendMail,
  genrateOTP,
  generateQuestions,
};
