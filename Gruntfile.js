module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['index.js', 'web/js/**/*.js']
    },
    watch: {
      scripts: {
        files: ['web/js/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // watch tasks
  grunt.loadNpmTasks('grunt-contrib-watch');

  // js hint, validate and clean javascript
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};
