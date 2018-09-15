// @ts-check

let source = document.getElementById("source");
let result = document.getElementById("result");
let registers = document.getElementById("registers");
let registerswrap = document.querySelector('.registers');
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

window.regs_add_row = (regnum, value) => {
    let row = document.createElement("tr");
    let reg = document.createElement("td");
    reg.innerText = "R" + regnum;
    let val = document.createElement("td");
    val.innerText = value;
    row.appendChild(reg);
    row.appendChild(val);
    registers.appendChild(row);
}

window.regs_reset = () => {
    while (registers.firstChild) {
        registers.removeChild(registers.firstChild);
    }
}

window.addEventListener('load', () => {
    if (!('WebAssembly' in window)) {
        show_message("Web browser isn't supported :-(");
        return;
    }
    const aqabler = import("./aqablerweb");
    aqabler.then(aqabler => {
        show_message("Ready");
        let first = true;
        run.addEventListener("click", () => {
            try {
                if (first) {
                    first = false;
                    registerswrap.classList.remove('hidden');
                }
                let program = source.value;
                show_message(aqabler.run(program));
            } catch (e) {
                show_message("Internal Error");
                console.error(e);
            }
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

    for (let elm of overview.querySelectorAll('.heading')) {
        connect(elm, expand);
    }

    let currentref = undefined;
    let reftitle = document.querySelector('.reference .title');
    let pagetitlewrap = document.querySelector('.reference .page-title');
    let pagetitle = pagetitlewrap.querySelector('.reference .page-title .title');
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

    for (let elm of overview.querySelectorAll('li')) {
        connect(elm, show);
    }
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