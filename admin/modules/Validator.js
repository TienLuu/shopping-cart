//**************** Validator************************* */
// [{
//     selector: ""
//     rules: []

// }]
class Validator {
    constructor({ formGroup, formMess, formInput, rules }) {
        this.formGroup = formGroup || ".form__group"
        this.formMess = formMess || ".form__message"
        this.formInput = formInput
        this.rules = rules
    }


    // Hàm validate nhận vào là id của input và các rules cho input đó
    validate() {
        if (!Array.isArray(this.rules)) this.rules = [this.rules]

        const inputEl = document.querySelector(this.formInput)
        const formGroupEl = inputEl.closest(this.formGroup)
        const spanEl = formGroupEl.querySelector(this.formMess)
        let errorMess

        for (const rule of this.rules) {
            errorMess = rule(inputEl.value.trim())
            if (errorMess) {
                formGroupEl.classList.add("invalid")
                spanEl.innerText = errorMess
                return false
            }
        }

        formGroupEl.classList.remove("invalid")
        spanEl.innerText = ""
        return true
    }


    // =============== Tạo các rule kiểm tra value của input nhầm tái sử dụng các rule ===============
    static emptyRule(message) {
        return (value) => {
            if (!value) {
                return message || "Trường này chưa nhập thông tin"
            }
            return undefined
        }
    }
    static numRule(message) {
        return (value) => {
            if (isNaN(value)) return message || "Giá trị phải là ký số từ 0-9"
            return undefined
        }
    }

    static rangeCharactorRule(min, max, message) {
        return (value) => {
            if (value.length < min || value.length > max) return message || `Giá trị nhập phải nằm từ ${min} đến ${max}`
            return undefined
        }
    }

    static typeRule(arrayType, message) {
        return (value) => {
            let isValid = arrayType.includes(value)
            if (!isValid) return message || "Giá trị select không hợp lệ"
            return undefined
        }
    }

    static sameIDRule(array, type, message) {
        return (value) => {
            if (array.find(element => element[type] === value) || !value) return message || "ID bị trùng không thể thêm mới"
            return undefined
        }
    }

}

export default Validator