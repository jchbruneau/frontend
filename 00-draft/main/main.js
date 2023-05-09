window.addEventListener('DOMContentLoaded', (event) => {
    placePopup();
});

let i = 0;
const progressId = setInterval(() => {
    const id = 'bar1';
    updateProgress('prg-'+ id, i);
    updateText('txt-'+ id, i);
    i++;
    if (i > 100) { clearInterval(progressId); }
}, 50);

let j = 0;
const popupId = setInterval(() => {
    const id = 'pop1';
    updateProgress('tim-'+ id, j);
    j++;
    if (j >= 100) {
        closePopup(id);
        placePopup();
        clearInterval(popupId);
    }
}, 50);

let value = 0;
function resetTimer(id) {
    value = 0;
    lockButton(id);
    const intervalId = setInterval(() => {
        updateProgress('tim-' + id, value);
        updateTime('txt-' + id, value);
        value++;
        if (value > 100) {
            unlockButton(id, 'Click me');
            clearInterval(intervalId);
        }
    }, 50);
}

function lockButton(id) {
    const button = document.getElementById(id);
    button.disabled = true;
}

function unlockButton(id, message) {
    const button = document.getElementById(id);
    const timer = document.getElementById('tim-' + id);
    const text = document.getElementById('txt-' + id);
    timer.style.width = '0%';
    text.textContent = message;
    button.disabled = false;
}

function updateProgress(id, value) {
    //console.log('id : ' + id);
    //console.log('value : ' + value);
    const progress = document.getElementById(id);
    progress.style.width = `${value}%`;
}

function updateText(id, value) {
    //console.log('id : ' + id);
    //console.log('value : ' + value);
    const text = document.getElementById(id);
    text.textContent = `${value}%`;
}

function updateTime(id, value) {
    //console.log('id : ' + id);
    //console.log('value : ' + value);
    const text = document.getElementById(id);
    text.textContent = `Click me ${5-Math.round(value*0.05)}s`;
}

function updateSwitch(id) {
    //console.log('id : ' + id);
    const switchs = document.getElementById('swt-' + id);
    const text = document.getElementById('txt-' + id);
    if (switchs.classList.contains('on')) {
        switchs.classList.replace('on', 'off');
        text.classList.replace('on', 'off');
        text.textContent = 'Off';
    } else {
        switchs.classList.replace('off', 'on');
        text.classList.replace('off', 'on');
        text.textContent = 'On';
    }
}

function closePopup(id) {
    //console.log('id : ' + id);
    const popup = document.getElementById(id);
    popup.classList.add('close')
}

function placePopup() {
    let i;
    let j = 0;
    const popups = document.getElementsByClassName('popup-box');
    for (i = 0; i < popups.length; i++) {
        if (! popups[i].classList.contains('close')) {
            popups[i].style.bottom = `${(j*12)+2}vh`
            j++;
        }
    }
}