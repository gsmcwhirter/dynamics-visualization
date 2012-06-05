var fs = require("fs")
  , util = require("util")
  , cleancss = require("clean-css")
  , jade = require("jade")
  , stylus = require("stylus")
  , minify = require("jake-uglify").minify
  , path = require("path")
  , rimraf = require("rimraf")
  ;
  
function abspath (pathname) {
    if (pathname[0] === '/') return pathname;
    return path.join(process.env.PWD, path.normalize(pathname));
}

function copyfile(from, to, callback){  
  var fromstream = fs.createReadStream(from)
    , tostream = fs.createWriteStream(to, {flags: 'w'})
    ;

  util.pump(fromstream, tostream, callback);  
}

function copyfiles(files, callback){
  var undone = files.length
    , failures = []
    ;
  
  function next(err){
    undone -= 1;
    if (err){
      console.log("Failed: " + err);
      failures.push(err);
    }
    
    if (undone === 0){
      if (failures.length){
        callback(failures);
      }
      else {
        callback();
      }
    }
    
  }
  
  files.forEach(function (task){
    copyfile(task.from, task.to, next);
  });  
}

desc('Build all files');
task('default', ['build']);

desc('Build all files');
task("build", ["check:build", "markup:build", "js:build", "css:build", "applet:build"]);

desc('Build all files for distribution');
task("dist", ["check:dist", "markup:dist", "js:dist", "css:dist", "applet:dist"]);

desc('Provide a link to the tests');
task('test', ['build'], function (){
  console.log("Open file://%s/build/test.html for testing.", __dirname);
});

namespace('check', function (){
  function dircheck(path){
    return function (params){
      params = params || {};
      console.log("Checking for %s directory...", path);
      fs.stat(path, function (err, stats){
        if (err || !stats.isDirectory()){
          if (!params.retried){
            console.log("Attempting to create %s directory...", path);
            //attempt to create
            fs.mkdirSync(path, '0755');
            //recheck
            dircheck(path)({retried: true, noclean: true});
          }
          else {
            fail('Unable to create ' + path + ' directory');
          }
        }
        else if (stats.isDirectory() && !params.noclean){
          console.log("Nuking %s directory...", path);
          
          rimraf(path, function (err){
            if (err){
              fail("Unable to clean the " + path + " directory");
            }
            else {
              dircheck(path)({noclean: true});
            }
          });
        }
        else {
          console.log("The %s directory exists and is empty.", path);
          complete();
        }
      });
    };
  }

  desc('Check for build directory');
  task('build', dircheck('build'), {async: true});
  
  desc('Check for build/js directory');
  task('build_js', dircheck('build/js'), {async: true});
  
  desc('Check for build/css directory');
  task('build_css', dircheck('build/css'), {async: true});
  
  desc('Check for dist directory strucutre');
  task('dist', dircheck('dist'), {async: true});
  
  desc('Check for dist/js directory');
  task('dist_js', dircheck('build/js'), {async: true});
  
  desc('Check for dist/css directory');
  task('dist_css', dircheck('dist/css'), {async: true});
});

namespace('markup', function (){
  desc('Compile jade templates');
  task('jade', function (){
    console.log("Rendering jade/index.jade to build/index.html...");
    var source = fs.readFileSync("jade/index.jade");

    var fn = jade.compile(source, {filename: "jade/index.jade"});
    var locals = {};

    fs.writeFileSync("build/index.html", fn(locals));
  });
  
  desc('Set up the test.html file');
  task('test.html', function (){
    console.log("Copying the test.html file to build...");
    copyfile('test.html', 'build/test.html', function (err){
      if (err){
        fail("Failed to copy the test.html file.");
      }
      else {
        complete();
      }
    });
  }, {async: true});
  
  desc('Build all relevant files');
  task('build', function (){
    console.log("Building all markup files...");
    jake.Task["markup:jade"].invoke();
    jake.Task["markup:test.html"].invoke();
  });
  
  desc('Compile and copy relevant files to dist');
  task('dist', function (){
    //TODO
  });
});

namespace('css', function (){
  desc('Compile stylus templates');
  task('stylus', function (){
    //TODO
  });
  
  desc('Build all relevant files');
  task('build', ['check:build_css'], function (){
    console.log("Building css files...");
    
    jake.Task['css:stylus'].invoke();
    
    var files = [
            {from: 'node_modules/mocha/mocha.css', to: 'build/css/mocha.css'}
        ]
      ; 
    
    copyfiles(files, function (err){
      if (err){
        console.log(err);
        fail("Failed to copy css library files.");
      }
      else {
        console.log("CSS library files copied.");
        complete();
      }
    });
  });
  
  desc('Compile, minify, and copy relevant files to dist');
  task('dist', function (){
    //TODO
  });
});

namespace('js', function (){
  desc('Build all relevant files');
  task('build', ['check:build_js'], function (){
    console.log("Building javascript files...");
    jake.Task['js:build_lib'].invoke();
    jake.Task['js:build_app'].invoke();
  });
  
  desc('Copy appropriate libraries to build.');
  task('build_lib', function (){
    var files = [
            {from: 'js/jquery.js', to: 'build/js/jquery.js'}
          , {from: 'js/ember-debug.js', to: 'build/js/ember.js'}
          , {from: 'node_modules/mocha/mocha.js', to: 'build/js/mocha.js'}
          , {from: 'node_modules/expect.js/expect.js', to: 'build/js/expect.js'}
          , {from: 'test/test.js', to: 'build/js/test.js'}
        ]
      ;
      
    copyfiles(files, function (err){
      if (err){
        console.log(err);
        fail("Failed to copy javascript library files.");
      }
      else {
        console.log("Javascript library files copied.");
        complete();
      }
    });
  }, {async: true});
  
  desc('Build the application javascript files.');
  task('build_app', function (){
    console.log("Building javascript app files...");
    var files = [
            {from: 'js/app.js', to: 'build/js/app.js'}
        ]
      ; 
    
    copyfiles(files, function (err){
      if (err){
        console.log(err);
        fail("Failed to copy javascript app files.");
      }
      else {
        console.log("Javascript app files copied.");
        complete();
      }
    });
  }, {async: true});

  desc('Minify and copy relevant libraries to dist');
  task('dist', function (){
    //TODO
  });
});

namespace('applet', function (){
  desc('Build all relevant files');
  task('build', function (){
    console.log("Building fallback applet files...");
    var files = [
            {from: 'applet/dynamics-visualization.jar', to: 'build/dynamics-visualization.jar'}
          , {from: 'applet/dynamics-visualization.jnlp', to: 'build/dynamics-visualization.jnlp'}
        ]
      ;  
    
    copyfiles(files, function (err){
      if (err){
        console.log(err);
        fail("Failed to copy applet files.");
      }
      else {
        console.log("Applet files copied.");
        complete();
      }
    });
  });

  desc('Build and copy all relevant files to dist');
  task('dist', function (){
    //TODO
  });
});
