var logo = document.getElementById('logo');
let scale = 1;
let opacity = 1;

logo.addEventListener('click', () => {
    document.getElementById('begin').style.visibility = 'hidden';
    const interval = setInterval(() => {
        scale += 1;
        opacity -= 0.0055;

        logo.style.transform = `scale(${scale})`;
        logo.style.opacity = opacity;

        if (scale >= 300) {
            clearInterval(interval);
            window.open("./html/main.html", "_self");
        }
    }, 10);
});
