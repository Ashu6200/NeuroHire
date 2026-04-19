const genrateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return { otp, otpExpiry }
}
module.exports = genrateOTP;