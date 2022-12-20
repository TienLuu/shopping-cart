import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import ProductManager from "../models/ProductManager.js";
import { getProductsAPI } from "../services/productAPI.js";

const cart = new Cart();
const productManager = new ProductManager();
const CART_KEY = "CartItems";

/*
=============================================
                INITIALIZATION
=============================================
*/
function generateShop(products) {
   let html = products
      .map((product) => {
         const { id, img, price, name, brand } = product;
         return `
            <div class="products__item">
               <a href="" data-toggle="modal" data-target="#previewModal">
                     <label>Mới</label>
                     <div class="products__img">
                        <img src="${img}" width="204" alt="${brand}">
                     </div>
                     <h3>${name}</h3>
                     <span class="products__price">${formatCash(
                        price.toString()
                     )}<sup>đ</sup></span>
                     <button class="btn btn-success" data-id=${id} data-type="addToCart">
                     Add to Cart
                     </button>
               </a>
            </div>
        `;
      })
      .join("");

   if (!html) html = "<div class='products__empty'>Nothing found</div>";
   dom(".products__list").innerHTML = html;
}

function renderCart() {
   dom(".cart__total").innerHTML = `
            ${formatCash(cart.calcTotalPrice().toString())}<sup>đ</sup>`;

   dom(".cart-amount").innerHTML = cart.getCart().length;

   let html = cart.getCart().map((cartItem) => {
      const { id, name, img, price } = cartItem.product;
      return `
            <div class="cartItem">
                    <div class="cartItem__img">
                        <div>
                            <img src="${img}" alt="CartItem Image">
                        </div>
                    </div>
                    <strong class="cartItem__name">${name}</strong>
                    <span class="cartItem__quantity">
                        <div>
                            <button class="btn-quantity" data-id=${id} data-type="decrement">
                                <i class="fas fa-chevron-left" ></i>
                            </button>
                            <p class="cartItem__number">${cartItem.quantity}</p>
                            <button class="btn-quantity" data-id=${id} data-type="increment">
                                <i class="fas fa-chevron-right" ></i>
                            </button>
                        </div>
                    </span>
                    <p class="cartItem__price">${formatCash(
                       price.toString()
                    )}<sup>đ</sup>
                    </p>
                    <button>
                        <i class="fas fa-trash" data-id=${id} data-type="deleteCartItem"></i>
                    </button>
                </div>
        `;
   });

   if (!html.length)
      html = `<span class="empty-cart">Looks Like You Haven't Added Any Product In The Cart</span>`;

   dom(".cartItems").innerHTML = html;
}

function init() {
   getProductsAPI()
      .then((res) => {
         // Lấy danh sách sản phẩm đưa vào class ProductManager để quản lý danh sách sản phẩm ở local => Cải thiện UX
         productManager.setProductList(res.data);

         // Hiển thị danh sách sản phẩm
         generateShop(res.data);

         // Render Cart khi loaded
         getCartFromLocal(CART_KEY);
         renderCart();
      })
      .catch(() => {
         // Hiển thị found nothing nếu fetching data bị lỗi
         generateShop([]);
      });
}

/*
=============================================
                FUNCTIONALLY
=============================================
*/
function getCartFromLocal(key) {
   const cartItems = JSON.parse(localStorage.getItem(key));
   if (!cartItems || cartItems.length === 0) return;

   const newCartItems = cartItems.map((cartItem) => {
      return new CartItem(cartItem.product, cartItem.quantity);
   });

   cart.setCart(newCartItems);
}
function addToCart(id, quantity = 1) {
   // Giới hạn sản phẩm thêm vào giỏ hàng
   if (cart.getCart().length >= 4) {
      swal({
         title: "Giỏ hàng đã đầy!",
         text: "Thanh toán sản phẩm trong giỏ hàng nhé!",
         icon: "warning",
         button: "Đóng!",
      });
      return;
   }
   // Lấy danh sách sản phẩm
   const products = productManager.getProDuctList();

   // Tìm Product chọn và tạo mới CartItem với quantity = 1
   const selectedProduct = products.find((product) => product.id === id);
   const cartItem = new CartItem(selectedProduct, quantity);

   // Thêm cartItem vào cart
   cart.addToCart(cartItem);
}

function increment(id) {
   cart.increaseQuantity(id);
}

function decrement(id) {
   const cartItem = cart.findCartItemById(id);
   if (cartItem.quantity === 1) {
      cart.deleteCartItem(id);
      return;
   }

   cart.decreaseQuantity(id);
}

function deleteCartItem(id) {
   cart.deleteCartItem(id);
}

function clearCart() {
   if (cart.getCart().length === 0) {
      swal({
         title: "Giỏ hàng trống!",
         text: "You clicked the button!",
         icon: "warning",
         button: "Đóng!",
      });
      return;
   }

   swal({
      title: "Xoá thành công!",
      text: "You clicked the button!",
      icon: "success",
      button: "Đóng!",
   });

   cart.clearCart();
}

function payment() {
   if (cart.getCart().length === 0) {
      swal({
         title: "Chọn sản phẩm trước khi thanh toán!",
         text: "You clicked the button!",
         icon: "warning",
         button: "Đóng!",
      });
      return;
   }

   swal({
      title: "Thanh toán thành công!",
      text: "You clicked the button!",
      icon: "success",
      button: "Đóng!",
   });

   cart.clearCart();
}

// Object data-type get function
const getElType = {
   addToCart,
   increment,
   decrement,
   clearCart,
   payment,
   deleteCartItem,
};

function getType(type, id) {
   return getElType[type](id);
}

/*
=============================================
                HANDLE EVENT
=============================================
*/
// Invoked function initialize
init();

// Lắng nghe sự kiện click theo data-type, tăng giảm số lượng sản phẩm, thanh toán và xoá sản phẩm trong giỏ hàng
document.addEventListener("click", (e) => {
   const element = e.target.closest("[data-type]");

   // Nếu click vào vùng không có attribute data-type thì return
   if (!element) return;

   // Lấy giá trị của html tag vừa click
   const actionType = element.dataset.type;
   const productId = element.dataset.id;

   // Invoked function theo từng loại value của data-type attribute
   getType(actionType, productId);

   // Rerender Cart
   renderCart();

   // Lưu giỏ hàng vào localStorage
   localStorage.setItem(CART_KEY, JSON.stringify(cart.getCart()));
});

// Lọc sản phẩm theo type
dom("#filterProdcut").addEventListener("change", (e) => {
   const inputVal = e.target.value;

   // Kiểm tra input nếu được option chọn loại được chọn lại lần nữa
   if (!inputVal) return;

   // Lọc danh sách sản phẩm theo type
   const newProducts = productManager.filterProductByType(inputVal);

   // Rerender ProductList sau khi filter
   generateShop(newProducts);
});

/*
=============================================
                HELPER FUNCTION
=============================================
*/
function dom(selector) {
   return document.querySelector(selector);
}

// Format VND
function formatCash(str) {
   return str
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
         return (index % 3 ? next : next + ",") + prev;
      });
}
