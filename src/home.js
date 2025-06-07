var goals = document.getElementsByTagName("LI");
var i;

for (i = 0; i < goals.length; i++){
    var span = document.createElement("SPAN");
    var cross = document.createTextNode("x");
    span.className  = "close";
    span.appendChild(cross);
    goals[i].appendChild(span);
}