const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = require('../../config');
const repo = require('./auth.repository');
const { send } = require('../../utils/email');
const { sign } = require('../../utils/jwt');

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

exports.signup = async ({ email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await repo.createUser({ email, passwordHash, verifyCode: code });
  await send({ to: email, subject: 'Verify Email', text: `Your code: ${code}` });
  return { id: user.id, email: user.email };
};

exports.login = async ({ email, password }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await require('bcryptjs').compare(password, user.password || '');
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (!user.verified) throw Object.assign(new Error('Email not verified'), { status: 401 });
  const roles = await repo.getUserRoles(user.id);
  const token = sign({ userId: user.id, roles });
  return { token };
};

exports.verifyEmail = async ({ email, code }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  if (user.verify_code !== code) throw Object.assign(new Error('Invalid code'), { status: 400 });
  await repo.verifyEmail(email);
  return { message: 'Email verified' };
};

exports.resetSend = async ({ email }) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await repo.setResetCode(email, code);
  await send({ to: email, subject: 'Password Reset Code', text: `Your code: ${code}` });
  return { message: 'Code sent' };
};

exports.resetVerify = async ({ email, code, newPassword }) => {
  const user = await repo.findUserByEmail(email);
  if (!user || user.reset_code !== code) throw Object.assign(new Error('Invalid code'), { status: 400 });
  const hash = await require('bcryptjs').hash(newPassword, 10);
  await repo.updatePasswordByEmail(email, hash);
  return { message: 'Password updated' };
};

exports.googleLogin = async ({ token }) => {
  if (!googleClient) throw Object.assign(new Error('Google login not configured'), { status: 503 });
  const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
  const email = ticket.getPayload().email;
  const userId = await repo.ensureUserWithGoogle(email);
  const roles = await repo.getUserRoles(userId);
  const jwt = sign({ userId, roles });
  return { token: jwt };
};

