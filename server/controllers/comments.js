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




