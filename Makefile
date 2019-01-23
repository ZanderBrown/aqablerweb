all: rust bind gulp

rust:
	cargo +nightly build --target wasm32-unknown-unknown --release

bind:
	wasm-bindgen target/wasm32-unknown-unknown/release/aqablerweb.wasm --out-dir . --out-name aqabler.wasm

gulp: faviconData.json
	gulp

faviconData.json:
	gulp favicons

serve:
	npm run serve

clean:
	rm -rf docs
	rm -rf icons
	rm aqabler.js
	rm aqabler.d.ts
	rm aqabler.wasm
	cargo clean
