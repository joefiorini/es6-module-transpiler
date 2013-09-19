import AbstractCompiler from './abstract_compiler';
import SourceModifier from './source_modifier';
import AMDCompiler from './amd_compiler';
import CJSCompiler from './cjs_compiler';

class UMDCompiler extends AbstractCompiler {

  stringify() {
    var string = this.string.toString();  // string is actually a node buffer
    this.source = new SourceModifier(string);

    if (!this.options.global) this.options.global = "window";

    this.map = [];
    var out = this.buildPreamble(this.exports.length > 0);

    return out;
  }

  buildPreamble(hasExports) {
    var out = "",
        dependencyNames = this.dependencyNames;

    var amdCompiler = new AMDCompiler(this.compiler, this.options);
    amdCompiler.stringify(); //hack to set this.map = [] in AMDCompile
    var cjsCompiler = new CJSCompiler(this.compiler, this.options);
    cjsCompiler.stringify(); //hack to set this.map = [] in AMDCompile

    var amdPreamble;

    if (hasExports) dependencyNames.push("exports");

    out += "(function(factory) {\n";

    out += "  if (typeof define === 'function' && define.amd) {\n";

    amdPreamble = amdCompiler.buildPreamble(hasExports);

    out += amdPreamble.split("\n").map(function(line) {
      return `    ${line}`;
    }).join("\n");

    out += "    factory(";

    out += dependencyNames.map(function(name, idx) {
      return `__dependency${idx+1}__`;
    }).join(",");

    out += ");\n";

    out += "      });\n";

    out += "  } else if (typeof exports === 'object') {\n";

    out += "    factory(";
    out += dependencyNames.map(function(name) {
      return `require("${name}")`;
    }).join(",");

    out += ");\n  ";

    out += "} else {\n";

    out += "    factory(";

    out += dependencyNames.map(function(name) {
      return `${this.options.global}.${this.options.imports[name] || name}`;
    }, this).join(",");

    out += ");\n  }\n";

    out += "}(function(";

    out += dependencyNames.map(function(name, idx) {
      return `${this.options.imports[name] || name}`;
    }, this).join(",");


    out += ") {\n";

    out += '  "use strict";\n';

    out += "}));";

    return out;
  }
}

export default UMDCompiler;
