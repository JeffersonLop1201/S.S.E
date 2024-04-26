/**
 * Constantes e variáveis globais
 */

// Elementos HTML
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
    addEventDescricion = document.querySelector('.event-descricao'),
    addEventSubmit = document.querySelector(".add-event-btn");

// Lista de usuários selecionados
const selectedUsers = [];

// Array com os nomes dos meses
const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Array para armazenar eventos
const eventsArr = [];

// Variáveis para armazenar a data atual e o mês e ano atuais
let today = new Date(),
    activeDay,
    month = today.getMonth(),
    year = today.getFullYear();


// Seleciona os elementos do DOM necessários para a funcionalidade de pesquisa e seleção de usuários
const btConts = document.querySelector(".bt_conts"),
    modalPesPessoa = document.getElementById("modal_pes-pessoa"),
    closeModalPesPessoa = document.querySelector(".close-modal"),
    searchInput = document.getElementById("searchInput"),
    pessoasContainer = document.getElementById("pessoasContainer"),
    selectedUsersList = document.getElementById("selectedUsersList");

// Lista de todos os usuários disponíveis
const allUsers = [
    { id: 1, name: "Ana Silva", icon: "👩" },
    { id: 2, name: "Carlos Souza", icon: "👨" },
    { id: 3, name: "Bruna Oliveira", icon: "👩" },
    { id: 4, name: "Diego Costa", icon: "👨" },
    { id: 5, name: "Fernanda Almeida", icon: "👩" },
    { id: 6, name: "Fernanda Goias", icon: "👩" },
    { id: 7, name: "Ana Silva", icon: "👩" },
    { id: 8, name: "Carlos Souza", icon: "👨" },
    { id: 9, name: "Bruna Oliveira", icon: "👩" },
    { id: 10, name: "Diego Costa", icon: "👨" },
    { id: 11, name: "Fernanda Almeida", icon: "👩" },
    { id: 12, name: "Fernanda Goias", icon: "👩" },
];


//------------------------------------------------------------------------------------------------//


/**
 * Funções gerais
 */

// Função para obter os eventos do armazenamento local
function getEvents() {
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

// Função para salvar os eventos no armazenamento local
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

// Função para obter os usuários selecionados
function getSelectedUsers() {
    return JSON.parse(localStorage.getItem("selectedUsers")) || [];
}

// Função para salvar os usuários selecionados
function saveSelectedUsers(SelectedUsers) {
    localStorage.setItem("selectedUsers", JSON.stringify(SelectedUsers));
}

// Função para obter a cor selecionada
function getColor() {
    return localStorage.getItem("selectedColor") || "#ffffff";
}

// Função para salvar a cor selecionada
function saveColor(color) {
    localStorage.setItem("selectedColor", color);
}

// Função para obter o dia ativo
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// Função para atualizar os eventos exibidos
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                const colorStyle = `background-color: ${event.color};`
                events += `
                ;

        <div class="event">
	        <div class="cont-color">
		        <div class="color-select-event" style="${colorStyle}"></div>
	        </div>
	        <div class="cont-principal">
		        <div class="event-title"><h1>${event.title}</h1></div>
		        <div class="event-time"><p>${event.time}</p></div>
	        </div>
	        <div class="left-confg">
		        <div class="cont-config">
              <i class="fi fi-sr-settings img-confg"></i>
		        </div>
	        </div>
        </div>
        `;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
                <img src="img/amico.png" alt="">
        </div>`;
    }
    eventsContainer.innerHTML = events;
    saveEvents();
}


// Função para inicializar o calendário
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


// Função para ir para o mês anterior
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

// Função para ir para o próximo mês
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

// Função para adicionar ouvintes de evento aos dias do calendário
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

// Função para ir para uma data específica
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

// Função para mostrar um modal de evento
function showEventModal(event) {
    const colorStyle = `background-color: ${event.color};`;

    const modalContent = `
    <div class="event-modal-content">
      <div class="modal-cont">
          <div class="content-color" style="${colorStyle}"><div class="close-btm">x</div></div>
        <div class="cont-modal-conteiner">
            <div class="cont-conteiner-pess-time-desc" >
                <div class="cont-title">
                  <h2>${event.title}</h2>
                </div>
                <div  class="cont-descrição">
                  <p> ${event.descrição}</p>
                </div>
                <div class="cont-time">
                  <p> ${event.time}</p>
                </div>
            </div>
            <div class="cont-users">
                <strong>Usuários:</strong>
                <div class="contt-user">
                ${event.users.map(user => `<p>${user.name}</p>`).join("")}
                </div>

            </div>
        </div>
      </div>
    </div>
  `;

    const modal = document.createElement("div");
    modal.className = "event-modal";
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    const closeModalBtn = modal.querySelector(".close-btm");
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}
// Função para fechar o modal
function closeEventModal() {
    const modal = document.querySelector(".event-modal");
    if (modal) {
        modal.remove(); // Remove o modal do DOM
    }
}

// Evento para fechar o modal ao clicar em event-modal-content
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("event-modal-content")) {
        closeEventModal();
    }
});

// Função para criar elemento de usuário
function createUserElement(user) {
    const userDiv = document.createElement("div");
    userDiv.textContent = `${user.icon} ${user.name}`;
    userDiv.classList.add("user-item");
    userDiv.classList.add("mod-pess-user-unit");
    userDiv.addEventListener("click", () => toggleSelectUser(user, userDiv));
    pessoasContainer.appendChild(userDiv);
}

// Função para listar usuários com base no termo de pesquisa
function listUsers(searchTerm) {
    pessoasContainer.innerHTML = "";
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
    );
    filteredUsers.forEach(createUserElement);
}

// Função para fechar o modal de pesquisa de pessoas
function closeModal() {
    modalPesPessoa.style.display = "none";
}

// Função para abrir o modal de pesquisa de pessoas
function openModal() {
    modalPesPessoa.style.display = "block";
    listUsers("");
}

// Função para fechar o modal ao clicar fora dele
function clickOutsideModal(event) {
    if (event.target === modalPesPessoa) {
        closeModal();
    }
}

// Função para realizar a pesquisa de usuários
function searchUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    listUsers(searchTerm);
}

// Funções para adicionar e remover usuário da lista de usuários selecionados
//adiciona
function addUserToSelected(user) {
    const listItem = document.createElement("div");
    listItem.textContent = `${user.icon} ${user.name}`;
    listItem.id = `user-${user.id}`;
    listItem.className = `mod-pess-unic-pess`;
    selectedUsersList.appendChild(listItem);
}
//remove
function removeUserFromSelected(userId) {
    const listItem = document.getElementById(`user-${userId}`);
    if (listItem) {
        listItem.remove();
    }
}

// Função para alternar a seleção de um usuário
function toggleSelectUser(user, divElement) {
    const index = selectedUsers.findIndex(u => u.id === user.id);
    if (index === -1) {
        selectedUsers.push(user);
        saveSelectedUsers(selectedUsers);
        divElement.classList.add("selected");
        addUserToSelected(user);
        addUserToWrapper(user);
    } else {
        selectedUsers.splice(index, 1);
        saveSelectedUsers(selectedUsers);
        divElement.classList.remove("selected");
        removeUserFromSelected(user.id);
        removeUserFromWrapper(user.id);
    }
}

// Função para remover usuário do container
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

    // Adiciona evento para mostrar aviso ao clicar no usuário
    userDiv.addEventListener("click", () => {
        showRemoveConfirmation(user, userDiv);  // Mostra o aviso de remoção
    });

    const selectedUsersContainer = document.getElementById("selectedUsersContainer");
    selectedUsersContainer.appendChild(userDiv);
}

// Função para mostrar confirmação de remoção de usuário
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

    // Evento para confirmar remoção
    deleteYes.addEventListener("click", function () {
        userDiv.remove();
        confirmDelete.remove();
        toggleSelectUser(user, userDiv);
    });

    // Evento para cancelar remoção
    deleteNo.addEventListener("click", function () {
        confirmDelete.remove();
    });
}

// Carrega eventos do armazenamento local
getEvents();

// Inicializa o calendário ao carregar a página
initCalendar();


//------------------------------------------------------------------------------------------------//


/**
 * Eventos
 */

// Adiciona eventos aos botões de mês anterior e próximo
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Adiciona ouvintes de eventos aos elementos selecionados
btConts.addEventListener("click", openModal);
closeModalPesPessoa.addEventListener("click", closeModal);
window.addEventListener("click", clickOutsideModal);
searchInput.addEventListener("input", searchUsers);

//funão para adicionar três pontos quando o texto não cobe
document.addEventListener("DOMContentLoaded", function () {
    var eventTitles = document.querySelectorAll('.events .event .event-title h1');

    eventTitles.forEach(function (title) {
        if (title.offsetWidth < title.scrollWidth) {
            var ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            ellipsis.classList.add('ellipsis');
            title.parentNode.appendChild(ellipsis);
        }
    });
});

// Função para abrir o modal de seleção de cor
document.addEventListener('DOMContentLoaded', function () {

    const corEscolhida = document.querySelector('.cor_escolhida'),
        modal = document.getElementById("modal"),
        colorOptions = document.querySelectorAll('.color-option');

    corEscolhida.addEventListener('click', function (event) {
        event.stopPropagation();
        modal.style.display = "block";
    });

    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            const selectedColor = this.querySelector('span:first-child').style.backgroundColor;
            corEscolhida.style.backgroundColor = selectedColor;
            saveColor(selectedColor);
            modal.style.display = "none";
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Evento para abrir confirmação de remoção ao clicar em um usuário
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
                user.remove();
                confirmDelete.remove();
            });

            deleteNo.addEventListener("click", function () {
                confirmDelete.remove();
            });
        });
    });
});

// Adiciona evento ao botão "Hoje"
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

// Adiciona evento ao campo de entrada de data
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

// Adiciona evento ao botão "Ir para a data"
gotoBtn.addEventListener("click", gotoDate);

// Adiciona evento ao botão de adicionar evento
addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});

// Adiciona evento ao botão de fechar adição de evento
addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});

// Limita a quantidade de caracteres do titulo
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 40);
});

// Limita a quantidade de caracteres da descrição
addEventDescricion.addEventListener("input", (e) => {
    addEventDescricion.value = addEventDescricion.value.slice(0, 200);
});

//deixa o botão de tempo com o formato certo : 00:00
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


// Adiciona evento ao botão de envio de evento
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventDescricion = addEventDescricion.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    const SelectedColor = getColor();
    const SelectedUsers = getSelectedUsers();

    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "" || eventDescricion === "") {
        alert("por favor preencha todos os campos");
        return;
    }

    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push({
                    title: eventTitle,
                    descrição: eventDescricion,
                    time: `${eventTimeFrom} - ${eventTimeTo}`,
                    color: SelectedColor,
                    users: SelectedUsers
                });
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        const eventId = Date.now(); // Gera um ID único baseado no timestamp
        eventsArr.push({
            id: eventId, // Adiciona o ID único aqui
            day: activeDay,
            month: month + 1,
            year: year,
            events: [{
                title: eventTitle,
                descrição: eventDescricion,
                time: `${eventTimeFrom} - ${eventTimeTo}`,
                color: SelectedColor,
                users: SelectedUsers
            }],
            color: SelectedColor
        });
    }

    saveEvents();
    saveColor(SelectedColor);
    saveSelectedUsers(SelectedUsers);

    addEventWrapper.classList.remove("active");
    addEventDescricion.value = "";
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);

    showEventModal({
        title: eventTitle,
        descrição: eventDescricion,
        time: `${eventTimeFrom} - ${eventTimeTo}`,
        color: SelectedColor,
        users: SelectedUsers
    });
});

// Adiciona evento ao container de eventos para deletar evento
eventsContainer.addEventListener("click", (e) => {
    const targetClass = e.target.classList;

    if (
        targetClass.contains("event") ||
        targetClass.contains("cont-principal") ||
        targetClass.contains("cont-color") ||
        targetClass.contains("left-confg") ||
        targetClass.contains("color-select-event") ||
        e.target.closest(".event-title") ||
        e.target.closest(".event-time")
    ) {
        const eventTitleElement = e.target.closest(".event").querySelector(".event-title h1");
        const eventTitle = eventTitleElement ? eventTitleElement.innerText : null;

        eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                const selectedEvent = event.events.find(
                    (item) => item.title === eventTitle
                );
                if (selectedEvent) {
                    showEventModal(selectedEvent);
                }
            }
        });
    }
});

userDiv.addEventListener("click", () => {
    toggleSelectUser(user, userDiv);
    addUserToWrapper(user);
});
