// OWL CAROUSEL INIT
$(document).ready(function () {
   $(".owl-one").owlCarousel({
      nav: true,
      dotsEach: true,
      autoplay: true,
      lazyLoad: true,
      responsive: {
         0: {
            items: 1,
         },
      },
   });

   $(".owl-two").owlCarousel({
      nav: true,
      dots: false,
      lazyLoad: true,
      responsive: {
         0: {
            items: 4,
         },
      },
   });

   $(".owl-three").owlCarousel({
      nav: true,
      dots: false,
      lazyLoad: true,
      responsive: {
         0: {
            items: 4,
         },
      },
   });

   $(".owl-four").owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      dotsEach: true,
      stagePadding: 200,
      lazyLoad: true,
      responsive: {
         0: {
            items: 2,
         },
      },
   });
});

// HANLDE VIEW CART
function viewCart(id) {
   const sideNavEl = document.querySelector(".side-nav");
   const overlay = document.querySelector(".cart__overlay");

   if (!+id) {
      body.classList.remove("scroll");
      overlay.style.display = "none";
      sideNavEl.classList.remove("show");
   } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      body.classList.add("scroll");
      overlay.style.display = "block";
      sideNavEl.classList.add("show");
   }
}

document.querySelector("body").addEventListener("click", (e) => {
   const element = e.target.closest("[data-cart-type]");
   if (!element) return;

   const actionType = element.dataset.cartType;
   const id = element.dataset.id;

   if (actionType === "sideNav") viewCart(id);
});
