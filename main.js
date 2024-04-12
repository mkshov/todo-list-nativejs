let modalBtn = document.getElementById("modal-btn");
let completedList = document.getElementById("completed");
let notCompletedList = document.getElementById("not-completed");
let modal = document.getElementsByClassName("modal-parent")[0];
let modalInner = document.getElementsByClassName("add-modal")[0];

// ? modal
let inp1 = document.getElementById("title");
let inp2 = document.getElementById("description");
let inp3 = document.getElementById("date");
let addBtn = document.getElementById("add-task");

// ? edit modal
let editParent = document.getElementsByClassName("edit-modal")[0];
let editInner = document.getElementsByClassName("edit-modal__inner")[0];
let edit_inp1 = document.getElementById("edit-inp1");
let edit_inp2 = document.getElementById("edit-inp2");
let edit_inp3 = document.getElementById("edit-inp3");
let editTask = document.getElementById("edit-task");

// ? details
let detailsParent = document.getElementById("details");
let detailsInner = document.getElementById("details__inner");
let closeDetails = document.getElementById("close-details");

function toggleModal(action = null) {
  if (action === "add") {
    modal.classList.toggle("close-modal");
  } else if (action === "edit") {
    editParent.classList.toggle("close-modal");
  } else if (action === "details") {
    detailsParent.classList.toggle("close-modal");
  } else {
    modal.classList.toggle("close-modal");
    editParent.classList.toggle("close-modal");
    detailsParent.classList.toggle("close-modal");
  }
}
toggleModal();

modalBtn.addEventListener("click", () => toggleModal("add"));
modal.addEventListener("click", () => toggleModal("add"));
modalInner.addEventListener("click", (e) => {
  e.stopPropagation();
});

editParent.addEventListener("click", () => toggleModal("edit"));
editInner.addEventListener("click", (e) => {
  e.stopPropagation();
});

detailsParent.addEventListener("click", () => toggleModal("details"));
detailsInner.addEventListener("click", (e) => {
  e.stopPropagation();
});

function toLocalStorage(data) {
  let storage = JSON.parse(localStorage.getItem("tasks")) || [];

  storage.push(data);
  localStorage.setItem("tasks", JSON.stringify(storage));
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let data = {
    title: inp1.value,
    description: inp2.value,
    date: inp3.value,
    completed: false,
  };

  if (inp1.value.trim() && inp2.value.trim() && inp3.value) {
    toLocalStorage(data);
    toggleModal("add");
    alert("Данные добавились");
    renderList();
    inp1.value = "";
    inp2.value = "";
    inp3.value = "";
  } else {
    alert("Заполните поля!");
  }
});

function renderList() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  notCompletedList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task, id) => {
    // ! Создаем элемент списка
    let li = document.createElement("li");
    li.innerText = `Задача - ${task.title}`;

    // ! Создаем инпут (чекбокс) и span чтоб поместить внутрь него checkbox с текстом
    let span = document.createElement("span");
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = task.completed;
    span.innerText = "Отметить как выполненное - ";
    span.append(checkbox);
    li.append(span);

    // ! создаем удаление
    let btnDelete = document.createElement("button");
    btnDelete.innerHTML = "Удалить";
    btnDelete.classList.add("delete-btn");

    btnDelete.addEventListener("click", () => {
      tasks.splice(id, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderList();
    });

    // ! редактирование
    let btnEdit = document.createElement("button");
    btnEdit.innerText = "Редактировать";
    btnEdit.classList.add("edit-btn");

    btnEdit.addEventListener("click", () => {
      updateTask(tasks, task);
    });

    // ! Детальный просмотр
    let btnDetails = document.createElement("button");
    btnDetails.innerText = "Подробнее";
    btnDetails.classList.add("edit-btn");
    btnDetails.id = "details-btn";

    btnDetails.addEventListener("click", () => {
      taskDetails(task);
    });

    let div = document.createElement("div");
    div.classList.add("btn-group");
    div.append(btnDelete, btnEdit, btnDetails);
    li.append(div);

    checkbox.addEventListener("change", () => {
      task.completed = !task.completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderList();
    });

    if (task.completed) {
      completedList.append(li);
    } else {
      notCompletedList.append(li);
    }
  });
}

renderList();

// ! CRUD - create, read, update, delete

function updateTask(tasks, task) {
  editParent.classList.remove("close-modal");

  edit_inp1.value = task.title;
  edit_inp2.value = task.description;
  edit_inp3.value = task.date;

  editTask.addEventListener("click", (e) => {
    e.preventDefault();
    task.title = edit_inp1.value;
    task.description = edit_inp2.value;
    task.date = edit_inp3.value;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    editParent.classList.add("close-modal");
    renderList();
  });
}

// ! details
let title = document.createElement("h2");
let description = document.createElement("p");
let date = document.createElement("p");

function taskDetails(task) {
  toggleModal("details");

  title.innerText = `Задача - ${task.title}`;
  description.innerText = `Описание задачи - ${task.description}`;
  date.innerText = `Срок задачи до - ${task.date}`;

  let h1 = detailsInner.querySelector("#details-header");

  h1.insertAdjacentElement("afterend", title);
  title.insertAdjacentElement("afterend", description);
  description.insertAdjacentElement("afterend", date);
}

closeDetails.addEventListener("click", () => {
  toggleModal("details");
  title.innerHTML = "";
  description.innerHTML = "";
  date.innerHTML = "";
});
