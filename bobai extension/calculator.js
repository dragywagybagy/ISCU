// all consolde logs are for debugging purposes


let display = document.getElementById('display'); // calculator display screen

document.getElementById('back').addEventListener('click', () => {
    window.location.href = 'popup.html'; // go back to the popup page
});
// button on click
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
// c button to clear
function clearDisplay() {
    display.value = '';
}
// delete button delete last list input
function deleteLast() {
    display.value = display.value.slice(0, -1);
}
// add number to list
function appendNumber(number) {
    console.log(`Digit entered: ${number}`);
    display.value += number;
}
// input value operated on
function appendOperator(operator) {
    display.value += ` ${operator} `;
}
//adds decimal point
function appendDot() {
    if (!display.value.includes('.')) {
        display.value += '.';
    }
}
// advanced calculator functions
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
// evaluate the expression
function calculate() {
    let expression = display.value;
    try {
        if (expression.includes('^')) {
            let parts = expression.split(' ^ ');
            display.value = Math.pow(parseFloat(parts[0]), parseFloat(parts[1]));
        } else {
            display.value = math.evaluate(expression);
        }
        //displays error in case
    } catch (e) {
        display.value = 'Error';
    }
}