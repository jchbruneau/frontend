const eye = { x: 0, y: 0 }
const ellipse = { a: 8, b: 4 }
const line = { k: 0 }

document.addEventListener('mousemove', (mouse) => {
    const element = document.getElementById('eye');
    const iris = document.getElementById('iris');
    const x0 = mouse.clientX - element.offsetLeft - (element.offsetWidth / 2) + window.scrollX;
    const y0 = mouse.clientY - element.offsetTop - (element.offsetHeight / 2) + window.scrollY;
    eyePosition(x0, y0);
    iris.style.top = (eye.y + 3) + 'px';
    iris.style.left = (eye.x + 6.5) + 'px';
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