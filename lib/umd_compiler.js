import AbstractCompiler from './abstract_compiler';
import { isEmpty } from './utils';
import path from 'path';

class UMDCompiler extends AbstractCompiler {
  stringify() {
    var deps            = this.dependencyNames,
        argsAndPreamble = this.buildPreamble(deps),
        wrapperArgs     = argsAndPreamble[0],
        preamble        = argsAndPreamble[1],
        exports_        = this.exports,
        exportDefault   = this.exportDefault,
        moduleName      = this.moduleName,
        lines           = this.lines,
        inner;

    return this.build(function(s) {

      if(!isEmpty(this.exports)) {
        deps.push('exports');
        wrapperArgs.push('exports');
      }

      forEach(deps, function(dependency, i) {
        if (/^\./.test(dependency)) {
          deps[i] = path.join(moduleName, '..', dependency).replace(/[\\]/g, '/');
        }
      });

      inner = s.capture(function() {
        s.func('factory', function() {
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
                  s.useStrict();
                  var factoryCall = s.capture(function(){
                    s.call('factory', function(factoryArgs) {
                      factoryArgs(wrapperArgs);
                    });

                    if(exportDefault){
                      s.line("return " + factoryCall);
                    } else {
                      s.line(factoryCall);
                    }
                  });
                });

                s.outdent();
                s.append("} else if(typeof exports === 'object') {");
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

              deps = s.unique('dependency');

              var inParen = s.capture(function() {
                s.call(inner, function(args) {
                  return args(function() {
                    return s.func(wrapperArgs, function() {
                      s.useStrict();

                      forEach(imports, function(import_, variables) {
                        if(Object.keys(variables).length == 1) {
                          name = Object.keys(variables)[0];
                        } else {
                          dependency = deps.next();

                          forEach(variables, function(name, alias) {
                            if(name == 'default') {
                              s.variable(alias, dependency);
                            } else {
                              s.variable(alias, s.prop(dependency, name));
                            }
                          });
                        }
                      });

                      s.append(...lines);

                      forEach(exports, function(exportName, exportValue) {
                        s.line("exports." + exportName + " = " + exportValue);
                      });

                      if(exportDefault) {
                        s.line("return" + exportDefault);
                      }
                    });
                  });
                });
              });
            });
          });
        });
        s.line("(" + inParen + ")");
    });

  });
}

export default UMDCompiler;
