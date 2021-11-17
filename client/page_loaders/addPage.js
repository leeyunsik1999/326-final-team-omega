export function loadAddPage(page) {
  console.log("loadAddPage");
  const addPage = document.createElement("div");
  addPage.id = "add-page";
  addPage.classList.add("page");
  addPage.appendChild(loadRow());

  page.appendChild(addPage);
}

function loadRow() {
  const row = document.createElement("div");
  row.classList.add("row");

  row.appendChild(loadCard(true));
  row.appendChild(loadCard(false));

  return row;
}

function loadCard(isHabitCard) {
  const cardColumn = document.createElement("div");
  cardColumn.classList.add("col-sm-6");
  if (isHabitCard) {
    cardColumn.appendChild(loadHabitCard());
  }
  else {
    cardColumn.appendChild(loadAddPicCard());
  }

  return cardColumn;
}

function loadHabitForm() {
  const habitForm = document.createElement("form");
  habitForm.id = "habits-form";
  habitForm.setAttribute("action", "");

  habitForm.appendChild(loadHabitFormGroup());

  return habitForm
}

function loadHabitFormGroup() {
  const habitFormGroup = document.createElement("div");
  habitFormGroup.classList.add("form-group");

  const habitFormLabel = document.createElement("label");
  habitFormLabel.for = "habit-name";
  habitFormLabel.innerText = "Habit Name";

  const habitFormInput = document.createElement("input");
  habitFormInput.type = "text";
  habitFormInput.classList.add("form-control");
  habitFormInput.id = "habit-name";
  habitFormInput.placeholder = "Enter Habit Name";

  habitFormGroup.appendChild(habitFormLabel);
  habitFormGroup.appendChild(habitFormInput);

  return habitFormGroup;
}

function loadHabitInputGroup() {
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group", "mb-3");

  const prepend = document.createElement("div");
  prepend.classList.add("input-group-prepend");

  const habitInputGroupText = document.createElement("span");
  habitInputGroupText.classList.add("input-group-text");
  habitInputGroupText.id = "basic-addon1";
  habitInputGroupText.innerText = "Habit";

  prepend.appendChild(habitInputGroupText);
  prepend.appendChild(loadHabitDropdown());

  inputGroup.appendChild(prepend);

  return inputGroup;
}

function loadHabitDropdown() {
  const habitDropdown = document.createElement("div");
  habitDropdown.classList.add("dropdown");

  const habitDropdownToggle = document.createElement("button");
  habitDropdownToggle.classList.add("btn", "btn-secondary", "dropdown-toggle");
  habitDropdownToggle.setAttribute("type", "button");
  habitDropdownToggle.setAttribute("id", "dropdownMenuButton");
  habitDropdownToggle.setAttribute("data-toggle", "dropdown");
  habitDropdownToggle.setAttribute("aria-haspopup", "true");
  habitDropdownToggle.setAttribute("aria-expanded", "false");
  habitDropdownToggle.innerText = "Pick Month";

  const habitDropdownMenu = document.createElement("div");
  habitDropdownMenu.classList.add("dropdown-menu");
  habitDropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
  for (let i = 0; i < 12; i++) {
    habitDropdownMenu.appendChild(loadDropdownItems(i));
  }

  habitDropdownToggle.appendChild(habitDropdownMenu);
  habitDropdown.appendChild(habitDropdownToggle);

  return habitDropdown;
}

function loadDropdownItems(month) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dropdownItem = document.createElement("a");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.setAttribute("href", "#");
  dropdownItem.innerText = months[month];

  return dropdownItem;
}


function loadHabitCard() {
  const habitCard = document.createElement("div");
  habitCard.classList.add("card");
  habitCard.id = "add-habit-card";

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h1");
  cardTitle.classList.add("card-title", "text-center");
  cardTitle.innerText = "Add Habit";

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(loadHabitForm());
  cardBody.appendChild(loadHabitInputGroup());
  cardBody.appendChild(loadHabitAddButton());

  habitCard.appendChild(cardBody);

  return habitCard;
}

function loadAddPicCard() {
  const addPicCard = document.createElement("div");
  addPicCard.classList.add("card");
  addPicCard.id = "add-pic-card";

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h1");
  cardTitle.classList.add("card-title", "text-center");
  cardTitle.innerText = "Add Picture";

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(loadAddPicBox());
  cardBody.appendChild(selectFileForm());
  cardBody.appendChild(loadPicAddButton());

  addPicCard.appendChild(cardBody);

  return addPicCard;

}

function loadAddPicBox() {
  const addPicBox = document.createElement("div");
  addPicBox.id = "drop-box"
  addPicBox.classList.add("upload-drop-box");
  addPicBox.innerText = "Drop Files Here";

  return addPicBox;
}

function loadAddButton() {
  const addPicButton = document.createElement("button");
  addPicButton.classList.add("d-flex", "justify-content-center", "sub-button-primary");

  const addLogo = document.createElement("img");
  addLogo.id = "add-button-logo";
  addLogo.src = "./images/add_logo.png";

  addPicButton.appendChild(addLogo);

  return addPicButton;
}

function selectFileForm() {
  const addForm = document.createElement("div");
  addForm.classList.add("form-group");

  const fileIdLabel = document.createElement("label");
  fileIdLabel.for = "file-id";
  fileIdLabel.innerText = "File ID";

  const fileIdInput = document.createElement("input");
  fileIdInput.type = "text";
  fileIdInput.classList.add("form-control");
  fileIdInput.id = "file-id";

  addForm.appendChild(fileIdLabel);
  addForm.appendChild(fileIdInput);

  const fileNameLabel = document.createElement("label");
  fileNameLabel.for = "file-name";
  fileNameLabel.innerText = "File Name";

  const fileNameInput = document.createElement("input");
  fileNameInput.type = "text";
  fileNameInput.classList.add("form-control");
  fileNameInput.id = "file-name";

  addForm.appendChild(fileNameLabel);
  addForm.appendChild(fileNameInput);

  const fileCaptionLabel = document.createElement("label");
  fileCaptionLabel.for = "file-caption";
  fileCaptionLabel.innerText = "File Caption";

  const fileCaptionInput = document.createElement("input");
  fileCaptionInput.type = "text";
  fileCaptionInput.classList.add("form-control");
  fileCaptionInput.id = "file-caption";

  addForm.appendChild(fileCaptionLabel);
  addForm.appendChild(fileCaptionInput);

  const uploadFileInput = document.createElement("input");
  uploadFileInput.type = "file";
  uploadFileInput.classList.add("form-control-file");
  uploadFileInput.id = "add-file-form";

  addForm.appendChild(uploadFileInput);

  return addForm;
}

function loadPicAddButton() {
  const addPicButton = document.createElement("button");
  addPicButton.classList.add("d-flex", "justify-content-center", "sub-button-primary", "add-image-button");

  const addLogo = document.createElement("img");
  addLogo.id = "add-button-logo";
  addLogo.src = "./images/add_logo.png";

  addPicButton.appendChild(addLogo);
  addPicButton.id = "add-pic-sub-button";
  addPicButton.classList.add("add-pic-btn");
  addPicButton.addEventListener("click", addImage);

  return addPicButton;
}

function loadHabitAddButton() {
  const addButton = loadAddButton();
  addButton.id = "add-habit-sub-button";
  addButton.classList.add("add-habit-btn");

  return addButton;
}

// - /user/id/date/images/create
//   - POST request to create a new image.
//   - Should add image to the day's image list, and upload image to images directory with appropriate id.
async function addImage() {
  const formData = new FormData();
  formData.append("img", document.getElementById("add-file-form").files[0]);
  formData.append("name", document.getElementById("file-name".value));
  formData.append("caption", document.getElementById("file-caption").value);

  var today = new Date();
  const date = `${today.getFullYear()}` + `${today.getMonth()+1}` + `${today.getDate()}`;
  console.log(date);
  const fileId = document.getElementById("file-id").value;

  const endpoint = `${window.hostname}/${window.user_name}/${fileId}/${date}/images/create`;

  const postOptions = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {},
    body: formData
  };

  const response = await fetch(endpoint, postOptions);
  if (response.ok) {
    console.log("Image added");
  } else {
    alert("Failed to add Image!");
  }
}
