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
	});
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service.js', { scope: './' })
		.then(function (registration) {
			console.log('Service Worker Registered');
		});
	navigator.serviceWorker.ready.then(function (registration) {
		console.log('Service Worker Ready');
	});
}