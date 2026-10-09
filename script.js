const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const emptyMessage = document.getElementById("empty-message");

let tasks = [];

try {
    const savedTasks = localStorage.getItem("taskflow-tasks");

    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks.filter(
                task =>
                    task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean"
            );
        }
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

function saveTasks() {
    try {
        localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
    } catch (error) {
        alert("Could not save tasks in your browser.");
        console.error(error);
    }
}

function updateSummary() {
    totalCount.textContent = tasks.length;

    completedCount.textContent = tasks.filter(
        task => task.completed
    ).length;

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    updateSummary();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

renderTasks();