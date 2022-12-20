class Cart {
   constructor() {
      this.cart = [];
   }

   getCart() {
      return this.cart;
   }

   setCart(cartItems) {
      this.cart = cartItems;
   }

   addToCart(cartItem) {
      const index = this.cart.findIndex(
         (item) => item.product.id === cartItem.product.id
      );

      if (index !== -1) {
         this.cart[index].quantity += 1;
      } else {
         this.cart.push(cartItem);
      }
   }

   findCartItemById(id) {
      return this.cart.find((item) => item.product.id === id);
   }

   increaseQuantity(id) {
      const index = this.findIndex(id);

      this.cart[index].quantity += 1;
   }

   decreaseQuantity(id) {
      const index = this.findIndex(id);

      this.cart[index].quantity -= 1;
   }

   deleteCartItem(id) {
      const index = this.findIndex(id);

      this.cart.splice(index, 1);
   }

   calcTotalCartItem() {
      return this.cart.reduce((result, cartItem) => {
         return result + cartItem.quantity;
      }, 0);
   }

   calcTotalPrice() {
      return this.cart.reduce((result, cartItem) => {
         return result + cartItem.calcPrice();
      }, 0);
   }

   clearCart() {
      this.cart = [];
   }

   findIndex(id) {
      return this.cart.findIndex((item) => item.product.id === id);
   }
}

export default Cart;
