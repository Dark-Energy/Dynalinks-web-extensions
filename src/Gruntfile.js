'use strict';
// Project configuration. 
module.exports = function(grunt) {
    var uglify_options = 
    {
        mangle: false,
        beautify: true,
        compress: {
            drop_console: false
        }       
    };
    
    var uglify_build = 
    {
        src: ['utils/filesaver.js', 'app/app.js','app/run.js','app/*.js'],
        dest: '../dynalinks-firefox/lib/app.js'
    };
    
    var concat = 
    {
      options: {
         separator: ';\n',
       },
       dist: {
          src: ['app/utils.js','js/*.js'],
          dest: '../dynalinks-firefox/scripts/dynalinks.min.js',
       },
    };
    
    
    var grunt_config = 
    {
        uglify: {
          options: uglify_options,
          build: uglify_build,
        },
       "concat": concat,
    };
    
	grunt.initConfig(grunt_config);
    grunt.loadNpmTasks('grunt-contrib-concat');            
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('dlink', ['concat']);
};