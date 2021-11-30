let mediaMatcherColorScheme = window.matchMedia("(prefers-color-scheme: dark)") 
const lightSchemeIcon = document.querySelector("link#light-scheme-icon");
const darkSchemeIcon = document.querySelector("link#dark-scheme-icon");


let color_scheme_ids = ["css", "css-custom"];

// We have to merge light and dark themes so we can switch between them.
function mergeColorScheme(id) {
	let dark_is_current = mediaMatcherColorScheme.matches;
	let light = document.querySelector("link#" + id + "-light");
	let dark = document.querySelector("link#" + id + "-dark");
	if (!light || !dark) return;
	let current = dark_is_current ? dark : light;
	let disabled = dark_is_current ? light : dark;
	console.log(current.getAttribute("href"));
	current.setAttribute("href-light", light.getAttribute("href"));
	current.setAttribute("href-dark", dark.getAttribute("href"));
	current.setAttribute("media", "all");
	current.setAttribute("id", id + "-light-dark");
	disabled.remove();
}

// Perform switch between light and dark themes
function setColorScheme(id, scheme) {
	let el = document.querySelector("link#" + id + "-light-dark");
	if (!el) return;
	el.setAttribute("href", el.getAttribute("href-" + scheme));
	if (typeof onColorSchemeChange !== "undefined")
		onColorSchemeChange(scheme);
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
	color_scheme_ids.forEach(function(item, index, array) {
		setColorScheme(item, scheme);
	});
	iconSchemeUpdate();
}

function onStorageColorSchemeUpdate(e) {
	if (e.key !== "color-scheme")
		return;
	onColorSchemeUpdate();
}



if (mediaMatcherColorScheme.media !== "not all") {
	iconSchemeUpdate();
	color_scheme_ids.forEach(function(item, index, array) {
		mergeColorScheme(item);
	});
	mediaMatcherColorScheme.addListener(onColorSchemeUpdate);
	window.onstorage = onStorageColorSchemeUpdate;
} else {
	// Cover situation when browser does not support color scheme at all and
	// thus would not load neither of color schemes. We unmask the light scheme.
	color_scheme_ids.forEach(function(item, index, array) {
		document.querySelector("#" + item + "-light").removeAttribute("media");
	});
}
