$("#phone_1").addClass("no-arab");
var input = document.querySelector("#phone_1");
var url2 = "https://ipwhois.pro/json/?key=vNsImsG44zadzFYE";
var xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function (e) {
  if (this.readyState === 4 && this.status !== 429) {
    var formParents = document.querySelectorAll("form");
    var json = JSON.parse(this.responseText);
    var countryCode = json["country_code"];

    user_ip = json.ip;

    ip_form = document.createElement("input");
    ip_form.type = "hidden";
    ip_form.name = "ip_form";
    ip_form.value = user_ip;

    country_form = document.createElement("input");
    country_form.type = "hidden";
    country_form.name = "country_code_footer";
    country_form.value = countryCode;

    if (formParents) {
      Array.prototype.map.call(formParents, function (el) {
        var clone = ip_form.cloneNode(true);
        el.insertBefore(clone, el.lastChild);
        var clone2 = country_form.cloneNode(true);
        el.insertBefore(clone2, el.lastChild);
      });

      console.log("newExecuteMk");
    }

    window.iti = window.intlTelInput(input, {
      initialCountry: countryCode,
      separateDialCode: true,
      autoPlaceholder: "aggressive",
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.18/js/utils.min.js",
    });

    window.iti.promise.then(function () {
      window.executePhoneListener();
      console.log("executePhoneListener");
      //console.log("dontExecutePhoneListener");
    });
  }
});

xhr.open("GET", url2, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();
$(window).on("resize scroll", function () {
  var value = $(this).scrollTop();
  if (value > $(".form-wrapper").height()) {
    $("body").addClass("show-banner");
    $("body").removeClass("animate-form");
  } else {
    $("body").removeClass("show-banner");
    $("body").addClass("animate-form");
  }
});
$(window).scroll();

window.addEventListener("load", function () {
  /** Estimate */

  function formatNumber(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }

  $("#estimate-slider").slider({
    tooltip: "always",
    formatter: function (value) {
      return "$ " + formatNumber(value);
    },
  });

  $("#estimate-slider").on("slide", function (e) {
    $(".card-estimate .card-estimate-result span").html(
      "$ " + formatNumber(e.value * 5.226)
    );
  });

  var recursos = $("<link />", {
    rel: "stylesheet",
    type: "text/css",
    href: "/public/recursos.css",
  });

  var banderas = $("<link />", {
    rel: "stylesheet",
    type: "text/css",
    href: "/public/intlTelInput.min.css",
  });

  $("head").append(recursos);
  $("head").append(banderas);

  $("#mainForm").addClass("needs-validation");
  $('#mainForm').on('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const firstName =  $('#firstname_1');
    const lastName = $('#lastname_1');
    const email = $('#email_1');
    const phoneField = $('#phone_1');
    const codeField = $('.iti__selected-dial-code');

    const a = firstName.val().length > 1;
    const b = lastName.val().length > 1;
    const c = email.hasClass('success_input');
    const d = phoneField.hasClass('success_input');

    if (!a || !b || !c || !d) {
      console.log(a, b, c, d)
      console.log('not all conditions are met');
      this.setTimeout(() => {
        document.querySelector(".loader__overlay_new").classList.add("not-show");
        $(".loader__overlay_new").hide();
        switch(true) {
          case !c:
            emailField.focus();
            break;
          case !d:
            phoneField.focus();
        }
      }, 1000);

      return;
    } 
  
    const phone = `${codeField.text().trim()}${phoneField.val().trim().replaceAll(/[\s-]/ig, '')}`;
    const data = {
      name: firstName.val(),
      lastname: lastName.val(),
      email: email.val(),
      full_number: phone,
    };

    $.ajax({
      type: "POST",
      url: `post.php?subid=${globalSubid}`,
      data,
      success: function (data) {
        if (data.success) {
          fbq("track", "Lead");
          window.location.href = data.success;
        } else if (data.error) {
          document.querySelector(".loader__overlay_new").classList.add("not-show");
          $(".loader__overlay_new").hide();  
          alert(data.error.replace(/<[^>]*>?/gm, ''));
        }
      },
      error: function () {
        console.log('Try again later...');
      },
    });
  })

  /** Goto position */

  if ($(".js-goto-position").length) {
    $(".js-goto-position").click(function () {
      var href = $(this).attr("data-target");
      console.log(href);
      $([document.documentElement, document.body]).animate(
        { scrollTop: $(href).offset().top - 50 },
        500
      );
      return false;
    });
  }

  /** Goto form */

  if ($(".js-goto-form").length) {
    $(".js-goto-form").click(function () {
      $([document.documentElement, document.body]).animate(
        { scrollTop: $("#mainForm").offset().top - 50 },
        600
      );
      $("#firstname_1").focus();
      return false;
    });
  }

  /** Loop over them and prevent submission: */

  var forms = document.getElementsByClassName("needs-validation");

  var validation = Array.prototype.map.call(forms, function (form) {
    form.addEventListener("submit",
      function (event) {
        let formId = form.id;
        // check if name has two words
        let nameContent = document.querySelector(`#${formId} #complete_name`);
        if (nameContent) {
          nameContent = nameContent.value.split(" ");
          if (!(nameContent.length >= 2)) {
            event.preventDefault();
            event.stopPropagation();
            document
              .querySelector(`#${formId} .error_name`)
              .classList.remove("not-show");
            document
              .querySelector(`#${formId} #complete_name`)
              .classList.add("error_name-imput");
            document.querySelector(`#${formId} #complete_name`).focus();
            return;
          } else if (
            !(nameContent[0].length > 0) ||
            !(nameContent[1].length > 0)
          ) {
            event.preventDefault();
            event.stopPropagation();
            document
              .querySelector(`#${formId} .error_name`)
              .classList.remove("not-show");
            document
              .querySelector(`#${formId} #complete_name`)
              .classList.add("error_name-imput");
            document.querySelector(`#${formId} #complete_name`).focus();
            return;
          }
        }

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated"); // Add loader when submitted

        document
          .querySelector(".loader__overlay_new")
          .classList.remove("not-show");

        $(".loader__overlay_new").show();
      },
      false
    );
  });

  // initialize the input autocomplete function of the email input
  if (document.querySelector("#email_1") != null) {
    autocompleteEmail(
      document.querySelector("#email_1"),
      emails_1,
      "en_usd",
      "#mainForm"
    );
    if (document.querySelector("#modalForm") != null) {
      autocompleteEmail(
        document.querySelector("#email_2"),
        emails_2,
        "en_usd",
        "#modalForm"
      );
    }
  }
});

/*** END LOAD */

/*** Phone Validation start */

const executePhoneListener = () => {
  // on blur: validate
  input.addEventListener("blur", validatePhone);

  // on keyup / change flag: reset
  input.addEventListener("keyup", (e) => {
    if (e.key != "Backspace") {
      validatePhone();
    } else {
      validationFeedback();
    }
  });

  if (nameField) nameField.addEventListener("keyup", nameFieldValidation);

  if (lastnameField)
    lastnameField.addEventListener("keyup", lastnameFieldValidation);

  if (completeName)
    completeName.addEventListener("keyup", completenameFieldValidation);

  autocomplet.addEventListener("click", emailFieldValidation);

  emailField.addEventListener("keyup", emailFieldValidation);
};

window.executePhoneListener = executePhoneListener;

/*** Phone Validation end */

const completeEmails = {
  it: ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"],
  es_eur: ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"],
  es_usd: ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"],
  en_usd: ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"],
  en_uk: ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"],
  nl: ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"],
};

let emails_1 = [];
let emails_2 = [];

const createEmailsArray = (lang) => {
  const e = [];
  completeEmails[lang].forEach((el) => {
    e.push(el);
  });
  return e;
};

const autocompleteEmail = (inp, emails, lang, form) => {
  let suggestionsContainer = document.querySelector(
    `${form} .autocomplete__items`
  );
  emails = createEmailsArray(lang);
  let suggestionsHtml = "";
  let divs = "";
  let filteredEmails = [];
  let focusElement = -1;

  inp.addEventListener("input", function (el) {
    let val = inp.value;
    closeAllLists();
    // if (!val) return false;
    if (el.data === "@") {
      filteredEmails = emails;
      focusElement = -1;
      // creo el placeholder
      suggestionsHtml = createPlaceholder(inp, filteredEmails);
      // lo inserto en el dom
      suggestionsContainer.innerHTML = suggestionsHtml;
      //creo event listeners para cada
      divs = document.querySelectorAll(`${form} .autocomplete__items div`);
      createDivsListeners();
      // aaply listeners for keyboard
      inp.addEventListener("keydown", keyDownListeners);
    } else if (val.indexOf("@") != -1) {
      let start = val.substr(val.indexOf("@") + 1);
      filteredEmails = emails.filter(
        (el) => el.substr(0, start.length) == start
      );
      focusElement = -1;
      // creo el placeholder
      suggestionsHtml = createPlaceholder(inp, filteredEmails);
      // lo inserto en el dom
      suggestionsContainer.innerHTML = suggestionsHtml;
      //creo event listeners para cada
      divs = document.querySelectorAll(`${form} .autocomplete__items div`);
      createDivsListeners();
      // aaply listeners for keyboard
      inp.addEventListener("keydown", keyDownListeners);
    }
  });

  const keyDownListeners = (event) => {
    if (event.keyCode == 40) {
      // down
      focusElement++;
      updateDivFocus();
      event.preventDefault();
    } else if (event.keyCode == 38) {
      // up
      focusElement--;
      updateDivFocus();
      event.preventDefault();
    } else if (event.keyCode == 13) {
      // enter
      event.preventDefault();
      if (focusElement < 0) return;
      let finnalContent =
        inp.value.substr(0, inp.value.indexOf("@") + 1) +
        filteredEmails[focusElement];
      inp.value = finnalContent;
      closeAllLists();
    } else if (event.keyCode == 9) {
      closeAllLists();
    }
  };

  const updateDivFocus = () => {
    divs.forEach((el) => {
      el.classList.contains("autocomplete-active")
        ? el.classList.remove("autocomplete-active")
        : "";
    });
    if (focusElement >= divs.length) {
      focusElement = 0;
    } else if (focusElement < 0) {
      focusElement = divs.length - 1;
    }
    divs[focusElement].classList.add("autocomplete-active");
  };

  const closeAllLists = () => {
    focusElement = -1;
    divs = "";
    suggestionsContainer.innerHTML = "";
    inp.removeEventListener("keydown", keyDownListeners);
  };

  const createPlaceholder = (inp, emails) => {
    let innerContent = "";
    let value = inp.value.substr(0, inp.value.indexOf("@") + 1);
    emails.forEach((el) => {
      innerContent += `<div id="item_${emails.indexOf(
        el
      )}" class="">${value}${el}</div>`;
    });
    return innerContent;
  };

  const createDivsListeners = () => {
    let finnalContent = "";
    divs.forEach((el) => {
      el.addEventListener("click", (event) => {
        finnalContent = event.target.innerHTML;
        inp.value = finnalContent;
        closeAllLists();
      });
    });
  };
};

// iti execution
var iti;
var input = document.querySelector("#phone_1");

var errorMsg = document.querySelector("#error-msg");
var validMsg = document.querySelector("#valid-msg");

/*nuevo*/

$("#phone_1").attr("required", true);
$("#email_1").attr("required", true);
$("#lastname_1").attr("required", true);
$("#firstname_1").attr("required", true);

$("#phone_1").attr("name", "Phone_1");
$("#email_1").attr("name", "Email_1");
$("#lastname_1").attr("name", "LastName_1");
$("#firstname_1").attr("name", "FirstName_1");
$('#mainForm input[type="email"]').attr("name", "Email_1");
$('#mainForm input[type="tel"]').attr("name", "Phone_1");

var languageInput = document.querySelector('input[name="language"]');
var languageValue = languageInput.value;
if (languageValue == "es") {
  var errorMap = "Este número de teléfono es incorrecto o falta un número";
  var loader_title = "Espere mientras procesamos sus datos.";
  var loader_text = "Este proceso puede demorar unos segundos.";
  $("#mainForm").attr("dir", "ltr");
} /*ES*/
if (languageValue == "en") {
  var errorMap = "This telephone number is incorrect or missing digits.";
  var loader_title = "Please wait while we process your data.";
  var loader_text = "This process may take a few seconds";
  $("#mainForm").attr("dir", "ltr");
} /*EN*/
if (languageValue == "pt") {
  var errorMap = "Este número de telefone está incorreto ou falta um número";
  var loader_title = "Por favor aguarde enquanto processamos os seus dados.";
  var loader_text = "Este processo pode demorar alguns segundos.";
  $("#mainForm").attr("dir", "ltr");
} /*PT*/
if (languageValue == "fr") {
  var errorMap =
    "Ce numéro de téléphone est incorrect ou il manque des chiffres.";
  var loader_title =
    "Veuillez patienter pendant que nous traitons vos données.";
  var loader_text = "Ce processus peut prendre quelques secondes.";
  $("#mainForm").attr("dir", "ltr");
} /*FR*/
if (languageValue == "nl") {
  var errorMap = "Dit telefoonnummer is onjuist of er ontbreekt een nummer";
  var loader_title = "Even geduld a.u.b. terwijl wij uw gegevens verwerken.";
  var loader_text = "Dit proces kan enkele seconden duren.";
  $("#mainForm").attr("dir", "ltr");
} /*NL*/
if (languageValue == "de" || languageValue == "ch" || languageValue == "at") {
  var errorMap = "Diese Telefonnummer ist falsch oder es fehlt eine Nummer";
  var loader_title = "Bitte warten Sie, während wir Ihre Daten verarbeiten.";
  var loader_text = "Dieser Vorgang kann einige Sekunden dauern.";
  $("#mainForm").attr("dir", "ltr");
} /*DE - CH - AT*/
if (languageValue == "no") {
  var errorMap = "Dette telefonnummeret er feil eller et nummer mangler";
  var loader_title = "Vennligst vent mens vi behandler dataene dine.";
  var loader_text = "Denne prosessen kan ta noen sekunder.";
  $("#mainForm").attr("dir", "ltr");
} /*NO*/
if (languageValue == "it") {
  var errorMap =
    "Questo numero di telefono non è corretto oppure manca un numero";
  var loader_title = "Per favore, aspetti mentre processiamo i suoi dati.";
  var loader_text = "Questo processo potrebbe durare alcuni secondi.";
  $("#mainForm").attr("dir", "ltr");
} /*IT*/
if (languageValue == "ar") {
  var errorMap = "رقم الهاتف هذا غير صحيح أو رقم مفقود";
  $("#phone_1").removeClass("no-arab");
  $("#phone_1").addClass("arab");
  var loader_title = "الرجاء الانتظار ريثما تتم معالجة بياناتك.";
  var loader_text = "قد يستغرق الأمر ثوان معدودة";
  $("#mainForm").attr("dir", "rtl");
} /*AR*/

if (languageValue == "pl") {
  var errorMap =
    "Ten numer telefonu jest nieprawidłowy lub brakuje w nim cyfr.";
  var loader_title = "Poczekaj, aż przetworzymy Twoje dane.";
  var loader_text = "Ten proces może potrwać kilka sekund";
  $("#mainForm").attr("dir", "ltr");
} /*PL*/

var loader_new =
  '<section class="s-loader_new loader__overlay_new not-show" style="display:none!important;"><div class="loader_new"><div class="loader__card_new"><div class="loader__icon_new text-center_new p-4_new"><div class="spinner-border_new" role="status"><span class="sr-only"></span></div><h3 class="loader__title_new">' +
  loader_title +
  '</h3><p class="loader__text_new">' +
  loader_text +
  "</p></div></div></div></section>";
document.body.insertAdjacentHTML("afterbegin", loader_new);

/*test*/

console.log("El idioma esta configurado en: " + languageValue);

if ($("#mainForm").length) {
  console.log('El input con ID "mainForm" existe.');
} else {
  alert('El input con ID "mainForm" NO EXISTE');
}

if ($("#firstname_1").length) {
  console.log('El input con ID "firstname_1" existe.');
} else {
  alert('El input con ID "firstname_1" NO EXISTE');
}

if ($('input[name="FirstName_1"]').length) {
  console.log('El input con name "FirstName_1" existe.');
} else {
  alert('El input con NAME "FirstName_1" NO EXISTE');
}

if ($("#lastname_1").length) {
  console.log('El input con ID "lastname_1" existe.');
} else {
  alert('El input con ID "lastname_1" NO EXISTE');
}

if ($('input[name="LastName_1"]').length) {
  console.log('El input con name "LastName_1" existe.');
} else {
  alert('El input con NAME "LastName_1" NO EXISTE');
}

if ($("#email_1").length) {
  console.log('El input con ID "email_1" existe.');
} else {
  alert('El input con ID "email_1" NO EXISTE');
}

if ($('input[name="Email_1"]').length) {
  console.log('El input con name "Email_1" existe.');
} else {
  alert('El input con NAME "Email_1" NO EXISTE');
}

if ($("#phone_1").length) {
  console.log('El input con ID "phone_1" existe.');
} else {
  alert('El input con ID "phone_1" NO EXISTE');
}

if ($('input[name="Phone_1"]').length) {
  console.log('El input con name "Phone_1" existe.');
} else {
  alert('El input con NAME "Phone_1" NO EXISTE');
}

/*nuevo*/

//formating
var format = document.getElementById("phone_1").placeholder;

// initialise plugin
var reset = function () {
  input.classList.remove("error");
  errorMsg.innerHTML = "";
  errorMsg.classList.add("d-none");
  validMsg.classList.add("d-none");
  input.classList.remove("success_input");
  input.classList.remove("error_input");
};

var validateFormat = function () {
  format = document.getElementById("phone_1").placeholder;

  var separator = " ";
  if (format.includes("-")) {
    separator = "-";
  }

  var position1 = format.indexOf(separator);
  var position2 = format.indexOf(separator, position1 + 1);
  var position3 = format.indexOf(separator, position2 + 1);

  if (
    input.value.length === position1 ||
    input.value.length === position2 ||
    input.value.length === position3
  ) {
    input.value += separator;
  }
};

var validationFeedback = function () {
  reset();
  if (typeof iti === "undefined") {
    iti = window.iti;
  }
  if (input.value.length >= 1) {
    if (input.value.trim()) {
      if (iti.isValidNumber()) {
        validMsg.classList.remove("d-none");
        input.classList.add("success_input");
        input.setAttribute("maxlength", format.length);
        $("#mainForm").find("button").prop("disabled", false);
        $("#mainForm :submit").find("button").prop("disabled", false);
        return true;
      } else {
        input.classList.add("error");
        $("#mainForm").find("button").prop("disabled", true);
        $("#mainForm :submit").find("button").prop("disabled", true);
        errorMsg.innerHTML = errorMap;
        errorMsg.classList.remove("d-none");
        input.classList.add("error_input");
        if (input.value.length < format.length) {
          input.removeAttribute("maxlength");
        } else {
          input.setAttribute("maxlength", format.length);
        }
        return false;
      }
    }
  }
};

var validatePhone = function () {
  reset();

  validateFormat();
  validationFeedback();
};

/************* phone events  */

// Name and Last name validation
var nameField = document.querySelector("#firstname_1");
var lastnameField = document.querySelector("#lastname_1");
var completeName = document.querySelector("#complete_name");

var nameFieldValidation = function () {
  //alert(nameField.value.length);
  if (nameField.value.length > 1) {
    nameField.classList.remove("error_input");
    nameField.classList.add("success_input");
    return true;
  } else {
    nameField.classList.remove("success_input");
    nameField.classList.add("error_input");
    return false;
  }
};
var lastnameFieldValidation = function (type) {
  if (lastnameField.value.length > 1) {
    lastnameField.classList.remove("error_input");
    lastnameField.classList.add("success_input");
    return true;
  } else {
    lastnameField.classList.remove("success_input");
    lastnameField.classList.add("error_input");
    return false;
  }
};
var completenameFieldValidation = function () {
  nameContent = completeName.value.split(" ");
  if (!(nameContent.length >= 2)) {
    completeName.classList.remove("success_input");
    completeName.classList.add("error_input");
    return false;
  } else if (!(nameContent[0].length > 0) || !(nameContent[1].length > 0)) {
    completeName.classList.remove("error_input");
    completeName.classList.add("success_input");
    return true;
  }
};

var emailField = document.querySelector("#email_1");
var autocomplet = document.querySelector(".autocomplete__items");
var phoneField = document.querySelector('#phone_1');

var emailFieldValidation = function () {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailField.value.match(mailformat)) {
    emailField.classList.remove("error_input");
    emailField.classList.add("success_input");
    return true;
  } else {
    emailField.classList.add("error_input");
    emailField.classList.remove("success_input");
    return false;
  }
};

const emailFinalValidation = function () {
  if (!emailField.classList.contains('success_input')) {
    return;
  }
  fetch(`ve.php?e=${encodeURIComponent(emailField.value)}`)
    .then(async (data) => {
      if (data.status >= 300) throw new Error(data.statusMessage);
      const result = await data.text();
      if (result === 'fail') {
        emailField.classList.add("error_input");
        emailField.classList.remove("success_input");
      }
    })
    .catch((err) => {
      alert(err);
    })
}

const phoneFinalValidation = function () {
  var codeField = document.querySelector('.iti__selected-dial-code');

  if (!phoneField.classList.contains('success_input')) {
    return;
  }

  const phone = `${codeField.innerText.trim()}${phoneField.value.trim().replaceAll(/\s-/ig, '')}`;

  fetch(`ve.php?p=${encodeURIComponent(phone)}`)
    .then(async (data) => {
      if (data.status >= 300) throw new Error(data.statusMessage);
      const result = await data.text();
      if (result === 'fail') {
        phoneField.classList.add("error_input");
        phoneField.classList.remove("success_input");
      }
    })
    .catch((err) => {
      alert(err);
    })
}

autocomplet.addEventListener("click", emailFieldValidation);
emailField.addEventListener("keyup", emailFieldValidation);
emailField.addEventListener('focusout', emailFinalValidation);
phoneField.addEventListener('focusout', phoneFinalValidation);

// input does not accept letters
document.getElementById("phone_1").onkeypress = function (evt) {
  var ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
};
