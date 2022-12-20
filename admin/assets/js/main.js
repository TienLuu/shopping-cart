// xử lý phần navigator
const navigation = document.querySelector(".navigation")
const listItem = document.querySelectorAll(".navigation__link")

navigation.onclick = function (e) {
    const target = e.target

    const link = target.closest(".navigation__link")
    const listLink = target.closest(".navigation__list")
    if (!link) return
    listItem.forEach((item, index) => {
        item.classList.remove("active")
        if (item === link) {
            listLink.style.setProperty("--position", index)
        }
    })
    link.classList.add("active")
}



// Xử lý các event toggle(bật tắt)
function turnOffToggle(type) {
    let elements = document.querySelectorAll(`[data-toggle='${type}']`)
    elements.forEach(element => {
        const target = document.querySelector(element.dataset.target)
        target.classList.remove("open")
    })
}

function handleToggle(e) {
    let element = e.target

    const dataType = element.dataset.toggle
    const toggleTargetID = element.dataset.target
    const toggleElement = document.querySelector(toggleTargetID)


    if (dataType === "dropdown") {
        toggleElement.classList.toggle("open")
    }
    if (dataType === "button") {
        toggleElement.classList.toggle("open")
    }

    if (dataType === "modal") {
        // if (toggleTargetID === "#previewModal" && !toggleElement.classList.contains("open")) {
        //     document.dispatchEvent(new CustomEvent("previewModal", {
        //         detail: { element }
        //     }))
        // }

        setTimeout(() => { toggleElement.classList.toggle("open") }, 0)
    }

    if (dataType === "theme") {
        toggleElement.classList.toggle("dark")

        if (toggleElement.classList.contains("dark")) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
}
document.addEventListener("click", handleToggle)