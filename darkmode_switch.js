// This should be set to reference of color scheme toggle button to support
// switching.
let colorSchemeToggleButton = document.querySelector("input#light-dark-btn");


function onColorSchemeChange(scheme) {
	colorSchemeToggleButton.checked = scheme === "dark";
}


if (colorSchemeToggleButton) {
	if (mediaMatcherColorScheme.media !== "not all") {
		colorSchemeToggleButton.checked = getColorScheme() === "dark";
		colorSchemeToggleButton.addEventListener("change", () => {
			let set_scheme = (colorSchemeToggleButton.checked) ? "dark" : "light";
			if (set_scheme == getColorScheme())
				localStorage.removeItem("color-scheme");
			else
				localStorage.setItem("color-scheme", set_scheme);
			onColorSchemeUpdate();
		});
	} else
		colorSchemeToggleButton.remove()
}
