MAKEFLAGS += --no-builtin-rules
INSTALL_DIR ?= installation
NO_BUILD ?= n

BOOTSTRAP_4_RELEASE := 6.2
BOOTSTRAP_4_HASH := 7f5c2d164d028c3d3f8d950dd458d48f652e2a0a7f99075f4ac2c4498085592c
BOOTSWATCH_4_HASH := f2dc5275373721bcf033e618e274286e67eee9a2ec89fbb489b8318751a23a0b

BOOTSTRAP_5_RELEASE := 3.3
BOOTSTRAP_5_HASH := 3809d5580cb4735087c445d52c5db1626aef9bab8b7f86d2644d1a2acab7e54b
BOOTSWATCH_5_HASH := 022a1e3b10318cbabc73a20c272e49daef40ccab12d8da0c6663b214697d1f44


.PHONY: all
all:
	@

.PHONY: prepare
prepare:
	@which npm >/dev/null || ( echo "Please install npm (apt install npm)" >&2; false )
	npm install

.PHONY: install
install:
	install -d '$(INSTALL_DIR)'
	install -m 644 darkmode_head.js darkmode_body.js '$(INSTALL_DIR)'
	install -m 644 favicon-black.png favicon-white.png '$(INSTALL_DIR)'
	install -m 644 logo-black.svg logo-white.svg '$(INSTALL_DIR)'
	install -m 644 bootstrap.bundle.js bootstrap.bundle.js.map '$(INSTALL_DIR)'
	install -m 644 bootstrap.bundle.min.js bootstrap.bundle.min.js.map '$(INSTALL_DIR)'
	install -d '$(INSTALL_DIR)/fonts'
	install -m 644 fonts/* '$(INSTALL_DIR)/fonts'

.PHONY: clean
clean::
	@


# The only argument is the major Bootstrap version
define BOOTSTRAP

BOOTSTRAP_$(1)_VERSION := $(1).$$(BOOTSTRAP_$(1)_RELEASE)

BOOTSTRAP_$(1)_DIR := bootstrap-$$(BOOTSTRAP_$(1)_VERSION)
BOOTSTRAP_$(1)_TAR := $$(BOOTSTRAP_$(1)_DIR).tar.gz

$$(BOOTSTRAP_$(1)_TAR):
	wget https://github.com/twbs/bootstrap/archive/refs/tags/v$$(BOOTSTRAP_$(1)_VERSION).tar.gz -O .$$@
	echo '$$(BOOTSTRAP_$(1)_HASH)  .$$@' | sha256sum --check
	mv .$$@ $$@

$$(BOOTSTRAP_$(1)_DIR): $$(BOOTSTRAP_$(1)_TAR)
	tar -xmf $$<

BOOTSWATCH_$(1)_DIR := bootswatch-$$(BOOTSTRAP_$(1)_VERSION)
BOOTSWATCH_$(1)_TAR := $$(BOOTSWATCH_$(1)_DIR).tar.gz

$$(BOOTSWATCH_$(1)_TAR):
	wget https://github.com/thomaspark/bootswatch/archive/refs/tags/v$$(BOOTSTRAP_$(1)_VERSION).tar.gz -O '.$$@'
	echo '$$(BOOTSWATCH_$(1)_HASH)  .$$@' | sha256sum --check
	mv .$$@ $$@

$$(BOOTSWATCH_$(1)_DIR): $$(BOOTSWATCH_$(1)_TAR)
	tar -xmf $$<

clean::
	rm -f '$$(BOOTSTRAP_$(1)_TAR)' '$$(BOOTSWATCH_$(1)_TAR)'
	rm -rf '$$(BOOTSTRAP_$(1)_DIR)' '$$(BOOTSWATCH_$(1)_DIR)'

endef
$(eval $(call BOOTSTRAP,4))
$(eval $(call BOOTSTRAP,5))


# The first argument is name of theme
# The second argument is version of Bootstrap
define THEME

all: $(1)-$(2).css $(1)-$(2).min.css

ifeq ($(NO_BUILD),n)

$(1)-$(2).scss: $$(BOOTSTRAP_$(2)_DIR) $$(BOOTSWATCH_$(2)_DIR) turris.scss
	echo '@import "turris.scss";' >$$@
	echo '@import "$$(BOOTSWATCH_$(2)_DIR)/dist/$(1)/variables";' >>$$@
	echo '@import "$$(BOOTSTRAP_$(2)_DIR)/scss/bootstrap";' >>$$@
	echo '@import "$$(BOOTSWATCH_$(2)_DIR)/dist/$(1)/bootswatch";' >>$$@

$(1)-$(2).css $(1)-$(2).css.map: $(1)-$(2).scss
	npx sass '$$<' '$$@'

$(1)-$(2).min.css $(1)-$(2).min.css.map: $(1)-$(2).scss
	npx sass '$$<' '$$@' --style compressed

endif

install: install-$(1)-$(2)
install-$(1)-$(2): $(1)-$(2).css $(1)-$(2).css.map $(1)-$(2).min.css $(1)-$(2).min.css.map
	install -d '$$(INSTALL_DIR)'
	install -m 644 $$^ '$$(INSTALL_DIR)'

clean::
	rm -f '$(1)-$(2).scss'
	rm -f '$(1)-$(2).css' '$(1)-$(2).css.map'
	rm -f '$(1)-$(2).min.css' '$(1)-$(2).min.css.map'

endef
$(eval $(call THEME,flatly,4))
$(eval $(call THEME,flatly,5))
$(eval $(call THEME,darkly,5))
$(eval $(call THEME,darkly,4))
