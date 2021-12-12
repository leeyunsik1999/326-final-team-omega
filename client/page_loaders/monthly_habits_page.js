// dict for the month and their respective # of days 
const months = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
}

// dict for the month name in full
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

// helper function to get the current month number
function get_month() {
  let today = new Date();
  return String(today.getMonth() + 1).padStart(2, '0');
}

function get_day() {
  let today = new Date();
  return today.getDate();
}

export async function load_monthly_page(parent) {
  (async () => {
    const month_days = months[get_month()];

    // div for the habits page
    const monthly_habits_page = document.createElement("div");
    monthly_habits_page.id = "monthly-habits-page";
    monthly_habits_page.classList.add("page");
    parent.appendChild(monthly_habits_page);

    // grid contrainer for the monthly habits page
    const grid_container = document.createElement("div");
    grid_container.id = "grid-container";
    grid_container.classList.add("container");
    monthly_habits_page.appendChild(grid_container);

    // header text for the current month
    const habits_month = document.createElement("h1");
    habits_month.id = "habits-month";
    console.log(month_word[get_month()]);
    habits_month.innerText = month_word[get_month()];
    grid_container.appendChild(habits_month);

    add_br(grid_container);

    fetch(`${window.requestName}/user/${window.user_name}/${month_word[get_month()]}/eventList`).then(res => {
      if (res.status !== 200) {
        alert("Error loading events for month");
      } else {
        res.json().then(resp => {
          for (let i = 0; i < resp.length; i++) {
            add_habit(grid_container, resp[i]["name"], month_days);
          }
          console.log("add habit completed");
          add_br(grid_container);

          // button to go back to the daily page div
          const daily_page_button = document.createElement("div");
          daily_page_button.id = "daily-page-button";
          daily_page_button.classList.add("d-flex", "justify-content-center");
          grid_container.appendChild(daily_page_button);
          console.log("Finished daily page button");
          // formatting for the button
          const daily_button = document.createElement("button");
          daily_button.type = "button";
          daily_button.classList.add("btn", "btn-light");
          daily_button.innerText = "Daily View";
          daily_page_button.appendChild(daily_button);
          console.log("Finished daily button");

          // Coloring in completed tasks
          fetch(`${window.requestName}/user/${window.user_name}/${month_word[get_month()]}/${get_day()}/events`).then(res => {
            if (res.status !== 200) {
              console.log("Error loading events for today");
            } else {
              res.json().then(events => {
                for (const event of events) {
                  console.log(`Event-${event["name"]}-Day-${event["day"]}`);
                  let box = document.getElementById(`Event-${event["name"]}-Day-${event["day"]}`);
                  box.style.backgroundColor = "pink";
                  box.style.color = "black";
                }
              });
            }
          });
        });
      }
    });
  })();

}

function add_br(parent) {
  const br = document.createElement("br");
  parent.appendChild(br);
}

// helper function to add one specific habit from that month to the page
function add_habit(parent, habit_name, month_days) {
  // row div
  const row = document.createElement("div");
  row.classList.add("row");
  parent.appendChild(row);

  // col div for the habit name
  const col_2 = document.createElement("div");
  col_2.classList.add("col-2");
  row.appendChild(col_2);

  // name of habit goes here
  const habit_label = document.createElement("p");
  habit_label.id = "habit-id";
  col_2.appendChild(habit_label);

  // putting the full habit name on the left side 
  const habit_text = document.createElement("b");
  habit_text.innerText = habit_name;
  habit_label.appendChild(habit_text);

  // col div for the checkboxes
  const col_10 = document.createElement("div");
  col_10.classList.add("col-2");
  row.appendChild(col_10);

  // grid div to create checkbox
  const grid = document.createElement("div");
  grid.classList.add("grid");
  col_10.appendChild(grid);

  // putting the dates into the boxes based on the specific month
  for (let i = 0; i < month_days; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.id = `Event-${habit_name}-Day-${i + 1}`;
    day.innerText = i < 9 ? `0${i + 1}` : i + 1;
    grid.appendChild(day);
  }
}