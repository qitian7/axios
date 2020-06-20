module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // 初始化配置 grunt任务
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> by Matt Zabriskie */\n'
    },

    clean: {
      dist: 'dist/**'
    },

    ts: {
      test: {
        options: { // List of library files to be included in(包含) the compilation(编译)
          lib: [
            'es5',
            'es2015.promise',
            'dom'
          ]
        },
        src: ['typings/index.d.ts', 'test/typescript/*.ts']
      }
    },

    package2bower: {
      all: {
        fields: [
          'name',
          'description',
          'version',
          'homepage',
          'license',
          'keywords'
        ]
      }
    },

    usebanner: {
      all: {
        options: {
          banner: '<%= meta.banner %>',
          linebreak: false
        },
        files: {
          src: ['dist/*.js']
        }
      }
    },

    eslint: {
      target: ['lib/**/*.js']
    },

    karma: { // e2e
      options: {
        configFile: 'karma.conf.js'
      },
      single: { // 只测一次  single run
        singleRun: true
      },
      continuous: { // watch, 一直测, 改了就测
        singleRun: false
      }
    },

    mochaTest: {
      test: {
        src: ['test/unit/**/*.js']
      },
      options: {
        timeout: 30000,
      },
    },

    watch: { // 热更新 (真正的自动化)
      build: {
        files: ['lib/**/*.js'],
        tasks: ['build']
      },
      test: {
        files: ['lib/**/*.js', 'test/**/*.js', '!test/typescript/axios.js', '!test/typescript/out.js'],
        tasks: ['test']
      }
    },

    webpack: require('./webpack.config.js')
  });

  // 注册默认任务
  grunt.registerMultiTask('package2bower', 'Sync package.json to bower.json', function () {
    var npm = grunt.file.readJSON('package.json');
    var bower = grunt.file.readJSON('bower.json');
    var fields = this.data.fields || [];

    for (var i=0, l=fields.length; i<l; i++) {
      var field = fields[i];
      bower[field] = npm[field];
    }

    grunt.file.write('bower.json', JSON.stringify(bower, null, 2));
  });

  // 注册默认任务
  //    执行任务是同步的, 依次往后
  // grunt.registerTask('test', 'Run the jasmine and mocha tests', ['ts']);
  grunt.registerTask('test', 'Run the jasmine and mocha tests', ['eslint', 'mochaTest', 'karma:single', 'ts']);
  grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
  grunt.registerTask('version', 'Sync version info for a release', ['usebanner', 'package2bower']);
};
