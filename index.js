const aqabler = import("./aqablerweb");

let source = document.getElementById("source");
let result = document.getElementById("result");
let registers = document.getElementById("registers");
let run = document.getElementById("run");

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

aqabler.then(aqabler => {
	result.innerText = "Ready";
	run.addEventListener("click", () => {
		let program = source.value;
		result.innerText = aqabler.run(program);
		setTimeout(() => {
			if (result.innerText != "Success") {
				result.classList.add("error");
			} else {
				result.classList.remove("error");
			}
		}, 0);
	});
});