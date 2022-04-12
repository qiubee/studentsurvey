(function () {
    const selectNodes = document.querySelectorAll(".select");
    if (selectNodes.length > 0) {
        selectNodes.forEach(function (select) {
            // update and show selected item
            const defaultValue = select.querySelector("option[value=\"\"]").textContent;
            select.querySelector(".trigger").textContent = defaultValue;
            
            // create options
            const optionsGroup = select.querySelector(".options");
            const options = select.querySelectorAll("option:not([value=\"\"])");
            options.forEach(function (option) {
                const newDiv = document.createElement("div");
                newDiv.dataset["value"] = option.value;
                newDiv.textContent = option.textContent;
                optionsGroup.appendChild(newDiv)
            });

            // open/close select menu
            const customSelect = select.querySelector(".custom-select");
            select.querySelector(".trigger").addEventListener("click", function () {
                customSelect.classList.toggle("open");
            });
        });
    }
})();