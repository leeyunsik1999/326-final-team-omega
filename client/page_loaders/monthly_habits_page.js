const months = {
  1 : 31,
  2 : 28,
  3 : 31,
  4 : 30,
  5 : 31,
  6 : 30,
  7 : 31,
  8 : 31,
  9 : 30,
  10 : 31,
  11 : 30,
  12 : 31
}

const month_word = {
  1 : "Jamuary",
  2 : "February",
  3 : "March",
  4 : "April",
  5 : "May",
  6 : "June",
  7 : "July",
  8 : "August",
  9 : "September",
  10 : "October",
  11 : "November",
  12 : "December"
}


function get_month() {
  let today = new Date();
  return String(today.getMonth() + 1).padStart(2, '0');
}

export function load_monthly_page(parent) {
  (async () => {
    const month_days = months[get_month];
    let habit_list = {};
    // const event_response = await fetch(`${window.hostname}/user/${window.user_name}/${month_word[get_month]}/events}`);
    // if(event_response.status !== 200) {
    //   alert("An error has occured.");
    // } else {
    //   habit_list = await event_response.json();
    // }

    const monthly_habits_page = document.createElement("div");
    monthly_habits_page.id = "monthly-habits-page";
    monthly_habits_page.classList.add("page");
    parent.appendChild(monthly_habits_page);

    const grid_container = document.createElement("div");
    grid_container.id = "grid-container";
    grid_container.classList.add("container");
    monthly_habits_page.appendChild(grid_container);

    const habits_month = document.createElement("h1");
    habits_month.id = "habits-month";
    console.log(month_word[get_month()]);
    habits_month.innerText = month_word[get_month()];
    grid_container.appendChild(habits_month);

    add_br(grid_container);

    for(let i = 0; i < habit_list.length; i++) {
      add_habit(grid_container, habit_list[i]["name"], month_days);
    }

    add_br(grid_container);

    const daily_page_button = document.createElement("div");
    daily_page_button.id = "daily-page-button";
    daily_page_button.classList.add("d-flex", "justify-content-center");
    grid_container.appendChild(daily_page_button);

    const daily_button = document.createElement("button");
    daily_button.type = "button";
    daily_button.classList.add("btn", "btn-light");
    daily_button.innerText = "Daily View";
    daily_page_button.appendChild(daily_button);
  })();

}

function add_br(parent) {
  const br = document.createElement("br");
  parent.appendChild(br);
}

function add_habit(parent, habit_name, month_days) {
  const row = document.createElement("div");
  row.classList.add("row");
  parent.appendChild(row);

  const col_2 = document.createElement("div");
  col_2.classList.add("col-2");
  row.appendChild(col_2);

  const habit_label = document.createElement("p");
  habit_label.id = "habit-id";
  col_2.appendChild(habit_label);

  const habit_text = document.createElement("b");
  habit_text.innerText = habit_name;
  habit_label.appendChild(habit_text);

  const col_10 = document.createElement("div");
  col_10.classList.add("col-2");
  row.appendChild(col_10);

  const grid = document.createElement("div");
  grid.classList.add("grid");
  col_10.appendChild(grid);

  for(let i = 0; i < month_days; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    // day.innerText = i;
    grid.appendChild(day);
  }
}