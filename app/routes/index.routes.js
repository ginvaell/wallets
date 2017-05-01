module.exports = function (app) {
    const userController = require('../controllers/users.controller');
    const pagesController = require('../controllers/pages.controller');

    app.route('/')
        .get(pagesController.index);

    app.route('/login')
        .get((req, res) => {
            if (req.session.user) {
                res.redirect('/');
                return;
            }

            res.render('login');
        })
        .post(userController.login);

    app.route('/logout')
        .get(userController.logout);

    app.route('/register')
        .get((req, res) => {
            if (req.session.user) {
                res.redirect('/');
                return;
            }

            res.render('registration', {user: {}});
        })
        .post(userController.create);

    app.route('/404')
        .get((req, res) => res.render('404'));
};