//Edit Student
const editStudent = (index, email, obj) => {
    let students = JSON.parse(localStorage.getItem("Students")) || [];
    students[index].email = obj.email;
    students[index].name = obj.Name;
    students[index].courses = obj.courses;
    students[index].marks = obj.marks;

    localStorage.setItem("Students",JSON.stringify(students));
}


//Adding student to the database;
const addStudent = (name, email, courses, marks) => {
    let students = JSON.parse(localStorage.getItem("Students")) || [];

    for(let i=0;i<students.length;i++){
        if(students[i].email === email){
            editStudent(i,students[i].email,obj);
            return;
        }
    }
    const data = {
        name : name,
        email : email,
        courses : courses,
        marks : marks
    };

    students.push(data);

    localStorage.setItem("Students",JSON.stringify(students));
}

addStudent("Rushikesh","rautrushikesh@gmail.com","All",9130512482);


//Removing a student from the database
const removeStudent = (email) => {
    let students = JSON.parse(localStorage.getItem("Students")) || [];
    for(let i=0;i<students.length;i++){
        if(students[i].email === email){
            students.splice(i,1);
            i--;
        }
    }
    console.log("User is not present in our DB");
    localStorage.setItem("Students",JSON.stringify(students));
}

removeStudent("rautrushikesh@gmail.com")

let obj = {
    Name : "Rushikesh Raut",
    email : "rushikeshraut@gmail.com",
    courses : "MERN stack development",
    marks : 98.6
};
