//get Comments Model
var Comments = require('../models/comments');

//List Comments
exports.list = function (req, res) {
    //List all Comments and sort by Date

    Comments.find().sort('-created').populate('user', 'local.email').exec(function (error, comments) {
        if (error)
            return res.send(400, { message: error })
    });

    //Render results
    res.render('comments', {
        title: 'Comments Page',
        comments: comments
    });

};

//Create Comments

exports.create = function (req, res) {

    var comments = new Comments(req.body);
    comments.user = req.user;
    comments.save(function (error) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }
        res.redirect('/comments');
    });
};

//Comments authorization middleware

exports.hasAuthorization = function(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect('/login');
};




