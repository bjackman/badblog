var fs = require('fs'),
    path = require('path'),
    _ = require('lodash')

module.exports = function(req, res){
  console.log(postInfos);
  res.render('posts', {config: config, posts: postInfos});
};