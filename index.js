// @ts-check

/** @type {HTMLTextAreaElement} */
let source = document.getElementById("source");
let result = document.getElementById("result");
let run = document.getElementById("run");

function showMessage(msg) {
    result.innerText = msg;
    setTimeout(() => {
        if (result.innerText != "Success" && result.innerText != "Ready") {
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

window.addEventListener('load', () => {
    if (!('WebAssembly' in window)) {
        showMessage("Web browser isn't supported :-(");
        return;
    }

    let registers = document.getElementById("registers");
    let registerswrap = document.querySelector('.registers');
    /** @type {HTMLSelectElement} */
    let registersmode = document.getElementById('reg-mode');
    let memory = document.getElementById("memory");
    let memorywrap = document.querySelector('.memory');
    /** @type {HTMLSelectElement} */
    let memorymode = document.getElementById('mem-mode');

    let context = null;

    registersmode.addEventListener('change', () => {
        if (context) {
            context.showRegs(registers, registersmode.value == 'signed');
        }
    });

    memorymode.addEventListener('change', () => {
        if (context) {
            context.showMem(registers, memorymode.value == 'signed');
        }
    });

    const aqabler = import("./aqablerweb.js");
    aqabler.then(aqabler => {
        showMessage("Ready");
        let first = true;
        const Context = aqabler.Context;
        let mems = [];
        let regs = [];

        class Run extends Context {
            constructor () {
                super();

                function showChange (elm, box) {
                    setTimeout(() => {
                        elm.classList.add("changed");
                        box.scrollTop = elm.offsetTop
                        setTimeout(() => elm.classList.remove("changed"), 1000);
                    }, 0);
                }

                this.listenReg((reg, val) => {
                    regs[reg].title = regs[reg].innerText = Context.format(val, registersmode.value == 'signed');
                    showChange(regs[reg], registers);
                });

                this.listenMem((mem, val) => {
                    mems[mem].title = mems[mem].innerText = Context.format(val, memorymode.value == 'signed');
                    showChange(mems[mem], memory);
                });
            }

            showRegs (registers, signed) {
                let count = this.getRegCount();
                for (let i = 0; i < count; i++) {
                    if (!regs[i]) {
                        let row = makeRow('R' + i, '');
            
                        regs[i] = row.value;
            
                        registers.appendChild(row.row);
                    }
                    regs[i].innerText = Context.format(this.getReg(i), signed);
                }
            }

            showMem (container, signed) {
                let count = this.getMemLength();
                for (let i = 0; i < count; i++) {
                    if (!mems[i]) {
                        let row = makeRow(i, '');
            
                        mems[i] = row.value;
            
                        container.appendChild(row.row);
                    }
                    mems[i].innerText = Context.format(this.getMem(i), signed);
                }
            }
        }
        run.addEventListener("click", () => {
            if (first) {
                first = false;
                registerswrap.classList.remove('hidden');
                memorywrap.classList.remove('hidden');
            }
            let program = source.value;
            try {
                context = new Run();
                let signed = registersmode.value == 'signed';
                context.showRegs(registers, signed);
                context.showMem(memory, signed);
                showMessage(context.run(program));
            } catch (e) {
                showMessage("Internal Error");
                console.error(e);
            }
        });
    }).catch(e => {
        showMessage("Failed to load Aqabler");
        console.error(e);
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
            console.error('Missing refrence page for ' + title);
        }
    };

    overview.querySelectorAll('li').forEach(elm => connect(elm, show));
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service.js', { scope: './' })
        .then(() => console.info('Service Worker Registered')).catch(e => {
            console.error("Service Worker Registration Failed");
            console.error(e.message);
        });
} else {
    console.warn("Service Worker Unsupported");
}