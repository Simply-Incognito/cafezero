const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require(`${__dirname}/../Models/userModel`);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/v1/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            // Extract user data from Google profile
            const email = profile.emails[0].value;
            const firstname = profile.name.givenName || "User";
            const lastname = profile.name.familyName || "";
            const photo = profile.photos[0]?.value;

            // Find or create user in database
            let user = await User.findOne({ email: email });

            if (!user) {
                // Create new user if doesn't exist
                // Generate a random password for OAuth users (they won't use it for login)
                const randomPassword = "oauthGeneratedPassword_" + Math.random().toString(36).slice(2);

                user = await User.create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    photo: photo,
                    password: randomPassword,
                    confirmPassword: randomPassword // Must match password
                });
                console.log("New Google user created:", user.email);
            } else {
                console.log("Existing Google user found:", user.email);
            }

            return cb(null, user);
        } catch (error) {
            return cb(error);
        }
    }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user._id); // Store only user ID in session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});