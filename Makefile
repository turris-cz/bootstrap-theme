MAKEFLAGS += --no-builtin-rules
INSTALL_DIR ?= installation
NO_BUILD ?= n

BOOTSTRAP_4_RELEASE := 6.1
BOOTSTRAP_4_HASH := 689088e453944f47bdd769a7fba6fa3495d4cf2412118f024a6525f525028598
BOOTSWATCH_4_HASH := ed17a0d402cb9e9c2e8fd6c93974ce127f8e565b868e172f832bec9376319a84

BOOTSTRAP_5_RELEASE := 1.3
BOOTSTRAP_5_HASH := 55b951db46e1d69b4236494122fe559716a76c4b8a418c11f3fed6abc2d4de3f
BOOTSWATCH_5_HASH := d7cb1d53d6ea9dece25fd582afb2fa1f20b57efecc6fddbe7727cb792ed84e0a


.PHONY: all
all:
	@

.PHONY: install
install:
	install -d '$(INSTALL_DIR)'
	install -m 644 favicon-black.png favicon-white.png '$(INSTALL_DIR)'
	install -m 644 darkmode.js darkmode_switch.js '$(INSTALL_DIR)'

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
	echo '@import "$$(BOOTSWATCH_$(2)_DIR)/dist/$(1)/variables";' >$$@
	echo '@import "$$(BOOTSTRAP_$(2)_DIR)/scss/bootstrap";' >>$$@
	echo '@import "$$(BOOTSWATCH_$(2)_DIR)/dist/$(1)/bootswatch";' >>$$@
	echo '@import "turris.scss";' >>$$@

$(1)-$(2).css $(1)-$(2).css.map: $(1)-$(2).scss
	sass '$$<' '$$@'

$(1)-$(2).min.css $(1)-$(2).min.css.map: $(1)-$(2).scss
	sass -t compressed '$$<' '$$@'

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
