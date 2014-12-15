Observe CSS pseudo rules without user interaction!

Running
==========
1. npm install
2. bower install
3. nodemon
4. http://localhost:3000

Goal
==========

1. Extract :focus, :hover, :active rules
2. Apply them to elements that would be the target of the user action.


Why?
==========

In order to see the effects of the pseudo rules a user interaction is required.
This interaction can be in the form of hovering mouse over the element, clicking
on the element, Holding the mouse button down on the element.. so on.

Doing this for a multi-client website becomes a big job, especially when your
making style changes to 4-5 different clients: Loading the browser up,
going to the clients url, navigating through pages, taking action.
Repeating for all clients.

Instead, keep a few browser windows in a seperate monitor and use LiveReload.
Make changes to css file, and observe the consequence in the browser without any further action!



High Level Strategy
==========

Though its possible to get inline style rules using $("[style]")[n].style,
the value of external stylesheets must be obtained through document.styleSheets.

Or, another method that seems promissing:
window.getComputedStyle( domQuerySelector, pseudoClass)
window.getComputedStyle( document.querySelector('.btn.btn-primary'), ':hover')
returns CSSStyleDeclaration

Bringing in a css parser instead of doing indexOf and string concatenation.
iterate over document.styleSheets
    foreach rule
        create AST
            foreach selectors
                match on /:hover|:active|:focus/g

