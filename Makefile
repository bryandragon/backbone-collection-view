clean:
	@rm -rf dist

build:
	@mkdir -p dist
	@./node_modules/.bin/uglifyjs \
		lib/collection-view.js \
		--output=dist/collection-view.min.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha-phantomjs \
		--reporter=dot \
		test/index.html

.PHONY: clean build test
