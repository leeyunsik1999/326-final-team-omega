import { resetImagesPage } from "./loadImages.js";

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
    habitDropdownMenu.appendChild(loadDropdownItems(i, habitDropdownToggle));
  }

  habitDropdownToggle.appendChild(habitDropdownMenu);
  habitDropdown.appendChild(habitDropdownToggle);

  return habitDropdown;
}

function loadDropdownItems(month, habitDropdownToggle) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dropdownItem = document.createElement("a");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.setAttribute("href", "#");
  dropdownItem.innerText = months[month];

  // On selection, saves selection to value and changes innerText of dropdown to selected value
  dropdownItem.addEventListener("click", () => {
    // Specifically changing text on childNodes[0] so it changes text only, not inner HTML
    habitDropdownToggle.childNodes[0].nodeValue = dropdownItem.innerText;
    habitDropdownToggle.value = dropdownItem.innerText;
  });
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
  cardBody.appendChild(selectFileForm());
  cardBody.appendChild(loadPicAddButton());

  addPicCard.appendChild(cardBody);

  return addPicCard;
}

function loadAddButton() {
  const addPicButton = document.createElement("button");
  addPicButton.classList.add("d-flex", "justify-content-center", "sub-button-primary");

  const addLogo = document.createElement("img");
  addLogo.id = "add-button-logo";
  addLogo.src = "/images/add_logo.png";

  addPicButton.appendChild(addLogo);

  return addPicButton;
}

function selectFileForm() {
  const addForm = document.createElement("div");
  addForm.classList.add("form-group");

  const fileNameLabel = document.createElement("label");
  fileNameLabel.for = "file-name";
  fileNameLabel.innerText = "Name";

  const fileNameInput = document.createElement("input");
  fileNameInput.type = "text";
  fileNameInput.classList.add("form-control");
  fileNameInput.id = "file-name";

  addForm.appendChild(fileNameLabel);
  addForm.appendChild(fileNameInput);

  const fileCaptionLabel = document.createElement("label");
  fileCaptionLabel.for = "file-caption";
  fileCaptionLabel.innerText = "Caption";

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
  addLogo.src = "/images/add_logo.png";

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

  addButton.addEventListener("click", addHabit);

  return addButton;
}

// - /user/id/date/images/create
//   - POST request to create a new image.
//   - Should add image to the day's image list, and upload image to images directory with appropriate id.
async function addImage() {
  const formData = new FormData();
  formData.append("img", document.getElementById("add-file-form").files[0]);
  formData.append("name", document.getElementById("file-name").value);
  formData.append("caption", document.getElementById("file-caption").value);

  document.getElementById("add-file-form").value = "";
  document.getElementById("file-name").value = "";
  document.getElementById("file-caption").value = "";

  var today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const endpoint = `${window.requestName}/${window.user_name}/${date}/images/create`;

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
    console.log("Image added!");
    await resetImagesPage();
    document.getElementById("pictures-page").style.display = "none";
    alert("Image added!");
  } else {
    alert("Failed to add Image!");
  }
}

async function addHabit() {
  const month = document.getElementById("dropdownMenuButton").value;
  const name = document.getElementById("habit-name").value;
  if (month === '') {
    window.alert("Please select a month!");
  } else if (name === '') {
    window.alert("Please enter a name for the event!");
  } else {
    const endpoint = `${window.requestName}/user/${window.user_name}/eventList`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": window.user_name,
        "month": month,
        "name": name
      })
    });
    if (response.status === 200){
      window.alert("Event created!");
      document.getElementById("habit-name").value = '';
  }else if (response.status === 404){
      window.alert("Username not found!");
    } else if (response.status === 500){
      window.alert("Server error");
    }
  }
}