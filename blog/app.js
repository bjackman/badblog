var express = require('express')
  , marked = require('meta-marked')
  , posts = require('./routes/posts')
  , post = require('./routes/post')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , _ = require('lodash')
  , strftime = require('strftime')

var app = express();

// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('domain', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){res.redirect('/post/recent')});
app.get('/posts', posts)
app.get('/post/:name', post)

console.log("hello world");
config = {}
postInfos = []
var i = 1
fs.readFile(__dirname+'/../config.json', function(err, data){
  if(err) throw err
  config = JSON.parse(data)
  fs.readdir(__dirname+'/../posts/', function(err, files){
    _.each(files, function(file){
      fs.readFile(__dirname+'/../posts/'+file, 'utf8', function(err, content){
        var info = marked(content);
        info.fileName = file;
        info.meta = info.meta || {};
        if (info.meta.date) {
          info.meta.date = new Date(info.meta.date);
          if (info.meta.date.toString() != "Invalid Date") {
            info.meta.dateString = strftime("%B %d, %Y", new Date(info.meta.date));
          }
        }
        if (!info.meta.title) {
          info.meta.title = content.split('===')[0].replace(/(\r\n|\n|\r)/gm,"")
        }
        info.url = encodeURIComponent(info.meta.title.replace(/ /g, "_"));
        postInfos.push(info)
        if(i >= files.length){
          postInfos.sort(function(a, b) {
            aDate = a.meta.date || new Date(0);
            bDate = b.meta.date || new Date(0);
            return bDate - aDate;
          })
          http.createServer(app).listen(app.get('port'), app.get("domain"), function(){
            console.log('Express server listening on port ' + app.get('port'));
          });
        }
        i++
      })
    })
  })
})