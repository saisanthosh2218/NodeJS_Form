document.addEventListener("DOMContentLoaded", function () {
  const send = document.getElementById("send");
  const reset = document.getElementById("reset");

  if (send) {
    send.addEventListener("click", handleButtonClick);
  }
  if (reset) {
    reset.addEventListener("click", handleButtonClick);
  }

  function handleButtonClick(event) {
    event.preventDefault();

    if (event.target.id === "send") {
      forgotPassword(event);
    } else if (event.target.id === "reset") {
      resetPassword(event);
    }
  }

  function resetPassword(event) {
    event.preventDefault();

    const pathParts = window.location.search.split("/");
    const id = pathParts[1];
    const token = pathParts[2];

    const password = document.querySelector("#passn").value;

    const data = {
      password,
    };

    const url = `http://localhost:5885/reset_password/${id}/${token}`;

    async function resetPassword() {
      try {
        const ressponse = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!ressponse) {
          console.log("request failed", response.status);
        }

        const result = await ressponse.json();

        console.log(result.message);
      } catch (error) {
        console.log(error);
      }
    }
    resetPassword(event);
  }

  function forgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById("emadd").value;

    const data = {
      email,
    };

    const url = "http://localhost:5885/password/retrive";

    async function passwordChnage() {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response) {
          console.error("request failed", response.status);
        }

        const doneUpdate = await response.json();

        console.log(doneUpdate.message);
      } catch (error) {
        console.log(error);
      }
    }
    passwordChnage(event);
  }
});
