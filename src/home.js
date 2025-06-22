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

function bgtItemName(){
    var name = document.createElement("input");
    name.setAttribute('type', 'text');
    name.setAttribute('placeholder', 'Enter Budget Item Here');
    name.style.width = '400px';
    name.id = 'bgtItemName';
    return name;
}

function bgtItemAmt(){
    var amt = document.createElement("input");
    amt.setAttribute('type', 'number');
    amt.setAttribute('min', '0');
    amt.setAttribute('oninput', 'validity.valid||(value=\'\'\)')
    amt.setAttribute('placeholder', 'Enter Amount Here');
    amt.id = 'bgtItemAmt';
    return amt;
}

function createDropdown() {
    var select = document.createElement('select');
    select.id = "itemType"
    var options = ["Income", "Expense"];
    options.forEach(function(opt){
        var option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
    return select;
}


function netCalc(table){

}


function createBudget(){
    var budgetBtn = document.getElementById("budgetBtn");
    budgetBtn.remove();
    var budget = document.createElement("table");
    budget.id = "budgetTable";
    var bgtDiv = document.getElementById("budget");
    bgtDiv.appendChild(budget);

    var thead = document.createElement("thead");
    budget.appendChild(thead);
    var newHead = thead.insertRow();
    var cell1 = newHead.insertCell();
    var cell2 = newHead.insertCell();
    var cell3 = newHead.insertCell();
    cell1.style.width = "55%"
    cell1.textContent = "Item"
    cell2.textContent = "Amount"
    cell3.textContent = "Type"


    var newRow = budget.insertRow();
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    cell1.style.width = "55%";
    cell1.appendChild(bgtItemName());
    cell2.appendChild(bgtItemAmt());
    cell3.appendChild(createDropdown());

    
    var tfoot = document.createElement("tfoot");
    budget.appendChild(tfoot);
    var newfoot = tfoot.insertRow();
    var cell1 = newfoot.insertCell();
    var cell2 = newfoot.insertCell();
    cell1.style.width = "55%";
    cell1.textContent = "Net Total: ";
    cell2.textContent = "...";

}