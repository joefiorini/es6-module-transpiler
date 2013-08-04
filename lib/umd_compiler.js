import AbstractCompiler from './abstract_compiler';
import { forEach, isEmpty } from './utils';
import path from 'path';

class UMDCompiler extends AbstractCompiler {
  stringify() {
    var deps            = this.dependencyNames,
        argsAndPreamble = this.buildPreamble(deps),
        wrapperArgs     = argsAndPreamble[0],
        preamble        = argsAndPreamble[1],
        exports_        = this.exports,
        exportDefault   = this.exportDefault,
        importDefault   = this.importDefault,
        moduleName      = this.moduleName,
        imports         = this.imports,
        lines           = this.lines,
        name,
        dependency,
        factoryCall,
        inParen,
        inner;

    return this.build(function(s) {

      if(!isEmpty(exports_)) {
        deps.push('exports');
        wrapperArgs.push('exports');
      }

      forEach(deps, function(dependency, i) {
        if (/^\./.test(dependency)) {
          deps[i] = path.join(moduleName, '..', dependency).replace(/[\\]/g, '/');
        }
      });

      inner = s.capture(function() {
        s.func(['factory'], function() {
          s.append("if (typeof define === 'function' && define.amd) {");
          s.indent();

          s.line(function() {
            s.call('define', function(arg) {
              if(moduleName) {
                arg(s.print(moduleName));
              }
              arg(s.linebreak);
              arg(s.print(deps));
              arg(s.linebreak);
              arg(function() {
                s.func(wrapperArgs, function() {
                  factoryCall = s.capture(function(){
                    s.call('factory', function(factoryArgs) {
                      factoryArgs(wrapperArgs);
                    });
                  });

                  if(exportDefault){
                    s.line("return " + factoryCall);
                  } else {
                    s.line(factoryCall);
                  }
                });
              });
            });
          });
          s.outdent();
          s.append("} else if (typeof exports === 'object') {");
          s.indent();

          var cjsArgs = [];

          function doImport(name, import_, prop) {
            cjsArgs.push(s.capture(function() {
              s.call('require', [s.print(import_)]);
            }));
          }

          forEach(importDefault, doImport);

          forEach(imports, doImport);

          if(!isEmpty(exports_)) {
            cjsArgs.push('exports');
          }

          factoryCall = s.capture(function() {
            s.call('factory', function(factoryArgs) {
              factoryArgs(cjsArgs);
            });
          });

          if(exportDefault) {
            s.line('module.exports = ' + factoryCall);
          } else {
            s.line(factoryCall);
          }

          s.outdent();
          s.append('} else {');
          s.indent();
          s.line("throw new Error('root UMD compilation not yet implemented')");
          s.outdent();
          s.append("}");
        });
      });

      deps = s.unique('dependency');

      inParen = s.capture(function() {
        s.call(inner, function(args) {
          args(function() {
            s.func(wrapperArgs, function() {
              s.useStrict();

              forEach(imports, function(variables, import_) {
                if(Object.keys(variables).length == 1) {
                  name = Object.keys(variables)[0];
                } else {
                  dependency = deps.next();

                  forEach(variables, function(alias, name) {
                    // console.log("variables: ", variables);
                    // console.log("alias: ", alias);
                    // console.log("name: ", name);
                    // console.log("dep: ", dependency);
                    if(name == 'default') {
                      s.variable(alias, dependency);
                    } else {
                      s.variable(alias, dependency + "." + name);
                    }
                  });
                }
              });

              s.append(...lines);

              forEach(exports_, function(exportValue, exportName) {
                s.line("exports." + exportName + " = " + exportValue);
              });

              if(exportDefault) {
                s.line("return " + exportDefault);
              }
            });
          });
        });
      });
      s.line("(" + inParen + ")");
      console.log(s.toString().split("\n").slice(0,45).join("\n"));
    });
  }
}

export default UMDCompiler;
