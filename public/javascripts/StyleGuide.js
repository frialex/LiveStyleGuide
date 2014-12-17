//document.styleSheets
    //CSSStyleSheet 1->n        : an entry for a stylesheet / inline. seems to preserve load order
    //  cssRules[]
    //      parentRule[]
    //      parentStyleSheet[]
    //      selectorText        : just the selector for the rule set
    //      cssText             => selector + rules !! leverage this to find pseudo rules !!


//note: naming functions for a cleaner stack trace
$(function app_main(){

    //global for testing
    pseudos = /:(active|focus|hover)/g

    var handlers = {
        media:          function(rule){ console.log(rule); },
        rule:           function(rule){ ruleExtractor(rule); },
        'font-face':    function(rule){ console.log(rule); },
        'keyframes':    function(rule){ console.log(rule); }
    }


    function ruleExtractor(ruleast){
        //1) foreach rule.selector
        //1.a) pseudo.exec(sel)
        //1.b) 

        $.each(ruleast.selectors, function(i, sel){
            //testing casues the regex state machines to advance
            //thus causing the exec to fail?
            if(pseudos.test(sel)){
                var type = pseudos.exec(sel);
            }
        });
    }

    $.each(document.styleSheets, function extract_from_browser(i, ss){
        var groupname = ss.href ? ss.href : 'inline-style';
        //console.groupCollapsed(groupname);
        console.group(groupname);

        $.each(ss.cssRules, function foreach_browser_rule(i, rule){

            var ast         = cssParser(rule.cssText);
            var rule        = ast.stylesheet.rules[0];
            var selectors   = rule.selectors

            handlers[rule.type](rule);

        });
        console.groupEnd(groupname);
    });


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

