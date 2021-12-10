// import { createModalContent } from './lighbox.js';

export async function loadImagesPage(page) {
    const imagePage = document.createElement("div");
    imagePage.id = "pictures-page"
    imagePage.classList.add("page");

    imagePage.appendChild(loadLogo());

    const details = await getUserImages();

    const gallery = createGallery(details);
    imagePage.appendChild(gallery);

    const modal = initializeModal();
    imagePage.appendChild(modal);

    page.appendChild(imagePage);
}

function loadLogo() {
  const logo = document.createElement("img");
  logo.classList.add("photo-image");
  logo.src = "./images/pictures_logo.png";
  logo.alt = "logo";
  logo.id = "picture-page-logo";

  return logo;
}

function createGallery(details) {
  const gallery = document.createElement("div");
  gallery.classList.add("container", "gallery-container");
  gallery.appendChild(createGalleryRow(details));

  return gallery;
}

function createGalleryRow(details) {
  const row = document.createElement("div");
  row.id = "gallery-row";
  row.classList.add("row");

  let numColumns = details.length;
  if (numColumns > 4) { // Truncate to 4 columns if more than 4 images
    numColumns = 4;
  }

  for (let i = 0; i < numColumns; i++) {
    row.appendChild(createGalleryColumn(details));
  }

  for (let i = 0; i < details.length; i++) {
    row.childNodes[i % numColumns].appendChild(loadImage(details[i]), i);
  }

  return row;
}

function createGalleryColumn(details) {
  const column = document.createElement("div");
  column.id = "gallery-column";
  column.classList.add("column");

  return column;
}


function loadImage(detail, currNum) {
  const path = "." + detail["path"].substr(9); // remove "../client" For some reason the path is not correct.

  const image = document.createElement("img");
  image.src = path;
  image.alt = detail["caption"];
  image.id = detail["_id"];
  image.onclick = function() {openModal();showPicture(path, detail["caption"])};
  image.classList.add("pic");

  return image;
}

// Get request to server to get all images for the user
async function getUserImages() {
  try {
    const response = await fetch(`${window.requestName}/${window.user_name}/images/details`);
    const data = await response.json();
    return data["images"];
  } catch (error) {
    console.log(error);
  }
}

// Delete image from the server
async function deleteUserImage() {
  try {
    const response = await fetch(`${window.requestName}/${window.user_name}/images/details`);
    const data = await response.json();
    return data["images"];
  } catch (error) {
    console.log(error);
  }
}


// Open the Modal
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Render the modal
function showPicture(path, caption) {
  var modalImg = document.getElementById("modalImage");
  var captionText = document.getElementById("caption");
  modalImg.src = path;
  captionText.innerHTML = caption;
}

function initializeModal() {
  return createModal();
}

function createModal() {
  var modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "myModal";
  modal.style.display = "none";
  modal.style.position = "fixed";

  console.log("Creating Modal!");

  modal.appendChild(createCloseButton());
  console.log("Created Close Button!");

  modal.appendChild(createModalImage());
  console.log("Created Modal Content!");

  modal.appendChild(createCaptionText());
  console.log("Created Caption!");

  return modal;
}

function createCloseButton() {
  var closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = closeModal;
  return closeButton;
}

function createModalImage() {
  var modalContent = document.createElement("img");
  modalContent.style.display = "width: 100%; height: auto";
  modalContent.id = "modalImage";

  return modalContent;
}

function createCaptionText(imageDetails) {
  var captionText = document.createElement("div");
  captionText.className = "caption-container";

  const caption = document.createElement("p");
  caption.id = "caption";
  caption.innerHTML = "";

  captionText.appendChild(caption);

  return captionText;
}

