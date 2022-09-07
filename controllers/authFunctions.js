
const isLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be signed in to do that!');
    res.redirect('/login')
}

const isAdmin = async (req, res, next) => {
    if (req.user.isAdmin === true) {
        return next();
    }
    req.flash('error', 'You must have Admin privileges for that!');
    res.redirect('/login')
}

module.exports = {
    isLoggedIn,
    isAdmin
}