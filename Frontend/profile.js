document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const updateBtn = document.getElementById("update_profile");
  const deleteBtn = document.getElementById("delete_profile");

  if (user) {
    document.getElementById("frstname").value = user.FirstName;
    document.getElementById("lastname").value = user.LastName;
    document.getElementById("proemail").value = user.email;
    document.getElementById("Username").value = user.username;
    document.getElementById("Password").value = user.password; // Note: In practice, you might not want to pre-fill the password field
  } else {
    console.error("No user data found");
  }

  updateBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("frstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("proemail").value;
    const username = document.getElementById("Username").value;

    const updatedData = {
      firstName,
      lastName,
      email,
    };

    async function updateUser() {
      try {
        const response = await fetch(
          `http://localhost:5885/change/${username}`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const updatedUser = await response.json();
        console.log("User data updated:", updatedUser);

        const updatedUserData = updatedUser.updated;

        // Update localStorage with the updated user data
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        // Refill input fields with updated user data
        document.getElementById("frstname").value = updatedUserData.FirstName;
        document.getElementById("lastname").value = updatedUserData.LastName;
        document.getElementById("proemail").value = updatedUserData.email;
        document.getElementById("Username").value = updatedUserData.username;
        document.getElementById("Password").value = updatedUserData.password;
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }

    alert("Save The Details");

    updateUser(e);
  });

  deleteBtn.addEventListener("click", function (event) {
    event.preventDefault();

    alert("Delete Data?");

    const firstName = document.getElementById("frstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("proemail").value;
    const username = document.getElementById("Username").value;

    const deletingData = {
      firstName,
      lastName,
      email,
    };

    async function deleteUser() {
      try {
        const response = await fetch(
          `http://localhost:5885/delete/${username}`,
          {
            method: "DELETE",
            body: JSON.stringify(deletingData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const deletedUser = await response.json();
        console.log("User data deleted:", deletedUser); // Update localStorage with the deleted user data

        localStorage.removeItem("user");

        firstName.value = "";
        lastName.value = "";
        email.value = "";
        username.value = "";
        window.location.assign("./signUp.html");
      } catch (error) {
        console.log(error);
      }
    }
    deleteUser(event);
  });
});
