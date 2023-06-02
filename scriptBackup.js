"use strict";

/*
=========================
* QR CODE GENERATOR APP *
=========================
*/

////////////////////////
//HTML ELEMENTS
const containerQr = document.getElementById("container-qr");
const inputUrl = document.getElementById("url-input");
const buttonGenerate = document.getElementById("generate-button");
const buttonShare = document.getElementById("share-button");
////////////////////////

/*
ISSUE!!!!
VIRKER IKKE PÅ SAFARI Å COPY QR CODE BUTTON!
CHATGPT hadde et svar.
*/

////////////////////////
//GENERATE QR CODE
async function generateQRCode() {
  const url = inputUrl.value;

  //Checks if URL is provided and valid
  if (url.trim() === "" || !isValidURL(url)) {
    showError(errorMessages[0], 3000);
    return;
  }

  //Make API request to generate the QR code
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    url
  )}`;

  try {
    //Fetch the QR Code image data
    const response = await fetch(apiUrl);
    //First checks if response of fetching apiUrl is (not) successfull (Status code 200)
    if (!response.ok) {
      throw new Error("Failed to generate QR Code");
    }

    //Convert the response data to blob
    const blob = await response.blob();

    //Create object URL from the blob
    const imageUrl = URL.createObjectURL(blob);

    //Clear previous QR code if any
    containerQr.textContent = "";

    //Create new image element to display QR Code
    const imageQRCode = document.createElement("img");
    imageQRCode.src = imageUrl;

    //Append QR image to the containerQR
    containerQr.appendChild(imageQRCode);
  } catch (error) {
    console.log("Failed to generate QR Code: ", error);
    alert("Failed to generate QR Code. Please try again.");
  }
}
////////////////////////

////////////////////////
//Function to validate URL from input value
function isValidURL(url) {
  const urlRegex =
    /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?$/;
  return urlRegex.test(url);
}
////////////////////////

////////////////////////
//Function to copy QR Code to the clipboard
function copyQRCode() {
  //Check if QR Code is generated
  if (!containerQr.querySelector("img")) {
    // alert("Please generate a QR Code first");
    showError(errorMessages[1], 3000);
    return;
  }

  // Get the QR code image source
  const qrCodeSource = containerQr.querySelector("img").src;

  //Use the Clipboard API to copy the QR code image source to the clipboard
  navigator.clipboard
    .writeText(qrCodeSource)
    .then(() => {
      // Show a success message
      alert("QR Code copied to clipboard!");
    })
    .catch((error) => {
      // Show an error message
      console.error("Failed to copy QR Code to clipboard:", error);
    });
}
////////////////////////

/*
Kanskje du kan lage en array med et par 
messages, og bruke arrayet som parameter
i showError function nedenfor)
*/

const errorMessages = ["Please enter valid URL", "An error occurred"];
////////////////////////
//Error Messages (Functions)
function showError(message, duration) {
  var popup = document.getElementById("popup");
  popup.innerText = message;
  popup.style.display = "block";

  setTimeout(function () {
    popup.style.display = "none";
  }, duration);
}
////////////////////////

////////////////////////
//EVENT HANDLERS
buttonGenerate.addEventListener("click", async (event) => {
  await generateQRCode();
  if (containerQr.querySelector("img")) {
    setTimeout(() => {
      buttonShare.style.opacity = "1";
    }, 1000);
  }
});
buttonShare.addEventListener("click", copyQRCode);
////////////////////////
