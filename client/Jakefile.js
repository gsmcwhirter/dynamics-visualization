desc('Build all files');
task('default', function (){

});

desc('Build all files for distribution');
task('dist', function (){

});

desc('Provide a link to the tests');
task('test', function (){
  //build and copy the tests into build
  console.log("Open file://%s/build/test.html for testing.", __dirname);
});

namespace('markup', function (){
  desc('Compile jade templates');
  task('jade', function (){
  
  });
  
  desc('Build all relevant files');
  task('build', function (){
  
  });
  
  desc('Compile and copy relevant files to dist');
  task('dist', function (){
  
  });
});

namespace('css', function (){
  desc('Compile stylus templates');
  task('stylus', function (){
  
  });
  
  desc('Build all relevant files');
  task('build', function (){
  
  });
  
  desc('Compile, minify, and copy relevant files to dist');
  task('dist', function (){
  
  });
});

namespace('js', function (){
  desc('Build all relevant files');
  task('build', function (){
  
  });

  desc('Minify and copy relevant libraries to dist');
  task('dist', function (){
  
  });
});
