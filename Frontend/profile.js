const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  console.log(user);
  document.getElementById("frstname").value = user.FirstName;
  document.getElementById("lastname").value = user.LastName;
  document.getElementById("proemail").value = user.email;
  document.getElementById("Username").value = user.username;
  document.getElementById("Password").value = user.password; // Note: In practice, you might not want to pre-fill the password field
} else {
  console.error("No user data found");
}
