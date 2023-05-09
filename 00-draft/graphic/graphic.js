const file = 'data.json';

let objects = new Array();

window.addEventListener('DOMContentLoaded', (event) => {
    fetch(file)
        .then((response) => response.json())
        .then((json) => loadObject(json));
});

function loadObject(json) {
    let code = '';
    objects = new Array();
    const box = document.getElementsByClassName('box')[0];
    for (let i = 0; i < json.graphics.length; i++) {
        addObject(json.graphics[i]);
        code += displayGraphic(i+1,objects[i], 10, 5);
    }
    box.innerHTML = code;
}

function addObject(graphic) {
    const object = { type: '', title: '', min: {}, max: {}, data: [] }
    object.type = graphic.type;
    object.title = graphic.title;
    object.data = graphic.data;
    for (let i = 0; i < object.data.length; i++) {
        if (graphic.data[i].x !== undefined) {
            if (object.min.x === undefined || object.min.x > graphic.data[i].x) { object.min.x = graphic.data[i].x; }
            if (object.max.x === undefined || object.max.x < graphic.data[i].x) { object.max.x = graphic.data[i].x; }
        }
        if (graphic.data[i].y !== undefined) {
            if (object.min.y === undefined || object.min.y > graphic.data[i].y) { object.min.y = graphic.data[i].y; }
            if (object.max.y === undefined || object.max.y < graphic.data[i].y) { object.max.y = graphic.data[i].y; }
        }
    }
    objects.push(object);
}

function displayGraphic(id, graphic, H, V) {
    let code = '';
    //code += '<div class="box">\n';
    code += '<div class="title">' + graphic.title + '</div>\n';
    code += '<div class="graphic" id="grph' + id + '">\n';
    code += '<!-- Graphic -->\n';
    code += '<svg width="100%" height="100%">\n';
    code += '<!-- Grid -->\n';
    code += '<g stroke="#c8c8c8" stroke-width="1" fill="none">\n';
    code += '<!-- Frame -->\n';
    code += '<rect x="0%" y="0%" width="100%" height="100%" stroke-width="2"/>\n';
    code += '<!-- Horizontal lines -->\n';
    for (let h = H; h < 100; h += H) {
        code += '<line x1="0%" y1="' + h + '%" x2="100%" y2="' + h + '%"/>\n';
    }
    code += '<!-- Vertical lines -->\n';
    for (let v = V; v < 100; v += V) {
        code += '<line x1="' + v + '%" y1="0%" x2="' + v + '%" y2="100%"/>\n';
    }
    code += '</g>';
    code += displayData(graphic);
    code += '<!-- Pointer -->\n';
    code += '<g class="disable" id="pntr' + id + '" stroke="red" stroke-width="0.5">\n';
    code += '<!-- Horizontal lines -->\n';
    code += '<line id="hz-pntr' + id + '" x1="0%" y1="0%" x2="100%" y2="0%"/>\n';
    code += '<!-- Vertical lines -->\n';
    code += '<line id="vt-pntr' + id + '" x1="0%" y1="0%" x2="0%" y2="100%"/>\n';
    code += '<!-- Text values -->\n';
    code += '<text id="val-pntr' + id + '" x="1%" y="97%" fill="red" font-size="10px">{0, 0}</text>\n';
    code += '</g>';
    code += '</svg>\n';
    code += '</div>\n';
    //code += '</div>\n';
    return code;
}

function displayData(graphic) {
    let code = '';
    if (graphic.type === 'bar') {
        code += '<!-- Data -->\n';
        code += '<g stroke="black" stroke-width="0" fill="red">\n';
        code += '<!-- Bars -->\n';
        code += '<rect x="24%" y="15%" width="2%" height="35%"/>\n';
        code += '</g>';
        code += '<!-- Axis -->\n';
        code += '<g stroke="black">\n';
        code += '<!-- Horizontal lines -->\n';
        code += '<line x1="0%" y1="50%" x2="100%" y2="50%" stroke-width="2"/>\n';
        code += '<!-- Vertical lines -->\n';
        code += '<line x1="0%" y1="0%" x2="0%" y2="100%" stroke-width="4"/>\n';
        code += '</g>';
    } else if (graphic.type === 'point') {
        code += '<!-- Axis -->\n';
        code += '<g stroke="black" stroke-width="2">\n';
        code += '<!-- Horizontal lines -->\n';
        code += '<line x1="0%" y1="50%" x2="100%" y2="50%"/>\n';
        code += '<!-- Vertical lines -->\n';
        code += '<line x1="50%" y1="0%" x2="50%" y2="100%"/>\n';
        code += '</g>';
        code += '<!-- Data -->\n';
        code += '<g stroke="blue" stroke-width="2" fill="white">\n';
        code += '<!-- Lines -->\n';
        code += '<line x1="10%" y1="10%" x2="90%" y2="65%"/>\n';
        code += '<!-- Points -->\n';
        code += '<circle cx="10%" cy="10%" r="6"/>\n';
        code += '<circle cx="90%" cy="65%" r="6"/>\n';
        code += '</g>';
    }
    //for (var i = 0; i < graphic.data.length; i++) {}
    return code;
}

document.addEventListener('mousemove', (mouse) => {
    const ids = document.getElementsByClassName('graphic').length;
    for (var i = 1; i <= ids; i++) {
        pointer(i, mouse.clientX, mouse.clientY);
    }
});

function pointer(id, mouseX, mouseY) {
    const roundValue = 1000;
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
