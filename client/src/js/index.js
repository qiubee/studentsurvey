(function () {
    const selectNodes = document.querySelectorAll(".select");
    if (selectNodes.length >= 0) {
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
                if (charCode(e) === 38) {
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
                if (charCode(e) === 40) {
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
                if (charCode(e) === 13 || charCode(e) === 32) {
                    if (selectedIndex >= 0) {
                        syncSelected(optionsGroup.children[selectedIndex].dataset.value);
                        closeSelect();
                    }
                }
                // esc/close
                if (charCode(e) === 27) {
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

(function () {
    const multiQuestions = document.querySelectorAll(".expandable");
    if (multiQuestions.length >= 0) {
        multiQuestions.forEach(function (multiQuestion) {
            const secondQuestion = multiQuestion.querySelector("div:last-of-type");
            const inputs = multiQuestion.querySelectorAll("div:first-of-type input");

            [...inputs].reverse().forEach(function (input) {
                if (input.value === "ja" && input.checked) {
                    showSecondQuestion();
                } else {
                    hideSecondQuestion();
                }
                input.addEventListener("input", toggleSecondQuestion);
            });

            function toggleSecondQuestion() {
                if (this.value === "ja" && this.checked) {
                    showSecondQuestion();
                } else {
                    hideSecondQuestion();
                }
            }

            function showSecondQuestion() {
                secondQuestion.classList.remove("hidden");
                secondQuestion.setAttribute("aria-hidden", "false");
            }

            function hideSecondQuestion() {
                secondQuestion.classList.add("hidden");
                secondQuestion.setAttribute("aria-hidden", "true");
            }
        });
    }
})();

(function () {
    const form = document.querySelector("form");
    const numberInput = form.querySelector("input[type=\"number\"]");
    const selectElements = form.querySelectorAll("select");
    const radioInputs = form.querySelectorAll("input[type=\"radio\"]");
    const optionalUserInputs = form.querySelectorAll("input[value=\"anders\"]");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        validateForm();
    });

    form.querySelector("[type=\"submit\"").addEventListener("click", function (e) {
        e.preventDefault();
        validateForm();
    });

    numberInput.addEventListener("input", function () {
        removeError(this);
        if (this.value.length > 3) {
            this.value = this.value.slice(0, 3);
        }
        if (parseInt(this.value) > 100) {
            this.value = 100;
        }
    });

    [...selectElements, ...radioInputs].flat().forEach(function (el) {
        el.parentElement.addEventListener("click", function () {
            removeError(this);
        });
    });

    optionalUserInputs.forEach(function (el) {
        const textareaElement = el.nextElementSibling.firstElementChild;
        el.parentElement.addEventListener("input", function () {
            removeError(textareaElement);
        });

        textareaElement.addEventListener("input", function () {
            removeError(this);
        });
    });

    function validateForm() {
        let valid = true;

        // radio input
        [...radioInputs].reverse().forEach(function (input) {
            if (input.validity.valueMissing) {
                setError(input.parentElement, "Kies een van de opties");
                valid = false;
            }
        });

        // select
        form.querySelectorAll(".select").forEach(function (selectGroup) {
            const selectElement = selectGroup.querySelector("select");
            if (selectElement.validity.valueMissing) {
                setError(selectGroup, "Selecteer " + selectElement.name);
                valid = false;
            }
        });

        // number input
        if (numberInput.validity.valueMissing || !numberInput.validity.valid) {
            setError(numberInput, "Vul je leeftijd in");
            valid = false;
        } else if (numberInput.validity.badInput) {
            setError(numberInput, "Vul een getal in");
            valid = false;
        }

        // optional user input
        optionalUserInputs.forEach(function (opt) {
            const textareaElement = opt.nextElementSibling.firstElementChild;
            if (opt.checked) {
                if (!opt.nextElementSibling.firstElementChild.value) {
                    setError(opt.nextElementSibling.firstElementChild, "Graag hier iets invullen");
                    valid = false;
                }
            }

            if (textareaElement.value.length > 0 && !opt.checked) {
                opt.checked = true;
            }
        });

        if (valid) {
            sendData(window.location.origin + "/api/v1/answers");
        }
    }

    function setError(el, message = null) {
        const parentElement = el.parentElement;
        window.scrollTo({
            top: parentElement.offsetTop - (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * 0.5),
            behavior: "smooth"
        });

        if (parentElement.classList.contains("form-error")) {
            if (message) {
                parentElement.lastElementChild.textContent = message;
            }
        } else {
            parentElement.classList.add("form-error");
            if (message) {
                const errorMessageDiv = document.createElement("div");
                errorMessageDiv.textContent = message;
                errorMessageDiv.classList.add("form-error-message");
                parentElement.appendChild(errorMessageDiv);
            }
        }
    }

    function removeError(el) {
        const parentElement = el.parentElement;
        if (parentElement.classList.contains("form-error")) {
            parentElement.classList.remove("form-error");
            if (parentElement.lastElementChild.classList.contains("form-error-message")) {
                parentElement.removeChild(parentElement.lastElementChild);
            }
        }
    }

    async function sendData(resource) {
        const formData = new FormData(form);
        const data = new URLSearchParams(formData);
        // send data
        try {
            const response = await fetch(resource, {
                method: "POST",
                body: data,
            });
            if (response.ok && (response.status === 200 || response.status === 201)) {
                showConfirmationMessage();
                showAnswers(formData);
                window.scrollTo({
                    top: document.offsetTop - (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)),
                    behavior: "smooth"
                });
            } else {
                handleResponseError(response);
            }
        } catch (error) {
            showErrorMessage("Er kon geen verbinding worden gemaakt.");
        }
    }

    async function showErrorMessage(message = null, buttonType = "retry") {
        const div = createDiv(["notification", "error"]);
        let msg;
        if (message && message.length > 0) {
            msg = createParagraph(message);
        } else {
            msg = createParagraph("Er ging iets mis bij het verwerken van de antwoorden.");
        }
        const closeButton = createDiv(["button", "close"]);
        closeButton.addEventListener("click", async function () {
            await fadeOut(div, 300);
            document.body.removeChild(div);
        });
        div.appendChild(closeButton);
        div.appendChild(msg);
        if (buttonType === "retry") {
            const retryButton = createDiv(["button", "default"]);
            retryButton.textContent = "Probeer opnieuw";
            retryButton.addEventListener("click", async function () {
                await fadeOut(div, 200);
                document.body.removeChild(div);
                validateForm();
            });
            div.appendChild(retryButton);
        }
        document.body.appendChild(div);
    }

    function showConfirmationMessage() {
        const div = createDiv(["notification", "complete"]);
        const message = createParagraph("Je antwoorden zijn opgestuurd. Bedankt voor het invullen van de vragenlijst!");
        const button = createDiv(["button", "default"]);
        button.textContent = "Sluiten";
        button.addEventListener("click", async function () {
            await fadeOut(div, 300);
            document.body.removeChild(div);
        });
        div.appendChild(message);
        div.appendChild(button);
        document.body.appendChild(div);
    }

    function createDiv(classNames = null) {
        const div = document.createElement("div");
        if (typeof classNames === "string" ) {
            div.classList.add(classNames);
        } else if (classNames.length > 0) {
            classNames.forEach(function (className) {
                div.classList.add(className);
            });
        }
        return div;
    }

    function createParagraph(text) {
        const p = document.createElement("p");
        p.textContent = text;
        return p;
    }

    function showAnswers(formData) {
        // create selectors from formData keys
        const selectors = [...new Set([...formData.keys()])];
        // create a collection of question elements and answers from selectors
        const qaSet = selectors.map(function (selector) {
            const input = form.querySelector(`[name="${selector}"]`);
            if (input.parentElement.firstChild.nodeType === 3) {
                if (input.type === "select-one") {
                    return [input.parentElement.parentElement, input.selectedOptions[0].textContent];
                } else {
                    return [input.parentElement, input.value];
                }
            } else {
                if (input.type === "checkbox") {
                    const multipleAnswers = [...input.parentElement.parentElement.querySelectorAll(":checked")].map(function (input) {
                        if (input.value === "anders") {
                            return input.labels[0].textContent + input.nextElementSibling.firstElementChild.value;
                        } else {
                            return input.labels[0].textContent;
                        }
                    });
                    return [input.parentElement.parentElement, multipleAnswers];
                } else {
                    const selectedAnswer = document.querySelector(`[name="${selector}"]:checked`);
                    return [input.parentElement.parentElement, selectedAnswer.labels[0].textContent];
                }
            }
        });
        // remove inputs & replace with answers
        qaSet.forEach(function (qa) {
            const question = qa[0];
            const answer = qa[1];

            if (question.firstElementChild.type === "number") {
                question.removeChild(question.firstElementChild);
                question.appendChild(createParagraph(answer));
            } else if (question.lastElementChild) {
                [...question.children].forEach(function (node) {
                    if (node.className !== "question") {
                        node.parentElement.removeChild(node);
                    }
                });
                if (typeof answer === "string") {
                    question.appendChild(createParagraph(answer));
                } else if (answer.length > 0) {
                    const list = document.createElement("ul");
                    answer.forEach(function (value) {
                        const item = document.createElement("li");
                        item.textContent = value;
                        list.appendChild(item);
                    });
                    question.appendChild(list);
                } else {
                    question.parentElement.removeChild(question);
                }
            }
        });
        // remove submit button
        form.removeChild(form.lastElementChild);
        // update introduction
        const intro = document.querySelector("main > p");
        intro.textContent = "Jouw antwoorden op de vragen.";
        intro.classList.add("text-center");
    }

    async function fadeOut(el, duration) {
        let opacity = 1;
        const interval = 50;
        const remaining = interval / duration;
        const fading = setInterval(decreaseOpacity, interval);

        function decreaseOpacity() {
            opacity -= remaining;
            el.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fading);
            }
        }
        await wait(duration);
    }

    function handleResponseError(response) {
        switch (response.status) {
        case 400:
            showErrorMessage("Er ging iets mis bij het verwerken van de antwoorden. Kijk nog een keer of alles wat je hebt ingevuld klopt.");
            break;
        case 404:
            showErrorMessage("Sorry, er worden geen antwoorden meer verwerkt.", "none");
            break;
        case 405:
            showErrorMessage("Op dit moment kunnen er geen antwoorden worden opgestuurd. Probeer het later nog eens.", "none");
            break;
        case 500:
            showErrorMessage("Oops, er ging iets mis in de cloud. We zijn op de hoogte. Probeer het later nog eens.", "none");
            break;
        case 502:
            showErrorMessage("Er ging iets mis bij het opsturen van de antwoorden. Probeer het op een later moment nog eens.", "none");
            break;
        }
    }
})();

function charCode(e) {
    return (e.which) ? e.which : charCode(e);
}

function wait(milliseconds) {
    return new Promise(function (res) {
        setTimeout(function () {
            res();
        }, milliseconds);
    });
}