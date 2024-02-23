const eye = { x: 0, y: 0 }
const ellipse = { a: 90, b: 40 }
const line = { k: 0 }

document.addEventListener('mousemove', (mouse)=> {
    const x0 = mouse.clientX - (window.innerWidth / 2);
    const y0 = mouse.clientY - (window.innerHeight / 2);
    const iris = document.getElementById('iris');
    eyePosition(x0, y0);
    iris.style.top = (eye.y + 60.4) + 'px';
    iris.style.left = (eye.x + 120.4) + 'px';
    const rings = document.getElementsByClassName('ring');
    for (var i = 0; i < rings.length; i++) {
        rings[i].style.top = (eye.y - 140.8 + (20*i)) + 'px';
        rings[i].style.left = (eye.x - 80.8 + (20*i)) + 'px';
    }
});

function eyePosition(x0, y0) {
    // Calculate the position of the eye
    if (x0 === 0) {
        if (y0 > 0) {
            eye.x = 0;
            eye.y = ellipse.b;
        } else {
            eye.x = 0;
            eye.y = - ellipse.b;
        }
    } else {
        line.k = (y0 / x0);
        if (x0 > 0) {
            eye.x = (ellipse.a * ellipse.b) / Math.sqrt(Math.pow(ellipse.b, 2) + (Math.pow(ellipse.a, 2) * Math.pow(line.k, 2)));
            eye.y = (line.k * eye.x);
        } else {
            eye.x = - (ellipse.a * ellipse.b) / Math.sqrt(Math.pow(ellipse.b, 2) + (Math.pow(ellipse.a, 2) * Math.pow(line.k, 2)));
            eye.y = (line.k * eye.x);
        }
    }
    // Check x0, y0 in the eye
    if (Math.abs(x0) <= Math.abs(eye.x) && Math.abs(y0) <= Math.abs(eye.y)) {
        eye.x = x0;
        eye.y = y0;
    }
}