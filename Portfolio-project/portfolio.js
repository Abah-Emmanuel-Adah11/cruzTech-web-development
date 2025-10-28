var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for(tablink of tablinks){
        tablink.classList.remove("active-link")
    };

    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab")
    };

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
};

var sidemenu = document.getElementById("sidemenu");

function openmenu() {
    sidemenu.style.right = "0"; /* At this point the inline style will over ride whatever is coded in
                                    the external css with respect to the "ul" which has an id of "sidemenu" */ 
};

function closemenu() {
    sidemenu.style.right = "-200px"; /* At this point the inline style will over ride whatever is coded in 
                                        the external css with respect to the "ul" which has an id of "sidemenu" */
};



// script for the form associated with the google sheet

  const scriptURL = 'https://script.google.com/macros/s/AKfycby9NYnoxsk6mwJoFxmykosykrtwnyTOJfzsbTBpRyGQUr7bgu8uE6zsSMdNWBnXIcJb/exec'
  const form = document.forms['submit-to-google-sheet']
  const msg = document.getElementById("msg")

  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})

      .then(response => {
        msg.innerHTML = "Message sent successfully!" // change the inner HTML to "Message sent successfully"
        setTimeout(function() {
            msg.innerHTML = ""
        },5000) // disappears success message after 5 seconds

        form.reset() // To reset the form input feid
      })
      .catch(error => console.error('Error!', error.message))
  });