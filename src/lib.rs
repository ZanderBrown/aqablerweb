use js_sys;
use wasm_bindgen;
use wasm_bindgen::prelude::*;

use aqabler::ChangeEvent;
use aqabler::Eval;
use aqabler::Input;
use aqabler::Memory;
use aqabler::Observer;
use aqabler::Parser;
use aqabler::Storage;

use std::rc::Rc;

struct Listen(JsValue);

impl Observer<ChangeEvent> for Listen {
    fn notify(&self, evt: ChangeEvent) {
        let this = JsValue::NULL;
        js_sys::Function::try_from(&self.0)
            .expect("Callback failed")
            .call2(
                &this,
                &JsValue::from(evt.idx as u32),
                &JsValue::from(evt.val as u32),
            )
            .expect("Callback failed");
    }
}

#[wasm_bindgen]
pub struct Context {
    regs: Memory,
    mem: Memory,
    listeners: Vec<Rc<Observer<ChangeEvent>>>,
}

#[wasm_bindgen]
impl Context {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Context {
            // We have 12 registers
            regs: Memory::create(12),
            // This gives us 6.4k "RAM"
            mem: Memory::create(200),
            listeners: Vec::new(),
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
        self.regs.count()
    }

    #[wasm_bindgen(js_name = getReg)]
    pub fn get_reg(&self, reg: usize) -> Result<u32, JsValue> {
        Ok(self
            .regs
            .get(reg, "Register")
            .map_err(|err| err.to_string())?)
    }

    #[wasm_bindgen(js_name = getMem)]
    pub fn get_mem(&self, mem: usize) -> Result<u32, JsValue> {
        Ok(self
            .mem
            .get(mem, "Memory Address")
            .map_err(|err| err.to_string())?)
    }

    #[wasm_bindgen(js_name = setMem)]
    pub fn set_mem(&mut self, i: usize, v: u32) -> Result<(), JsValue> {
        // Wat? I know right
        Ok(self
            .mem
            .set(i, v, "Memory")
            .map_err(|err| err.to_string())?)
    }

    #[wasm_bindgen(js_name = getMemLength)]
    pub fn get_mem_length(&self) -> usize {
        self.mem.count()
    }

    #[wasm_bindgen(js_name = listenReg)]
    pub fn listen_reg(&mut self, listen: JsValue) -> Result<(), JsValue> {
        let rc: Rc<Observer<ChangeEvent>> = Rc::new(Listen(listen.clone()));
        self.regs.add_observer(Rc::downgrade(&rc));
        self.listeners.push(rc);
        Ok(())
    }

    #[wasm_bindgen(js_name = listenMem)]
    pub fn listen_mem(&mut self, listen: JsValue) -> Result<(), JsValue> {
        let rc: Rc<Observer<ChangeEvent>> = Rc::new(Listen(listen.clone()));
        self.mem.add_observer(Rc::downgrade(&rc));
        self.listeners.push(rc);
        Ok(())
    }

    pub fn format(&self, val: u32, signed: bool) -> String {
        if signed {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", val as i32, val as i32)
        } else {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", val as u32, val as u32)
        }
    }
}
