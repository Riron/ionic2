var Package = require('dgeni').Package;
var jsdocPackage = require('dgeni-packages/jsdoc');
var nunjucksPackage = require('dgeni-packages/nunjucks');
var typescriptPackage = require('./typescript-package');
var linksPackage = require('./links-package');
var gitPackage = require('dgeni-packages/git');
var path = require('path');
var semver = require('semver');
var fs = require('fs');
var _ = require('lodash');

// Define the dgeni package for generating the docs
module.exports = function(currentVersion){

  return new Package('ionic-v2-docs', [jsdocPackage, nunjucksPackage, typescriptPackage, linksPackage, gitPackage])

.processor(require('./processors/latest-version'))
.processor(require('./processors/index-page'))
.processor(require('./processors/jekyll'))
.processor(require('./processors/remove-private-members'))

// for debugging docs
// .processor(function test(){
//   return {
//
//     $runBefore: ['rendering-docs'],
//     $process: function(docs){
//       docs.forEach(function(doc){
//         if (doc.members && doc.name == "IonicApp"){
//           doc.members.forEach(function(method){
//             if (method.name === "load") {
//               console.log(method);
//             }
//           })
//         }
//       })
//     }
//   }
// })

.config(function(log) {
  log.level = 'error'; //'silly', 'debug', 'info', 'warn', 'error'
})

.config(function(renderDocsProcessor, computePathsProcessor, versionInfo) {
  try {
    versions = fs.readdirSync(path.resolve(__dirname, '../../dist/ionic-site/docs/v2/'))
      .filter(semver.valid)
  } catch(e) {
    versions = [];
  }

  // new version, add it to the versions list
  if (currentVersion != 'nightly' && !_.contains(versions, currentVersion)){
    versions.unshift(currentVersion);
  }

  // sort by version so we can find latest
  versions.sort(semver.rcompare);
  // add nightly if it isn't in the list
  !_.contains(versions, 'nightly') && versions.unshift('nightly');

  //First semver valid version is latest
  var latestVersion = _.find(versions, semver.valid);
  versions = versions.map(function(version) {
    //Latest version is in docs root
    var folder = version == latestVersion ? '' : version;
    return {
      href: path.join('/docs/v2', folder),
      folder: folder,
      name: version
    };
  });

  var versionData = {
    list: versions,
    current: _.find(versions, { name: currentVersion }),
    latest: _.find(versions, {name: latestVersion}) || _.first(versions)
  };

  renderDocsProcessor.extraData.version = versionData;
  renderDocsProcessor.extraData.versionInfo = versionInfo;

  computePathsProcessor.pathTemplates = [{
    docTypes: ['class', 'var', 'function', 'let'],
    getOutputPath: function(doc) {
      // strip ionic from path root
      var docPath = doc.fileInfo.relativePath.replace(/^ionic\//, '');
      // remove filename since we have multiple docTypes per file
      docPath = docPath.substring(0, docPath.lastIndexOf('/') + 1);
      docPath += doc.name + '/index.md';
      var path = 'docs/v2/' + (versionData.current.folder || '') +
                     '/api/' +  docPath;

                    return path;
    }
  }];
})

//configure file reading
.config(function(readFilesProcessor, readTypeScriptModules) {

  // Don't run unwanted processors since we are not using the normal file reading processor
  readFilesProcessor.$enabled = false;
  readFilesProcessor.basePath = path.resolve(__dirname, '../..');

  readTypeScriptModules.basePath = path.resolve(path.resolve(__dirname, '../..'));
  readTypeScriptModules.sourceFiles = [
    'ionic/ionic.ts'
  ];
})

.config(function(parseTagsProcessor) {
  // We actually don't want to parse param docs in this package as we are getting the data out using TS
  // parseTagsProcessor.tagDefinitions.forEach(function(tagDef) {
  //   if (tagDef.name === 'param') {
  //     tagDef.docProperty = 'paramData';
  //     tagDef.transforms = [];
  //   }
  // });
})

// Configure links
.config(function(getLinkInfo) {
  getLinkInfo.useFirstAmbiguousLink = false;
})

// Configure file writing
.config(function(writeFilesProcessor) {
  writeFilesProcessor.outputFolder  = 'dist/ionic-site'
})

// Configure rendering
.config(function(templateFinder, templateEngine) {

  // Nunjucks and Angular conflict in their template bindings so change the Nunjucks
  // Also conflict with Jekyll
  templateEngine.config.tags = {
    variableStart: '<$',
    variableEnd: '$>',
    blockStart: '<@',
    blockEnd: '@>',
    commentStart: '<#',
    commentEnd: '#>'
  };

  // add custom filters to nunjucks
  templateEngine.filters.push(
    require('./filters/capital'),
    require('./filters/code')
  );

  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  // Specify how to match docs to templates.
  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.docType }.template.html',
    'common.template.html'
  ]
})
}
