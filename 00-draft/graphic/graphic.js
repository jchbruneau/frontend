const file = 'data.json';
let objects = new Array();
let id = 0;

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
        id = i+1;
        addObject(json.graphics[i]);
        code += displayGraphic();
    }
    box.innerHTML = code;
}

function addObject(graphic) {
    const object = { type: '', title: '', min: {}, max: {}, length: {}, data: [] }
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
    fixValues(object);
    objects.push(object);
}

function fixValues(object) {
    let fix = 0;
    if (object.min.x !== undefined && object.max.x !== undefined) {
        fix = (object.max.x - object.min.x) * 0.025;
        object.min.x += -fix;
        object.max.x += fix;
        object.length.x = object.max.x - object.min.x;
    }
    if (object.min.y !== undefined && object.max.y !== undefined) {
        fix = (object.max.y - object.min.y) * 0.05;
        object.min.y += -fix;
        object.max.y += fix;
        object.length.y = object.max.y - object.min.y;
    }
}

function displayGraphic() {
    let code = '';
    const graphic = objects[id-1];
    code += '<div class="sub-box">\n';
    code += '<div class="title">' + graphic.title + '</div>\n';
    code += '<div class="graphic" id="grph' + id + '">\n';
    code += '<!-- Graphic -->\n';
    code += '<svg width="100%" height="100%">\n';
    if (graphic.type === 'histogram') {
        code += displayHistogram();
    } else if (graphic.type === 'point') {
        code += displayPoint();
    }
    code += '<!-- Pointer -->\n';
    code += '<g class="disable" id="pntr' + id + '">\n';
    code += '<!-- Horizontal line -->\n';
    code += '<line id="hz-pntr' + id + '" x1="0%" y1="0%" x2="100%" y2="0%" stroke="red" stroke-width="0.5"/>\n';
    code += '<!-- Vertical line -->\n';
    code += '<line id="vt-pntr' + id + '" x1="0%" y1="0%" x2="0%" y2="100%" stroke="red" stroke-width="0.5"/>\n';
    code += '<!-- Text values -->\n';
    code += '<rect x="0.5%" y="93.5%" width="10%" height="5%" fill="#ffffffb3"/>\n';
    code += '<text id="val-pntr' + id + '" x="1%" y="97%" fill="red" font-size="10px"></text>\n';
    code += '</g>';
    code += '</svg>\n';
    code += '</div>\n';
    code += '</div>\n';
    return code;
}

function displayHistogram() {
    const graphic = objects[id-1];
    let code = '';
    let x0 = 0;
    let y0 = 0;
    let height = 0;
    const step = 100 / ((3 * graphic.data.length) + 1);
    const width = 2 * step;
    
    code += '<!-- Grid -->\n';
    code += '<g stroke="#c8c8c8" stroke-width="1" fill="none">\n';
    code += '<!-- Frame -->\n';
    code += '<rect x="0%" y="0%" width="100%" height="100%" stroke-width="2"/>\n';
    code += '<!-- Horizontal lines -->\n';
    if (graphic.min.y <= 0 && graphic.max.y >= 0) {
        y0 = 100 * (graphic.max.y / graphic.length.y);
        for (let h = y0 - (Math.round(y0 / 10) * 10); h < 100; h += 10) {
            code += '<line x1="0%" y1="' + h + '%" x2="100%" y2="' + h + '%"/>\n';
        }
    } else {
        for (let h = 10; h < 100; h += 10) {
            code += '<line x1="0%" y1="' + h + '%" x2="100%" y2="' + h + '%"/>\n';
        }
    }
    code += '</g>';
    
    code += '<!-- Data -->\n';
    code += '<g stroke="black" stroke-width="0" fill="red">\n';
    code += '<!-- Bars -->\n';
    x0 = step;
    for (let i = 0; i < graphic.data.length; i++) {
        if (graphic.min.y <= 0 && graphic.max.y >= 0) {
            if (graphic.data[i].y > 0) {
                y0 = 100 - (100 * (graphic.length.y - graphic.max.y + graphic.data[i].y) / graphic.length.y);
                height = 100 * (graphic.data[i].y / graphic.length.y);
                code += '<rect x="' + x0 + '%" y="' + y0 + '%" width="' + width + '%" height="' + height + '%"/>\n';
            } else if (graphic.data[i].y < 0) {
                y0 = 100 * (graphic.max.y / graphic.length.y);
                height = 100 * (Math.abs(graphic.data[i].y) / graphic.length.y);
                code += '<rect x="' + x0 + '%" y="' + y0 + '%" width="' + width + '%" height="' + height + '%"/>\n';
            }
        } else if (graphic.data[i].y > 0) {
            height = 100 * (graphic.length.y - graphic.max.y + graphic.data[i].y) / graphic.length.y;
            y0 = 100 - height;
            code += '<rect x="' + x0 + '%" y="' + y0 + '%" width="' + width + '%" height="' + height + '%"/>\n';
        } else if (graphic.data[i].y < 0) {
            y0 = 100 * (graphic.data[i].y - graphic.min.y) / graphic.length.y;
            height = 100 - y0;
            code += '<rect x="' + x0 + '%" y="0%" width="' + width + '%" height="' + height + '%"/>\n';
        }
        x0 += width + step;
    }
    code += '</g>';
    
    code += '<!-- Axis -->\n';
    code += '<g stroke="black">\n';
    code += '<!-- Horizontal lines -->\n';
    if (graphic.min.y <= 0 && graphic.max.y >= 0) {
        y0 = 100 * (graphic.max.y / graphic.length.y);
        code += '<line x1="0%" y1="' + y0 + '%" x2="100%" y2="' + y0 + '%" stroke-width="2"/>\n';
    } else if (graphic.min.y > 0) {
        code += '<line x1="0%" y1="100%" x2="100%" y2="100%" stroke-width="4"/>\n';
    } else if (graphic.max.y < 0) {
        code += '<line x1="0%" y1="0%" x2="100%" y2="0%" stroke-width="4"/>\n';
    }
    code += '<!-- Vertical lines -->\n';
    code += '<line x1="0%" y1="0%" x2="0%" y2="100%" stroke-width="4"/>\n';
    code += '</g>';
    return code;
}

function displayPoint() {
    let code = '';
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    const graphic = objects[id-1];
    
    code += '<!-- Grid -->\n';
    code += '<g stroke="#c8c8c8" stroke-width="1" fill="none">\n';
    code += '<!-- Frame -->\n';
    code += '<rect x="0%" y="0%" width="100%" height="100%" stroke-width="2"/>\n';
    code += '<!-- Horizontal lines -->\n';
    if (graphic.min.y <= 0 && graphic.max.y >= 0) {
        y1 = 100 * (graphic.max.y / graphic.length.y);
        for (let h = y1 - (Math.round(y1 / 10) * 10); h < 100; h += 10) {
            code += '<line x1="0%" y1="' + h + '%" x2="100%" y2="' + h + '%"/>\n';
        }
    } else {
        for (let h = 10; h < 100; h += 10) {
            code += '<line x1="0%" y1="' + h + '%" x2="100%" y2="' + h + '%"/>\n';
        }
    }
    code += '<!-- Vertical lines -->\n';
    if (graphic.min.x <= 0 && graphic.max.x >= 0) {
        x1 = 100 * (Math.abs(graphic.min.x) / graphic.length.x);
        for (let v = x1 - (Math.round(x1 / 10) * 10); v < 100; v += 5) {
            code += '<line x1="' + v + '%" y1="0%" x2="' + v + '%" y2="100%"/>\n';
        }
    } else {
        for (let v = 5; v < 100; v += 5) {
            code += '<line x1="' + v + '%" y1="0%" x2="' + v + '%" y2="100%"/>\n';
        }
    }
    code += '</g>';
    
    code += '<!-- Axis -->\n';
    code += '<g stroke="black">\n';
    code += '<!-- Horizontal lines -->\n';
    if (graphic.min.y <= 0 && graphic.max.y >= 0) {
        y1 = 100 * (graphic.max.y / graphic.length.y);
        code += '<line x1="0%" y1="' + y1 + '%" x2="100%" y2="' + y1 + '%" stroke-width="2"/>\n';
    } else if (graphic.min.y > 0) {
        code += '<line x1="0%" y1="100%" x2="100%" y2="100%" stroke-width="4"/>\n';
    } else if (graphic.max.y < 0) {
        code += '<line x1="0%" y1="0%" x2="100%" y2="0%" stroke-width="4"/>\n';
    }
    code += '<!-- Vertical lines -->\n';
    if (graphic.min.x <= 0 && graphic.max.x >= 0) {
        x1 = 100 * (Math.abs(graphic.min.x) / graphic.length.x);
        code += '<line x1="' + x1 + '%" y1="0%" x2="' + x1 + '%" y2="100%" stroke-width="2"/>\n';
    } else if (graphic.min.x > 0) {
        code += '<line x1="0%" y1="0%" x2="0%" y2="100%" stroke-width="4"/>\n';
    } else if (graphic.max.x < 0) {
        code += '<line x1="100%" y1="0%" x2="100%" y2="100%" stroke-width="4"/>\n';
    }
    code += '</g>';
    
    code += '<!-- Data -->\n';
    code += '<g stroke="blue" stroke-width="2" fill="white">\n';
    code += '<!-- Lines -->\n';
    for (let i = 0; i < graphic.data.length; i++) {
        if (i === 0) {
            if (graphic.data[i].x > 0) {
                x1 = 100 * (graphic.length.x - graphic.max.x + graphic.data[i].x) / graphic.length.x;
            } else {
                x1 = 100 * (graphic.data[i].x - graphic.min.x) / graphic.length.x;
            }
            if (graphic.data[i].y > 0) {
                y1 = 100 - (100 * (graphic.length.y - graphic.max.y + graphic.data[i].y) / graphic.length.y);
            } else {
                y1 = 100 - (100 * (graphic.data[i].y - graphic.min.y) / graphic.length.y);
            }
        } else {
            if (graphic.data[i].x > 0) {
                x2 = 100 * (graphic.length.x - graphic.max.x + graphic.data[i].x) / graphic.length.x;
            } else {
                x2 = 100 * (graphic.data[i].x - graphic.min.x) / graphic.length.x;
            }
            if (graphic.data[i].y > 0) {
                y2 = 100 - (100 * (graphic.length.y - graphic.max.y + graphic.data[i].y) / graphic.length.y);
            } else {
                y2 = 100 - (100 * (graphic.data[i].y - graphic.min.y) / graphic.length.y);
            }
            code += '<line x1="' + x1 + '%" y1="' + y1 + '%" x2="' + x2 + '%" y2="' + y2 + '%"/>\n';
            x1 = x2;
            y1 = y2;
        }
    }
    code += '<!-- Points -->\n';
    for (let i = 0; i < graphic.data.length; i++) {
        if (graphic.data[i].x > 0) {
            x1 = 100 * (graphic.length.x - graphic.max.x + graphic.data[i].x) / graphic.length.x;
        } else {
            x1 = 100 * (graphic.data[i].x - graphic.min.x) / graphic.length.x;
        }
        if (graphic.data[i].y > 0) {
            y1 = 100 - (100 * (graphic.length.y - graphic.max.y + graphic.data[i].y) / graphic.length.y);
        } else {
            y1 = 100 - (100 * (graphic.data[i].y - graphic.min.y) / graphic.length.y);
        }
        code += '<circle cx="' + x1 + '%" cy="' + y1 + '%" r="6"/>\n';
    }
    code += '</g>';
    return code;
}

document.addEventListener('mousemove', (mouse) => {
    const ids = document.getElementsByClassName('graphic').length;
    for (let i = 0; i < ids; i++) {
        id = i+1;
        pointer(mouse.clientX, mouse.clientY);
    }
});

function pointer(mouseX, mouseY) {
    const roundValue = 100;
    const graphic = objects[id-1];
    const graph = document.getElementById('grph' + id);
    const pointer = document.getElementById('pntr' + id);
    const pointerH = document.getElementById('hz-pntr' + id);
    const pointerV = document.getElementById('vt-pntr' + id);
    const text = document.getElementById('val-pntr' + id);
    let x0 = mouseX - graph.offsetLeft - (0.02 * graph.offsetWidth) + window.scrollX;
    let y0 = mouseY - graph.offsetTop - (0.02 * graph.offsetWidth) + window.scrollY;
    if (x0 > 0 && x0 < (0.96 * graph.offsetWidth) && y0 > 0 && y0 < 300) {
        pointerH.outerHTML = '<line id="hz-pntr' + id + '" x1="0%" y1="' + (y0 / 300) * 100 + '%" x2="100%" y2="' + (y0 / 300) * 100 + '%" stroke="red" stroke-width="0.5"/>';
        pointerV.outerHTML = '<line id="vt-pntr' + id + '" x1="' + (x0 / (0.96 * graph.offsetWidth)) * 100 + '%" y1="0%" x2="' + (x0 / (0.96 * graph.offsetWidth)) * 100 + '%" y2="100%" stroke="red" stroke-width="0.5"/>';
        if (graphic.type === 'histogram') {
            text.innerHTML = '{ ' + Math.round(graphic.min.x + (graphic.length.x * x0) / (0.96 * graph.offsetWidth)) + ', ' + (Math.round((graphic.max.y - (graphic.length.y * y0 / 300)) *roundValue) / roundValue) + ' }';
        } else {
            text.innerHTML = '{ ' + (Math.round((graphic.min.x + (graphic.length.x * x0) / (0.96 * graph.offsetWidth)) * roundValue) / roundValue) + ', ' + (Math.round((graphic.max.y - (graphic.length.y * y0 / 300)) *roundValue) / roundValue) + ' }';
        }
        pointer.classList.remove('disable');
    } else if (! pointer.classList.contains('disable')) {
        pointer.classList.add('disable');
    }
}
