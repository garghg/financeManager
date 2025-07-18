import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, doc, updateDoc, query, orderBy, setDoc, collection, getDocs, deleteDoc, serverTimestamp  } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { v4 as uuidv4 } from 'https://unpkg.com/uuid@latest/dist/esm-browser/index.js';


const firebaseConfig = {
  apiKey: "AIzaSyAkyVCMwmUvpSzT_FrnkhHNGvXrqvQRp8s",
  authDomain: "coinquest-d01e1.firebaseapp.com",
  projectId: "coinquest-d01e1",
  storageBucket: "coinquest-d01e1.firebasestorage.app",
  messagingSenderId: "858259555984",
  appId: "1:858259555984:web:fed3c7cdc0616962147a15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

var goals = document.getElementsByTagName("LI");
var i;
var addRowBtn;
var bgtCreated = false;
var budget;
var netCell;
var budgetBtn = document.getElementById("budgetBtn");
var bgtDiv = document.getElementById("budget");
var selectedRows = [];
var budget = document.createElement("table");
var coinNum = document.getElementById('coinNum');
var coinsTotal = 0;
var coinVal;
var prevCoins; 
var currentLvl = Number(document.getElementById('currentLvl').textContent);
var nextLvl = Number(document.getElementById('nextLvl').textContent);
var coinsNeeded = Math.round(10 * Math.pow(currentLvl, 1.5));
var coinsBefore = 0;
var coinsEarned = coinsTotal - coinsBefore;
var coinsLeft = coinsNeeded - coinsEarned;
var coinsOverflow = 0;
document.getElementById('coinstoNL').textContent = `${coinsLeft} coins to level ${nextLvl}`;
var avatars = [];
var avatarsMap = new Map();
var avtModalDiv = document.createElement('div');
var avatarsUnlocked = [];
var coinsShown = 0;
var contTutorial;
var tblArray = [];
var categories = ["Job", "Assets", "Savings", "Housing", "Food", "Transportation", "Goals", "Projects"]
var barColors = [
    "#ae2012",
    "#ca6702",
    "#ee9b00",
    "#e9d8a6",
    "#94d2bd",
    "#0a9396",
    "#005f73",
    "#001219"
];
var amounts =  [0,0,0,0,0,0,0,0];
var myChart;
var cursorBall = document.querySelector(".cursor-ball");
var cursorOutline = document.querySelector(".cursor-outline");
var setModalDiv = document.createElement('div');

var greeting = document.getElementById('greeting');
var username = sessionStorage.getItem('username');

if (username == null){
    username = 'Adventurer'
}
greeting.textContent = `Welcome, ${username}!`


onAuthStateChanged(auth, async (user) => {
  if (user) {
    loadData(budget);

    if (sessionStorage.getItem('register')){
    const userId = auth.currentUser.uid;
    const docRef = doc(db, "budgets", userId);
    const docSnap = await setDoc(docRef, {username: username}, {merge:true});
}
  }
});


document.addEventListener("mousemove", (e) => {
  cursorBall.style.top = e.pageY + "px";
  cursorBall.style.left = e.pageX + "px";

  cursorOutline.style.top = e.pageY + "px";
  cursorOutline.style.left = e.pageX + "px";
});

document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    cursorOutline.classList.add("cursor-mousedown");
  }
});

document.addEventListener("mouseup", () => {
  cursorOutline.classList.remove("cursor-mousedown");
});



export function tutorial(){
    var tutorialMD = document.createElement('div');
    tutorialMD.classList.add('modal-container');
    tutorialMD.id = 'tutorial-modal-container';
    document.body.appendChild(tutorialMD);

    var modal = document.createElement('div');
    modal.classList.add('modal');
    tutorialMD.appendChild(modal);

    var heading = document.createElement('h2');
    heading.textContent = 'Welcome Adventurer!';
    modal.appendChild(heading);
    var content = document.createElement('p');
    content.innerText = `
    I'm Arthur, your ol' guide through the wild woods of personal finance.
    Ready to take your first step toward treasure and triumph? Let\'s begin, shall we?

    `;
    modal.appendChild(content);

    var arthurImg = document.createElement('img');
    arthurImg.src = '../img/arthur.gif';
    arthurImg.id = 'arthur';
    arthurImg.draggable = false;
    tutorialMD.appendChild(arthurImg);

    var btnDiv = document.createElement('div');
    btnDiv.id = 'btnDiv'
    modal.appendChild(btnDiv);

    var button1 = document.createElement('button');
    button1.textContent = `I'm Ready!`;
    btnDiv.appendChild(button1);
    button1.classList.add('Btn');
    button1.id = 'confirm';

    var button2 = document.createElement('button');
    button2.textContent = 'Skip Tutorial';
    btnDiv.appendChild(button2);
    button2.classList.add('Btn');
    button2.id = 'cancel';

    tutorialMD.classList.toggle('show') //open modal

    button1.addEventListener('click', () => {
        tutorialMD.classList.toggle('show');
        document.body.removeChild(tutorialMD);
        createModal('1️⃣ It all starts with a Budget', 'Great! To unlock the rest of the amazing features, let’s set up your budget first. It’s quick and easy!');
        contTutorial = true;
    })

    button2.addEventListener('click', () => {
        tutorialMD.classList.toggle('show'); //close modal
        document.body.removeChild(tutorialMD);
        contTutorial = false;
    })
    
}

window.tutorial = tutorial;


function createModal(head, string, b1_text = 'OK', b2_text = 'Cancel') {
    return new Promise((resolve) => {
        const modalDiv = document.createElement('div');
        modalDiv.classList.add('modal-container');
        modalDiv.id = 'modal-container';
        document.body.appendChild(modalDiv);

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modalDiv.appendChild(modal);

        const heading = document.createElement('h2');
        heading.textContent = head;
        modal.appendChild(heading);

        const content = document.createElement('p');
        content.innerText = string;
        modal.appendChild(content);

        const btnDiv = document.createElement('div');
        btnDiv.id = 'btnDiv';
        modal.appendChild(btnDiv);

        const button1 = document.createElement('button');
        button1.textContent = b1_text;
        button1.classList.add('Btn');
        button1.id = 'confirm';
        if (b1_text !== '') {
            btnDiv.appendChild(button1);
        }

        const button2 = document.createElement('button');
        button2.textContent = b2_text;
        button2.classList.add('Btn');
        button2.id = 'cancel';
        if (b2_text !== '') {
            btnDiv.appendChild(button2);
        }

        modalDiv.classList.add('show');

        button2.addEventListener('click', () => {
            modalDiv.classList.remove('show');
            document.body.removeChild(modalDiv);
            resolve(false); // User cancelled
        });

        button1.addEventListener('click', () => {
            modalDiv.classList.remove('show');
            document.body.removeChild(modalDiv);
            resolve(true); // User confirmed
        });
    });
}

export function coinAnimate() {
    let i = 1;
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

window.coinAnimate = coinAnimate;


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

async function handleClick(ev) {
    if (ev.target.tagName === 'LI' && !ev.target.classList.contains('processed')) {
        ev.target.classList.add('processed');
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "budgets", userId, "entries", ev.target.getAttribute('id'));
        await updateDoc(docRef, {
            processed: true
        });

        ev.target.classList.toggle('checked');

        var taskText = ev.target.textContent;
        var coinVal;

        if (taskText.includes("5 coins")) {
            coinVal = 5;
        } else if (taskText.includes("10 coins")) {
            coinVal = 37;
        } else {
            coinVal = 1;
        }

        prevCoins = coinsTotal;

        if (ev.target.classList.contains('checked')) {
            coinsTotal += coinVal;
            coinsShown += coinVal;
            coinNum.textContent = `${coinsTotal} coins`;
            runXp(coinVal);
        } else {
            coinsTotal -= coinVal;
            coinsShown -= coinVal;
            coinNum.textContent = `${coinsTotal} coins`;
            runXp(coinVal);
        }

        setTimeout(() => {
            ev.target.style.display = 'none';
        }, 500);
    }
}


list.addEventListener("click", handleClick);

var xpQueue = Promise.resolve();

function runXp(coinVal) {
    xpQueue.then(() => xp(coinVal));
}

function animateProgressChange(increment, increasing, overflowInc) {
    return new Promise((resolve) => {
        var fill = document.getElementById('fill');
        var currentWidth = parseFloat(fill.style.width) || 0;
        var targetWidth = increasing ? currentWidth + increment : currentWidth - increment;
        var barWidth = Math.max(0, Math.min(100, targetWidth));

        var step = increasing ? 1 : -1;

        var interval = setInterval(() => {
            currentWidth += step;
            fill.style.width = currentWidth + '%';

            if ((increasing && currentWidth >= barWidth) || (!increasing && currentWidth <= barWidth)) {
                clearInterval(interval);

                if (currentWidth >= 100) {
                    if (currentLvl != 5 && currentLvl != 10 && currentLvl != 15 && currentLvl != 20) {
                            createModal('Yay! You reached the next level 🪜', 'You have now reached the next level.');
                        }

                    setTimeout(() => {
                        fill.style.width = '0%';

                        let overflowWidth = 0;
                        let overflowStep = 1;

                        var overflowInterval = setInterval(() => {
                            overflowWidth += overflowStep;
                            fill.style.width = `${overflowWidth}%`;

                            if (overflowWidth >= overflowInc) {
                                clearInterval(overflowInterval);
                                resolve();
                            }
                        }, 20);
                    }, 250);
                } else {
                    resolve();
                }
            }
        }, 20);
    });
}


async function xp(coinVal){
    coinNum.textContent = `${coinsShown} coins`;
    currentLvl = Number(document.getElementById('currentLvl').textContent);
    nextLvl = Number(document.getElementById('nextLvl').textContent);

    coinsNeeded = Math.round(10 * Math.pow(currentLvl, 1.5));


    coinsBefore = 0;
    for (let i = 1; i < currentLvl; i++){
        var iCoins = Math.round(10 * Math.pow(i, 1.5));
        coinsBefore += iCoins;
    }
    coinsEarned = coinsTotal - coinsBefore;
   
    coinsLeft = coinsNeeded - coinsEarned;

    if (coinsEarned > coinsNeeded){
        coinsOverflow = coinsEarned - coinsNeeded;
    } else {
        coinsOverflow = 0;
    }

    if (coinsEarned >= coinsNeeded){
        document.getElementById('fill').style.width = '100%';

        currentLvl += 1;
        nextLvl += 1;
        unlockavts();
        document.getElementById('currentLvl').textContent = currentLvl;
        document.getElementById('nextLvl').textContent = nextLvl;
        coinNum.textContent = `${coinsShown} coins`;

        coinsNeeded = Math.round(10 * Math.pow(currentLvl, 1.5));
        coinsBefore = 0;
        for (let i = 1; i < currentLvl; i++){
        var iCoins = Math.round(10 * Math.pow(i, 1.5));
        coinsBefore += iCoins;
    }
        coinsEarned = coinsTotal - coinsBefore;
        coinsLeft = coinsNeeded - coinsEarned;

        var overflowInc = (coinsOverflow / coinsNeeded) * 100;
    }

    document.getElementById('coinstoNL').textContent = `${Math.max(0, coinsLeft)} coins to level ${nextLvl}`;

    var increment = (coinVal / coinsNeeded) * 100;
    var increasing = prevCoins < coinsTotal;

    return animateProgressChange(increment, increasing, overflowInc);
}


export function addTask(input = '', taskType = '', addToTable=true, rowId = ''){
    var newTask = document.createElement("li");

    if (rowId != ''){
        newTask.setAttribute('id', rowId);
    }

    if (input == '' || taskType == ''){
        var input = document.getElementById("input").value;
        var taskType = document.getElementById("taskType").value;
    }
    
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
    } else {
        if (taskType != 'Other goal'){
            var taskName = document.createTextNode(taskType +" $" +input+` (+${addCoin} coins)`);
        } else{
            var taskName = document.createTextNode(taskType +" for $" +input+` (+${addCoin} coins)`);
        }
        newTask.appendChild(taskName);
        if (addToTable){
            var rowTaskName = taskName.textContent.replace(` (+${addCoin} coins)`, "") 
            addRow(budget, rowTaskName, input, taskType, false, null, newTask);
            tblArray.push(-Number(input));
            amounts[6] += Number(input);
            myChart ? myChart.destroy() : {};
            graph();
            getTableVal();
        }  
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
        close[i].onclick = async function() {
            var count = 1;
            var div = this.parentElement;
            div.style.display = "none";
            for (let currentRow of budget.rows){
                var checkText;
                if (taskType == 'Other goal'){
                    checkText = (taskType +" for $" +input);
                } else{
                    checkText = (taskType +" $" +input);
                }
                if (currentRow.cells[0].textContent == checkText && count > 0){
                    var cellVal = Number(currentRow.cells[1].textContent);
                    var category = currentRow.cells[2].textContent;
                    const docId = currentRow.getAttribute("id");
                    amounts[categories.indexOf(category)] -= cellVal;
                    
                    if (category != "Job" && category != "Assets" && category != "Savings"){
                        cellVal = -cellVal;
                    }
                    var numIdx = tblArray.indexOf(cellVal);
                    tblArray.splice(numIdx, 1);
                    amounts[6] += cellVal;
                    myChart ? myChart.destroy() : {};
                    graph();
                    budget.deleteRow(currentRow.rowIndex);
                    count --;
                    getTableVal();

                    const userId = auth.currentUser.uid;
                    const docRef = doc(db, "budgets", userId, "entries", docId);
                    console.log("Trying to delete doc with ID:", docId);
                    await deleteDoc(docRef);
                }
            }

        }
    }
}

window.addTask = addTask;



function bgtItemName(nameVal = ''){
    var name = document.createElement("input");
    name.setAttribute('type', 'text');
    name.setAttribute('placeholder', 'Enter Budget Item Here');
    name.style.width = '400px';
    name.id = 'bgtItemName';
    name.value = nameVal;
    return name;
}


function bgtItemAmt(amtVal = ''){
    var amt = document.createElement("input");
    amt.setAttribute('type', 'number');
    amt.setAttribute('min', '0');
    amt.setAttribute('max', '9999999999999999');
    amt.setAttribute('oninput', 'validity.valid||(value=\'\'\)')
    amt.setAttribute('placeholder', 'Enter Amount Here');
    amt.id = 'bgtItemAmt';
    amt.value = amtVal;
    return amt;
}

function getTableVal() {
    netCell.textContent = tblArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    },0);

} 


async function addRow(table, nameVal = '', amtVal = '', dropdownVal = '', loading = false, existingId = null, newTask = null) {
    var newRow = table.insertRow(table.rows.length-1);

    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    cell1.style.width = '55%';


    cell1.textContent = nameVal;
    cell2.textContent = amtVal;
    cell3.textContent = dropdownVal;

    if (dropdownVal != "Job" && dropdownVal != "Assets" && dropdownVal != "Savings"){
            amtVal = Number(-amtVal);
    }

    const userId = auth.currentUser.uid;
    const customId = existingId || uuidv4();
    newRow.setAttribute('id', customId);
    if (newTask != null){
        newTask.setAttribute('id', customId);
    }

    if (!loading){
        await setDoc(doc(db, "budgets", userId, "entries", customId), {
            name: nameVal,
            amount: amtVal,
            category: dropdownVal,
            createdAt: serverTimestamp()
        }, { merge: true });
    }

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

document.addEventListener('keydown', async function(event) {
    if ((event.key === "Delete" || event.key === "Backspace") && selectedRows.length > 0) {
        const table = document.getElementById("budgetTable");
        selectedRows.sort((a, b) => b - a);

        for (const index of selectedRows) {
            if (table.rows[index]) {
                const docId = table.rows[index].getAttribute("id");
                var category = table.rows[index].cells[2].textContent;
                var cellVal = Number(table.rows[index].cells[1].textContent);

                const userId = auth.currentUser.uid;
                const docRef = doc(db, "budgets", userId, "entries", docId);
                await deleteDoc(docRef);

                if (category == 'Save' || category == 'Invest' || category == 'Other goal'){
                    category = 'Goals'
                    console.log('goalArr')
                    var goalsArr = document.querySelectorAll('li');
                    for (let i = 0; i < goalsArr.length; i++){
                        var id = goalsArr[i].getAttribute('id');
                        if (id == docId){
                            goalsArr[i].style.display = 'none';
                        }
                    }
                }

                if (category !== "Job" && category !== "Assets" && category !== "Savings") {
                    cellVal = -cellVal;
                }
                if (cellVal > 0){
                    amounts[categories.indexOf(category)] -= cellVal;
                } else{
                    amounts[categories.indexOf(category)] += cellVal;
                }

                var numIdx = tblArray.indexOf(cellVal);
                myChart ? myChart.destroy() : {};
                graph();
                tblArray.splice(numIdx, 1);
                table.deleteRow(index);
                getTableVal();

                
            }
        }

        selectedRows.length = 0;
    }
});


async function loadData(table) {
    const userId = auth.currentUser.uid;
    const entriesRef = collection(db, "budgets", userId, "entries");
    const entriesQuery = query(entriesRef, orderBy("createdAt"));


    try {
        const querySnapshot = await getDocs(entriesQuery);
        if (querySnapshot.size === 0) return;

        createBudget();

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            var amount = Number(data.amount);
            var category = data.category;

            tblArray.push(amount);
            amount = Math.abs(amount);
            addRow(table, data.name, amount, category, true, docSnap.id);
            getTableVal();
            if (category == 'Save' || category == 'Invest' || category == 'Other goal'){
                if (!data.processed) {addTask(amount, category, false, docSnap.id)};
            }       

            switch (category) {
                case "Job": amounts[0] += amount; break;
                case "Assets": amounts[1] += amount; break;
                case "Savings": amounts[2] += amount; break;
                case "Housing": amounts[3] += amount; break;
                case "Food": amounts[4] += amount; break;
                case "Transportation": amounts[5] += amount; break;
                case "Save": amounts[6] += amount; break;
                case "Invest": amounts[6] += amount; break;
                case "Other goal": amounts[6] += amount; break;
                case "Projects": amounts[7] += amount; break;
            }
        });

        if (myChart) myChart.destroy();
        graph();

    } catch (error) {
        console.error("Error loading documents:", error);
    }
}



export function createBudget(){
    bgtCreated = true;
    document.getElementById('colBgt').classList.toggle('hidden');
    budgetBtn.remove();
    if (contTutorial){
        createModal('2️⃣ Set Your Goals', 
            `Awesome! Now that you’ve added some values, it’s time to set your money goals. 💪

            Remember to maximize your incomes and assets while you minimize needless expenses.

            For bigger, long-term dreams, try creating projects!

            As you hit your goals, you’ll earn coins, level up, and unlock fun new characters (view in settings). Let’s do this! 🚀`
        );
    }
    budget.id = "budgetTable";
    var rowInput = document.getElementById('rowInput');

    var name = bgtItemName();
    var amount = bgtItemAmt();

    rowInput.appendChild(name);
    rowInput.appendChild(amount);
    
    var category = document.createElement('select');
    category.classList.add('category');
    rowInput.appendChild(category);
    categories.forEach(function(opt){
        var option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        category.appendChild(option);
    });

    addRowBtn = document.createElement('button');
    addRowBtn.textContent = "Add Row";
    addRowBtn.className = 'Btn';
    addRowBtn.id = "addRowBtn"; 
    addRowBtn.onclick = function(){
        
        if (category.value != "Job" && category.value != "Assets" && category.value != "Savings"){
            amount.value = -amount.value;
        }
        if (name.value != '' && amount.value != ''){
            document.getElementById('myChart').classList.remove('hidden');
            addRow(budget, name.value, Math.abs(amount.value), category.value);
            tblArray.push(Number(amount.value));
            getTableVal();
            switch (category.value) {
                case "Job": amounts[0] += Math.abs(amount.value); myChart ? myChart.destroy() : {}; graph(); break;
                case "Assets": amounts[1] += Math.abs(amount.value); myChart ? myChart.destroy() : {}; graph(); break;
                case "Savings": amounts[2] += Math.abs(amount.value); myChart ? myChart.destroy() : {}; graph(); break;
                case "Housing": amounts[3] += Math.abs(amount.value); myChart ? myChart.destroy() : {}; graph(); break;
                case "Food": amounts[4] += Math.abs(amount.value); myChart ? myChart.destroy() : {}; graph(); break;
                case "Transportation": amounts[5] += Math.abs(amount.value); myChart ? myChart.destroy() : {}; graph(); break;
            }
            name.value = '';
            amount.value = '';
        }else if (name.value == ''){
            createModal('Budget Item Name 🤔', 'Please take a moment to add the name for this item.');
        } else {
            createModal('Budget Item Amount 💸', 'Could you please add the amount for this item?');
        };
    }
    rowInput.appendChild(addRowBtn);

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
    netCell.id = 'netCell';
    var cell3 = newfoot.insertCell();
    cell1.textContent = "Net Total: ";
    netCell.textContent = "0";
    cell3.textContent = "";

}

window.createBudget = createBudget;


function unlockavts(){
    // --------------------------------------------- Planner ---------------------------------------------------------------
    if (currentLvl == 5){
        createModal(
            'Character Unlocked! 🔓',
            'Awesome! You\'ve just reached Level 5 and unlocked a new character: The Planner. Head over to the avatar menu in settings to check it out!',
            'Got it!',
            'Close' 
        ); 
        
        for (let i = 0; i < avatars.length; i++){
            if (avatarsMap.get(avatars[i]) === "Planner"){
                var planner = avatars[i];
                document.getElementById('plannerCost').textContent = 'Click to buy with 100 coins';
                console.log('Before:', coinsShown);
                planner.addEventListener('click', () =>{
                    if (!avatarsUnlocked.includes(planner)){
                        if (coinsShown > 100){
                            coinsShown -= 100;
                            coinNum.textContent = `${coinsShown} coins`;
                            planner.style.filter = 'none';
                            avatarsUnlocked.push(avatars[i]);
                            document.getElementById('plannerCost').remove();
                        }
                    }
                    
                }); 

            }
        }
    }

    // --------------------------------------------- Strategist ---------------------------------------------------------------

    if (currentLvl == 10){
        createModal(
            'New Character Unlocked! 🎊 ',
            'Nice! As you reached level 10, a new character is ready to join your collection. Take a look in the avatar menu!',
            'Awesome!', 
            'Close'
        ); 
        
        for (let i = 0; i < avatars.length; i++){
            if (avatarsMap.get(avatars[i]) === "Strategist"){
                var strategist = avatars[i];
                document.getElementById('strategistCost').textContent = 'Click to buy with 500 coins';
                console.log('Before:', coinsShown);
                strategist.addEventListener('click', () =>{
                    if (!avatarsUnlocked.includes(strategist)){
                        if (coinsShown > 500){
                            coinsShown -= 500;
                            coinNum.textContent = `${coinsShown} coins`;
                            strategist.style.filter = 'none';
                            avatarsUnlocked.push(avatars[i]);
                            document.getElementById('strategistCost').remove();
                        }
                    }
                });

            }
        }
    }

    // --------------------------------------------- Analyst ---------------------------------------------------------------

    if (currentLvl == 15){
        createModal(
            'Character Unlocked!🚀 ',
            'Congrats on reaching level 15. Someone special awaits you in the avatar menu. Go meet your new character!',
            'Let\'s go!',
            'Close'
        );
        
        for (let i = 0; i < avatars.length; i++){
            if (avatarsMap.get(avatars[i]) === "Analyst"){
                var analyst = avatars[i];
                document.getElementById('analystCost').textContent = 'Click to buy with 500 coins';
                analyst.addEventListener('click', () =>{
                    if (!avatarsUnlocked.includes(analyst)){
                        if (coinsShown > 1500){
                            coinsShown -= 1500;
                            coinNum.textContent = `${coinsShown} coins`;
                            analyst.style.filter = 'none';
                            avatarsUnlocked.push(avatars[i]);
                            document.getElementById('analystCost').remove();
                        }
                    }
                });
            }
        }
    }

    // --------------------------------------------- Owner ---------------------------------------------------------------

    if (currentLvl >= 20){
        if (currentLvl == 20){
            createModal(
                'Look Who’s Here! ✨',
                'WOW! You\'re officially level 20. And with that, The Owner has joined the fun! Check him out in the avatar menu now!',
                'Yay!',
                'Close'
            );
        }
        
        for (let i = 0; i < avatars.length; i++){
            if (avatarsMap.get(avatars[i]) === "Owner"){
                var owner = avatars[i];
                document.getElementById('ownerCost').textContent = 'Click to buy with 500 coins';
                owner.addEventListener('click', () =>{
                    if (!avatarsUnlocked.includes(owner)){
                        if (coinsShown > 3500){
                            coinsShown -= 3500;
                            coinNum.textContent = `${coinsShown} coins`;
                            owner.style.filter = 'none';
                            avatarsUnlocked.push(avatars[i]);
                            document.getElementById('ownerCost').remove();
                        }
                    }
                });
            }
        }
    }
}

function animateavts() {
    for (let i = 0; i < avatars.length; i++) {
        avatars[i].addEventListener('mouseover', () => {
            avatars[i].src = `../img/${avatarsMap.get(avatars[i])}.gif`;
        });

        avatars[i].addEventListener('mouseout', () => {
            setTimeout(() => {
                avatars[i].src = `../img/${avatarsMap.get(avatars[i])}.png`;
            }, 1000);
        });

        avatars[i].addEventListener('click', () => {
            let div = avatars[i].parentElement;
            let p = div.childNodes[2];

            if (avatarsUnlocked.includes(avatars[i])){
                for (let j = 0; j < avatarsUnlocked.length; j++){
                    let div = avatarsUnlocked[j].parentElement;
                    let p = div.childNodes[2];
                    if (p.textContent.includes('Selected')){
                        console.log('before: '+ p.innerText)
                        p.innerText = '';
                        p.classList.toggle('avtSelected');
                        avatarsUnlocked[j].classList.toggle('selectedImg');

                    }
                }
                if (!p.textContent.includes('Selected')){
                    p.innerText = 'Selected';
                    p.classList.toggle('avtSelected');
                    avatars[i].classList.toggle('selectedImg');
                    document.getElementById("avtShown").src = avatars[i].src;
                }
            }
        });
    }
}


export function avatarLoad(){
    var existingModal = document.getElementById('avatar-modal-container');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    avtModalDiv = document.createElement('div');
    avtModalDiv.classList.add('modal-container');
    avtModalDiv.id = 'avatar-modal-container';
    document.body.appendChild(avtModalDiv);

    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'avatar-modal';
    avtModalDiv.appendChild(modal);

    var btnDiv = document.createElement('div');
    btnDiv.id = 'avtBtnDiv';
    modal.appendChild(btnDiv);

    var heading = document.createElement('h2');
    heading.textContent = 'Avatars';
    modal.appendChild(heading);

    var content = document.createElement('div');
    content.id = 'avtContent';
    modal.appendChild(content);

    // ------------------ Starter -----------------
    var starter = document.createElement('div');
    starter.id = 'starter';
    content.appendChild(starter);

    var starterImg = document.createElement('img');
    starterImg.id = 'starterImg';
    starterImg.classList.add('selectedImg');
    starterImg.src = '../img/Starter.png';
    starter.appendChild(starterImg);

    avatars.push(starterImg);
    avatarsMap.set(starterImg, 'Starter');
    avatarsUnlocked.push(starterImg);

    var starterDes = document.createElement('p');
    starterDes.innerText = 'The Starter';
    starter.appendChild(starterDes);

    var starterSelected = document.createElement('p');
    starterSelected.classList.add('avtSelected');
    starterSelected.innerText = 'Selected';
    starter.appendChild(starterSelected);

    // ----------------- Planner -----------------

    var planner = document.createElement('div');
    planner.id = 'planner';
    content.appendChild(planner);

    var plannerImg = document.createElement('img');
    plannerImg.src = '../img/Planner.png';
    planner.appendChild(plannerImg);

    avatars.push(plannerImg);
    avatarsMap.set(plannerImg, 'Planner');

    var plannerDes = document.createElement('p');
    plannerDes.innerText = 'The Planner';
    planner.appendChild(plannerDes);

    var plannerCost = document.createElement('p');
    plannerCost.innerText = '\nReach Level 5 \n\n Cost: 100 coins';
    plannerCost.id = 'plannerCost';
    planner.appendChild(plannerCost);

    var plannerSelected = document.createElement('p');
    plannerSelected.innerText = '';
    planner.appendChild(plannerSelected);

    // ----------------- Strategist -----------------

    var strategist = document.createElement('div');
    strategist.id = 'strategist';
    content.appendChild(strategist);

    var strategistImg = document.createElement('img');
    strategistImg.src = '../img/Strategist.png';
    strategist.appendChild(strategistImg);

    avatars.push(strategistImg);
    avatarsMap.set(strategistImg, 'Strategist');

    var strategistDes = document.createElement('p');
    strategistDes.innerText = 'The Strategist';
    strategist.appendChild(strategistDes);

    var strategistCost = document.createElement('p');
    strategistCost.innerText = '\nReach Level 10 \n\n Cost: 500 coins';
    strategistCost.id = 'strategistCost';
    strategist.appendChild(strategistCost);

    var strategistSelected = document.createElement('p');
    strategistSelected.innerText = '';
    strategist.appendChild(strategistSelected);

    // ----------------- Analyst -----------------

    var analyst = document.createElement('div');
    analyst.id = 'analyst';
    content.appendChild(analyst);

    var analystImg = document.createElement('img');
    analystImg.src = '../img/Analyst.png';
    analyst.appendChild(analystImg);

    avatars.push(analystImg);
    avatarsMap.set(analystImg, 'Analyst');

    var analystDes = document.createElement('p');
    analystDes.innerText = 'The Analyst';
    analyst.appendChild(analystDes);

    var analystCost = document.createElement('p');
    analystCost.innerText = '\n Reach Level 15 \n\n Cost: 1500 coins';
    analystCost.id = 'analystCost';
    analyst.appendChild(analystCost);

    var analystSelected = document.createElement('p');
    analystSelected.innerText = '';
    analyst.appendChild(analystSelected);

    // ----------------- Owner -----------------

    var owner = document.createElement('div');
    owner.id = 'owner';
    content.appendChild(owner);

    var ownerImg = document.createElement('img');
    ownerImg.src = '../img/Owner.png';
    owner.appendChild(ownerImg);

    avatars.push(ownerImg);
    avatarsMap.set(ownerImg, 'Owner');

    var ownerDes = document.createElement('p');
    ownerDes.innerText = 'The Owner';
    owner.appendChild(ownerDes);

    var ownerCost = document.createElement('p');
    ownerCost.innerText = '\nReach Level 20 \n\n Cost: 3500 coins';
    ownerCost.id = 'ownerCost';
    owner.appendChild(ownerCost);

    var ownerSelected = document.createElement('p');
    ownerSelected.innerText = '';
    owner.appendChild(ownerSelected);

    // ------------------------------------------------
    var avtClose = document.createElement('button');
    avtClose.textContent = '< Back';
    btnDiv.appendChild(avtClose);
    avtClose.classList.add('Btn');
    avtClose.id = 'avtBack';
    
    avtClose.addEventListener('click', () => {
        avtModalDiv.classList.toggle('show'); //close modal
        setModalDiv.classList.toggle('show');
    });

    animateavts();

}

window.avatarLoad = avatarLoad;


function avatarView() {
    avtModalDiv.classList.toggle('show'); //open modal
}

window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('darkMode') === 'on') {
        document.body.classList.add('darkMode');
    }
});

function darkMode() {
    document.body.classList.toggle('darkMode');
    const isDark = document.body.classList.contains('darkMode');
    sessionStorage.setItem('darkMode', isDark ? 'on' : 'off');
    chartFontCol();
}

function chartFontCol(){
    var body = document.body;
    if (body.classList.contains("darkMode")){
            myChart.options.plugins.legend.labels.color = 'white';
            myChart.update();
    } else{
            myChart.options.plugins.legend.labels.color = 'black';
            myChart.update();
    }
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


export function startProj(){
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
            addRow(budget, projectName.value, saveMonth, "Projects");
            tblArray.push(Number(-saveMonth));
            amounts[7] += Number(saveMonth);
            myChart ? myChart.destroy() : {};
            graph();
            getTableVal();
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

window.startProj = startProj;



var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    const button = coll[i];
    const content = button.nextElementSibling;

    button.addEventListener("click", function () {
        this.classList.toggle("active");
        if (content.style.maxHeight) {
            content.style.padding = '0px';
            content.style.maxHeight = null;
        } else {
            content.style.padding = '10px';
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });

    // Set up a MutationObserver for dynamic content changes
    const observer = new MutationObserver(() => {
        if (content.style.maxHeight) {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });

    observer.observe(content, {
        childList: true,
        subtree: true
    });
}

function graph(){
    myChart = new Chart("myChart", {
    type: "doughnut",
    data: {
        labels: categories,
        datasets: [{
            backgroundColor: barColors,
            data: amounts
        }]
    },

    options: {
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'monospace'
                    },
                    color: 'black'
                }
            }
        }
    }
    });
    chartFontCol();
}

async function logoutPrompt() {
    const confirmLO = await createModal('Log Out 🔐', 'Are you sure you would like to log out?', 'Confirm', 'Cancel');
    if (confirmLO) {
        console.log('logging out');
        window.location.href = '../html/login.html';
    }
}

async function delAccount() {
    const confirmed = await createModal(
        'Are you 100% sure?',
        'Once deleted account data will be lost forever.',
        'Delete My Account',
        'Cancel'
    );
    if (confirmed){
        const user = auth.currentUser;
        if (!user) return;

        const userId = user.uid;

        try {
            // Delete Firestore entries first
            const entriesRef = collection(db, "budgets", userId, "entries");
            const querySnapshot = await getDocs(entriesRef);
            for (const entryDoc of querySnapshot.docs) {
                await deleteDoc(entryDoc.ref);
            }

            // Then delete the user
            await deleteUser(user);

            // Optionally: show a confirmation
            if (createModal('Account Deleted', 'Your account and data have been successfully deleted. You will now be logged out.')){
                window.location.href = '../index.html';
            }

        } catch (error) {
            console.error(error);
            createModal('Could Not Delete Account', 'Sorry! We ran into an issue deleting your account. Please try again later.');
        }
    }
}


export function openSettings(){

    var existingModal = document.getElementById('settings-modal-container');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    setModalDiv = document.createElement('div');
    setModalDiv.classList.add('modal-container');
    setModalDiv.id = 'settings-modal-container';
    document.body.appendChild(setModalDiv);

    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'settings-modal';
    setModalDiv.appendChild(modal);

    var btnDiv = document.createElement('div');
    btnDiv.id = 'setBtnDiv';
    modal.appendChild(btnDiv);

    var heading = document.createElement('h2');
    heading.textContent = 'Settings';
    modal.appendChild(heading);

    var content = document.createElement('div');
    content.id = 'setContent';
    modal.appendChild(content);

    // --------------------------------------- Light/Dark Mode -------------------------------------------------

    var modeBtn = document.createElement('button');
    modeBtn.classList.add('setBtn');
    modeBtn.classList.add('Btn');

    var modeIcon = document.createElement('img');
    modeIcon.src = '../img/lightMode.png';
    modeIcon.style.width = '30px';
    modeIcon.style.height = '30px';
    modeBtn.appendChild(modeIcon);

    // Add text after the image without overwriting it
    var modebtnText = document.createTextNode('Toggle Dark Mode');
    modeBtn.appendChild(modebtnText);

    modeBtn.addEventListener('click', () => {darkMode()});

    content.appendChild(modeBtn);


    // --------------------------------------- Avatar Menu -------------------------------------------------

    var avtBtn = document.createElement('button');
    avtBtn.classList.add('setBtn');
    avtBtn.classList.add('Btn');

    var avtIcon = document.createElement('img');
    avtIcon.src = '../img/avatar.png';
    avtIcon.style.width = '30px';
    avtIcon.style.height = '30px';
    avtBtn.appendChild(avtIcon);

    // Add text after the image without overwriting it
    var avtbtnText = document.createTextNode('Open Avatar Menu');
    avtBtn.appendChild(avtbtnText);

    avtBtn.addEventListener('click', () => {avatarView(); setModalDiv.classList.toggle('show');});

    content.appendChild(avtBtn);

    // --------------------------------------- Logout -------------------------------------------------

    var LOBtn = document.createElement('button');
    LOBtn.classList.add('setBtn');
    LOBtn.classList.add('Btn');

    var LOIcon = document.createElement('img');
    LOIcon.src = '../img/logout.png';
    LOIcon.style.width = '30px';
    LOIcon.style.height = '30px';
    LOBtn.appendChild(LOIcon);


    // Add text after the image without overwriting it
    var LOBtnText = document.createTextNode('Logout');
    LOBtn.appendChild(LOBtnText);

    LOBtn.addEventListener('click', () => {
        logoutPrompt();
    });

    content.appendChild(LOBtn);

    // --------------------------------------- delete Account -------------------------------------------------

    var delBtn = document.createElement('button');
    delBtn.classList.add('setBtn');
    delBtn.classList.add('Btn');
    delBtn.id = "delBtn";

    var delIcon = document.createElement('img');
    delIcon.src = '../img/delete.png';
    delIcon.style.width = '30px';
    delIcon.style.height = '30px';
    delBtn.appendChild(delIcon);


    // Add text after the image without overwriting it
    var delbtnText = document.createTextNode('delete Account');
    delBtn.appendChild(delbtnText);

    delBtn.addEventListener('click', () => {delAccount()});

    content.appendChild(delBtn);

    // ------------------------------------------------------------------------------------------------------------


    var setClose = document.createElement('button');
    setClose.textContent = 'X';
    btnDiv.appendChild(setClose);
    setClose.classList.add('Btn');
    setClose.id = 'setX';

    setModalDiv.classList.toggle('show');
    
    setClose.addEventListener('click', () => {
        setModalDiv.classList.toggle('show'); //close modal
    });
}

window.openSettings = openSettings;
