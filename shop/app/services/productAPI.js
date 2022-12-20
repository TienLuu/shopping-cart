function getProductsAPI() {
   return axios({
      url: "https://62f50939535c0c50e76847d8.mockapi.io/products",
      method: "GET",
   });
}

export { getProductsAPI };
