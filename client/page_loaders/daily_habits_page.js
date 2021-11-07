export function load_daily_page(parent) {

  const habits_page = document.createElement("div");
  habits_page.id = "habits-page";
  habits_page.classList.add("page", "container");
  parent.appendChild(habits_page);

  const row = document.createElement("div");
  habits_page.appendChild(row);

  const habit_to_do = document.createElement("div");
  habit_to_do.id = "habit_to_do";
  habit_to_do.classList.add("col-4");
  row.appendChild(habit_to_do);

  const habit_card = document.createElement("div");
  habit_card.id = "habit_card";
  habit_card.classList.add("card");
  habit_to_do.appendChild(habit_card);

  const card_body = document.createElement("div");
  card_body.classList.add("card-body");
  habit_card.appendChild(card_body);

  const date_text = document.createElement("h1");
  // document.body.appendChild(document.innerText(`${get_date_text()}`));
  card_body.appendChild(date_text);

  const habits_list = document.createElement("div");
  // const event_response = await fetch(`${window.hostname}/user/${window.user_name}/${get_date()}/events}/`)
  // if(event_response.status !== 200) {
  //   alert("An error has occured.");
  // } else {
  //   const events = await event_response.json()
  //   for(const event in events) {
  //     habits_list.appendChild(create_habit(event));
  //   }
  // }
  card_body.appendChild(habits_list);

  habit_card.appendChild(document.createElement("br"));

  const add_habit_sub_button = document.createElement("div");
  add_habit_sub_button.classList.add("add-habit-btn", "d-flex", "justify-content-center", "sub-button-primary");
  card_body.appendChild(add_habit_sub_button);
  const plus_image = document.createElement("img");
  plus_image.id = "plus_image";
  plus_image.src = "./images/add_logo.png";
  add_habit_sub_button.appendChild(plus_image);

  habit_card.appendChild(document.createElement("br"));

  const monthly_page_button = document.createElement("div");
  monthly_page_button.id = "monthly_page_button";
  monthly_page_button.classList.add("d-flex", "justify-content-center");
  habit_card.appendChild(monthly_page_button);
  const button = document.createElement("button");
  button.classList.add("btn", "btn-light");
  button.innerText = "Monthly View";
  monthly_page_button.appendChild(button);

  const daily_photos = document.createElement("div");
  daily_photos.id = "daily_photos";
  daily_photos.classList.add("col-8");
  habit_to_do.appendChild(daily_photos);

}

function create_habit(habit_title) {
  const task = document.createElement("div");
  task.classList.add("custom-control", "custom-checkbox");
  habits_list.appendChild(task);

  const checkbox = document.createElement("input");
  checkbox.id = habit_title;
  checkbox.type = "checkbox";
  checkbox.classList("custom-control-input");
  task.appendChild(checkbox);

  const label = document.createElement("label");
  label.classList.add("custom-control-label");
  label.setAttribute("for", habit_title)
  label.innerText = habit_title;
  task.appendChild(label);
}

