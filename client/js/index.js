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

            // remove noscript
            customSelect.classList.remove("noscript");

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
                        optionsGroup.scrollTo(0, optionsGroup.scrollHeight);
                    } else {
                        selectedIndex--;
                        updateScrollPosition(selectedIndex, "top");
                    }

                    if (selectedIndex + 1 <= options.length - 1) {
                        removeOptionHover(selectedIndex + 1);
                    }  else {
                        removeOptionHover(0);
                    }
                }
                // down/next
                if (e.keyCode === 40) {
                    if (selectedIndex === options.length - 1) {
                        selectedIndex = 0;
                        optionsGroup.scrollTo(0, 0);
                    } else {
                        selectedIndex++;
                        updateScrollPosition(selectedIndex, "bottom");
                    }

                    if (selectedIndex - 1 >= 0) {
                        removeOptionHover(selectedIndex - 1);
                    } else {
                        removeOptionHover(options.length - 1);
                    }
                }
                // select/enter
                if (e.keyCode === 13 || e.keyCode === 32) {
                    if (selectedIndex >= 0) {
                        syncSelected(optionsGroup.children[selectedIndex].dataset.value);
                        closeSelect();
                    }
                }
                // esc/close
                if (e.keyCode === 27) {
                    closeSelect();
                }

                if (selectedIndex >= 0) {
                    optionsGroup.children[selectedIndex].classList.add("hover");
                }
            }

            function clickOutsideSelect(e) {
                if (!customSelect.contains(e.target)) {
                    closeSelect();
                }
            }

            function updateScrollPosition(optionIndex, watchDirection) {
                const optionNode = optionsGroup.children[optionIndex];
                if (watchDirection === "top") {
                    if (optionsGroup.scrollTop > (optionNode.offsetTop - optionNode.offsetHeight)) {
                        optionsGroup.scrollTo(0, optionsGroup.scrollTop - optionNode.offsetHeight);
                    }
                } else if (watchDirection === "bottom") {
                    if (optionNode.offsetTop - (optionsGroup.scrollTop + optionsGroup.offsetHeight) > 0) {
                        optionsGroup.scrollTo(0, optionNode.offsetTop - optionsGroup.offsetHeight);
                    }
                }
            }

            function removeOptionHover(position) {
                optionsGroup.children[position].classList.remove("hover");
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