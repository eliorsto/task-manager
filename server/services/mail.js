const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const mail = async (email, subject, message) => {
	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_SERVER,
		port: process.env.MAIL_SERVER_PORT,
		secure: true,
		auth: {
			user: process.env.MAIL,
			pass: process.env.MAIL_AUTH
		}
	});

	const mailOptions = {
		from: process.env.MAIL,
		to: email,
		subject,
		html: message
	};

	try {
		const info = await transporter.sendMail(mailOptions);

		return {
			status: 'SUCCESS',
			msg: info.response
		};
	} catch (err) {
		return {
			status: 'ERROR',
			msg: err.message
		}

	}
}

const generateResetToken = () => {
	const token = crypto.randomBytes(20).toString('hex');
	const resetToken = jwt.sign({ token }, process.env.JWT_RESET_PASSWORD_SECRET, {
		expiresIn: '1h'
	});
	return resetToken;
}

const verifyResetToken = (resetToken) => {
	try {
		const decoded = jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD_SECRET);
		return decoded;
	} catch (err) {
		console.error('Token verification failed:', err.message);
		return null;
	}
}

const getMailTemplateWithLink = (fullName, buttonUrl) => {
	return `<!DOCTYPE html>
    <html>
    <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
      <div
        style="
          max-width: 400px;
          margin: 10px;
          background-color: #fafafa;
          padding: 25px;
          border-radius: 20px;
        "
      >
        <p style="text-align: left;">
          Hello, ${fullName}
		  Please press the button below to reset your password
        </p>
        <a href="${buttonUrl}" target="_blank">
          <button
            style="
              background-color: blue;
              border: 0;
              width: 200px;
              height: 30px;
              border-radius: 6px;
              color: #fff;
			  cursor: pointer;
            "
          >
            Reset Password
          </button>
        </a>
        <p style="text-align: left;">
          If you are unable to click the above button, copy paste the below URL into your address bar
        </p>
        <a href="${buttonUrl}" target="_blank">
            <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
              ${buttonUrl}
            </p>
        </a>
		TaskPilot
      </div>
    </body>
  </html>`;
}

module.exports = {
	mail,
	generateResetToken,
	verifyResetToken,
	getMailTemplateWithLink
}