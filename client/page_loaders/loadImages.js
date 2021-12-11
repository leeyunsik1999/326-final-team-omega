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

    const editModal = createEditModal();
    imagePage.appendChild(editModal);

    page.appendChild(imagePage);
}

export async function resetImagesPage() {
  const imagePage = document.getElementById("pictures-page");
  const parent = imagePage.parentNode;
  parent.removeChild(imagePage);
  await loadImagesPage(parent);
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
    row.childNodes[i % numColumns].appendChild(loadImage(details[i]));
  }

  return row;
}

function createGalleryColumn(details) {
  const column = document.createElement("div");
  column.id = "gallery-column";
  column.classList.add("column");

  return column;
}


function loadImage(detail) {
  const path = "." + detail["path"].substr(9); // remove "../client" For some reason the path is not correct.
  console.log(detail);
  const image = document.createElement("img");
  image.src = path;
  image.alt = detail["caption"];
  image.id = detail["_id"];
  image.onclick = function() {openModal();showPicture(path, detail["caption"], detail["name"], detail["_id"])};
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

// PUT request to update the name and caption of an image in the server
async function updateUserImage(id, name, caption) {
  const jsonString = JSON.stringify({
    name: name,
    caption: caption
  });

  const postOptions = {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonString
  }

  const response = await fetch(`${window.requestName}/${window.user_name}/${id}/images/update`, postOptions);
  if (response.ok) {
    console.log(`Updated image (${id}), Name: ${name}, Caption: ${caption}.`);
    alert("Image updated successfully.");
  } else {
    console.log(`Failed to update the name and caption for image: ${id}.`);
    alert("Failed to update image!");
  }
}

// Delete request to delete an image from the server
async function deleteUserImage(id) {
    const response = await fetch(`${window.requestName}/${window.user_name}/${id}/images/delete`, {method: 'DELETE'});
  if (response.ok) {
    console.log(`Deleted image (${id}).`);
    alert("Image deleted successfully.");
  } else {
    console.log(`Failed to delete image (${id}) from server.`);
    alert("Failed to delete image!");
  }
}

// Mode details picture modal

// Open the Modal
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Render the modal
function showPicture(path, caption, name, id) {
  var modalImg = document.getElementById("modalImage");
  var captionText = document.getElementById("caption");
  var nameText = document.getElementById("name");

  modalImg.src = path;
  nameText.innerHTML = name;
  captionText.innerHTML = caption;

  document.getElementById("edit-button").onclick = function() {closeModal(); openEditModal(id);};
}

function updateImageButton() {
  const editButton = document.createElement("button");
  editButton.id = "edit-button";
  editButton.classList.add("btn", "btn-primary");
  editButton.innerHTML = "Edit/Delete Image";

  return editButton;
}

function openEditModal(imageId) {
  document.getElementById("editModal").style.display = "block";
  document.getElementById("save-button").onclick = function() {closeEditModal(); pushUpdate(imageId);};
  document.getElementById("delete-button").onclick = function() {closeEditModal(); deleteImage(imageId);};
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function setDeleteImageButton(imageId) {
  const deleteButton = document.getElementById("edit-button");
  deleteButton.onclick = closeModal;
}

async function pushUpdate(imageId) {
  const name = document.getElementById("name-input").value;
  const caption = document.getElementById("caption-input").value;
  await updateUserImage(imageId, name, caption);
  await resetImagesPage();
}

async function deleteImage(imageId) {
  await deleteUserImage(imageId);
  await resetImagesPage();
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

  modal.appendChild(createCloseButton());
  modal.appendChild(createNameText());
  modal.appendChild(createModalImage());
  modal.appendChild(createCaptionText());
  modal.appendChild(updateImageButton());

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

function createNameText(imageDetails) {
  var nameText = document.createElement("div");
  nameText.className = "name-container";

  const name = document.createElement("p");
  name.id = "name";
  name.innerHTML = "";

  nameText.appendChild(name);

  return nameText;
}

// BS4 Edit/Delete Modal
function createEditModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "editModal";

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  modalContent.appendChild(createEditModalHeader());
  modalContent.appendChild(createEditModalBody());
  modalContent.appendChild(createEditModalFooter());

  modalDialog.appendChild(modalContent);
  modal.appendChild(modalDialog);

  return modal;
}

function createEditModalHeader() {
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const headerTitle = document.createElement("h4");
  headerTitle.className = "modal-title";
  headerTitle.innerHTML = "Edit Image Details";

  modalHeader.appendChild(headerTitle);

  const closeButton = document.createElement("button");
  closeButton.className = "close";
  closeButton.id = "closeX";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = closeEditModal;

  modalHeader.appendChild(closeButton);

  return modalHeader;
}

function createEditModalBody() {
  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";

  const form = document.createElement("form");
  form.id = "edit-form";

  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  // Name Form
  const nameLabel = document.createElement("label");
  nameLabel.innerHTML = "Name";

  const nameInput = document.createElement("input");
  nameInput.className = "form-control";
  nameInput.type = "text";
  nameInput.id = "name-input";

  formGroup.appendChild(nameLabel);
  formGroup.appendChild(nameInput);

  // Caption form
  const captionLabel = document.createElement("label");
  captionLabel.innerHTML = "Caption";

  const captionInput = document.createElement("input");
  captionInput.className = "form-control";
  captionInput.type = "text";
  captionInput.id = "caption-input";

  formGroup.appendChild(captionLabel);
  formGroup.appendChild(captionInput);

  form.appendChild(formGroup);

  modalBody.appendChild(form);

  return modalBody;
}

function createEditModalFooter() {
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger";
  deleteButton.innerHTML = "Delete Image";
  deleteButton.id = "delete-button";
  deleteButton.onclick = function() {closeEditModal();};

  const saveButton = document.createElement("button");
  saveButton.className = "btn btn-primary";
  saveButton.innerHTML = "Save";
  saveButton.id = "save-button";
  saveButton.onclick = function() {closeEditModal();};

  modalFooter.appendChild(saveButton);
  modalFooter.appendChild(deleteButton);

  return modalFooter;
}
