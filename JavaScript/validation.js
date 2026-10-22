const validateStudent = (data) => {
    // data.preventDefault();
    data.name = "";
    data.email = "";
    data.mobile = "";
    data.course = "";

    let valid = true;
    if(data.Name.lenght < 3){
        valid = false;
        return valid;
    }
    if(!data.email.includes(".com")){
        valid = false;
        return valid;
    }
    if(data.mobile.length !== 10){
        valid = false;
        return valid;
    }
};

