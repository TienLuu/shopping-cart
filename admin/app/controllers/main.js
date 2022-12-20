import ProductManager from "../model/ProductManager.js";
import Product, {
   addProduct,
   deleteProduct,
   getProductByID,
   getProductByValue,
   getProducts,
   updateProduct,
} from "../model/Product.js";
import validationForm, { resetError } from "../services/validate.js";
import {
   errorToast,
   infoToast,
   successToast,
} from "../services/toastMessage.js";

//=====================================================
//       Tạo hàm render các sản phẩm ra giao diện
//         từ thông tin nhận được khi gọi API
//=====================================================
function initial() {
   getProducts().then((products) => {
      productManager.products = products;
      render(productManager.products);
   });
}
// hàm render phần giao diện bảng để quản lý
function render(products) {
   let htmls = products.reduce((output, product, index) => {
      const {
         id,
         name,
         price,
         screen,
         backCamera,
         frontCamera,
         img,
         desc,
         brand,
      } = product;
      return (
         output +
         `
            <div class="product__item" data-toggle="modal" data-target="#previewModal" data-id="${id}">
                <div class="row">
                    <div class="product__id col-2 col-sm-1 col-md-1">
                        ${index + 1}
                    </div>
                    <div class="product__name col-4 col-sm-3 col-md-2">
                        ${name}
                    </div>
                    <div class="product__brand col-0 col-sm-2 col-md-1">
                        ${brand}
                    </div>
                    <div class="product__price col-3 col-sm-2 col-md-2">
                        $${price}
                    </div>
                    <div class="product__desc col-0 col-sm-0 col-md-3">
                        ${desc}
                    </div>
                    <div class="product__img col-0 col-sm-2 col-md-1">
                        <img 
                            onerror="this.src='../../assets/img/error.png.webp'"
                            src="${img}"
                            alt="">
                    </div>
                    <div class="product__controller col-3 col-sm-2">
                        <button class="btnEdit" data-toggle="modal" data-target="#formModal" data-type="edit"><i class='bx bx-edit'></i></button>
                        <button class="btndelete" data-type="delete"><i class='bx bx-box'></i></button>
                    </div>
                </div>
            </div>`
      );
   }, "");
   if (!htmls) htmls = `<div class="product__empty">No product found</div>`;
   productManager.products = products;
   dom("#product__content").innerHTML = htmls;
}

// hàm render phần preview , chứa tất cả thông tin sản phẩm
function renderPreview(product) {
   const {
      id,
      productCode,
      name,
      price,
      screen,
      backCamera,
      frontCamera,
      img,
      desc,
      brand,
      views,
      solds,
   } = product;
   const htmls = `
        <div class="overlay">
        </div>
        <div class="preview">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 col-sm-6 col-md-5 mb-sm-5">
                        <img onerror="this.src='../../assets/img/error.png.webp'" class="preview__img"
                            src="${img}" alt="">
                        <div class="preview__img-slide">
                            <img src="${img}"
                                alt="">
                            <img src="${img}"
                                alt="">
                            <img src="${img}"
                                alt="">
                            <img src="${img}"
                                alt="">
                            <img src="${img}"
                                alt="">
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-7">
                        <h3 class="preview__name">${name}</h3>
                        <p class="preview__desc">${desc}</p>
                        <p class="preview__price">$${price}</p>
                        <div class="preview__info">
                            <div class="preview__code">
                                <span>Product code:</span> ${productCode}
                            </div>
                            <div class="preview__screen">
                                <span>screen:</span> ${screen}
                            </div>
                            <div class="preview__backCamera">
                                <span>backCamera:</span> ${backCamera}
                            </div>
                            <div class="preview__frontCamera">
                                <span>backCamera:</span> ${frontCamera}
                            </div>
                            <div class="preview__brand">
                                <span>Brand:</span> ${brand}
                            </div>
                            <div class="preview__views">
                                <span>Views:</span> ${views}
                            </div>
                            <div class="preview__solds">
                                <span>Solds:</span> ${solds}
                            </div>
                        </div>
                    </div>
                    <div class="col-5">

                    </div>
                </div>
            </div>
            <div class="modal__close" data-toggle="modal" data-target="#previewModal">
                <i class='bx bx-x'></i>
            </div>
        </div>
        `;
   dom("#previewModal").innerHTML = htmls;
}

// hàm reRender để reRender lại mỗi khi cập nhật,chỉnh sửa thông tin
function reRender() {
   initial();
}

//=====================================================
//       Xử lý tạo giao diện đầu tiên khi vừa vào web
//=====================================================
let productManager = new ProductManager();
initial();

//=====================================================
//          Lắng nghe sự kiện click vào
//     các button chức năng xử lý thêm sửa xóa update
//=====================================================
document.addEventListener("click", (e) => {
   e.preventDefault();
   const button = e.target;

   // Mặc định các button có chức năng xử lý form đều có property [data-type]
   // Kiểm tra nếu nhấn phải các element không có data-type thì không xử lý gì cả
   const buttonType = button.dataset.type;
   if (!buttonType) return;
   button.disabled = true;

   // Xử lý khi nhấn nút mở form nhập sản phẩm
   if (buttonType === "open") {
      resetFormValue();
      resetError();
      dom("#productCode").disabled = false;

      dom("#formModal .form__header").innerText = "Add New Product";
      dom(
         "#formModal .form__submit"
      ).innerHTML = `<button class="submitBtn" data-type="add">Confirm</button>
             <button class="cancleBtn" data-toggle="modal" data-target="#formModal">Cancel</button>
        `;
      button.disabled = false;
   }

   // Xử lý khi nhấn nút xác nhận (confirm) tạo mới sản phẩm
   if (buttonType === "add") {
      const product = getFormValue();

      validationForm()
         .then(() => {
            return new Promise((resolve, reject) => {
               // Kiểm tra xem productcode có trùng trong database không
               // nếu trùng thì reject
               // không trùng thì tiếp tục resolve
               getProductByValue({ productCode: product.productCode })
                  .then(() => {
                     reject("same product code");
                  })
                  .catch(() => {
                     resolve();
                  });
            });
         })

         .then(() => {
            return addProduct(product);
         })
         .then((product) => {
            productManager.add(product);
            closeForm();
            reRender();
            successToast.fire(`"${product.name}" is ready to sell 🤞🎁`);
         })
         .catch((error) => {
            if (error === "same product code") {
               errorToast.fire("💢 productCode's name has already been used");
            } else if (error === false) {
               errorToast.fire("Your form input value is not valid 🏴 🏴 🏴");
            } else {
               errorToast.fire("Sever is busy 🏴 🏴 🏴");
            }
         })
         .finally(() => {
            button.disabled = false;
         });
   }

   // Xử lý khi nhấn nút delete sản phẩm
   if (buttonType === "delete") {
      const produceID = button.closest(".product__item").dataset.id;

      deleteProduct(produceID)
         .then((product) => {
            productManager.delete(product.id);
            reRender();
            infoToast.fire(`You have deleted ಠ_ಠ "${product.name}"`);
         })
         .catch((error) => {
            errorToast.fire("Sever is busy 🏴 🏴 🏴");
         })
         .finally(() => {
            button.disabled = false;
         });
   }

   // Xử lý khi nhấn nút edit sản phẩm
   if (buttonType === "edit") {
      resetFormValue();
      resetError();
      // Không cần sửa lại productCode
      dom("#productCode").disabled = true;

      const produceID = button.closest(".product__item").dataset.id;

      dom("#formModal .form__header").innerText = "Edit Product";
      dom(
         "#formModal .form__submit"
      ).innerHTML = `<button class="submitBtn" data-type="update">Update</button>
             <button class="cancleBtn" data-toggle="modal" data-target="#formModal">Cancel</button>
        `;

      getProductByID(produceID)
         .then((product) => {
            fillFormValue(product);
         })
         .catch((error) => {
            console.log(error);
         })
         .finally(() => {
            button.disabled = false;
         });
   }

   // Xử lý khi nhấn nút update sản phẩm
   if (buttonType === "update") {
      const product = getFormValue();

      validationForm()
         .then(() => {
            return updateProduct(product, product.id);
         })
         .then((product) => {
            productManager.update(product.id, product);
            closeForm();
            reRender();
            successToast.fire(`Update ${product.name} successfully 🎉`);
         })
         .catch((error) => {
            errorToast.fire("Sever is busy 🏴 🏴 🏴");
         })
         .finally(() => {
            button.disabled = false;
         });
   }
});

//=====================================================
//    Xử lý chức năng tìm kiềm bằng search product
//=====================================================

function debounce(cb, delay = 300) {
   let timeout;
   return (searchTerm) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
         cb(searchTerm);
      }, delay);
   };
}

const updateSearch = debounce((searchTerm) => {
   // console.log(searchTerm)
   getProducts(searchTerm).then((products) => {
      render(products);
   });
});

dom("#searchInput").addEventListener("input", function (e) {
   const searchTerm = this.value;
   updateSearch(searchTerm);
});

//=====================================================
//          Lắng nghe sự kiện click vào
//     các các item product để mở modal preview
//          chứa toàn bộ thông tin sản phẩm
//=====================================================
// document.addEventListener("previewModal", (e) => {
//     const produceID = e.detail.element.dataset.id
//     console.log([e.detail.element])
//     const product = products.find(produce => produce.id === produceID)
//     renderModal(product)
// })

dom("#product__content").onclick = function (e) {
   const element = e.target.closest(".product__item");
   if (!element) return;
   const produceID = element.dataset.id;
   const product = productManager.findByID(produceID);
   renderPreview(product);
};

//========================================
//           Helper function
//========================================
function dom(selector) {
   return document.querySelector(selector);
}

function domAll(selector) {
   return document.querySelectorAll(selector);
}

function closeForm() {
   dom("#formModal .modal__close").click();
}

function getFormValue() {
   const productID = dom("#productID").value;
   const productCode = dom("#productCode").value;
   const productName = dom("#productName").value;
   const productPrice = +dom("#productPrice").value;
   const productBrand = dom("#productBrand").value;
   const productBackCamera = dom("#productBackCamera").value;
   const productFrontCamera = dom("#productFrontCamera").value;
   const productImg = dom("#productImg").value;
   const productScreen = dom("#productScreen").value;
   const productDesc = dom("#productDesc").value;

   return new Product(
      productID,
      productCode,
      productName,
      productPrice,
      productScreen,
      productBackCamera,
      productFrontCamera,
      productImg,
      productDesc,
      productBrand
   );
}

function fillFormValue(product) {
   dom("#productID").value = product.id;
   dom("#productCode").value = product.productCode;
   dom("#productName").value = product.name;
   dom("#productPrice").value = product.price;
   dom("#productBrand").value = product.brand;
   dom("#productScreen").value = product.screen;
   dom("#productBackCamera").value = product.backCamera;
   dom("#productFrontCamera").value = product.frontCamera;
   dom("#productImg").value = product.img;
   dom("#productDesc").value = product.desc;
}

function resetFormValue() {
   dom("#productID").value = "";
   dom("#productCode").value = "";
   dom("#productName").value = "";
   dom("#productPrice").value = "";
   dom("#productBrand").value = "";
   dom("#productScreen").value = "";
   dom("#productBackCamera").value = "";
   dom("#productFrontCamera").value = "";
   dom("#productImg").value = "";
   dom("#productDesc").value = "";
}
