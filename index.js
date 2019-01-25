// @ts-check

let source = document.getElementById("source");
let result = document.getElementById("result");
let run = document.getElementById("run");

function show_message(msg) {
    result.innerText = msg;
    setTimeout(() => {
        if (result.innerText != "Success" && result.innerText != "Ready") {
            result.classList.add("error");
        } else {
            result.classList.remove("error");
        }
    }, 0);
}

function show_regs (registers, context, signed) {
    while (registers.firstChild) registers.removeChild(registers.firstChild);
    let count = context.getRegCount();
    for (let i = 0; i < count; i++) {
        let row = document.createElement("div");

        let reg = document.createElement("span");
        reg.innerText = "R" + i;
        let val = document.createElement("span");
        val.innerText = context.getReg(i, signed);
        row.appendChild(reg);
        row.appendChild(val);

        registers.appendChild(row);
    }
}

let context = null;

window.addEventListener('load', () => {
    if (!('WebAssembly' in window)) {
        show_message("Web browser isn't supported :-(");
        return;
    }

    let registers = document.getElementById("registers");
    let registerswrap = document.querySelector('.registers');
    let registersmode = document.getElementById('reg-mode');

    registersmode.addEventListener('change', () => {
        if (context) {
            show_regs(registers, context, registersmode.value == 'signed');
        }
    });

    const aqabler = import("./aqablerweb.js");
    aqabler.then(aqabler => {
        show_message("Ready");
        let first = true;
        run.addEventListener("click", () => {
            if (first) {
                first = false;
                registerswrap.classList.remove('hidden');
            }
            let program = source.value;
            try {
                context = new aqabler.Context();
                context.listenMem((a, b) => {
                    console.log(arguments)
                    console.log(a);
                    console.log(b);
                });
                show_message(context.run(program));
            } catch (e) {
                show_message("Internal Error");
                console.error(e);
            }
            show_regs(registers, context, registersmode.value == 'signed');
        });
    }).catch(e => {
        show_message("Failed to load Aqabler");
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
            console.error(e);
        });
} else {
    console.warn("Service Worker Unsupported");
}