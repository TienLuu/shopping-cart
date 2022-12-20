class Toast {
    constructor({ root, type, title, duration }) {
        const rootEl = document.querySelector(root)
        if (!rootEl) {
            throw new Error("Toast Root Element not found")
        }


        this.root = rootEl
        this.title = title
        this.duration = duration
        this.type = type
    }


    fire(message) {
        const icon = {
            success: "<i class='bx bxs-check-circle'></i>",
            warning: "<i class='bx bxs-error'></i>",
            error: "<i class='bx bxs-error-circle'></i>",
            info: "<i class='bx bxs-info-circle'></i>"
        }

        const delay = (this.duration / 1000).toFixed(2)

        const toast = document.createElement("div");
        toast.classList.add("toast", `toast--${this.type}`)


        toast.innerHTML = `
                <div class="toast__bar"></div>
                <div class="toast__icon">
                    ${icon[this.type] && icon[this.type] || ''}
                </div>
                <div class="toast__body">
                    <h3>${this.title}</h3>
                    <p>${message}</p>
                </div>
                <div class="toast__close">
                    <i class='bx bx-x'></i>
                </div>
            `
        toast.style.animation = `slideIn 0.5s ease, fadeOut 0.3s ease ${delay}s`;



        // xu ly remove toast tu dong
        const toastID = setTimeout(() => {
            toast.remove()
        }, this.duration + 300)

        //xu ly remove toast khi click close
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                toast.remove()
                clearTimeout(toastID);
            }
        }
        this.root.appendChild(toast)
    }
}


export default Toast

