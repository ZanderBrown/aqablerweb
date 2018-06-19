cargo +nightly build --target wasm32-unknown-unknown &&
wasm-bindgen target/wasm32-unknown-unknown/debug/aqablerweb.wasm --out-dir . &&
./node_modules/.bin/webpack