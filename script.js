/* =========================================================
   GIỎ HÀNG
   ========================================================= */

/* Thêm sản phẩm vào giỏ hàng */
    function addToCart(name, price, image) {

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];

    /* Kiểm tra sản phẩm đã có trong giỏ chưa */
        let existingProduct = cart.find(function(product) {
            return product.name === name;
        });

        if (existingProduct) {

        /* Nếu đã có → tăng số lượng */
            existingProduct.quantity += 1;

        } else {

        /* Nếu chưa có → thêm sản phẩm mới */
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        window.location.href = "cart.html";
    }


/* =========================================================
   XỬ LÝ GIÁ TIỀN
   ========================================================= */

/* Chuyển giá tiền về dạng số */
function getPriceNumber(price) {
    if (typeof price === "number") {
        return price;
    }

    return parseInt(
        String(price)
            .replace(/\./g, "")
            .replace(/đ/g, "")
            .replace(/₫/g, "")
            .replace(/\s/g, "")
    ) || 0;
}


/* Định dạng tiền Việt Nam */
function formatPrice(price) {
    return getPriceNumber(price).toLocaleString("vi-VN") + "đ";
}


/* =========================================================
   TÍNH TỔNG TIỀN SẢN PHẨM ĐƯỢC CHỌN
   ========================================================= */

function calculateSelectedTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    let checkboxes = document.querySelectorAll(".product-check");

    checkboxes.forEach(function (checkbox) {

        if (checkbox.checked) {

            let index = parseInt(checkbox.dataset.index);

            let product = cart[index];
            console.log(product);
            console.log("QUANTITY =", product.quantity);

            if (product) {
                total += getPriceNumber(product.price) * (product.quantity || 1);
            }
        }
    });


    let totalPrice = document.getElementById("total-price");

    if (totalPrice) {
        totalPrice.textContent = formatPrice(total);
    }

    return total;
}


/* =========================================================
   THANH TOÁN
   ========================================================= */

function payCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let checkboxes = document.querySelectorAll(".product-check");

    let selectedProducts = [];




    /* Lấy những sản phẩm được chọn */

    checkboxes.forEach(function (checkbox) {

        if (checkbox.checked) {

            let index = parseInt(checkbox.dataset.index);

            let product = cart[index];

            if (product) {
                selectedProducts.push({
                    ...product,
                    cartIndex: index
                });
            }
        }

    });


    /* Không chọn sản phẩm */

    if (selectedProducts.length === 0) {

        alert("Vui lòng chọn sản phẩm muốn thanh toán!");

        return;
    }


    /* Tính lại tổng tiền */

    let total = 0;

    selectedProducts.forEach(function (product) {
        total += getPriceNumber(product.price) * (product.quantity || 1);
    });


    /* Hiển thị sản phẩm */

    let selectedProductsHTML = "";


    selectedProducts.forEach(function (product) {

        selectedProductsHTML += `
            <div class="selected-product">

                <img src="${product.image}" alt="${product.name}">

                <div>
                    <strong>${product.name}</strong>
                    <p>${formatPrice(product.price)}</p>
                    <p>Số lượng: ${product.quantity || 1}</p>
                </div>

            </div>
        `;

    });


    let selectedProductsElement =
        document.getElementById("selected-products");


    if (selectedProductsElement) {

        selectedProductsElement.innerHTML =
            selectedProductsHTML;

    }


    /* Hiển thị tổng tiền */

    let paymentTotal =
        document.getElementById("payment-total");


    if (paymentTotal) {

        paymentTotal.textContent =
            formatPrice(total);

    }


    /* Lưu sản phẩm đang thanh toán */

    localStorage.setItem(
        "selectedProducts",
        JSON.stringify(selectedProducts)
    );


    /* Hiển thị form thanh toán */

    let paymentForm =
        document.getElementById("payment-form");


    if (paymentForm) {

        paymentForm.style.display = "flex";

    }

}

/* =========================================================
   ĐÓNG FORM THANH TOÁN
   ========================================================= */

function closePayment() {

    let paymentForm =
        document.getElementById("payment-form");

    if (paymentForm) {
        paymentForm.style.display = "none";
    }
}


/* =========================================================
   XÁC NHẬN ĐẶT HÀNG
   ========================================================= */
function confirmOrder() {

    /* -------------------------
       LẤY THÔNG TIN KHÁCH HÀNG
       ------------------------- */

    let fullnameElement =
        document.getElementById("fullname");

    let phoneElement =
        document.getElementById("phone");

    let addressElement =
        document.getElementById("address");


    let fullname =
        fullnameElement ? fullnameElement.value.trim() : "";

    let phone =
        phoneElement ? phoneElement.value.trim() : "";

    let address =
        addressElement ? addressElement.value.trim() : "";


    /* -------------------------
       LẤY PHƯƠNG THỨC THANH TOÁN
       ------------------------- */

    let payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    /* -------------------------
       KIỂM TRA HỌ TÊN
       ------------------------- */

    if (fullname === "") {

        alert("Vui lòng nhập họ và tên!");

        return;
    }


    /* -------------------------
       KIỂM TRA SỐ ĐIỆN THOẠI
       ------------------------- */

    if (phone === "") {

        alert("Vui lòng nhập số điện thoại!");

        return;
    }


    /* -------------------------
       KIỂM TRA ĐỊA CHỈ
       ------------------------- */

    if (address === "") {

        alert("Vui lòng nhập địa chỉ nhận hàng!");

        return;
    }


    /* -------------------------
       KIỂM TRA THANH TOÁN
       ------------------------- */

    if (!payment) {

        alert("Vui lòng chọn phương thức thanh toán!");

        return;
    }

    /* =====================================================
   THANH TOÁN COD
   ===================================================== */

   if (payment.value === "COD") {

       let qrPayment =
           document.getElementById("qr-payment");

       if (qrPayment) {

           qrPayment.style.display = "none";

       }  

         let selectedProducts =
            JSON.parse(
            localStorage.getItem("selectedProducts")
       ) || [];


        let order = {

            fullname: fullname,

            phone: phone,

            address: address,

            payment: "Thanh toán khi nhận hàng (COD)",

            products: selectedProducts

        };


        localStorage.setItem(
            "order",
            JSON.stringify(order)
        );


        finishOrder();

            alert("ĐẶT HÀNG THÀNH CÔNG!");

            window.location.href = "invoice.html";

        return;
    }

/* =====================================================
   CHUYỂN KHOẢN NGÂN HÀNG
   ===================================================== */

    if (payment.value === "Bank") {

        let qrPayment =
            document.getElementById("qr-payment");

        if (qrPayment) {

            qrPayment.style.display = "block";

        }

        return;
    }

    }


/* =========================================================
   HOÀN TẤT ĐƠN HÀNG
   ========================================================= */

    function finishOrder() {

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];


        let selectedProducts =
            JSON.parse(
                localStorage.getItem("selectedProducts")
            ) || [];


    /* Lấy index của những sản phẩm đã thanh toán */

        let selectedIndexes =
            selectedProducts.map(function (product) {

                return product.cartIndex;

            });


    /* Xóa sản phẩm đã thanh toán khỏi giỏ */

        cart = cart.filter(function (product, index) {

            return !selectedIndexes.includes(index);

        });


    /* Cập nhật lại giỏ hàng */

        localStorage.setItem(
            "cart",
             JSON.stringify(cart)
        );


    /* Xóa danh sách sản phẩm đang thanh toán */

        localStorage.removeItem("selectedProducts");

    }


/* =========================================================
   HIỂN THỊ LẠI TỔNG TIỀN KHI CHECKBOX THAY ĐỔI
   ========================================================= */

    document.addEventListener("DOMContentLoaded", function () {

        let checkboxes =
            document.querySelectorAll(".product-check");


        checkboxes.forEach(function (checkbox) {

            checkbox.addEventListener(
                "change",
                calculateSelectedTotal
            );

        });


    /* Tính tổng tiền ngay khi mở trang */

        if (checkboxes.length > 0) {

            calculateSelectedTotal();

        }

    });


