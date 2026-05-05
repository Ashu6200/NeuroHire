const { MongoClient } = require('mongodb');
const { config } = require('../config/config');
const logger = require('../utils/logger');
const { ApplicationEnvironment } = require('../constants');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} = require('./mail');

const isProd = config.ENV === ApplicationEnvironment.PRODUCTION;

let mongoClientPromise = null;
let authPromise = null;
let nodeAuthPromise = null;
let authHandlerPromise = null;

const getTrustedOrigins = () => {
  const origins = (config.ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((o) => {
      try {
        const url = new URL(o.trim());
        return `${url.protocol}//${url.host}`;
      } catch {
        return o.trim();
      }
    })
    .filter(Boolean);

  if (config.BETTER_AUTH_URL) {
    try {
      const url = new URL(config.BETTER_AUTH_URL);
      origins.push(`${url.protocol}//${url.host}`);
    } catch {
      origins.push(config.BETTER_AUTH_URL);
    }
  }
  return [...new Set(origins)];
};

const getMongoClient = async () => {
  if (!mongoClientPromise) {
    const client = new MongoClient(config.MONGODB_URI);
    mongoClientPromise = client.connect().then(() => client);
    mongoClientPromise.catch(() => {
      mongoClientPromise = null;
    });
  }
  return mongoClientPromise;
};

const getBetterAuthNode = async () => {
  if (!nodeAuthPromise) {
    nodeAuthPromise = import('better-auth/node');
    nodeAuthPromise.catch(() => {
      nodeAuthPromise = null;
    });
  }
  return nodeAuthPromise;
};

const getAuth = async () => {
  if (!authPromise) {
    authPromise = Promise.all([
      import('better-auth'),
      import('better-auth/adapters/mongodb'),
      import('better-auth/plugins'),
      getMongoClient(),
    ]).then(
      ([{ betterAuth, APIError }, { mongodbAdapter }, { admin }, client]) =>
        betterAuth({
          appName: 'NeuroHire',
          baseURL: config.BETTER_AUTH_URL || `http://localhost:${config.PORT}`,
          basePath: '/api/auth',
          secret: config.BETTER_AUTH_SECRET,
          trustedOrigins: getTrustedOrigins(),

          database: mongodbAdapter(client.db(), { client }),

          emailAndPassword: {
            enabled: true,
            minPasswordLength: 6,
            maxPasswordLength: 128,
            requireEmailVerification: false,
            autoSignIn: false,
            resetPasswordTokenExpiresIn: 3600,
            revokeSessionsOnPasswordReset: true,

            sendResetPassword: async ({ user, url }) => {
              try {
                await sendPasswordResetEmail({
                  name: user.name,
                  email: user.email,
                  url,
                });
              } catch (error) {
                logger.error('[auth] Failed to send password reset email', {
                  email: user.email,
                  error: error.message,
                });
                throw error;
              }
            },

            onPasswordReset: async ({ user }) => {
              try {
                await sendPasswordResetSuccessEmail({
                  name: user.name,
                  email: user.email,
                });
              } catch (error) {
                logger.warn('[auth] Failed to send reset success email', {
                  email: user.email,
                  error: error.message,
                });
              }
            },
          },

          emailVerification: {
            sendOnSignUp: true,
            sendOnSignIn: isProd,
            autoSignInAfterVerification: true,
            expiresIn: 3600,

            sendVerificationEmail: async ({ user, url }) => {
              try {
                const frontendUrl = config.FRONTEND_URL;
                const verificationUrl = new URL(url);
                verificationUrl.searchParams.set(
                  'callbackURL',
                  `${frontendUrl}/sign-in`,
                );

                await sendVerificationEmail({
                  name: user.name,
                  email: user.email,
                  url: verificationUrl.toString(),
                });
              } catch (error) {
                logger.error('[auth] Failed to send verification email', {
                  email: user.email,
                  error: error.message,
                });
                throw error;
              }
            },
          },

          session: {
            expiresIn: 60 * 60 * 24 * 7,
            updateAge: 60 * 60 * 24,
            cookieCache: {
              enabled: true,
              maxAge: 60 * 5,
            },
          },

          user: {
            modelName: 'users',
            changeEmail: {
              enabled: true,
              sendChangeEmailVerification: false,
            },
            deleteUser: {
              enabled: true,
            },
            additionalFields: {
              role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false,
              },
              plan: {
                type: 'string',
                required: false,
                defaultValue: 'free',
                input: false,
              },
              status: {
                type: 'string',
                required: false,
                defaultValue: 'active',
                input: false,
              },
              permissions: {
                type: 'string[]',
                required: false,
                defaultValue: [],
                input: false,
              },
              subscriptionId: { type: 'string', required: false, input: false },
              razorpayCustomerId: {
                type: 'string',
                required: false,
                input: false,
              },
              lastLoginAt: { type: 'date', required: false, input: false },
            },
          },

          databaseHooks: {
            session: {
              create: {
                before: async (session) => {
                  const UserModel = require('../models/userModel');
                  const appUser = await UserModel.findOne({
                    id: session.userId,
                  });

                  if (appUser?.status === 'suspended') {
                    throw new APIError('FORBIDDEN', {
                      message:
                        'Your account has been suspended. Please contact support.',
                      code: 'ACCOUNT_SUSPENDED',
                    });
                  }

                  if (appUser?.status === 'deleted') {
                    throw new APIError('FORBIDDEN', {
                      message: 'This account no longer exists.',
                      code: 'ACCOUNT_DELETED',
                    });
                  }
                },
                after: async (session) => {
                  const UserModel = require('../models/userModel');
                  const now = new Date();
                  const appUser = await UserModel.findOne({
                    id: session.userId,
                  });

                  // Throttle lastLoginAt update to once per hour
                  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                  if (
                    !appUser.lastLoginAt ||
                    appUser.lastLoginAt < oneHourAgo
                  ) {
                    await UserModel.updateOne(
                      { id: session.userId },
                      { $set: { lastLoginAt: now } },
                    );
                  }
                },
              },
            },
            user: {
              delete: {
                after: async (user) => {
                  const UserModel = require('../models/userModel');
                  // Hard delete or Soft delete based on requirement.
                  // Here we'll do a soft delete to preserve historical data but block access.
                  await UserModel.updateOne(
                    { id: user.id },
                    { $set: { status: 'deleted' } },
                  );
                },
              },
            },
          },

          plugins: [
            admin({
              defaultRole: 'user',
              roles: ['admin', 'support'],
            }),
          ],

          advanced: {
            defaultCookieAttributes: {
              httpOnly: true,
              secure: isProd,
              sameSite: isProd ? 'none' : 'lax',
              path: '/',
            },
            ipAddress: {
              ipAddressHeaders: ['x-forwarded-for', 'cf-connecting-ip'],
            },
          },

          logger: {
            level: isProd ? 'error' : 'warn',
            log: (level, message, ...args) => {
              const msg = `[BetterAuth] ${message}`;
              if (level === 'error') logger.error(msg, ...args);
              else if (level === 'warn') logger.warn(msg, ...args);
              else if (level === 'debug') logger.debug(msg, ...args);
              else logger.info(msg, ...args);
            },
          },

          onAPIError: {
            throw: true,
            onError: (error) => {
              logger.warn('[BetterAuth] API error', {
                message: error.message,
                status: error.status,
                code: error.body?.code,
              });
            },
          },
        }),
    );

    authPromise.catch(() => {
      authPromise = null;
    });
  }

  return authPromise;
};

const getAuthHandler = async () => {
  if (!authHandlerPromise) {
    authHandlerPromise = Promise.all([getAuth(), getBetterAuthNode()]).then(
      ([auth, { toNodeHandler }]) => toNodeHandler(auth),
    );
    authHandlerPromise.catch(() => {
      authHandlerPromise = null;
    });
  }
  return authHandlerPromise;
};

const getSessionFromRequest = async (req) => {
  const [auth, { fromNodeHeaders }] = await Promise.all([
    getAuth(),
    getBetterAuthNode(),
  ]);
  return auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
};

const validateAuthConfig = () => {
  const required = ['BETTER_AUTH_SECRET', 'MONGODB_URI', 'BETTER_AUTH_URL'];
  const smtp = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
  ];
  const missing = [...required, ...smtp].filter((key) => !config[key]);
  if (missing.length > 0) {
    logger.warn('[auth] Missing config keys — some features may not work', {
      missing,
    });
  }
};

validateAuthConfig();

module.exports = { getAuth, getAuthHandler, getSessionFromRequest };
