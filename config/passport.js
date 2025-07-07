const LocalStrategy = require("passport-local").Strategy;
const { authUser, deserialize } = require("../controllers/userController");

module.exports = function(passport) {
    passport.use(new LocalStrategy(authUser));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(deserialize);
};
