export const showHomePage = (req, res) => {
    res.render('index', { title: 'Home', messages: req.session.messages || [] });
};