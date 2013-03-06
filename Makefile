all: build

build: components templates stylus/dynamics-visualization.css index.html test.html index.js static.js test.js game.js canvas.js jade-runtime.js
	@component build --dev -v
	@cp jade-runtime.js build/jade-runtime.js
	
dist: build index-dist.html
	-mkdir dist
	-mkdir dist/js
	-mkdir dist/css
	-mkdir dist/images
	cp build/build.js dist/js/app.js
	cp build/jade-runtime.js dist/js/jade-runtime.js
	cp build/build.css dist/css/app.css
	cp index-dist.html dist/index.html
	cp images/* dist/images/

stylus/dynamics-visualization.css: stylus/dynamics-visualization.styl
	@stylus $<

test.html: jade/test.jade
	@jade -O . -P $<

index.html: jade/index.jade
	@jade -O . -P -o '{"prefix": "${PREFIX}"}' $<
	
index-dist.html: jade/index-dist.jade
	@jade -O . -o '{"prefix": "${PREFIX}"}' $<

templates: clean-templates
	@jade -c -D templates -o '{"prefix": "${PREFIX}"}' && for fname in templates/*.js; do if [ -f "$$fname" ]; then echo -n "module.exports = " | cat - $$fname > /tmp/out && mv /tmp/out $$fname; fi; done;

components: component.json
	@component install --dev

clean: clean-templates
	@rm -fr build dist components stylus/dynamics-visualization.css index.html index-dist.html test.html

clean-templates:
	@rm -f templates/*.js

.PHONY: clean templates clean-templates
