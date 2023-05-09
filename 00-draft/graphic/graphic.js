
document.addEventListener('mousemove', (mouse) => {
    const ids = document.getElementsByClassName('graphic').length;
    for (var i = 1; i <= ids; i++) {
        pointer(i, mouse.clientX, mouse.clientY);
    }
});

function pointer(id, mouseX, mouseY) {
    const roundValue = 10000;
    const graph = document.getElementById('grph' + id);
    const pointer = document.getElementById('pntr' + id);
    const pointerH = document.getElementById('hz-pntr' + id);
    const pointerV = document.getElementById('vt-pntr' + id);
    const text = document.getElementById('val-pntr' + id);
    let x0 = mouseX - graph.offsetLeft - (0.02 * graph.offsetWidth) + window.scrollX;
    let y0 = mouseY - graph.offsetTop - (0.02 * graph.offsetWidth) + window.scrollY;
    if (x0 > 0 && x0 < (0.96 * graph.offsetWidth) && y0 > 0 && y0 < 300) {
        pointer.classList.remove('disable');
        pointerH.outerHTML = '<line id="hz-pntr' + id + '" x1="0%" y1="' + (y0 / 300) * 100 + '%" x2="100%" y2="' + (y0 / 300) * 100 + '%"/>';
        pointerV.outerHTML = '<line id="vt-pntr' + id + '" x1="' + (x0 / (0.96 * graph.offsetWidth)) * 100 + '%" y1="0%" x2="' + (x0 / (0.96 * graph.offsetWidth)) * 100 + '%" y2="100%"/>';
        text.innerHTML = '{' + (Math.round((x0 / (0.96 * graph.offsetWidth)) * roundValue) / roundValue) + ', ' + (Math.round((y0 / 300) *roundValue) / roundValue) + '}';
    } else if (! pointer.classList.contains('disable')) {
        pointer.classList.add('disable');
    }
}

/*
const file = 'data.json';

window.addEventListener('DOMContentLoaded', (event) => {
    fetch(file)
        .then((response) => response.json())
        .then((json) => loadData(json));
});

function loadData(json) {
    let code = '';
    const container = document.getElementsByClassName('container')[0];
    for (var i = 0; i < json.graphics.length; i++) {
        if (json.graphics[i].type === 'bar') {
            code += loadBar(json.graphics[i]);
        } else if (json.graphics[i].type === 'point') {
            //To complete
        }
    }
    container.innerHTML = code;
}

function loadBar(graphic) {
    let code = '';
    code += '<div class="box">\n';
    code += '<div class="title">' + graphic.title + '</div>\n';
    code += '<div class="graphic">\n';
    code += '<div class="grid">\n';
    code += '<div class="axis axis-y"></div>\n';
    code += '<div class="axis axis-x"></div>\n';
    code += '</div>\n';
    code += '<div class="bars">\n';
    for (var i = 0; i < graphic.data.length; i++) {
        code += '<div class="bar">\n';
        code += '<div class="value">' + graphic.data[i].value + '</div>\n';
        code += '<div class="shape" style="height: ' + (graphic.data[i].value + 14) + 'px"></div>\n';
        code += '<div class="label">' + graphic.data[i].label + '</div>\n';
        code += '</div>\n';
    }
    code += '</div>\n';
    code += '</div>\n';
    code += '</div>\n';
    return code;
}

function getMinAndMax(data) {
    
}
*/