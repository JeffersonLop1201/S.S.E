const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const eventsArr = [];
getEvents();

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
                <img src="amico.png" alt="">
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});


addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }
  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push({ title: eventTitle, time: timeFrom + " - " + timeTo });
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [{ title: eventTitle, time: timeFrom + " - " + timeTo }],
    });
  }

  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
});

eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.querySelector(".event-title").innerText;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events = event.events.filter(
            (item) => item.title !== eventTitle
          );
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}
document.addEventListener('DOMContentLoaded', function () {
  const corEscolhida = document.querySelector('.cor_escolhida');
  const modal = document.getElementById("modal");
  const colorOptions = document.querySelectorAll('.color-option');

  corEscolhida.addEventListener('click', function (event) {
    event.stopPropagation();
    modal.style.display = "block";
  });

  colorOptions.forEach(option => {
    option.addEventListener('click', function () {
      const selectedColor = this.querySelector('span:first-child').style.backgroundColor;
      corEscolhida.style.backgroundColor = selectedColor;
      modal.style.display = "none";
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
const btConts = document.querySelector(".bt_conts");
const modalPesPessoa = document.getElementById("modal_pes-pessoa");
const closeModalPesPessoa = document.querySelector(".close-modal");
const searchInput = document.getElementById("searchInput");
const pessoasContainer = document.getElementById("pessoasContainer");
const selectedUsersList = document.getElementById("selectedUsersList");

// Users data
const allUsers = [
  { id: 1, name: "Ana Silva", icon: "👩" },
  { id: 2, name: "Carlos Souza", icon: "👨" },
  { id: 3, name: "Bruna Oliveira", icon: "👩" },
  { id: 4, name: "Diego Costa", icon: "👨" },
  { id: 5, name: "Fernanda Almeida", icon: "👩" },
];

// Selected users
const selectedUsers = [];

// Event listeners
btConts.addEventListener("click", openModal);
closeModalPesPessoa.addEventListener("click", closeModal);
window.addEventListener("click", clickOutsideModal);
searchInput.addEventListener("input", searchUsers);

// Open modal
function openModal() {
  modalPesPessoa.style.display = "block";
  listUsers("");
}

// Close modal
function closeModal() {
  modalPesPessoa.style.display = "none";
}

// Close modal when clicking outside
function clickOutsideModal(event) {
  if (event.target === modalPesPessoa) {
    closeModal();
  }
}

// Search users
function searchUsers() {
  const searchTerm = searchInput.value.toLowerCase();
  listUsers(searchTerm);
}

// List users
function listUsers(searchTerm) {
  pessoasContainer.innerHTML = "";
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm)
  );
  filteredUsers.forEach(createUserElement);
}

// Create user element
function createUserElement(user) {
  const userDiv = document.createElement("div");
  userDiv.textContent = `${user.icon} ${user.name}`;
  userDiv.classList.add("user-item");
  userDiv.classList.add("mod-pess-user-unit");
  userDiv.addEventListener("click", () => toggleSelectUser(user, userDiv));
  pessoasContainer.appendChild(userDiv);
}

// Toggle select user
function toggleSelectUser(user, divElement) {
  const index = selectedUsers.findIndex(u => u.id === user.id);
  if (index === -1) {
    selectedUsers.push(user);
    divElement.classList.add("selected");
    addUserToSelected(user);
    addUserToWrapper(user);
  } else {
    selectedUsers.splice(index, 1);
    divElement.classList.remove("selected");
    removeUserFromSelected(user.id);
    removeUserFromWrapper(user.id);
  }
}

// Add user to selected
function addUserToSelected(user) {
  const listItem = document.createElement("li");
  listItem.textContent = `${user.icon} ${user.name}`;
  listItem.id = `user-${user.id}`;
  selectedUsersList.appendChild(listItem);
}

// Remove user from selected
function removeUserFromSelected(userId) {
  const listItem = document.getElementById(`user-${userId}`);
  if (listItem) {
    listItem.remove();
  }
}

// Add user to wrapper
function addUserToWrapper(user) {
  const userDiv = document.createElement("div");
  userDiv.textContent = `${user.icon} ${user.name}`;
  userDiv.id = `wrapper-user-${user.id}`;
  userDiv.classList.add("wrapper-user");
  addEventWrapper.appendChild(userDiv);
}

// Remove user from wrapper
function removeUserFromWrapper(userId) {
  const userDiv = document.getElementById(`wrapper-user-${userId}`);
  if (userDiv) {
    userDiv.remove();
  }
}

// Função para adicionar usuário ao container
function addUserToWrapper(user) {
  const userDiv = document.createElement("div");
  userDiv.innerHTML = `<span class="user-icon">${user.icon}</span> ${user.name} <span class="remove-user"></span>`;
  userDiv.id = `wrapper-user-${user.id}`;
  userDiv.classList.add("wrapper-user");
  
  // Adiciona evento para remover usuário ao clicar no "×"
  userDiv.querySelector(".remove-user").addEventListener("click", () => {
    toggleSelectUser(user, userDiv);  // Remove o usuário da seleção
  });

  const selectedUsersContainer = document.getElementById("selectedUsersContainer");
  selectedUsersContainer.appendChild(userDiv);
}

// Função para remover usuário do container
function removeUserFromWrapper(userId) {
  const userDiv = document.getElementById(`wrapper-user-${userId}`);
  if (userDiv) {
    userDiv.remove();
  }
}

userDiv.addEventListener("click", () => {
  toggleSelectUser(user, userDiv);
  addUserToWrapper(user);  // Adiciona o usuário ao container
});
document.addEventListener("DOMContentLoaded", function () {
  const wrapperUsers = document.querySelectorAll(".wrapper-user");

  wrapperUsers.forEach((user) => {
    user.addEventListener("click", function () {
      const confirmDelete = document.createElement("div");
      confirmDelete.className = "confirm-delete";
      confirmDelete.innerHTML = `
        <p>Do you want to delete this user?</p>
        <button class="delete-yes">Yes</button>
        <button class="delete-no">No</button>
      `;
      
      document.body.appendChild(confirmDelete);

      const deleteYes = confirmDelete.querySelector(".delete-yes");
      const deleteNo = confirmDelete.querySelector(".delete-no");

      deleteYes.addEventListener("click", function () {
        // Remova o usuário aqui
        user.remove();
        confirmDelete.remove();
      });

      deleteNo.addEventListener("click", function () {
        confirmDelete.remove();
      });
    });
  });
});
// Função para adicionar usuário ao container
function addUserToWrapper(user) {
  const userDiv = document.createElement("div");
  userDiv.innerHTML = `<span class="user-icon">${user.icon}</span> ${user.name} <span class="remove-user"></span>`;
  userDiv.id = `wrapper-user-${user.id}`;
  userDiv.classList.add("wrapper-user");
  
  // Adiciona evento para mostrar aviso ao clicar no usuário
  userDiv.addEventListener("click", () => {
    showRemoveConfirmation(user, userDiv);  // Mostra o aviso de remoção
  });

  const selectedUsersContainer = document.getElementById("selectedUsersContainer");
  selectedUsersContainer.appendChild(userDiv);
}

// Função para mostrar aviso de remoção
function showRemoveConfirmation(user, userDiv) {
  const confirmDelete = document.createElement("div");
  confirmDelete.className = "confirm-delete";
  confirmDelete.innerHTML = `
   <div class="confirm-delete-box">
    <p>Do you want to remove ${user.name}?</p>
    <button class="delete-yes">Yes</button>
    <button class="delete-no">No</button>
    </div>
  `;

  document.body.appendChild(confirmDelete);

  const deleteYes = confirmDelete.querySelector(".delete-yes");
  const deleteNo = confirmDelete.querySelector(".delete-no");

  deleteYes.addEventListener("click", function () {
    // Remova o usuário aqui
    userDiv.remove();
    confirmDelete.remove();
    toggleSelectUser(user, userDiv);  // Remove o usuário da seleção
  });

  deleteNo.addEventListener("click", function () {
    confirmDelete.remove();
  });
}

// Função para remover usuário do container
function removeUserFromWrapper(userId) {
  const userDiv = document.getElementById(`wrapper-user-${userId}`);
  if (userDiv) {
    userDiv.remove();
  }
}
