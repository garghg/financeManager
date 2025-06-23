var goals = document.getElementsByTagName("LI");
var i;
var addRowBtn;
var budget;
var netCell;
var budgetBtn = document.getElementById("budgetBtn");
var bgtDiv = document.getElementById("budget");
var selectedRows = [];

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
    amt.addEventListener('blur', getTableVal);
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
        select.addEventListener('blur', getTableVal);
    });
    return select;
}

function getTableVal() {
    var tblArray = [];
    var nodeList = document.querySelectorAll('input[type="number"]');

    var typeArray = [];
    var selectList = document.querySelectorAll('select');
    for (let i = 0; i < selectList.length - 1; i++) {
        typeArray.push(selectList[i].value);
    }

    for (let i = 0; i < nodeList.length; i++) {
        var value = nodeList[i].value.trim();
        if (value !== "") {
            tblArray.push(Number(value));
        }
    }

    for (let i = 0; i < tblArray.length; i++) {
        if (typeArray[i] === "Expense") {
            tblArray[i] = -Math.abs(tblArray[i]);
        } else if (typeArray[i] === "Income") {
            tblArray[i] = Math.abs(tblArray[i]);
        }
    }

    netCell.textContent = tblArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    },0);

} 


function addRow(table){
    var newRow = table.insertRow(table.rows.length-1);
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    cell1.style.width = "55%";
    cell1.appendChild(bgtItemName());
    cell2.appendChild(bgtItemAmt());
    cell3.appendChild(createDropdown()); 

    var clickCount = 0;
    var savedColor;
    var savedColorRGB;

    var selectedRowsMap = new Map();

    
    // Add click event listener to new row
    newRow.addEventListener('dblclick', function(){
        clickCount++;
        if (clickCount == 1){
            console.log('counter went up to 1')
            savedColor = newRow.style.backgroundColor;
            savedColorRGB = window.getComputedStyle(this, null).getPropertyValue("background-color"); //savecolorRGB here now go below to eventlisterner and set back to original
            selectedRows.push(this.rowIndex);
            this.style.backgroundColor = 'aquamarine';
            selectedRowsMap.set(this.rowIndex, savedColorRGB);
            console.log(selectedRows);
        } else if (clickCount == 2){
            this.style.backgroundColor = savedColor;
            clickCount = 0;
            var index = selectedRows.indexOf(this.rowIndex);
            selectedRows.splice(index, 1)
            selectedRowsMap.delete(this.rowIndex)
            console.log(selectedRows);
        }
    });

    document.addEventListener('click', function(event){
        if (!table.contains(event.target)) {
            console.log(selectedRowsMap)
        }
    });

}

function deleteRows(){

}

function createBudget(){
    budgetBtn.remove();
    deleteRows();
    var budget = document.createElement("table");
    budget.id = "budgetTable";
    bgtDiv.appendChild(budget);

    var thead = document.createElement("thead");
    budget.appendChild(thead);
    var newHead = thead.insertRow();
    var cell1 = newHead.insertCell();
    var cell2 = newHead.insertCell();
    var cell3 = newHead.insertCell();
    cell1.style.width = "55%"
    cell2.style.width = "25%"
    cell1.textContent = "Item"
    cell2.textContent = "Amount"
    cell3.textContent = "Type"

    var tfoot = document.createElement("tfoot");
    budget.appendChild(tfoot);
    var newfoot = tfoot.insertRow();
    var cell1 = newfoot.insertCell();
    netCell = newfoot.insertCell();
    var cell3 = newfoot.insertCell();
    cell1.textContent = "Net Total: ";
    netCell.textContent = "0";
    cell3.textContent = "";

    
    addRowBtn = document.createElement('button');
    addRowBtn.textContent = "Add Row";
    addRowBtn.className = 'Btn';
    addRowBtn.id = "addRowBtn"; 
    addRowBtn.onclick = function(){
        addRow(budget);
    };
    document.getElementById('sect1').appendChild(addRowBtn);

}