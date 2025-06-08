var goals = document.getElementsByTagName("LI");
var i;

for (i = 0; i < goals.length; i++){
    var span = document.createElement("SPAN");
    var cross = document.createTextNode("x");
    span.className  = "close";
    span.appendChild(cross);
    goals[i].appendChild(span);
};

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++){
    close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

var list = document.querySelector("ul");
list.addEventListener("click", function(ev){
    if (ev.target.tagName === 'LI'){
        ev.target.classList.toggle('checked');
    }
})



function addTask(){
    var newTask = document.createElement("li");
    var input = document.getElementById("input").value;
    var taskType = document.getElementById("taskType").value;
    var coinVal;
    if (taskType === "Habit"){
        coinVal = 2
    }
    else if (taskType === "Save" || taskType === "Spend"){
        coinVal = 5
    }
    else{
        coinVal = 1
    }
    taskName = document.createTextNode(input+` (+${coinVal} coins)`);
    newTask.appendChild(taskName);
    if (input === ''){
        alert("Please Enter a Task Name");
    }
    else {
        document.querySelector("ul").appendChild(newTask);
    }

    document.getElementById("input").value = "";

    var span = document.createElement("SPAN");
    var cross = document.createTextNode("x");
    span.className  = "close";
    span.appendChild(cross);
    newTask.appendChild(span);

    for (i = 0; i < close.length; i++){
    close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    }
}
}
