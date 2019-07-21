// @ts-check

/** @type {HTMLTextAreaElement} */
let source = document.querySelector("#source");
let result = document.getElementById("result");
let msgbox = document.getElementById("msgbox");
let pcval = document.getElementById("pc-val");
let addrval = document.getElementById("addr-val");
let bufval = document.getElementById("buf-val");
let insval = document.getElementById("ins-val");
let statval = document.getElementById("stat-val");
let run = document.getElementById("run");
let statusarea = document.querySelector(".status");
/** @type {HTMLSelectElement} */
// @ts-ignore
let speed = document.getElementById("speed");

/**
 * @param {string} msg
 */
function showMessage(msg) {
    msgbox.innerText = msg;
    setTimeout(() => {
        if (msgbox.innerText != "Success" && msgbox.innerText != "Ready") {
            result.classList.add("error");
        } else {
            result.classList.remove("error");
        }
    }, 0);
}

function makeRow(titleText, valueText) {
    let row = document.createElement("div");

    let title = document.createElement("span");
    title.innerText = titleText;
    let value = document.createElement("span");
    value.innerText = valueText;

    row.appendChild(title);
    row.appendChild(value);

    return {row,title,value}
}

if (!('WebAssembly' in window)) {
    showMessage("Web browser isn't supported :-(");
    //return;
}

import { Context } from "./Cargo.toml";

/** @type {{row: HTMLElement, title: HTMLElement, value: HTMLElement}[]} */
let regs = [];
/** @type {{row: HTMLElement, title: HTMLElement, value: HTMLElement}[]} */
let mems = [];

class Run {
    constructor (registers, registersmode, memory, memorymode) {
        this.context = new Context ();
        this.pc = 0;
        /** 
         * @param {HTMLElement} elm
         * @param {HTMLElement | null} box
         */
        function showChange (elm, box) {
            setTimeout(() => {
                elm.classList.add("changed");
                if (box) {
                    box.scrollTop = elm.offsetTop;
                }
                setTimeout(() => elm.classList.remove("changed"), 1000);
            }, 0);
        }

        this.context.listenReg((reg, val) => {
            if (reg == 13) {
                insval.innerText = Context.format(val, false).split(' ')[0];
                showChange(insval, null);
            } else if (reg == 14) {
                bufval.innerText = Context.format(val, false);
                showChange(bufval, null);
            } else if (reg == 15) {
                mems[this.pc].row.classList.remove("current");
                pcval.innerText = val;
                this.pc = val;
                showChange(pcval, null);
                mems[this.pc].row.classList.add("current");
            } else if (reg == 16) {
                addrval.innerText = val;
                showChange(addrval, null);
            } else if (reg == 17) {
                statval.innerText = val;
                showChange(statval, null);
            } else {
                regs[reg].row.title = regs[reg].value.innerText = Context.format(val, registersmode.value == 'signed');
                showChange(regs[reg].value, registers);
            }
        });

        this.context.listenMem((mem, val) => {
            mems[mem].row.title = mems[mem].value.innerText = Context.format(val, memorymode.value == 'signed');
            showChange(mems[mem].value, memory);
        });
    }

    /**
     * @param {HTMLElement} registers
     * @param {boolean} signed
     */
    showRegs (registers, signed) {
        for (let i = 0; i < 13; i++) {
            if (!regs[i]) {
                let row = makeRow('R' + i, '');
    
                regs[i] = row;
    
                registers.appendChild(row.row);
            }
            let text = Context.format(this.context.getReg(i), signed);
            regs[i].value.innerText = text;
            regs[i].value.title = text;
        }
    }

    /**
     * @param {HTMLElement} container
     * @param {boolean} signed
     */
    showMem (container, signed) {
        let count = this.context.getMemLength();
        for (let i = 0; i < count; i++) {
            if (!mems[i]) {
                let row = makeRow(i, '');
    
                mems[i] = row;
    
                container.appendChild(row.row);
            }
            let text = Context.format(this.context.getMem(i), signed);
            mems[i].value.innerText = text;
            mems[i].value.title = text;
        }
    }
}

let registers = document.getElementById("registers");
let registerswrap = document.querySelector('.registers');
/** @type {HTMLSelectElement} */
let registersmode = document.querySelector('#reg-mode');
let memory = document.getElementById("memory");
let memorywrap = document.querySelector('.memory');
/** @type {HTMLSelectElement} */
let memorymode = document.querySelector('#mem-mode');


let context = null;

registersmode.addEventListener('change', () => {
    if (context) {
        context.showRegs(registers, registersmode.value == 'signed');
    }
});

memorymode.addEventListener('change', () => {
    if (context) {
        context.showMem(memory, memorymode.value == 'signed');
    }
});

showMessage("Ready");
let first = true;

run.addEventListener("click", () => {
    if (first) {
        first = false;
        registerswrap.classList.remove('hidden');
        memorywrap.classList.remove('hidden');
        statusarea.classList.remove('hidden');
    }
    let program = source.value;
    try {
        context = new Run(registers, registersmode, memory, memorymode);
        let signed = registersmode.value == 'signed';
        context.showRegs(registers, signed);
        context.showMem(memory, signed);

        let res = context.context.assemble(program);
    
        if (res == 'Success') {
            showMessage('Running...');

            function next() {
                let res = context.context.step();
                if (res == "~~continue") {
                    setTimeout(next, parseInt(speed.value));
                } else if (res != "~~done") {
                    showMessage(res);
                } else {
                    showMessage('Ready');
                }
            }
            
            setTimeout(next, parseInt(speed.value));
        } else {
            showMessage(res);
        }
    } catch (e) {
        showMessage("Internal Error");
        console.error(e);
    }
});

let overview = document.querySelector('.reference .overview');
let currentsec = undefined;

let connect = (elm, cb) => {
    elm.addEventListener('click', e => {
        e.preventDefault();
        cb(e.target);
    });
    elm.addEventListener('keyup', e => {
        if (e.key == ' ') {
            e.preventDefault();
            cb(e.target);
        }
    });
};

let expand = elm => {
    let next = elm.nextElementSibling;
    if (currentsec && currentsec != next) {
        currentsec.classList.remove('expanded');
    }
    currentsec = next;
    currentsec.classList.toggle('expanded');
};

overview.querySelectorAll('.heading').forEach(elm => connect(elm, expand));

let currentref = undefined;
let reftitle = document.querySelector('.reference .title');
let pagetitlewrap = document.querySelector('.reference .page-title');
/** @type {HTMLDivElement} */
let pagetitle = pagetitlewrap.querySelector('.reference .page-title .title h2');
let backbtn = document.querySelector('.reference .page-title .back');

let back = _elm => {
    if (currentref) {
        currentref.classList.add('hidden');
        currentref = undefined;
    }
    overview.classList.remove('hidden');
    reftitle.classList.remove('hidden');
    pagetitlewrap.classList.add('hidden');
};

connect(backbtn, back);

let show = elm => {
    let title = elm.innerText;
    let ref = document.getElementById("ref-" + title.replace(' ', '-').toLowerCase());
    if (ref) {
        pagetitle.innerText = title;
        ref.classList.remove('hidden');
        overview.classList.add('hidden');
        reftitle.classList.add('hidden');
        pagetitlewrap.classList.remove('hidden');
        currentref = ref;
    } else {
        console.error('Missing reference page for ' + title);
    }
};

overview.querySelectorAll('li').forEach(elm => connect(elm, show));

if ('serviceWorker' in navigator) {
    const sw = './service-worker.js';
    navigator.serviceWorker.register(sw, { scope: './' })
        .then(() => console.info('Service Worker Registered')).catch(e => {
            console.error("Service Worker Registration Failed");
            console.error(e.message);
        });
} else {
    console.warn("Service Worker Unsupported");
}