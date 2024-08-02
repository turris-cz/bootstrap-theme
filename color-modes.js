/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 *
 * Modified by CZ.NIC z.s.p.o. (http://www.nic.cz/), 2024.
 *
 * You can view the full license here: https://creativecommons.org/licenses/by/3.0/
 */

(() => {
    "use strict";

    const getStoredTheme = () => localStorage.getItem("theme");
    const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    const setTheme = (theme) => {
        if (theme === "auto") {
            const isDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            document.documentElement.setAttribute(
                "data-bs-theme",
                isDarkMode ? "dark" : "light"
            );
        } else {
            document.documentElement.setAttribute("data-bs-theme", theme);
        }
    };

    const setFavicon = () => {
        const isDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const lightFavicon = document.getElementById("light-scheme-favicon");
        const darkFavicon = document.getElementById("dark-scheme-favicon");

        // Exit if either of the favicon elements are not found
        if (!lightFavicon || !darkFavicon) {
            return;
        }

        if (isDarkMode) {
            lightFavicon.setAttribute("href", "");
            darkFavicon.setAttribute("href", "/turris-theme/favicon-white.png");
            darkFavicon.setAttribute("rel", "icon");
            lightFavicon.setAttribute("rel", "icon alternate");
        } else {
            darkFavicon.setAttribute("href", "");
            lightFavicon.setAttribute(
                "href",
                "/turris-theme/favicon-black.png"
            );
            lightFavicon.setAttribute("rel", "icon");
            darkFavicon.setAttribute("rel", "icon alternate");
        }
    };

    setTheme(getPreferredTheme());

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector("#bd-theme");

        if (!themeSwitcher) {
            return;
        }

        const themeSwitcherText = document.querySelector("#bd-theme-text");
        const activeThemeIcon = document.querySelector(
            ".theme-icon-active use"
        );
        const btnToActive = document.querySelector(
            `[data-bs-theme-value="${theme}"]`
        );
        const svgOfActiveBtn = btnToActive
            .querySelector("svg use")
            .getAttribute("href");

        document
            .querySelectorAll("[data-bs-theme-value]")
            .forEach((element) => {
                element.classList.remove("active");
                element.setAttribute("aria-pressed", "false");
            });

        btnToActive.classList.add("active");
        btnToActive.setAttribute("aria-pressed", "true");
        activeThemeIcon.setAttribute("href", svgOfActiveBtn);
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
        themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

        if (focus) {
            themeSwitcher.focus();
        }
    };

    // Watch for changes in the prefers-color-scheme media query
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            const storedTheme = getStoredTheme();
            if (storedTheme !== "light" && storedTheme !== "dark") {
                setTheme(getPreferredTheme());
            }
            setFavicon();
        });

    // Watch for changes in localStorage
    window.addEventListener("storage", () => {
        const storedTheme = getStoredTheme();
        setTheme(storedTheme);
        showActiveTheme(storedTheme);
    });

    // Set the theme on page load
    window.addEventListener("DOMContentLoaded", () => {
        showActiveTheme(getPreferredTheme());

        document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const theme = toggle.getAttribute("data-bs-theme-value");
                setStoredTheme(theme);
                setTheme(theme);
                showActiveTheme(theme, true);
            });
        });

        // Initial theme and favicon setup
        setTheme(getPreferredTheme());
        setFavicon();
    });
})();
