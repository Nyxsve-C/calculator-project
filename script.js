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

const display = document.querySelector('.display');
const numbers = document.querySelectorAll('.numbers *');
const dot = document.getElementById('dot');

numbers.forEach(button => {
    button.addEventListener('click', e => {
        const input = e.target.innerText;
        console.log(e.target.innerText);
        if (display.value === '0') {
            display.value = input;
        } else {
            display.value += input;
        };
        if (display.value.includes('.')) {
            dot.disabled = true;
            if (display.value === '.') {
                display.value = '0.';
            }
        };
    });
});
