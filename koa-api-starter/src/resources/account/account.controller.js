const validators = require('./validators');

const userService = require('resources/user/user.service');
const authService = require('auth.service');
const emailService = require('email.service');

const securityUtil = require('security.util');
const config = require('config');

const createUserAccount = async (userData) => {
  const salt = await securityUtil.generateSalt();

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(userData.password, salt),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash: hash.toString(),
    passwordSalt: salt.toString(),
    email: userData.email,
    isEmailVerified: false,
    signupToken,
  });

  await emailService.sendSignupWelcome({ email: user.email, signupToken });

  return user;
};

/**
* Create user, company, default app, send signup confirmation email and
* create auth token for user to login
*/
exports.signup = async (ctx, next) => {
  const result = await validators.signup.validate(ctx);
  ctx.assert(!result.errors, 400);

  const userData = result.value;
  await createUserAccount(userData);

  ctx.body = {};
};

/**
* Verify user's email when user click a link from email
* sets `emailVerified` to true if token is valid
*/
exports.verifyEmail = async (ctx, next) => {
  const result = await validators.verifyEmail.validate(ctx);
  ctx.assert(!result.errors, 400);

  const data = result.value;
  const user = await userService.markEmailAsVerified(data.userId);

  const token = authService.createAuthToken({
    userId: user._id,
  });
  const loginUrl = `${config.webUrl}?token=${token}`;

  ctx.redirect(`${loginUrl}&emailVerification=true`);
};

/**
* Sign in user
* Loads user by email and compare password hashes
*/
exports.signin = async (ctx, next) => {
  const result = await validators.signin.validate(ctx);
  ctx.assert(!result.errors, 400);

  const signinData = result.value;

  const token = authService.createAuthToken({ userId: signinData.userId });

  ctx.body = {
    email: signinData.email,
    isEmailVerified: signinData.isEmailVerified,
    token,
  };
};

/**
* Send forgot password email with a unique link to set new password
* If user is found by email - sends forgot password email and update
* `forgotPasswordToken` field. If user not found, still return 200 response
*/
exports.forgotPassword = async (ctx, next) => {
  const result = await validators.forgotPassword.validate(ctx);
  ctx.assert(!result.errors, 400);

  const data = result.value;
  const user = await userService.findOne({ email: data.email });

  if (user) {
    let resetPasswordToken = user.resetPasswordToken;
    if (!resetPasswordToken) {
      resetPasswordToken = await securityUtil.generateSecureToken();
      await userService.updateResetPasswordToken(user._id, resetPasswordToken);
    }

    await emailService.sendForgotPassword(user, resetPasswordToken);
  }

  ctx.body = {};
};

/**
* Updates user password, used in combination with forgotPassword
*/
exports.resetPassword = async (ctx, next) => {
  const result = await validators.resetPassword.validate(ctx);
  ctx.assert(!result.errors, 400);

  const { userId, password } = result.value;

  await userService.updatePassword(userId, password);
  await userService.updateResetPasswordToken(userId, '');

  ctx.body = {};
};

exports.resendVerification = async (ctx, next) => {
  const email = ctx.request.body.email;
  const user = await userService.findOne({ email });

  if (user) {
    await emailService.sendSignupWelcome({ email, signupToken: user.signupToken });
  }

  this.body = {};
};
