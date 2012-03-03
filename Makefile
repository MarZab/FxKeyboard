VERSION=`grep "em:version" $(PWD)/src/install.rdf | sed -n -e 's/<.*>\(.*\)<\/.*>/\1/p' | sed 's/^[ \t]*//'`
FILENAME="fxkeyboard-$(VERSION).xpi"

build:
	@echo "Building $(FILENAME)..."
	@cd "src" && zip -r "$(FILENAME)" *
	@mv "src/$(FILENAME)" .
	@zip "$(FILENAME)" COPYING README
	@echo "Done!"

clean:
	rm fxkeyboard-*
	@echo "Done!"