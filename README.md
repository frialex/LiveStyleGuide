Observe CSS pseudo rules without user interaction!

Goal:

1) Extract :focus, :hover, :active rules
2) Apply them to elements that would be the target of the event had user taken action.


Why?

In order to see the effects of the pseudo rules a user interaction is required.
This interaction can be in the form of hoving mouse over the element, clicking
on the element, Holding the mouse button down on the element.. so on.

Doing this for a multi client website becomes a big job, especially when your
faced with making style changes to 4-5 different clients: Loading the browser up,
going to the clients url, taking action, and repeating for all clients.

Instead, keep the browser windows in a seperate monitor and user live reload.
Make changes to css file, and observe the changes in the browser without any further action!



High Level Strategy:
Starting point
document.styleSheets contains all the style rules in the web page in a very structured format.
