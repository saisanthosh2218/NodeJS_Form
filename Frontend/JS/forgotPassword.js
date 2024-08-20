document.addEventListener("DOMContentLoaded", function () {
  const send = document.querySelector("button");
  const reset = document.querySelector("#reset");

  reset.addEventListener("click", function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const token = urlParams.get("token");
    console.log(urlParams);
    console.log(id, token);

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
      } catch (error) {
        console.log(error);
      }
    }
    resetPassword(event);
  });

  send.addEventListener("click", function (e) {
    e.preventDefault();

    const email = document.getElementById("eadd").value;

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
    passwordChnage(e);
  });
});
