module.exports = function (req, resp, next) {
    if (!req.session.userId) {
        resp.status(400).send("You are not logged in");
    } else {
        next();
    }
}
