(function () {
  var externalId = "external_id";
  var external_id = "";
  var externalsIds = {
    ob_click_id: externalId,
    gclid: externalId,
    fbclid: externalId,
    cid: externalId,
    msclkid: externalId,
    twclid: externalId,
    spcid: externalId,
    vmcid: externalId,
    ttclid: externalId,
    click_id: externalId,
    bid_id: externalId,
    external_id: externalId,
  };
  var url = document.URL;
  if (!document.querySelector("input[id='external_id']")) {
    if (external_id == "") {
      for (var key in externalsIds) {
        if (url.includes(key)) {
          var value = urlParams(key);
          console.log(value);
          if (value != "{{fbclid}}" || value != "" || value != "%7B%7Bfbclid%7D%7D") {
            // console.log("Entered on key: ");
            // console.log(key);
            external_id = urlParams(key);
            // console.log(external_id);
            break;
          }
        }
      }
    }
  }

  // check if facebook external id was replaced. If not, looks for facebook old external id key
  var fbclidparams = urlParams("fbclid");
  var external_id = urlParams("external_id");

  if ((external_id == "" || external_id == "%7B%7Bfbclid%7D%7D" || external_id == "{{fbclid}}") && (fbclidparams != "" || fbclidparams != "{{fbclid}}")) {
    external_id = fbclidparams;
  } else {
    external_id = external_id;
  }

  var formParents = document.querySelectorAll("form");

  var externalIdInput = document.createElement("input");
  externalIdInput.setAttribute("type", "hidden");
  externalIdInput.setAttribute("id", "external_id");
  externalIdInput.setAttribute("name", "external_id");
  externalIdInput.setAttribute("value", external_id);

  var subidInput = document.createElement("input");
  subidInput.setAttribute("type", "hidden");
  subidInput.setAttribute("id", "subid");
  subidInput.setAttribute("name", "subid");
  const urlParams2 = new URLSearchParams(window.location.search);
  const subid = urlParams2.get("subid");
  const s5 = urlParams2.get("s5");
  if (subid != null) {
    subidInput.setAttribute("value", subid);
  } else {
    subidInput.setAttribute("value", s5);
  }

  let referrerInput = document.querySelector("input[name='referrer']");
  var url2 = window.location.href;
  var insertReferrer = false;
  if (referrerInput != null) {
    referrerInput.value = url2;
  } else {
    referrerInput = document.createElement("input");
    referrerInput.type = "hidden";
    referrerInput.name = "referrer";
    referrerInput.value = url;
    insertReferrer = true;
  }

  if (formParents) {
    Array.prototype.map.call(formParents, function (el) {
      var clone = externalIdInput.cloneNode(true);
      el.insertBefore(clone, el.lastChild);
      var clone2 = subidInput.cloneNode(true);
      el.insertBefore(clone2, el.lastChild);
      if (insertReferrer) {
        var clone3 = referrerInput.cloneNode(true);
        el.insertBefore(clone3, el.lastChild);
      }
    });
    setTimeout(function () {
      cid();
    }, 2000);
  }

  function cid() {
    // obtain click id, or generate one
    var h = "";
    var collectionHitId = document.querySelectorAll("input[name=hitid]");

    try {
      h = window.clickflare.tracking_params.click_id;
      Array.prototype.map.call(collectionHitId, function (el) {
        el.value = h;
      });
      // console.log("uno");
    } catch (error) {
      // console.log("dos");
      const urlParams3 = new URLSearchParams(window.location.search);
      const cf_click_id_url = urlParams3.get("s2");
      if (cf_click_id_url != null) {
        console.log(cf_click_id_url);
        // console.log("tre");
        h = cf_click_id_url;
      } else {
        // console.log("cuatro");
        h = Date.now();
        h = h.toString().split("");
        h.unshift("C-");
        h = h.join("");
      }
    }
    Array.prototype.map.call(collectionHitId, function (el) {
      el.value = h;
    });
  }

  function urlParams(x) {
    if (url.includes(x + "=")) {
      let str = url.split(x + "=");
      let params;
      if (str[1].includes("&")) {
        params = str[1].split("&")[0];
      } else {
        params = str[1];
      }
      return params;
    } else {
      return "";
    }
  }
})();
