let display = document.getElementById('display');

document.getElementById('back').addEventListener('click', () => {
    window.location.href = 'popup.html'; // Navigate back to the popup page
});

document.getElementById('clear').addEventListener('click', clearDisplay);
document.getElementById('delete').addEventListener('click', deleteLast);
document.getElementById('divide').addEventListener('click', () => appendOperator('/'));
document.getElementById('multiply').addEventListener('click', () => appendOperator('*'));
document.getElementById('seven').addEventListener('click', () => appendNumber(7));
document.getElementById('eight').addEventListener('click', () => appendNumber(8));
document.getElementById('nine').addEventListener('click', () => appendNumber(9));
document.getElementById('subtract').addEventListener('click', () => appendOperator('-'));
document.getElementById('four').addEventListener('click', () => appendNumber(4));
document.getElementById('five').addEventListener('click', () => appendNumber(5));
document.getElementById('six').addEventListener('click', () => appendNumber(6));
document.getElementById('add').addEventListener('click', () => appendOperator('+'));
document.getElementById('one').addEventListener('click', () => appendNumber(1));
document.getElementById('two').addEventListener('click', () => appendNumber(2));
document.getElementById('three').addEventListener('click', () => appendNumber(3));
document.getElementById('equals').addEventListener('click', calculate);
document.getElementById('zero').addEventListener('click', () => appendNumber(0));
document.getElementById('dot').addEventListener('click', appendDot);
document.getElementById('sqrt').addEventListener('click', () => appendFunction('sqrt'));
document.getElementById('pow').addEventListener('click', () => appendFunction('pow'));
document.getElementById('sin').addEventListener('click', () => appendFunction('sin'));
document.getElementById('cos').addEventListener('click', () => appendFunction('cos'));
document.getElementById('tan').addEventListener('click', () => appendFunction('tan'));
document.getElementById('log').addEventListener('click', () => appendFunction('log'));

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function appendNumber(number) {
    console.log(`Digit entered: ${number}`);
    display.value += number;
}

function appendOperator(operator) {
    display.value += ` ${operator} `;
}

function appendDot() {
    if (!display.value.includes('.')) {
        display.value += '.';
    }
}

function appendFunction(func) {
    switch (func) {
        case 'sqrt':
            display.value = Math.sqrt(parseFloat(display.value));
            break;
        case 'pow':
            display.value += ' ^ ';
            break;
        case 'sin':
            display.value = Math.sin(parseFloat(display.value) * Math.PI / 180);
            break;
        case 'cos':
            display.value = Math.cos(parseFloat(display.value) * Math.PI / 180);
            break;
        case 'tan':
            display.value = Math.tan(parseFloat(display.value) * Math.PI / 180);
            break;
        case 'log':
            display.value = Math.log10(parseFloat(display.value));
            break;
    }
}

function calculate() {
    let expression = display.value;
    try {
        if (expression.includes('^')) {
            let parts = expression.split(' ^ ');
            display.value = Math.pow(parseFloat(parts[0]), parseFloat(parts[1]));
        } else {
            display.value = math.evaluate(expression);
        }
    } catch (e) {
        display.value = 'Error';
    }
}