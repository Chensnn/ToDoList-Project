let add = document.querySelector("form button");
let section = document.querySelector("section");

add.addEventListener("click", (e) => {
  //阻擋表單送出
  e.preventDefault();

  //取三個input的值
  let form = e.target.parentElement;
  //   console.log(form.children);

  let todoText = form[0].value;
  let todoMonth = form[1].value;
  let todoDate = form[2].value;

  if (todoText === "") {
    alert("Please Enter Some Text.");
    return;
  }
  if (todoMonth === "" || todoDate === "") {
    alert("Please Enter number");
    return;
  }

  //建立List
  let todo = document.createElement("div");
  todo.classList.add("todo");

  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;

  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = `${todoMonth}  /  ${todoDate}`;

  todo.appendChild(text);
  todo.appendChild(time);

  // 建立To do check 和 trash can
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fi fi-sr-checkbox"></i>';

  completeButton.addEventListener("click", (e) => {
    // console.log(e.target.parentElement.children[0]);
    let todoItemText = e.target.parentElement.children[0];
    let todoItemTime = e.target.parentElement.children[1];
    // let todoItem = e.target.parentElement;
    // todoItem.classList.toggle("done");
    todoItemText.classList.toggle("done");
    todoItemTime.classList.toggle("done");
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fi fi-bs-trash"></i>';

  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;

    // 讓animation跑完再移除
    todoItem.addEventListener("animationend", () => {
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });

      todoItem.remove();
    });

    todoItem.style.animation = "scaleDown .3s forwards";
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);
  todo.style.animation = "scaleUp .3s forwards";

  //資料存進array變object

  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  console.log(JSON.parse(localStorage.getItem("list")));

  // click之後移除input
  form[0].value = "";
  form[1].value = "";
  form[2].value = "";
  section.appendChild(todo);
});
//=======================================================================================

loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);

    myListArray.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");

      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;

      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = `${item.todoMonth}  /  ${item.todoDate}`;

      todo.appendChild(text);
      todo.appendChild(time);

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fi fi-sr-checkbox"></i>';

      completeButton.addEventListener("click", (e) => {
        // console.log(e.target.parentElement.children[0]);
        let todoItemText = e.target.parentElement.children[0];
        let todoItemTime = e.target.parentElement.children[1];
        // let todoItem = e.target.parentElement;
        // todoItem.classList.toggle("done");
        todoItemText.classList.toggle("done");
        todoItemTime.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fi fi-bs-trash"></i>';

      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;

        // 讓animation跑完再移除
        todoItem.addEventListener("animationend", () => {
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });

          todoItem.remove();
        });

        todoItem.style.animation = "scaleDown .3s forwards";
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    });
  }
}

// 做排序
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  loadData();
});
