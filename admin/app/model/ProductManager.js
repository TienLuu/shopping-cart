class ProductManager {
    constructor() {
        this.products = []
    }

    add(product) {
        this.products.push(product)
    }

    delete(productID) {
        this.products = this.products.filter(item => item.id !== productID)
    }

    update(productID, product) {
        this.products = this.products.map(item => {
            if (productID === item.id) {
                return product
            }
            return item
        })
    }

    findByID(productID) {
        return this.products.find(product => product.id === productID)
    }
}

export default ProductManager