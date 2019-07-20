use js_sys;
use wasm_bindgen;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use aqabler::ChangeEvent;
use aqabler::Input;
use aqabler::Memory;
use aqabler::Observer;
use aqabler::Storage;
use aqabler::Assemble;
use aqabler::execute;

use std::rc::Rc;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_value(s: JsValue);
}

struct Listen(JsValue);

impl Observer<ChangeEvent> for Listen {
    fn notify(&self, evt: ChangeEvent) {
        let this = JsValue::NULL;
        if let Some(func) = &self.0.dyn_ref::<js_sys::Function>() {
            match func.call2(
                &this,
                &JsValue::from(evt.idx as u32),
                &JsValue::from(evt.val as u32),
            ) {
                Ok(_) => (),
                Err(err) => log_value(err),
            }
        }
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
            // We have 12 general purpose registers
            // and 5 special registers
            regs: Memory::create(String::from("register"), 18),
            // Our "RAM"
            mem: Memory::create(String::from("memory address"), 200),
            listeners: Vec::new(),
        }
    }

    pub fn assemble(&mut self, program: String) -> String {
        match Input::from(program).assemble(&mut self.mem) {
            Ok(()) => String::from("Success"),
            Err(err) => err.to_string(),
        }
    }

    pub fn step(&mut self) -> String {
        match execute(&mut self.mem, &mut self.regs) {
            Err(err) => err.to_string(),
            Ok(res) if res => String::from("~~continue"),
            Ok(_) => String::from("~~done"),
        }
    }

    #[wasm_bindgen(js_name = getReg)]
    pub fn get_reg(&self, reg: u32) -> Result<u32, JsValue> {
        Ok(self
            .regs
            .get(reg)
            .map_err(|err| err.to_string())?)
    }

    #[wasm_bindgen(js_name = getMem)]
    pub fn get_mem(&self, mem: u32) -> Result<u32, JsValue> {
        Ok(self
            .mem
            .get(mem)
            .map_err(|err| err.to_string())?)
    }

    #[wasm_bindgen(js_name = setMem)]
    pub fn set_mem(&mut self, i: u32, v: u32) -> Result<(), JsValue> {
        // Wat? I know right
        Ok(self
            .mem
            .set(i, v)
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

    pub fn format(val: u32, signed: bool) -> String {
        if signed {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", val as i32, val as i32)
        } else {
            // Pad hex within 8 '0'
            format!("{:08X} ({})", val as u32, val as u32)
        }
    }
}
