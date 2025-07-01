window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('darkMode');
    }
});

function homePage() {
    const isDarkMode = document.body.classList.contains('darkMode');
    sessionStorage.setItem('darkMode', isDarkMode);

    window.location.href = 'C:/Users/gargh/OneDrive/Documents/financeManager/html/main.html';
}

function darkMode(){
    var body = document.body;
    body.classList.toggle("darkMode");
}
