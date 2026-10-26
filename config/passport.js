const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Demo storage: users are kept in memory and reset when the server restarts.
// Replace this array with a database for a real application.
const users = [];
let nextId = 1;

function findUserByEmail(email) {
  return users.find((user) => user.email === email.toLowerCase());
}

function configurePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = findUserByEmail(email);
          if (!user) return done(null, false, { message: 'Невірний email або пароль.' });

          const passwordMatches = await bcrypt.compare(password, user.passwordHash);
          if (!passwordMatches) {
            return done(null, false, { message: 'Невірний email або пароль.' });
          }

          return done(null, { id: user.id, email: user.email });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    const user = users.find((item) => item.id === id);
    if (!user) return done(null, false);
    return done(null, { id: user.id, email: user.email });
  });
}

async function registerUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  if (findUserByEmail(normalizedEmail)) {
    const error = new Error('Користувач із таким email уже існує.');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = { id: nextId++, email: normalizedEmail, passwordHash };
  users.push(user);
  return { id: user.id, email: user.email };
}

module.exports = configurePassport;
module.exports.registerUser = registerUser;
