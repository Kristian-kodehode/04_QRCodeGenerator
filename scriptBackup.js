"use strict";

/*
=========================
* QR CODE GENERATOR APP *
=========================
*/
const wrapper = document.getElementById("wrapper");
const containerQr = document.getElementById("container-qr");
const inputUrl = document.getElementById("url-input");
const buttonGenerate = document.getElementById("generate-button");
const buttonShare = document.getElementById("share-button");
const resetButton = document.getElementById("reset-button");
const themeModeButton = document.getElementById("thememode");
const themeIcon = document.getElementById("theme-icon");

////////////////////////
// script.js

function slideIn() {
  wrapper.style.opacity = "1";
  wrapper.style.transform = "translateY(0px)"; // Slide the div in from the top
}
document.addEventListener("DOMContentLoaded", slideIn);

////////////////////////

function themeMode() {
  const element = document.body;
  element.classList.toggle("thememode");
  console.log("clickedbody");
  themeModeButton.classList.toggle("thememode");
  console.log("clicked3");
}

////////////////////////
//GENERATE QR CODE
async function generateQRCode() {
  const url = inputUrl.value;
  //Checks if URL is provided and valid
  if (url.trim() === "" || !isValidURL(url)) {
    showError(errorMessages[0], 3000);
    return;
  }

  //API Request
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    url
  )}`;
  try {
    const response = await fetch(apiUrl);
    //Response fetching apiUrl ok / not ok. ok = (Status code 200)
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
  setTimeout(() => {
    resetButton.style.opacity = "1";
  }, 2000);
}

//Validate URL
function isValidURL(url) {
  const urlRegex =
    /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?$/;
  return urlRegex.test(url);
}

//Copy QR Code
function copyQRCode() {
  //Check if QR Code is generated
  if (!containerQr.querySelector("img")) {
    // alert("Please generate a QR Code first");
    showError(errorMessages[1], 3000);
    return;
  }
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

// Error in QR window
const errorMessages = ["Please enter valid URL", "An error occurred"];
function showError(message, duration) {
  var popup = document.getElementById("popup");
  popup.innerText = message;
  popup.style.display = "block";
  setTimeout(function () {
    popup.style.display = "none";
  }, duration);
}

// Reset the program
function resetProgram() {
  containerQr.innerHTML = "";
  inputUrl.value = "";
  buttonShare.style.opacity = "0";
  resetButton.style.display = "none";
}

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
resetButton.addEventListener("click", resetProgram);
themeModeButton.addEventListener("click", themeMode);
////////////////////////
