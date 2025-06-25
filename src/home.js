var goals = document.getElementsByTagName("LI");
var i;
var addRowBtn;
var bgtCreated = false;
var budget;
var netCell;
var budgetBtn = document.getElementById("budgetBtn");
var bgtDiv = document.getElementById("budget");
var selectedRows = [];
var coinNum = document.getElementById('coinNum');
var coinsShown = 0;
var coinVal;
var options = ["Income", "Expense"];
var budget = document.createElement("table");


function coinAnimate() {
    i = 1;
    var coinDiv = document.getElementById("coinImg");
    setInterval(() => {
        coinDiv.innerHTML = '';
        var coinImg = document.createElement('img');
        coinImg.src = `../img/${i}.png`;
        coinDiv.appendChild(coinImg);
        i++;
        if (i > 8){
            i = 1;
        }
    }, 250);
}


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
        var taskText = ev.target.textContent;
        if (taskText.includes("5 coins")){
            coinVal = 5;
        } else if (taskText.includes("10 coins")){
            coinVal = 10;
        } else{
            coinVal = 1;
        }

        if (ev.target.classList.contains('checked')){
            coinsShown += coinVal;
            coinNum.textContent = `${coinsShown} coins`
        }else{
            coinsShown -= coinVal;
            coinNum.textContent = `${coinsShown} coins`
        }

    }
})


function addTask(){
    var newTask = document.createElement("li");
    var input = document.getElementById("input").value;
    var taskType = document.getElementById("taskType").value;
    var addCoin;

    if (taskType === "Default"){
        alert('Please select a valid task type.');
        document.getElementById("input").value = "";
        return;
    } else if (taskType === "Save"){
        addCoin = 5;
    } else if (taskType === "Invest"){
        addCoin = 10;
    } else{
        addCoin = 1;
    }
    
    if (!bgtCreated){
        alert("You must have a budget to set goals.");
        return;
    } else if (input > netCell.textContent){
        confirm("You do not have enough money to set this goal.\nWould you like to start a project for this goal? ");
        if (confirm){
            startProj();
        }
        return;
    } else if(bgtCreated && netCell.textContent > 0){
        var taskName = document.createTextNode(taskType +" $" +input+` (+${addCoin} coins)`);
        newTask.appendChild(taskName);
        var rowTaskName = taskName.textContent.replace(` (+${addCoin} coins)`, "") 
        addRow(budget, rowTaskName, input, 'Expense');
        getTableVal(budget);
    }

    if (input === ''){
        alert("Please Enter an amount.");
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

function bgtItemName(nameVal = ''){
    var name = document.createElement("input");
    name.setAttribute('type', 'text');
    name.setAttribute('placeholder', 'Enter Budget Item Here');
    name.style.width = '400px';
    name.id = 'bgtItemName';
    name.value = nameVal;
    return name;
}

function bgtItemAmt(table, amtVal = ''){
    var amt = document.createElement("input");
    amt.setAttribute('type', 'number');
    amt.setAttribute('min', '0');
    amt.setAttribute('oninput', 'validity.valid||(value=\'\'\)')
    amt.setAttribute('placeholder', 'Enter Amount Here');
    amt.id = 'bgtItemAmt';
    amt.value = amtVal;
    amt.addEventListener('blur', function() {
    getTableVal(table);
    });

    return amt;
}

function createDropdown(table, dropdownVal = '') {
    var select = document.createElement('select');
    select.classList.add("itemType");
    options.forEach(function(opt){
        var option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        option.selected = dropdownVal;
        select.appendChild(option);
        select.addEventListener('blur', function() {
            getTableVal(table);
        });
    });
    return select;
}

function getTableVal(table) {
    var tblArray = [];
    var nodeList = table.querySelectorAll('input[type="number"]');

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


function addRow(table, nameVal = '', amtVal = '', dropdownVal = '') {
    var newRow = table.insertRow(table.rows.length-1);

    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    cell1.style.width = '55%';

    var nameInput = bgtItemName(nameVal);
    var amtInput = bgtItemAmt(table, amtVal);
    var dropdown = createDropdown(table, dropdownVal);

    cell1.appendChild(nameInput);
    cell2.appendChild(amtInput);
    cell3.appendChild(dropdown);

    var clickCount = 0;
    var savedColor;
    var savedColorRGB;

    var selectedRowsMap = new Map();

    
    // Add click event listener to new row
    newRow.addEventListener('dblclick', function(){
        clickCount++;
        if (clickCount == 1){
            savedColor = newRow.style.backgroundColor;
            savedColorRGB = window.getComputedStyle(this, null).getPropertyValue("background-color"); //savecolorRGB here now go below to eventlisterner and set back to original
            selectedRows.push(this.rowIndex);
            this.style.backgroundColor = 'aquamarine';
            selectedRowsMap.set(this.rowIndex, savedColorRGB);
        } else if (clickCount == 2){
            this.style.backgroundColor = savedColor;
            clickCount = 0;
            var index = selectedRows.indexOf(this.rowIndex);
            selectedRows.splice(index, 1)
            selectedRowsMap.delete(this.rowIndex);
        }
    });

    document.addEventListener('click', function(event){
        if (!table.contains(event.target)) {
            clickCount = 0;
            for (let [key, currentColor] of selectedRowsMap){
                for (i = 0; i < table.rows.length; i++){
                    var currentRow = table.rows[i];
                    if (key === i){
                        currentRow.style.backgroundColor = currentColor;
                    }
                    selectedRows.splice(currentRow, 1);
                    selectedRowsMap.delete(currentRow.rowIndex);
                }
            }
        }
    });

}

document.addEventListener('keydown', function(event) {
    if ((event.key === "Delete" || event.key === "Backspace") && selectedRows.length > 0) {
        const table = document.getElementById("budgetTable");
        selectedRows.sort((a, b) => b - a);
        selectedRows.forEach(index => {
            if (table.rows[index]) {
                table.deleteRow(index);
            }
        });
        selectedRows.length = 0;
    }
});

function createBudget(){
    bgtCreated = true;
    budgetBtn.remove();
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
    tfoot.id = 'tfoot'
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

function darkMode(){
    var body = document.body;
    body.classList.toggle("darkMode");
}

function startProj(){
    alert("Starting a project");
}