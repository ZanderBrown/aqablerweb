all: parcel

serve:
	npx ws --https

dev:
	parcel index.html

clean:
	rm -rf docs
	rm -rf pkg
	rm -rf .cache
	cargo clean

parcel:
	mkdir -p docs
	cp robots.txt docs/
	# For search etc that just looks for favicon.ico
	cp favicon.ico docs/favicon.ico
	parcel build index.html -d docs --public-url=/aqablerweb -t browser --detailed-report --no-source-maps
	# The bindgen plugin has a bug and the toml gets emited
	rm  -f docs/Cargo*