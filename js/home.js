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
var coinsTotal = 0;
var coinVal;
var options = ["Income", "Expense"];
var budget = document.createElement("table");
var prevCoins; 
var checkedGoals = [];


function createModal(head, string, b1_text='OK', b2_text='Cancel'){
    var modalDiv = document.createElement('div');
    modalDiv.classList.add('modal-container');
    modalDiv.id = 'modal-container';
    document.body.appendChild(modalDiv);

    var modal = document.createElement('div');
    modal.classList.add('modal');
    modalDiv.appendChild(modal);

    var heading = document.createElement('h2');
    heading.textContent = head;
    modal.appendChild(heading);
    var content = document.createElement('p');
    content.innerText = string;
    modal.appendChild(content);

    var btnDiv = document.createElement('div');
    btnDiv.id = 'btnDiv'
    modal.appendChild(btnDiv);

    var button1 = document.createElement('button');
    button1.textContent = b1_text;
    if (b1_text !== ''){
        btnDiv.appendChild(button1);
    }
    button1.classList.add('Btn');
    button1.id = 'confirm';

    var button2 = document.createElement('button');
    button2.textContent = b2_text;
    if (b2_text !== ''){
        btnDiv.appendChild(button2);
    }
    button2.classList.add('Btn');
    button2.id = 'cancel';

    modalDiv.classList.toggle('show') //open modal
    button2.addEventListener('click', () => {
        modalDiv.classList.toggle('show'); //close modal
        document.body.removeChild(modalDiv);
        return false;
    })
    button1.addEventListener('click', () => {
        modalDiv.classList.toggle('show');
        document.body.removeChild(modalDiv);
        return true;
    })
}

function coinAnimate() {
    i = 1;
    var coinDiv = document.getElementById("coinImg");
    setInterval(() => {
        coinDiv.innerHTML = '';
        var coinImg = document.createElement('img');
        coinImg.draggable = false;
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
        checkedGoals.push(ev.target);
        console.log(checkedGoals);
        var taskText = ev.target.textContent;
        if (taskText.includes("5 coins")){
            coinVal = 5;
        } else if (taskText.includes("10 coins")){
            coinVal = 10;
        } else{
            coinVal = 1;
        }

        prevCoins = coinsTotal;

        if (ev.target.classList.contains('checked')){
            coinsTotal += coinVal;
            coinNum.textContent = `${coinsTotal} coins`
            xp(coinVal);
        }else{
            coinsTotal -= coinVal;
            coinNum.textContent = `${coinsTotal} coins`
            xp(coinVal);
        }

    }
})

function animateProgressChange(increment, increasing, coinsNeeded, currentLvl, nextLvl) {
    var fill = document.getElementById('fill');
    var currentWidth = parseFloat(fill.style.width) || 0;
    var targetWidth = increasing ? currentWidth + increment : currentWidth - increment;

    targetWidth = Math.max(0, Math.min(100, targetWidth)); // clamp between 0 and 100

    var step = increasing ? 1 : -1;

    var interval = setInterval(() => {
        currentWidth += step;
        fill.style.width = currentWidth + '%';

        if ((increasing && currentWidth >= targetWidth) || (!increasing && currentWidth <= targetWidth)) {
            clearInterval(interval);
        }

        if (currentWidth >= 100) {
            createModal('Yay! You reached the next level 🪜', 'You have now reached the next level.');
            if (coinsTotal >= coinsNeeded){
                currentLvl += 1;
                nextLvl += 1;
                document.getElementById('currentLvl').textContent = currentLvl;
                document.getElementById('nextLvl').textContent = nextLvl;
            }
            setTimeout(() => {
                fill.style.width = '0%';
                for (i = 0; i < checkedGoals.length; i++){
                    checkedGoals[i].style.display = 'none';
                }
            }, 1000);
        }
    }, 20);
}




//if you check off the goals too fast, progress bar gets screwed up and other features don't work then 



function xp(coinVal){
    var currentLvl = Number(document.getElementById('currentLvl').textContent);
    var nextLvl = Number(document.getElementById('nextLvl').textContent);

    var coinsLastlvl = Math.round(10 * Math.pow(currentLvl-1, 1.5));
    var coinsNeeded = coinsLastlvl+Math.round(10 * Math.pow(currentLvl, 1.5));
    var coinsLeft = coinsNeeded - coinsTotal;
    if (coinsLeft < 0){
        coinsLeft = Math.abs(coinsLeft);
    }
    document.getElementById('coinstoNL').textContent = `${Math.max(0, coinsLeft)} coins to level ${nextLvl}`;

    var increment = (coinVal / coinsNeeded) * 100;
    var increasing = prevCoins < coinsTotal;

    animateProgressChange(increment, increasing, coinsNeeded, currentLvl, nextLvl);
}


function addTask(){
    var newTask = document.createElement("li");
    var input = document.getElementById("input").value;
    var taskType = document.getElementById("taskType").value;
    var addCoin;

    if (taskType === "Default"){
        createModal('Hang on‼️', 'Looks like you missed picking a task type. Let\'s select one to move forward.', 'Select Task Type', 'Nevermind');
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
        createModal("Just a heads-up 👋", "You'll need to set a budget before creating your goals.", "Make a Budget", "Maybe Later");
        return;
    } else if (input === ''){
        createModal("Oops 💲", "Looks like you forgot to enter an amount. Let\'s enter that in, shall we?", "Enter Amount", 'I\'ll do it later');
        return;
    } else if (Number(input) > Number(netCell.textContent)){
        createModal(
        'Almost There 🚩',
        "You're a little short on funds for this goal.\nWant to kick off a project to help make it happen?",
        'Start a project',
        'Not Now'
        );
        if (confirm){
            document.getElementById('projectName').focus();
        }
        return;
    } else if (bgtCreated && Number(netCell.textContent) > 0){
        var taskName = document.createTextNode(taskType +" $" +input+` (+${addCoin} coins)`);
        newTask.appendChild(taskName);
        var rowTaskName = taskName.textContent.replace(` (+${addCoin} coins)`, "") 
        addRow(budget, rowTaskName, input, 'Expense');
        getTableVal(budget);
    }

    document.querySelector("ul").appendChild(newTask);

    document.getElementById("input").value = "";
    document.getElementById("taskType").value = "Default";

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
    netCell.id = 'netCell'
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

function addProject(name, dueDate, startDate, monthsLeft, saveAmt, saveMonth){
    var project = document.getElementById('projects');
    var projectView = document.createElement('div');
    projectView.id = 'projectView';
    project.appendChild(projectView);

    
    var viewBtn = document.createElement('button');
    viewBtn.textContent = name;
    viewBtn.classList.add('Btn');
    viewBtn.classList.add('viewBtn');
    projectView.appendChild(viewBtn);

    viewBtn.addEventListener('click', ()=>{
        createModal(name, `
            Savings Goal: $${saveAmt}
            Start Date: ${startDate}
            Due Date: ${dueDate}
            Time Left: ${monthsLeft} months
            Save Per month: $${saveMonth}
            `, 'Close', '')
    });
}

function startProj(){
    var project = document.getElementById('projects');
    document.getElementById('projectBtn').remove();

    var projDetails = document.createElement('div');
    projDetails.id = 'projDetails'
    project.appendChild(projDetails);

    var projectName = document.createElement('input');
    projectName.id = 'projectName';
    projectName.setAttribute('type', 'text');
    projectName.setAttribute('placeholder', 'Enter Project Name');
    projDetails.appendChild(projectName);
    
    var projectAmt = document.createElement('input');
    projectAmt.id = 'projectAmt';
    projectAmt.setAttribute('type', 'number');
    projectAmt.setAttribute('min', '1');
    projectAmt.setAttribute('oninput', 'validity.valid||(value=\'\'\)');
    projectAmt.setAttribute('placeholder', 'Enter Amount');
    projDetails.appendChild(projectAmt);

    var dateDiv = document.createElement('div');
    dateDiv.id = 'dateDiv';
    project.appendChild(dateDiv);

    var startDate = document.createElement('input');
    var startTitle = document.createElement('p'); 
    startTitle.textContent = 'Enter Start Date: '
    startDate.setAttribute('type', 'date');
    startDate.id = 'startDate';
    dateDiv.appendChild(startTitle);
    var today = new Date().toISOString().split("T")[0];
    startDate.value = today;
    startDate.setAttribute('min', today);
    dateDiv.appendChild(startDate);
    startDate.addEventListener('blur', () =>{
        dueDate.setAttribute('min', startDate.value);
    });

    var dueDate = document.createElement('input');
    var dueTitle = document.createElement('p')
    dueTitle.textContent = 'Enter Due Date: '
    dueDate.setAttribute('type', 'date');
    dueDate.id = 'dueDate';
    dueDate.setAttribute('min', today);
    dateDiv.appendChild(dueTitle);
    dateDiv.appendChild(dueDate);

    var addProj = document.createElement('button');
    addProj.id = 'addProjBtn'
    addProj.textContent = 'Add Project';
    addProj.classList.add('Btn');
    addProj.addEventListener('click', () => {
        var daysLeft = (new Date(dueDate.value) - new Date(startDate.value)) / (1000 * 3600 * 24);
        var monthsLeft = Math.floor(daysLeft/30);
        var saveMonth = Math.ceil(projectAmt.value/monthsLeft);
        if(!document.getElementById('netCell')){
            createModal(
                'Please Add A Budget First 🧾',
                'You\'ll need to set a budget before creating a long-term project.',
                'Got It',
                'Close'
            );
        } else if (saveMonth > Number(netCell.textContent)){
            createModal(
                'Need More Time 🕛',
                'Your calculated per month savings goal is over your current budget. Try a later due date.',
                'Set A Later Due Date',
                'Close'
            );
        } else if(daysLeft < 0){
            createModal('Oops ⏳', 'Can\'t end a project before it even starts. Start Date must be later than Due Date.', 'Let\'s get time flowing forwards again', 'Close');
        } else if(daysLeft < 30){
            createModal(
                'Longer Projects Please 🗓️',
                'This feature is meant for goals that take over a month to finish.',
                'Set a Goal',
                'Close'
            );

        } else if (projectName.value === ''){
            createModal('Just a Quick Fix 🛠️', 'Let\'s enter a project name to proceed.', 'Got it', 'I\'ll come back to it');
        } else if (projectAmt.value === ''){
            createModal('Just a Quick Fix 🛠️', 'Let\'s double check the amount for this project.', 'Will do', 'I\'ll come back to it');
        } else if (dueDate.value === '' || startDate.value === ''){
            createModal('Just a Quick Fix 🛠️', 'Let\'s double check the project dates before moving forward.', 'Got it', 'I\'ll come back to it');
        } else if (projectName.value !== '' && dueDate.value !== '' && startDate.value !== '' && daysLeft > 0 && projectAmt.value > 0){
            addProject(projectName.value, dueDate.value, startDate.value, monthsLeft, projectAmt.value, saveMonth);
            addRow(budget, projectName.value, saveMonth, 'Expense');
            getTableVal(budget);
            projectAmt.value = '';
            projectName.value = '';
            dueDate.value = '';
            startDate.value = today;
        }
    })

    project.appendChild(addProj);
    var heading = document.createElement('h2');
    heading.textContent = 'Ongoing Projects';
    heading.style.textDecoration = 'underline';
    project.appendChild(heading);

}