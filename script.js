// class Calculator {
//     input;
//     operator;
//     #display;

//     get display() {
//         return this.#display;
//     }

//     add() {
//         this.#display = (this.#display || 0) + this.input;
//     }

//     subtract() {
//         this.#display = (this.#display || 0) - this.input;
//     }

//     multiply() {
//         this.#display = (this.#display || 0) * this.input;
//     }

//     divide() {
//         this.#display = (this.#display || 0) / this.input;
//     }

//     operate() {
//         if (this.operator === 'divide' && this.input === 0) {
//             this.#display = 'error';
//             return
//         }
//         if (this.#display === 'error') {
//             this.#display === 0;
//         }
//         this[this.operator]();
//         this.input = null;
//     }

//     clear() {
//         this.#display = null;
//     }

//     back() {
//         this.#display = Math.floor(this.#display / 10);
//     }
// }

const operations = {
    '÷': (a, b) => a / b,
    '×': (a, b) => a * b,
    '-': (a, b) => a - b,
    '+': (a, b) => a + b,
}

let state;
let operator;
let clearDisplayScheduled;
let a;
let b;

function operate(operator, a, b) {
    return operations[operator](a, b);
}

function updateState() {
    state = !operator && !b ? 'waitingA' :
            a && operator ? 'waitingB' :
            '';
    console.log(state);
}

const display = document.querySelector('.display');
const numbers = document.querySelectorAll('.numbers *');
const dot = document.getElementById('dot');
const erase = document.querySelectorAll('.erase *');
const operators = document.querySelectorAll('.operators *');
const equals = document.getElementById('equals');

operators.forEach(operator => operator.disabled = true);
updateState();

numbers.forEach(button => {
    button.addEventListener('click', e => {
        const input = e.target.innerText;
        console.log(input);
        operators.forEach(operator => operator.disabled = false);
        if (clearDisplayScheduled) {
            display.value = '';
            clearDisplayScheduled = false;
        }
        if (display.value === '0') {
            display.value = input;
        } else {
            display.value += input;
        }
        if (display.value.includes('.')) {
            dot.disabled = true;
            if (display.value === '.') {
                display.value = '0.';
            }
        }
        if (state === 'waitingA') a = display.value, equals.disabled = true;        
        if (state === 'waitingB') b = display.value;
        console.log('display:', display.value, 'a:', a, 'b:', b);
        updateState();
    });
});

operators.forEach(button => {
    button.addEventListener('click', e => {
        if (!operator) {
            operator = e.target.innerText;
            console.log(operator);
        } else if (!b) {
            operator = e.target.innerText;
            console.log(operator);
        } else {
            const result = operate(operator, +a, +b);
            if (result === Infinity) {
                operator = a = b = '';
                operators.forEach(operator => operator.disabled = true);
                display.value = 'error';
            } else {
                display.value = result;
                console.log(operator, result);
                operator = e.target.innerText;
                a = result;
                b = '';
                if (operator === '=') {
                    operator = '';
                    equals.disabled = true;
                }
            }
        }
        dot.disabled = false;
        clearDisplayScheduled = true;
        updateState();
    });
});

erase.forEach(button => {
    button.addEventListener('click', e => {
        const action = e.target.innerText;
        console.log(action);
        if (action === 'C') {
            display.value = '';
            dot.disabled = false;
            operator = a = b = '';
            operators.forEach(operator => operator.disabled = true);
        } else {
            const last = display.value.slice(-1);
            display.value = display.value.slice(0, -1);
            if (last === '.') {
                dot.disabled = false;
            }
            if (display.value === '') {
                dot.disabled = false;
                operator = a = b = '';
                operators.forEach(operator => operator.disabled = true);
            }
        }
        updateState();
    });
});
