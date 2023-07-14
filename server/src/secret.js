require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3002

const mongoDBUrl = process.env.MONGODB_ATLAS_URL

const defaultUserImage = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/user.webp'

const jwtSecretKey = process.env.JWT_SECRET_KEY

const smtpUser = process.env.SMTP_USERNAME

const smtpPass = process.env.SMTP_PASSWORD

const clientURL = process.env.CLIENT_URL

module.exports = {serverPort, mongoDBUrl, defaultUserImage, jwtSecretKey, smtpUser, smtpPass, clientURL}