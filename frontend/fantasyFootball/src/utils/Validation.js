export default function Validation (val) {
    const err = {}

    const fNamePattern = /^[A-Za-z][A-Za-z0-9_]{2,29}$/;
    const lNamePattern = /^[A-Za-z][A-Za-z0-9_]{2,29}$/;
    const emailPattern =  /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const contactPattern = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    if(val.fname === ""){
        err.fname = "First name is required"
    }
    if(!fNamePattern.test(val.fname)){
        err.fname = "Please enter a valid first name"
    }
    if(val.lname === ""){
        err.lname = "Last name is required"
    }
    if(!lNamePattern.test(val.lname)){
        err.lname = "Please enter a valid last name"
    }
    if(val.email === ""){
        err.email = "Email name is required"
    }
    if(!emailPattern.test(val.email)){
        err.email = "Please enter an email ID in the format username@domainname.com"
    }
    if(val.password === ""){
        err.password = "Password is required"
    }
    if(!passwordPattern.test(val.password)){
        err.password = "Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number:"
    }
    if(val.contact_no === ""){
        err.contact_no = "Contact number is required"
    }
    if(!contactPattern.test(val.contact_no)){
        err.contact_no = "Please enter a valid 10 digit contact number"
    }

    return err;
}