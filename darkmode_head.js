let mediaMatcherColorScheme = window.matchMedia("(prefers-color-scheme: dark)") 
const lightSchemeIcon = document.querySelector("link#light-scheme-icon");
const darkSchemeIcon = document.querySelector("link#dark-scheme-icon");

let color_scheme_link_ids = ["css", "css-custom"];
var color_scheme_change = []

// We have to merge light and dark themes so we can switch between them.
function mergeColorSchemeLink() {
	color_scheme_link_ids.forEach(function(id, index, array) {
		let light = document.querySelector("link#" + id + "-light");
		let dark = document.querySelector("link#" + id + "-dark");
		if (!light || !dark) return;
		let current = (getColorScheme() === "dark") ? dark : light;
		let disabled = (getColorScheme() === "dark") ? light : dark;
		current.setAttribute("href-light", light.getAttribute("href"));
		current.setAttribute("href-dark", dark.getAttribute("href"));
		current.setAttribute("media", "all");
		current.setAttribute("id", id + "-light-dark");
		disabled.remove();
	});
}

// Perform switch between light and dark themes for links
function setColorSchemeLink(scheme) {
	color_scheme_link_ids.forEach(function(id, index, array) {
		let el = document.querySelector("link#" + id + "-light-dark");
		if (!el) return;
		el.setAttribute("href", el.getAttribute("href-" + scheme));
	});
}


function getColorScheme() {
	configured = localStorage.getItem("color-scheme")
	prefered = (mediaMatcherColorScheme.matches) ? "dark" : "light"
	if (configured == prefered)
		localStorage.removeItem("color-scheme");
	return (configured) ? configured : prefered;
}

function iconSchemeUpdate() {
	if (!lightSchemeIcon || !darkSchemeIcon)
		return;
	if (mediaMatcherColorScheme.matches) {
		lightSchemeIcon.remove();
		document.head.append(darkSchemeIcon);
	} else {
		document.head.append(lightSchemeIcon);
		darkSchemeIcon.remove();
	}
}

function onColorSchemeUpdate() {
	let scheme = getColorScheme();
	color_scheme_change.forEach(function(item, index, array) {
		item(scheme);
	});
	iconSchemeUpdate();
}

function onStorageColorSchemeUpdate(e) {
	if (e.key !== "color-scheme")
		return;
	onColorSchemeUpdate();
}


if (mediaMatcherColorScheme.media !== "not all") {
	mergeColorSchemeLink();
	color_scheme_change.push(setColorSchemeLink);
	iconSchemeUpdate();
	mediaMatcherColorScheme.addListener(onColorSchemeUpdate);
	window.onstorage = onStorageColorSchemeUpdate;
} else {
	// Cover situation when browser does not support color scheme at all and
	// thus would not load neither of color schemes. We unmask the light scheme.
	color_scheme_link_ids.forEach(function(item, index, array) {
		document.querySelector("link#" + item + "-light").removeAttribute("media");
	});
}
