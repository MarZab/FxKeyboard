
VERSION=`grep "em:version" $(PWD)/src/install.rdf | sed 's/.*<em:version>\(.*\)<\/em:version>.*/\1/'`
FILENAME="fxkeyboard-$(VERSION).xpi"

build:
	@echo "Building '$(VERSION)'  $(FILENAME)..."
	@cd "src" && 7za a -tzip "$(FILENAME)" *
	@mv "src/$(FILENAME)" .
	@7za a -tzip "$(FILENAME)" COPYING README.md
	@echo "Done!"

clean:
	rm fxkeyboard-*
	@echo "Done!"