"use strict";

////////////////////////
//HTML ELEMENTS
const containerQr = document.getElementById("container-qr");
const inputUrl = document.getElementById("url-input");
const buttonGenerate = document.getElementById("generate-button");
const buttonShare = document.getElementById("share-button");
////////////////////////

////////////////////////
//GENERATE QR CODE
function generateQRCode() {
  const url = inputUrl.value;

  //Checks if URL is provided
  if (url.trim() === "" || !isValidURL(url)) {
    alert("Please enter valid URL");
    return;
  }

  //Make API request to generate the QR code
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    url
  )}`;

  //Clear previous QR code if any
  containerQr.textContent = "";

  //Create new image element to display QR Code
  const imageQRCode = document.createElement("img");
  imageQRCode.src = apiUrl;

  //Append QR image to the containerQR
  containerQr.appendChild(imageQRCode);
}
////////////////////////

////////////////////////
//Function to validate URL
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
    alert("Please generate a QR Code first");
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

////////////////////////
//EVENT HANDLERS
buttonGenerate.addEventListener("click", generateQRCode);
buttonShare.addEventListener("click", copyQRCode);
////////////////////////
