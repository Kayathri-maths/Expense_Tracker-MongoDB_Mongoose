document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("forgotPasswordForm");
    signupForm.addEventListener("submit", forgotpassword);
});
async function forgotpassword(event) {
    try {
        event.preventDefault();
        const userDetails = {
            email: event.target.email.value
        }
        console.log(userDetails);
        const response = await axios.post('http://localhost:3000/password/forgotpassword', userDetails);
        if (response.status === 202) {
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong')
        }
    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
}