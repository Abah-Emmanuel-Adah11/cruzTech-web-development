    const invoice = {
      issued_number: "001",
      issued_date: "2025-06-09",
      customers_id: "John Doe",
      items: [
        { product_description: "Laptop", unit_price: "$1000", quantity: 1, total: "$1000" },
        { product_description: "Mouse", unit_price: "$50", quantity: 2, total: "$100" }
      ],
      sub_total: "$1100",
      discount: "$100",
      grand_total: "$1000"
    };

//   function generatePdf(invoice) {
// return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Print invoice</title>

//     <!-- Bootstrap style sheet CDN -->
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

//     <!-- link to the icon to be displayed on the browser tab -->
//     <link rel="icon" href="images/Cruz_logo.jpg">

//     <!-- link to the stylesheet -->
//     <link rel="stylesheet" type="text/css" href="output.css">
// </head>
// <body>
//     <div class= "invoice-container">
//         <section id="heading">
//           <div class="row">
//             <div class="top-heading col-12">
//               <span>
//                 <img src="images/Cruz_logo.jpg" alt="Logo" width="80" />
//               </span>
//               <ul class="heading-list">
//                 <li><h1>INVOICE</h1></li>
//                 <li>Issued Number: INV202504${invoice.issued_number}</li>
//                 <li>Issued Date: ${invoice.issued_date}</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         <section id="stakeholders" class="my-3">
//           <div class="row">
//             <div class="col-12 d-flex justify-content-between">
//               <div class="sender">
//                 <p><strong>Invoice To:</strong><br>${invoice.customers_id}</p> 
//               </div>
//               <div class="receiver text-end">
//                 <p><strong>Invoice From:</strong></p>
//                 <h5>Cruz Tech</h5>
//                 <p>Suit G10, Pathfied Mall,<br>4th Avenue, Gwarinpa<br>Abuja, Nigeria.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section id="product-list">
//           <table class="table-class w-100">
//             <thead>
//               <tr>
//                 <th>No</th>
//                 <th>Description</th>
//                 <th>Unit Price</th>
//                 <th>Qty</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${invoice.items.map((item, i) => `
//                 <tr>
//                   <td>${i + 1}</td>
//                   <td>${item.product_description}</td>
//                   <td>${item.unit_price}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.total}</td>
//                 </tr>`).join('')}
//             </tbody>
//           </table>

//           <ul class="total mt-3">
//             <li><b>Subtotal:</b> ${invoice.sub_total}</li>
//             <li><b>Discount:</b> ${invoice.discount}</li>
//             <li><b>Total Due:</b> ${invoice.grand_total}</li>
//           </ul>
//         </section>
//         <section id="footer" class="mt-4">
//           <ul class="footer-list">
//             <li>+2349065465539</li>
//             <li>www.cruztech.com.ng</li>
//             <li>Cruztechnologies1@gmail.com</li>
//             <li>Pathfied Mall, Gwarinpa Abuja</li>
//           </ul>
//         </section>

//     </div>

// </body>
// </html>
//       `;
//     }

    async function downloadInvoicePDF() {
      const container = document.getElementById('invoice-container');
    //   container.innerHTML = generatePdf(invoice);
      container.style.display = 'block';

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice.issued_number}.pdf`);

      container.style.display = 'none';
    }

    console.log('start')
    downloadInvoicePDF()
    // document.onload(downloadInvoicePDF())
    console.log('end')