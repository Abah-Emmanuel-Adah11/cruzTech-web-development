// This function collects all invoice information from a webpage form
function getValue() {
    // Create an empty object to store all invoice details
    const invoice = {};

    // === 1. Collect initial invoice information ===

    // Get the issued number from the input field and save it
    let issued_number = document.getElementById("issued-number").value;
    invoice.issued_number = issued_number;

    // Get the issued date from the input field and save it
    let issued_date = document.getElementById("issued-date").value;
    invoice.issued_date = issued_date;

    // Get the customer's ID from the input field and save it
    let customers_id = document.getElementById("customers-id").value;
    invoice.customers_id = customers_id;

    // === 2. Collect financial summary information ===

    // Get the subtotal value
    let sub_total = document.getElementById("subtotal").value;
    invoice.sub_total = sub_total;

    // Get the discount value
    let discount = document.getElementById("discount").value;
    invoice.discount = discount;

    // Get the VAT (Value Added Tax) value
    let vat  = document.getElementById("vat").value;
    invoice.vat = vat;

    // Get the service charge value
    let service_charge = document.getElementById("service-charge").value;
    invoice.service_charge = service_charge;

    // Get the grand total value
    let grand_total = document.getElementById("grand-total").value;
    invoice.grand_total = grand_total;

    // === 3. Collect the list of products/services ===

    const items = []; // Initialize an empty list to hold each product/service

    // Loop through up to 10 possible product entries
    for (let i = 0; i < 10; i++) {
        // Find each invoice item (like product description, quantity, price, etc.)
        let invoice_item = document.querySelectorAll(".invoice_item")[i];

        // If the product description field is empty, skip this item
        if (invoice_item.children[1].lastChild.value.length < 1) {
            continue;
        }

        // Create an object to store this product's details
        const item = {};
        item.product_description = invoice_item.children[1].lastChild.value;
        item.unit_price = invoice_item.children[2].lastChild.value;
        item.quantity = invoice_item.children[3].lastChild.value;
        item.total = invoice_item.children[4].lastChild.value;

        // Add this product to the list
        items.push(item);
    }

    // Save the list of items into the invoice
    invoice.items = items;

    // === 4. Generate and display the final invoice ===

    // Create the final HTML content by passing the invoice details to the generateOutput function
    const outputHTML = generateOutput(invoice);

    // Open a new browser window/tab
    const outputWidow = window.open('', '_blank');
    if (outputWidow) {
        // If the new window/tab opened successfully
        outputWidow.document.open();
        outputWidow.document.write(outputHTML); // Write the invoice HTML into the window
        outputWidow.document.close();
        
        // Change the URL in the new tab (even though it stays on the same page)
        outputWidow.history.replaceState(null, '', './output.html');

        outputWidow.onload = function() {
            // You could add code here to run after the page fully loads
        }
    } else {
        // If the new window could not open, just write directly to the current document
        document.write(outputHTML);
        outputWidow.history.replaceState(null, '', './output.html');
    }
};

// This function creates the full HTML content for the invoice
function generateOutput(invoice) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>invoice_output</title>

    <!-- Include Bootstrap for styling -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Icon shown on the browser tab -->
    <link rel="icon" href="images/Cruz_logo.jpg">

    <!-- Custom styles for the invoice -->
    <link rel="stylesheet" type="text/css" href="output.css">
</head>
<body>

    <!-- Invoice heading with logo and issued details -->
    <section id="heading" class="container-fluid">
        <div class="row">
            <div class="top-heading col-lg-12 col-md-12 col-sm-12">
                <span>
                    <img src="images/Cruz_logo.jpg" alt="Cruz_logo">
                </span>
                <ul class="heading-list">
                    <li><h1>INVOICE</h1></li>
                    <li>Issued Number: INV202504${invoice.issued_number}</li>
                    <li>Issued Date: ${invoice.issued_date}</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Stakeholders: Invoice to (Customer) and Invoice from (Your Company) -->
    <section id="stakeholders">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="sender">
                    <p>Invoice To: ${invoice.customers_id}</p> 
                </div>
                <div class="reciever">
                    <p>Invoice From:</p>
                    <h2>Cruz tech,</h2>
                    <p> Suit G10, Pathfied Mall, <br> 4th Avenue, Gwarinpa <br> Abuja, Nigeria.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Product listing section with table -->
    <section id="product-list">
        <div class="table-container">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>PRODUCT DESCRIPTION</th>
                        <th>UNIT PRICE</th>
                        <th>QUANTITY</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                ${
                  invoice.items ? invoice.items.map((item, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.product_description}</td>
                        <td>${item.unit_price}</td>
                        <td>${item.quantity}</td>
                        <td class="last-column">${item.total}</td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="5">No items</td></tr>
                  `
                }
                </tbody>
            </table> 
        </div>

        <!-- Display subtotal, discount, VAT, service charge, and total -->
        <ul class="total total-heading">
            <li><b>SUBTOTAL:</b><br>${invoice.sub_total}</li>
            <li><b>DISCOUNT:</b><br>${invoice.discount}</li>
            <li><b>VAT:</b><br>${invoice.vat}</li>
            <li><b>SERVICE CHARGE:</b><br>${invoice.service_charge}</li>
            <li><b>TOTAL DUE:</b><br>${invoice.grand_total}</li>
        </ul>
    </section>

    <!-- Payment method details -->
    <section id="payment">
        <div class="row">
            <div class="payment-div col-lg-12 col-md-12 offset-md-0">
                <h3>Payment Method:</h3>
                <ul class="recipient">
                    <li><b>Account No:</b> 0602285440</li>
                    <li><b>Account Name:</b> Cruiztopia integrated services Ltd</li>
                    <li><b>Bank:</b> GTB</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Terms and conditions section -->
    <section id="terms">
        <div>
            <h3><b>Terms & Conditions</b></h3>
            <p>Please settle the invoice by paying into the account number provided. Kindly share the payment receipt with us upon completion.</p>  
        </div>
    </section>

    <!-- Appreciation note -->
    <section id="appreciation">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12">
                <h2><span class="break-after">Thanks For Your</span> <span class="break-after">Patronage</span></h2>
                <p class="signature">&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;<br>
                    Authorized Signature</p>
            </div>
        </div>
    </section>

    <!-- Footer section with contact information -->
    <section id="footer">
        <div class="row">
            <div class="col-lg-12 col-md-5 col-sm-5 clip1">
                <h3>Contact US:</h3>
                <p>+2349065465539</p>
                <p>www.cruztech.com.ng</p>
                <p>Cruztechnologies1@gmail.com</p>
                <p>Suit G10, Pathfied Mall, 4th Avenue, Gwarinpa Abuja, Nigeria</p>
            </div>
        </div>    
    </section>

    <!-- Bootstrap JavaScript bundle for interactive elements -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./index.js" charset="UTF-8"></script>
</body>
</html>
    `;
}

// ✅ Summary:

// getValue() collects information from a form and opens a new page showing the invoice.

// generateOutput(invoice) creates the actual HTML page that will be shown.