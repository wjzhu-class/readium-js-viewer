'use strict';

module.exports = function(grunt) {

    grunt.registerTask("epubReadingSystem_processModules", function() {
        Array.isArray = Array.isArray || function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };

        var processModules = function(basePath, json) {
            for (var prop in json) {
                if (!json.hasOwnProperty(prop)) continue;

                if (prop === "modules" && Array.isArray(json[prop])) {
                    for (var i = 0; i < json[prop].length; i++) {
                        var module = json[prop][i];

                        if (typeof module === "string") {
                            var fullPath = basePath + "/" + json[prop];

                            var moduleJson = require(fullPath);
                            json[prop][i] = moduleJson;

                            var slash = fullPath.lastIndexOf("/");
                            var rebased = fullPath.substr(0, slash);


                            grunt.option('epubReadingSystem_moduleMap_' + rebased, json[prop][i]);
                            //grunt.config.set(["git-describe", "options", "moduleMap", rebased], json[prop][i]);
                            grunt.task.run('epubReadingSystem_gitDescribe:' + rebased);

                            processModules(rebased, moduleJson);
                        }
                    }
                }
            }
        };

        var epubReadingSystem = grunt.option('epubReadingSystem_JSON');

        processModules(process.cwd(), epubReadingSystem.readium);
    });

    return {};
};
