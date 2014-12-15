//document.styleSheets
//CSSStyleSheet 1->n        : an entry for a stylesheet / inline. seems to preserve load order
//  cssRules[]
//      parentRule[]
//      parentStyleSheet[]
//      selectorText        : just the selector for the rule set
//      cssText             => selector + rules !! leverage this to find pseudo rules !!


//note: naming functions for a cleaner stack trace
$(function app_main(){
console.log('Loading styleguide');

    //DOM API doesn't provide an easy iterator for objects, options are:
        //1) for(var key in document.styleSheets){ takeAction(document.stylesheets[key]); }
        //
        //2) var fe = Array.prototype.forEach.bind(document.styleSheets);
        //   fe(function(styleSheet){ takeAction(stylesheet); });
        //
        //3) Array.prototype.forEach.call(document.styleSheets, lambda)
        //
        //4) Object.keys(document.styleSheets).forEach(lambda)
        //
        //5) jQuery / underscore / ...

    //Whats the difference between all these methods?
        //1) Easy check to  .hasOwnProperty() and standard programming construct
        //
        //2) Since the context is bound to document.styleSheets, you can pass it around
        //   to lambdas without worrying about execution context
        //
        //4) Since Object.keys returns an array, you can perform all the functional programming
        //   methods on it: filter, sort, ... before executing the lambda
        //   var numeric_keys Object.keys(document.styleSheets).filter(function(k){ return !isNaN(k); });

    $.each(document.styleSheets, function extract_from_browser(i, ss){
        var groupname = ss.href ? ss.href : 'inline-style';
        console.groupCollapsed(groupname);

        $.each(ss.cssRules, function foreach_browser_rule(i, rule){
            //ignore media queries for now
            if(rule instanceof CSSStyleRule){
                //multiple pseudos can be part of single ruleset
                //selector:hover, selector:active { rules.. }

                if(rule.cssText.indexOf(':focus') > 0)
                    extractFocus(rule);

                if(rule.cssText.indexOf(':hover') > 0)
                    extractHover(rule);

                if(rule.cssText.indexOf(':active') > 0)
                    extractActive(rule);
            }
        }); //cssRules

        console.groupEnd(groupname);
    }); //StyleSheets

    function extractFocus(rule){
        extractRule(rule, function extract_focus_cb(sel, ast){
            var dotted = sel.replace(/:focus/g, '.focus');
            setPseudoRuleAsInline(sel, dotted, ast);
        });
    }
    function extractHover(rule){
        //console.log('Found :hover');
        //console.log(rule);
        extractRule(rule, function extract_hover_cb(sel, ast){
            var dotted = sel.replace(/:hover/g, '.hover');
            setPseudoRuleAsInline(sel, dotted, ast);
        });
    }
    function extractActive(rule){
        //console.log('Found :active');
        //console.log(rule);
        extractRule(rule, function extract_active_cb(sel, ast){
            var dotted = sel.replace(/:active/g, '.active');
            setPseudoRuleAsInline(sel, dotted, ast);
        });
    }

    //input: selector1, selectorN { ruleset }
    //output: AST by css-parser:
            //stylesheet
            //  rules[]
            //  declarations[]
            //  selectors[]
    function extractRule(rule, callback){
        var ast = cssParser(rule.cssText);
        $.each(ast.stylesheet.rules, function ast_stylesheet(i, astrule){
            $.each(astrule.selectors, function ast_rule(i, sel){
                callback(sel, astrule);
            });
        });
    }


    function setPseudoRuleAsInline(sel, dotted, astrule){
        var $all = $(dotted);
        if($all.length){

            console.groupCollapsed(sel);
            console.log(dotted);
            $all.each(function(i, el){ console.log(el); });
            console.groupEnd(sel);

            $.each(astrule.declarations, function assign_ast_inline(i, d){
                $all.css(d.property, d.value); //note: primary reason for using an AST
            });

        }
    };

})


//Could make it 'elegant' by applying functional programming concepts and closures
//
//var extract = {
// ":hover" : function(rule){ ... },
// ":focus" : function(rule){ ... },
// ":active": function(rule){ ... }
//}
//
// rule.cssText.match(/:hover|:focus|:active/g)
//             .forEach(function(type){ extract[type](rule); })
//
//
//But I prefer simplicity of the current structure. Take out the g from regexp and watch it fail.
//
