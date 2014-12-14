//document.styleSheets
//CSSStyleSheet 1->n
//  cssRules[]
//      parentRule[]
//      parentStyleSheet[]
//      selectorText: just the selector for the rule set
//      cssText => selector + rules !! leverage this to find pseudo rules !!


$(function(){
console.log('Loading styleguide');

    $.each(document.styleSheets, function(i, ss){
        var groupname = ss.href ? ss.href : 'inline-style';
        console.groupCollapsed(groupname);

        $.each(ss.cssRules, function(i, rule){
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
        console.log('Found :focus');
        console.log(rule);
    }
    function extractHover(rule){
        console.log('Found :hover');
        console.log(rule);
    }
    function extractActive(rule){
        console.log('Found :active');
        console.log(rule);
    }

    function setPseudoRuleAsInline(sel, dotted, astrule){

    };


                         //(string) => string
    function extractRule(replacer){
        
    }

})
