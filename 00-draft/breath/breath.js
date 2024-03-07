const step = 50;
let times = [4, 6];
let total = 10;
let i = - 1000 / step;

const chrono = setInterval(() => {
    updateLinearTimer('linear-timer');
    i++;
}, step);

function updateLinearTimer(id) {
    let code = '';
    const gap = 1000 / step;
    let start = 1, end = 1, cursor = 1, t = 0;
    let value = 0;
    const timer = document.getElementById(id);
    for (const j in times) {
        const size = (times[j] * (100 - (2 * times.length))) / total;
        cursor += size * (i - (t * gap)) / (times[j] * gap);
        console.log(cursor);
        end += size;
        code += '<line x1="' + start + '%" y1="50%" x2="' + end + '%" y2="50%" fill="none" stroke="#aaaaaa"/>';
        if (i > ((t + times[j]) * gap)) {
            code += '<line x1="' + start + '%" y1="50%" x2="' + end + '%" y2="50%" fill="none" stroke="#4caf50" stroke-width="8"/>';
        } else if (i > (t * gap) && i <= ((t + times[j]) * gap)) {
            value = i == ((t + times[j]) * gap) ? 0 : parseInt((i / gap) - t);
            code += '<line x1="' + start + '%" y1="50%" x2="' + cursor + '%" y2="50%" fill="none" stroke="#4caf50" stroke-width="8"/>';
        }
        end += 2;
        start = end;
        cursor = end;
        t += times[j];
    }
    code += '<text x="50%" y="30%" text-anchor="middle" font-family="sans-serif" font-size="60">' + value + '</text>';
    if (i >= total * gap) { i = 0; }
    timer.innerHTML = code;
}

function resetActive() {
    const tabs = document.getElementsByClassName('tab');
    for (let j = 0; j < tabs.length; j++) { tabs[j].classList.remove('active'); }
}

function clickTab(id) {
    resetActive();
    document.getElementById(id).classList.add('active');
    switch (id) {
        case 'tab-1':
            times = [4, 6];
            total = 10;
            break;
        case 'tab-2':
            times = [5, 5];
            total = 10;
            break;
        case 'tab-3':
            times = [4, 4, 4, 4];
            total = 16;
            break;
        case 'tab-4':
            times = [4, 4, 6, 2];
            total = 16;
            break;
        case 'tab-5':
            times = [6, 4, 8, 2];
            total = 20;
            break;
        case 'tab-6':
            times = [4, 7, 8];
            total = 19;
            break;
    }
    i = - 1000 / step;
}