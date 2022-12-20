class CartItem {
   constructor(product, quantity) {
      this.product = product;
      this.quantity = quantity;
   }

   calcPrice() {
      return +this.product.price * this.quantity;
   }
}

export default CartItem;
