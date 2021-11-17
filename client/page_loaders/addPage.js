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
  const addPicButton = document.createElement("div");
  addPicButton.classList.add("d-flex", "justify-content-center", "sub-button-primary");

  const addLogo = document.createElement("img");
  addLogo.id = "add-button-logo";
  addLogo.src = "./images/add_logo.png";

  addPicButton.appendChild(addLogo);

  return addPicButton;
}

function loadPicAddButton() {
  const addButton = loadAddButton();
  addButton.id = "add-pic-sub-button";
  addButton.classList.add("add-pic-btn");

  return addButton;
}

function loadHabitAddButton() {
  const addButton = loadAddButton();
  addButton.id = "add-habit-sub-button";
  addButton.classList.add("add-habit-btn");

  return addButton;
}
