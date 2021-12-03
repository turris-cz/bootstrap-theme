let colorSchemeToggleButton = document.querySelector("input#light-dark-btn");

function onColorSchemeChange(scheme) {
	colorSchemeToggleButton.checked = scheme === "dark";
}

function mergeColorSchemePicture() {
	document.querySelectorAll("picture").forEach(function(item) {
		let dark = item.children["dark"];
		let light = item.children["light"];
		if (!light || !dark) return;
		let img = item.children["img"];
		img.setAttribute("src-dark", dark.getAttribute("srcset"));
		img.setAttribute("src-light", light.getAttribute("srcset"));
		img.setAttribute("src", img.getAttribute("src-" + getColorScheme()));
		dark.remove();
		light.remove();
	});
}

function setColorSchemePicture(scheme) {
	document.querySelectorAll("picture").forEach(function(item) {
		let img = item.children["img"];
		if (!img) return;
		img.setAttribute("src", img.getAttribute("src-" + scheme));
	});
}


if (mediaMatcherColorScheme.media !== "not all") {

	mergeColorSchemePicture();
	color_scheme_change.push(setColorSchemePicture);

	if (colorSchemeToggleButton) {
		colorSchemeToggleButton.checked = getColorScheme() === "dark";
		colorSchemeToggleButton.addEventListener("change", () => {
			let set_scheme = (colorSchemeToggleButton.checked) ? "dark" : "light";
			if (set_scheme == getColorScheme())
				localStorage.removeItem("color-scheme");
			else
				localStorage.setItem("color-scheme", set_scheme);
			onColorSchemeUpdate();
		});
	}

} else {
	if (colorSchemeToggleButton)
		colorSchemeToggleButton.remove();
}
