class ProductManager {
   constructor() {
      this.productList = [];
   }

   setProductList(products) {
      this.productList = [...products];
   }

   getProDuctList() {
      return this.productList;
   }

   filterProductByType(brand) {
      if (brand === "all") return this.productList;

      return this.productList.filter(
         (cartItem) => cartItem.brand.toLowerCase() === brand.toLowerCase()
      );
   }
}

export default ProductManager;
