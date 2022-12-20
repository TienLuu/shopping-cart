import Toast from "../../modules/Toast.js"



const successToast = new Toast(
    {
        root: "#toast",
        type: "success",
        title: "Success ! Everything is worked !",
        duration: 3000
    })

const errorToast = new Toast(
    {
        root: "#toast",
        type: "error",
        title: "Uh oh, something went wrong",
        duration: 3000
    })

const infoToast = new Toast(
    {
        root: "#toast",
        type: "info",
        title: "Did you know?",
        duration: 3000
    })



export { successToast, errorToast, infoToast }
