(function () {
    const selectNodes = document.querySelectorAll(".select");
    if (selectNodes.length > 0) {
        selectNodes.forEach(function (select) {
            const nativeSelect = select.querySelector("select");
            const customSelect = select.querySelector(".custom-select");
            const trigger = select.querySelector(".trigger");
            const optionsGroup = select.querySelector(".options");
            const options = select.querySelectorAll("option:not([disabled])");
            let selectedIndex = -1;

            // create options
            options.forEach(function (option) {
                const newDiv = document.createElement("div");
                newDiv.dataset["value"] = option.value;
                newDiv.textContent = option.textContent;

                // select item
                newDiv.addEventListener("click", function () {
                    trigger.textContent = this.textContent;
                    syncSelected(this.dataset.value);
                    closeSelect();
                });
                optionsGroup.appendChild(newDiv);
            });

            // open/close select menu
            trigger.addEventListener("click", function () {
                customSelect.classList.toggle("open");
                if (customSelect.classList.contains("open")) {
                    customSelect.setAttribute("aria-hidden", "false");
                    document.addEventListener("click", clickOutsideSelect);
                    document.addEventListener("keydown", keyboardNavigationSelect);
                } else {
                    customSelect.setAttribute("aria-hidden", "true");
                }
            });

            // default value
            if (!nativeSelect.value) {
                trigger.textContent = select.querySelector("option[disabled]").textContent;
            } else {
                syncSelected(nativeSelect.value);
            }

            // sync value on native select change
            nativeSelect.addEventListener("change", function () {
                syncSelected(this.value);
            });

            function keyboardNavigationSelect(e) {
                e.preventDefault();
                // up/previous
                if (e.keyCode === 38) {
                    if (selectedIndex < 1) {
                        selectedIndex = options.length - 1;
                    } else {
                        selectedIndex--;
                    }

                    if (selectedIndex + 1 <= options.length - 1) {
                        optionsGroup.children[selectedIndex + 1].classList.remove("hover");
                    }  else {
                        optionsGroup.children[0].classList.remove("hover");
                    }
                }
                // down/next
                if (e.keyCode === 40) {
                    if (selectedIndex === options.length - 1) {
                        selectedIndex = 0;
                    } else {
                        selectedIndex++;
                    }

                    if (selectedIndex - 1 >= 0) {
                        optionsGroup.children[selectedIndex - 1].classList.remove("hover");
                    } else {
                        optionsGroup.children[options.length - 1].classList.remove("hover");
                    }
                }
                // select/enter
                if (e.keyCode === 13 || e.keyCode === 32) {
                    const value = optionsGroup.children[selectedIndex].dataset.value;
                    syncSelected(value);
                    closeSelect();
                }
                // esc/close
                if (e.keyCode === 27) {
                    closeSelect();
                }
                optionsGroup.children[selectedIndex].classList.add("hover");
            }

            function clickOutsideSelect(e) {
                if (!customSelect.contains(e.target)) {
                    closeSelect();
                }
            }

            function closeSelect() {
                customSelect.classList.remove("open");
                customSelect.setAttribute("aria-hidden", "true");
                document.removeEventListener("click", clickOutsideSelect);
                document.removeEventListener("keydown", keyboardNavigationSelect);
            }

            function syncSelected(value) {
                if (nativeSelect.value !== value) {
                    nativeSelect.value = value;
                }
                if (trigger.dataset.value !== value) {
                    trigger.dataset.value = value;
                    trigger.textContent = optionsGroup.querySelector("[data-value=\"" + value + "\"]").textContent;
                }
            }
        });
    }
})();