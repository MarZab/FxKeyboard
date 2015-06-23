VERSION=`grep "em:version" $(PWD)/src/install.rdf | sed -n -e 's/<.*>\(.*\)<\/.*>/\1/p' | xargs `
FILENAME="fxkeyboard-$(VERSION).xpi"

build:
	@echo "Building $(FILENAME)..."
	@cd "src" && 7za a -tzip "$(FILENAME)" *
	@mv "src/$(FILENAME)" .
	@7za a -tzip "$(FILENAME)" COPYING README
	@echo "Done!"

clean:
	rm fxkeyboard-*
	@echo "Done!"