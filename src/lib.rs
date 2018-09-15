extern crate aqabler;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

use aqabler::Eval;
use aqabler::Input;
use aqabler::MainMemory;
use aqabler::Parser;
use aqabler::Registers;
use aqabler::Storage;

#[wasm_bindgen]
extern {
    fn regs_add_row(reg: usize, val: String);
    fn regs_reset();
}

fn show_regs(regs: Registers) {
    regs_reset();
    // Show the end state of the registers
    for (i, v) in regs.iter().enumerate() {
        if *v > 9 {
            regs_add_row(i, format!("{:X} ({})", v, v));
        } else {
            regs_add_row(i, format!("{:X}", v));
        }
    }
}

#[wasm_bindgen]
pub fn run(program: String) -> String {
    // We have 12 registers
    let mut regs = Registers::create(12);
    // On 64bit system this gives us 64k "RAM"
    let mut main = MainMemory::create(1000);
    // Parse the program
    match Input::from(program).parse() {
        Ok((p, l)) => {
            // Run the program
            if let Err(e) = p.eval(&l, &mut regs, &mut main) {
                // Showing any error
                show_regs(regs);
                return e.to_string()
            }
        }
        // Opps syntax error
        Err(e) => {
            show_regs(regs);
            return e.to_string()
        }
    }
    show_regs(regs);
    "Success".into()
}
