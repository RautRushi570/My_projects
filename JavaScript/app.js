const STORAGE_KEY = "Students";

const studentForm = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const courseInput = document.getElementById("course");
const studentMarksInput = document.getElementById("studentMarks");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitbtn");
const studentTableBody = document.querySelector("tbody");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const emptyMessage = document.getElementById("emptymsg");

const getStudents = () => {
    const storedStudents = localStorage.getItem(STORAGE_KEY);
    if (!storedStudents) {
        return [];
    }

    const students = JSON.parse(storedStudents);
    if (!Array.isArray(students)) {
        throw new Error("Saved student data must be a list.");
    }

    return students;
};

const saveStudents = (students) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const getGrade = (marks) => {
    if (marks >= 90) return "A";
    if (marks >= 80) return "B";
    if (marks >= 70) return "C";
    if (marks >= 60) return "D";
    return "F";
};

const updateStatistics = (students) => {
    const totalMarks = students.reduce((sum, student) => sum + Number(student.marks || 0), 0);
    const courses = new Set(students.map((student) => student.courses).filter(Boolean));
    const averageMarks = students.length ? totalMarks / students.length : 0;

    document.getElementById("totalStudent").textContent = String(students.length);
    document.getElementById("averageMarks").textContent = averageMarks.toFixed(1);
    document.getElementById("totalCourses").textContent = String(courses.size);
};

const appendCell = (row, value) => {
    const cell = document.createElement("td");
    cell.textContent = String(value);
    row.appendChild(cell);
    return cell;
};

const renderStudents = () => {
    const students = getStudents();
    const searchTerm = searchInput.value.trim().toLocaleLowerCase();
    const selectedCourse = filterCourse.value;
    const matchingStudents = students
        .map((student, index) => ({ student, index }))
        .filter(({ student }) => {
            const matchesSearch = `${student.name || ""} ${student.email || ""}`
                .toLocaleLowerCase()
                .includes(searchTerm);
            const matchesCourse = selectedCourse === "empty" || student.courses === selectedCourse;
            return matchesSearch && matchesCourse;
        });

    studentTableBody.replaceChildren();

    matchingStudents.forEach(({ student, index }) => {
        const row = document.createElement("tr");
        const marks = Number(student.marks);

        appendCell(row, student.id || index + 1);
        appendCell(row, student.name || "");
        appendCell(row, student.email || "");
        appendCell(row, student.courses || "");
        appendCell(row, Number.isFinite(marks) ? marks : "");

        const gradeCell = document.createElement("td");
        const grade = document.createElement("span");
        grade.className = `grade grade-${getGrade(Number.isFinite(marks) ? marks : 0)}`;
        grade.textContent = getGrade(Number.isFinite(marks) ? marks : 0);
        gradeCell.appendChild(grade);
        row.appendChild(gradeCell);

        const actionsCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit";
        editButton.dataset.action = "edit";
        editButton.dataset.index = String(index);
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.index = String(index);
        deleteButton.textContent = "Delete";

        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);
        studentTableBody.appendChild(row);
    });

    emptyMessage.hidden = matchingStudents.length > 0;
    updateStatistics(students);
};

const resetFormMode = () => {
    studentIdInput.value = "";
    formTitle.textContent = "Add new Student";
    submitButton.textContent = "Add Student";
};

studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const students = getStudents();
    const editingIndex = studentIdInput.value === "" ? -1 : Number(studentIdInput.value);
    const name = studentNameInput.value.trim();
    const email = studentEmailInput.value.trim();
    const courses = courseInput.value;
    const marks = studentMarksInput.valueAsNumber;

    studentNameInput.setCustomValidity(name ? "" : "Enter a student name.");
    courseInput.setCustomValidity(courses !== "empty" ? "" : "Select a course.");
    studentMarksInput.setCustomValidity(
        Number.isFinite(marks) && marks >= 0 && marks <= 100
            ? ""
            : "Enter marks between 0 and 100."
    );

    if (!studentForm.reportValidity()) {
        return;
    }

    const duplicateEmail = students.some((student, index) =>
        index !== editingIndex && String(student.email).toLocaleLowerCase() === email.toLocaleLowerCase()
    );
    if (duplicateEmail) {
        studentEmailInput.setCustomValidity("A student with this email already exists.");
        studentEmailInput.reportValidity();
        return;
    }
    studentEmailInput.setCustomValidity("");

    const student = { name, email, courses, marks };
    if (editingIndex >= 0 && editingIndex < students.length) {
        student.id = students[editingIndex].id;
        students[editingIndex] = student;
    } else {
        student.id = globalThis.crypto.randomUUID();
        students.push(student);
    }

    saveStudents(students);
    studentForm.reset();
    resetFormMode();
    renderStudents();

});

studentForm.addEventListener("reset", () => {
    studentEmailInput.setCustomValidity("");
    studentNameInput.setCustomValidity("");
    courseInput.setCustomValidity("");
    studentMarksInput.setCustomValidity("");
    resetFormMode();
});

studentEmailInput.addEventListener("input", () => {
    studentEmailInput.setCustomValidity("");
});

studentTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);
    const students = getStudents();
    const student = students[index];
    if (!student) {
        return;
    }

    if (button.dataset.action === "delete") {
        students.splice(index, 1);
        saveStudents(students);
        renderStudents();
        return;
    }

    studentIdInput.value = String(index);
    studentNameInput.value = student.name || "";
    studentEmailInput.value = student.email || "";
    courseInput.value = student.courses || "empty";
    studentMarksInput.value = student.marks ?? "";
    formTitle.textContent = "Edit Student";
    submitButton.textContent = "Save Changes";
    studentNameInput.focus();
});

searchInput.addEventListener("input", renderStudents);
filterCourse.addEventListener("change", renderStudents);

const themeButton = document.getElementById("themebtn");
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

document.getElementById("currentYear").textContent = String(new Date().getFullYear());

renderStudents();