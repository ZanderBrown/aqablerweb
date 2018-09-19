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
pub struct Context {
    regs: Registers,
    mem: MainMemory,
}

#[wasm_bindgen]
impl Context {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Context {
            // We have 12 registers
            regs: Registers::create(12),
            // This gives us 32k "RAM"
            mem: MainMemory::create(1000),
        }
    }

    pub fn run(&mut self, program: String) -> String {
        // Parse the program
        match Input::from(program).parse() {
            Ok((p, l)) => {
                // Run the program
                if let Err(e) = p.eval(&l, &mut self.regs, &mut self.mem) {
                    // Showing any error
                    e.to_string()
                } else {
                    "Success".into()
                }
            }
            // Opps syntax error
            Err(e) => e.to_string(),
        }
    }

    #[wasm_bindgen(js_name = getRegCount)]
    pub fn get_reg_count(&self) -> usize {
        self.regs.len()
    }

    #[wasm_bindgen(js_name = getReg)]
    pub fn get_reg(&self, reg: usize, signed: bool) -> String {
        let v = self.regs[reg];
        
        if signed {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", v as isize, v as isize)
        } else {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", v, v)
        }
    }

    #[wasm_bindgen(js_name = getMem)]
    pub fn get_mem(&self, mem: usize, signed: bool) -> String {
        let v = self.mem[mem];
        
        if signed {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", v as isize, v as isize)
        } else {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", v, v)
        }
    }

    #[wasm_bindgen(js_name = getMemLength)]
    pub fn get_mem_length(&self) -> usize {
        self.mem.len()
    }
}
