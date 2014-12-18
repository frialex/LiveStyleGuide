//document.styleSheets
    //CSSStyleSheet 1->n        : an entry for a stylesheet / inline. seems to preserve load order
    //  cssRules[]
    //      parentRule[]
    //      parentStyleSheet[]
    //      selectorText        : just the selector for the rule set
    //      cssText             => selector + rules !! leverage this to find pseudo rules !!


//note: naming functions for a cleaner stack trace
$(function app_main(){

    //removing /g since rules iterated over the ast, which gives it as a selector array.
    var pseudos = /:(active|focus|hover)/

    var handlers = {
        media:          function(rule){ mediaQueryExtractor(rule); },
        rule:           function(rule){ ruleExtractor(rule); },
        'font-face':    function(rule){ /* Doesn't have any pseudo rules => ignore */ },
        'keyframes':    function(rule){ /* Ignore. Key in dict to prevent crashing */ }
    }


    function ruleExtractor(ruleast){
        //RuleAst properties of importance
            //declarations  [1->n]
            //selectors     [1->n]

        $.each(ruleast.selectors, function(i, sel){
            if(pseudos.test(sel)){                  //test is much faster then exec => exec on pseudo rules only
                var match = pseudos.exec(sel);    //exec will return [full_match, group]
                var pseudo = match[1]

                var dotted = sel.replace(':', '.');
                setPseudoRuleAsInline(sel, dotted, ruleast);
            }
        });
    }

    function mediaQueryExtractor(ruleast){
        //console.log(ruleast);
    }

    $.each(document.styleSheets, function app_main(i, ss){
        var groupname = ss.href ? ss.href : 'inline-style';
        //console.groupCollapsed(groupname);
        console.group(groupname);

        $.each(ss.cssRules, function foreach_browser_rule(i, rule){

            //output: AST by css-parser:
                    //stylesheet
                    //  rules[]
                    //  declarations[]
                    //  selectors[]
            var ast         = cssParser(rule.cssText);
            var rule        = ast.stylesheet.rules[0];
            var selectors   = rule.selectors

            handlers[rule.type](rule);

        });
        console.groupEnd(groupname);
    });


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

