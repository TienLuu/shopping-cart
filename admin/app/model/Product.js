import { apiGetProducts, apiGetProductByID, apiGetProductByValue, apiAddProduct, apiUpdateProduct, apiDeleteProduct } from "../services/productsAPI.js"


class Product {
    constructor(id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds) {
        this.id = id
        this.productCode = productCode
        this.name = name
        this.price = price
        this.screen = screen
        this.backCamera = backCamera
        this.frontCamera = frontCamera
        this.img = img
        this.desc = desc
        this.brand = brand
        this.views = views || 0
        this.solds = solds || 0
    }
}

function getProducts(searchTerm) {
    return apiGetProducts(searchTerm)
        .then(res => {
            const data = res.data
            const products = data.map(({ id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds }) => {
                return new Product(id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds)
            })

            return Promise.resolve(products)
        })
}

function getProductByID(productID) {
    return apiGetProductByID(productID)
        .then(res => {
            const { id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds } = res.data
            const product = new Product(id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds)
            return Promise.resolve(product)
        })
}

function getProductByValue({ ...filter }) {
    return apiGetProductByValue(filter)
        .then(res => {
            const data = res.data
            const products = data.map(({ id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds }) => {
                return new Product(id, productCode, name, price, screen, backCamera, frontCamera, img, desc, brand, views, solds)
            })

            return Promise.resolve(products)
        })
}

function addProduct(product) {
    return apiAddProduct(product)
        .then(res => {
            return Promise.resolve(res.data)
        })
}

function updateProduct(product, productID) {
    return apiUpdateProduct(product, productID)
        .then(res => {
            return Promise.resolve(res.data)
        })
}

function deleteProduct(productID) {
    return apiDeleteProduct(productID)
        .then(res => {
            return Promise.resolve(res.data)
        })
}


export default Product
export { getProducts, getProductByID, addProduct, updateProduct, deleteProduct, getProductByValue }