.PHONY: help install build dev serve clean

help:      ## list the commands
	@grep -E '^[a-z]+:.*##' $(MAKEFILE_LIST) | sed 's/:.*##/\t/'

install:   ## install the build dependencies (once)
	npm install

build:     ## build the whole site into _site/
	npm run build

dev:       ## build, serve on http://localhost:8800 and rebuild on every change (PORT=3000 to change)
	node tools/dev.mjs $(or $(PORT),8800)

serve:     ## serve what is already built, without watching
	python -m http.server $(or $(PORT),8800)

clean:     ## remove _site/
	rm -rf _site
