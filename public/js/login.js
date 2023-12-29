const email = document.getElementById("email")
const error =  document.getElementById("err")
const password = document.getElementById("password")

password.addEventListener("input",e=>{
    let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/; 
    if(!regex.test(e.target.value.trim())){
        error.innerText = "Password must begin with a capital and contain lower, number and alphanumeric character"
        return false
    } else{
        error.innerText = ""
    }
})

email.addEventListener('input',e=>{
    let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
    if(!regex.test(e.target.value.trim())){
        error.innerText = "Email is invalid !"
        return false
    } else{
        error.innerText = ""
    }
})

document.getElementById("loginBtn").addEventListener('click',e=>{
    if(error.innerText!=""){
        return false; 
    } else if(email.value.trim()=="" || password.value.trim()==""){
        error.innerText = "Enter Email and Password !"
        return false
    }
    fetch("/login",{
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
            email: email.value,
            password: (password.value)
        })
    })
    .then((result) => {
        if(result.ok){
            location.href = "home"
        } else if(result.status===404){
            error.innerText = "Invalid Email or Password !"
        } else if(result.status==403){
            error.innerText = "Your signup request is not approved yet!"
        }
        setTimeout(()=>{
            error.innerText = ""
        },3000) 
    }).catch((err) => {
        error.innerText = err
    });
})

document.getElementById("hideShowPass").addEventListener('click',e=>{
    if(e.target.classList.contains("fa-eye")){
        e.target.classList.remove("fa-eye")
        e.target.classList.add("fa-eye-slash")
        password.type = "text"
    } else {
        e.target.classList.add("fa-eye")
        e.target.classList.remove("fa-eye-slash")
        password.type = "password"
    }
})