all: rust bind gulp

rust:
	cargo +nightly build --target wasm32-unknown-unknown

bind:
	wasm-bindgen target/wasm32-unknown-unknown/debug/aqablerweb.wasm --out-dir .

gulp: faviconData.json
	gulp

faviconData.json:
	gulp generate-favicon

clean:
	rm -rf docs
	rm -rf icons
	rm aqablerweb.js
	rm aqablerweb.d.ts
	rm aqablerweb_bg.wasm
	cargo clean
