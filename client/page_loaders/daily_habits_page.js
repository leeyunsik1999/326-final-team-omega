//dictionary for the months
const month_word = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
}

export async function load_daily_page(parent) {
  (async () => {
    // create div for the habits page 
    const habits_page = document.createElement("div");
    habits_page.id = "habits-page";
    habits_page.classList.add("page", "container");
    parent.appendChild(habits_page);

    // row div
    const row = document.createElement("div");
    row.classList.add("row")
    habits_page.appendChild(row);

    // size div for habits to do list on the left
    const habit_to_do = document.createElement("div");
    habit_to_do.id = "habit-to-do";
    habit_to_do.classList.add("col-4");
    row.appendChild(habit_to_do);

    // card for habits to do list
    const habit_card = document.createElement("div");
    habit_card.id = "habit-card";
    habit_card.classList.add("card");
    habit_to_do.appendChild(habit_card);

    // card body for above
    const card_body = document.createElement("div");
    card_body.classList.add("card-body");
    habit_card.appendChild(card_body);

    // Date header on top of the habits to do list
    const date_text = document.createElement("h2");
    date_text.innerText = `${get_date_text()}`;
    card_body.appendChild(date_text);

    // creates the list of items that needs to be checked off. Pulls from the events (what is checked off) and eventList (what needs to be added to the list) api
    const habits_list = document.createElement("div");
    habits_list.id = "habits-list";

    // First create the checkboxes
    fetch(`${window.requestName}/user/${window.user_name}/${get_month()}/eventList`).then(res => {
      if (res.status !== 200) {
        console.log("Error loading events for month");
      } else {
        res.json().then(events => {
          for (const event of events) {
            create_habit(event, habits_list);
          }
        });
      }
    }).finally(res => {
      fetch(`${window.requestName}/user/${window.user_name}/${get_month()}/${get_day()}/events`).then(res => {
        if (res.status !== 200){
          console.log("Error loading events for today");
        } else {
          res.json().then(events => {
            for (const event of events){
              let box = document.getElementById(`Checkbox Event: ${event["name"]}`);
  
              box.checked = true;
            }
          });
        }
      });
    });

    card_body.appendChild(habits_list);

    habit_card.appendChild(document.createElement("br"));

    // button that redirects to add page from the habits to do list
    const add_habit_sub_button = document.createElement("div");
    add_habit_sub_button.id = "add-habit-sub-button";
    add_habit_sub_button.classList.add("add-habit-btn", "d-flex", "justify-content-center", "sub-button-primary");
    card_body.appendChild(add_habit_sub_button);
    const plus_image = document.createElement("img");
    plus_image.id = "add-button-logo";
    plus_image.src = "/images/add_logo.png";
    add_habit_sub_button.appendChild(plus_image);

    habit_card.appendChild(document.createElement("br"));

    // button that redirects to monthly page
    const monthly_page_button = document.createElement("div");
    monthly_page_button.id = "monthly-page-button";
    monthly_page_button.classList.add("d-flex", "justify-content-center");
    habit_card.appendChild(monthly_page_button);
    const button = document.createElement("button");
    button.classList.add("btn", "btn-light");
    button.type = "button";
    button.innerText = "Monthly View";
    monthly_page_button.appendChild(button);

    // div for photos
    const daily_photos = document.createElement("div");
    daily_photos.id = "daily-photos";
    daily_photos.classList.add("col-8");
    row.appendChild(daily_photos);

    // card for photos
    const photo_card = document.createElement("div")
    photo_card.classList.add("card");
    daily_photos.appendChild(photo_card);

    // card body for photos
    const photo_card_body = document.createElement("div");
    photo_card_body.classList.add("card-body");
    photo_card.appendChild(photo_card_body);

    // container for photos
    const photo_card_container = document.createElement("div");
    photo_card_container.classList.add("container");
    photo_card_body.appendChild(photo_card_container);

    // row to help separate the photos
    const image_row = document.createElement("div");
    image_row.id = "image-row";
    image_row.classList.add("row");
    photo_card_container.appendChild(image_row);

    // images


    // button to add picture on the picutres column 
    const add_pic_sub_button = document.createElement("div");
    add_pic_sub_button.id = "add-pic-sub-button";
    add_pic_sub_button.classList.add("add-pic-btn", "d-flex", "justify-content-center", "sub-button-primary");
    photo_card_container.appendChild(add_pic_sub_button);

    // image on the button
    const add_button_logo = document.createElement("img");
    add_button_logo.id = "add-button-logo";
    add_button_logo.src = "/images/add_logo.png";
    add_pic_sub_button.appendChild(add_button_logo);
  })();
}

// gets the date in the form yyyymmdd as a string
function get_date() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  return yyyy + mm + dd;
}

// Gets the month in string
function get_month() {
  let today = new Date();
  return month_word[today.getMonth() + 1];
}

// Gets the date in number
function get_day() {
  let today = new Date();
  return today.getDate();
}

// gets the date and returns as the name of the month and day and year
function get_date_text() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  return month_word[mm] + ", " + dd + " " + yyyy;
}

// creates the individual checkboxes for each habit under the to do list
function create_habit(habit, parent) {
  // checkbox div
  const task = document.createElement("div");
  task.classList.add("custom-control", "custom-checkbox");
  parent.appendChild(task);

  // specific checkbox for the habit
  const checkbox = document.createElement("input");
  checkbox.id = `Checkbox Event: ${habit["name"]}`;
  checkbox.type = "checkbox";
  checkbox.classList.add("custom-control-input");
  checkbox.value = habit["_id"];
  task.appendChild(checkbox);

  // Logic for API call on post / delete
  checkbox.addEventListener("click", () => {
    (async () => {
      const endpoint = `${window.requestName}/user/${window.user_name}/events`;
      const type = checkbox.checked ? 'POST' : 'DELETE';
      const response = await fetch(endpoint, {
        method: type,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "username": window.user_name,
          "month": habit["month"],
          "name": habit["name"],
          "eventID": habit["_id"],
          "day": get_day(),
          "date": get_date()
        })
      });
      // True case: POST
      if (checkbox.checked) {
        if (response.status === 200) {
          console.log("Event occurence created");
        } else {
          console.log("Failed to create event " + habit["name"]);
          window.alert("Failed to create event " + habit["name"]);
        }
        // False case: DELETE
      } else {
        if (response.status === 200) {
          console.log("Event deleted");
        } else {
          console.log("Event deletion unsuccessful");
          window.alert("Event deletion unsuccessful");
        }
      }
    })();
  });
  // what the habit name is called 
  const label = document.createElement("label");
  label.classList.add("custom-control-label");
  label.setAttribute("for", habit["name"]);
  label.innerText = habit["name"];
  task.appendChild(label);

  task.addEventListener("click", () => {
    checkbox.click();
  });

}

// creates the html for adding images to the images colum (this probably needs to be changed)
function create_image(image_link, parent) {
  const image_col = document.createElement("div");
  image_col.classList.add("col");
  parent.appendChild(image_col);

  for (let i = 0; i < image_link.length; i++) {
    const add_image = document.createElement("img");
    add_image.src = image_link[i];
    image_col.appendChild(add_image);
  }
}