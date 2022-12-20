function apiGetProducts(searchTerm) {
   return axios({
      url: "https://62f50939535c0c50e76847d8.mockapi.io/products",
      method: "GET",
      params: {
         name: searchTerm,
      },
   }).catch((error) => {
      console.log(
         "There is something wrong with call request at Folder services/productsAPI.js !"
      );
      return Promise.reject();
   });
}

function apiGetProductByID(id) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/products/${id}`,
      method: "GET",
   }).catch((error) => {
      console.log(
         "There is something wrong with call request at Folder services/productsAPI.js !"
      );
      return Promise.reject();
   });
}

function apiAddProduct(product) {
   console.log(product);
   return axios({
      url: "https://62f50939535c0c50e76847d8.mockapi.io/products",
      method: "POST",
      data: product,
   }).catch((error) => {
      console.log(
         "There is something wrong with call request at Folder services/productsAPI.js !"
      );
      return Promise.reject();
   });
}

function apiUpdateProduct(product, id) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/products/${id}`,
      method: "PUT",
      data: product,
   }).catch((error) => {
      console.log(
         "There is something wrong with call request at Folder services/productsAPI.js !"
      );
      return Promise.reject();
   });
}

function apiDeleteProduct(id) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/products/${id}`,
      method: "DELETE",
   }).catch((error) => {
      console.log("There is something wrong with call request!");
      return Promise.reject();
   });
}

function apiGetProductByValue({ ...filter }) {
   return axios({
      url: "https://62f50939535c0c50e76847d8.mockapi.io/products",
      method: "GET",
   })
      .catch((error) => {
         console.log(
            "There is something wrong with call request at Folder services/productsAPI.js !"
         );
         return Promise.reject();
      })
      .then((res) => {
         const { data } = res;
         const items = [];

         data.forEach((item) => {
            for (const type in filter) {
               if (Array.isArray(filter[type])) {
                  let count = 0;
                  for (const value of filter[type]) {
                     if (item[type] !== value) {
                        count++;
                     }
                  }
                  if (count === filter[type].length) return;
               } else if (typeof filter[type] === "object") {
                  const greaterValue = filter[type].$gt || Number.MIN_VALUE;
                  const lesserValue = filter[type].$lt || Number.MAX_VALUE;

                  if (!item[type] > greaterValue && !item[type] < lesserValue)
                     return;
               } else {
                  if (item[type] !== filter[type]) return;
               }
            }
            items.push(item);
         });

         if (items.length !== 0) {
            res.data = items;
            return Promise.resolve(res);
         } else {
            return Promise.reject("NOT FOUND");
         }
      });
}
export {
   apiGetProducts,
   apiGetProductByID,
   apiAddProduct,
   apiUpdateProduct,
   apiDeleteProduct,
   apiGetProductByValue,
};
