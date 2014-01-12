var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    strftime = require('strftime')

module.exports = function(req, res){
  // get first 5 posts
  fs.readdir(__dirname+'/../../posts/', function(err, files){
    var postInfo;
    if(req.params.name === 'recent'){
      postInfo = postInfos[files.length - 1];
    }
    else {
      try {
        postInfo = _.find(postInfos, {url: req.params.name})
      } catch (err) {
        res.status(404).send("nope");
        return;
      }
    }
    postInfo.meta.date = strftime("%B %d, %Y", new Date(postInfo.meta.date))
    res.render('index', {
      config: config,
      meta: postInfo.meta,
      content: postInfo.html
    });
  })
};