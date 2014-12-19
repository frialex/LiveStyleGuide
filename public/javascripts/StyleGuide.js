//document.styleSheets
    //CSSStyleSheet 1->n        : an entry for a stylesheet / inline. seems to preserve load order
    //  cssRules[]
    //      parentRule[]
    //      parentStyleSheet[]
    //      selectorText        : just the selector for the rule set
    //      cssText             => selector + rules !! leverage this to find pseudo rules !!

//Program Flow: app_start() -> app_main() -> LOOP on all the stylesheets loaded -> action based on handlers map
//the handlers map contains two paths used by the application:
//RuleSet -> InlineRule
//MediaQuery -> RuleSet -> InlineRule

//note: naming functions for a cleaner stack trace
$(function app_start(){

    //removing /g since rules are iterated over the ast, which gives us an array of selectors.
    var pseudos = /:(active|focus|hover)/

    var handlers = {
        media:          function(rule){ mediaQueryExtractor(rule); },
        rule:           function(rule){ ruleExtractor(rule); },
        'font-face':    function(rule){ /* Doesn't have any pseudo rules => ignore */ },
        'keyframes':    function(rule){ /* Ignore. Key in map to prevent crashing  */ }
    }

    //Take in an ast -> check for pseudo rules -> pass it on to setPseudoRuleAsInline
    function ruleExtractor(ruleast){
        //RuleAst properties of importance
            //declarations  [1->n]
            //selectors     [1->m]

        $.each(ruleast.selectors, function(i, sel){
            if(pseudos.test(sel)){                  //test is much faster then exec => exec on pseudo rules only
                var match = pseudos.exec(sel);      //exec will return [full_match, group]
                var pseudo = match[1]

                var dotted = sel.replace(':', '.');
                setPseudoRuleAsInline(sel, dotted, ruleast);
            }
        });
    }

    function mediaQueryExtractor(ruleast){
        //RuleAst properties of importance
            //media: print | mediaQuery
            //rules[1->m] {note each element is same ast as input to ruleExtractor.. this makes it easy :) }
            //  selectors       [1->x]
            //  declarations    [1->y]

        //Read the media query ast as: for each type of media query there are m rule sets,
        //and each ruleset could have x number of selectors and y number of declarations.

        //pseudo rules and print queries don't make sense: Can't hover over paper :/
        if(ruleast.type == 'print')
            return;

        //now check that we are able to apply the media query
        var mqTest = window.matchMedia(ruleast.media);
        if(mqTest.matches)
            $.each(ruleast.rules, function mediaquery_foreach_rule(i, rule){ ruleExtractor(rule); });

    }

    $.each(document.styleSheets, function app_main(i, ss){
        var groupname = ss.href ? ss.href : 'inline-style';
        //console.groupCollapsed(groupname);
        console.group(groupname);

        $.each(ss.cssRules, function foreach_browser_rule(i, rule){

            //output: AST by css-parser:
                //stylesheet
                //  rules           [1]
                //      declarations    [1->n]
                //      selectors       [1->n]
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

