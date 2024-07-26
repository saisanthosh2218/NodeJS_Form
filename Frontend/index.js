document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login");
  const signBtn = document.getElementById("sign");
  const icon = document.querySelector("#basic-addon1");
  const passwordInput = document.querySelector("#password");
  const lock = document.querySelector("#lock");

  icon.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      lock.classList.remove("fa-lock");

      lock.classList.add("fa-unlock-alt");
    } else {
      passwordInput.type = "password";
      lock.classList.add("fa-lock");

      lock.classList.remove("fa fa-unlock-alt");
    }
  });

  if (loginBtn) {
    loginBtn.addEventListener("click", handleButtonClick);
  }
  if (signBtn) {
    signBtn.addEventListener("click", handleButtonClick);
  }

  function handleButtonClick(event) {
    event.preventDefault();

    if (event.target.id === "login") {
      login(event);
    } else if (event.target.id === "sign") {
      signUp(event);
    }
  }

  function signUp(event) {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const username = document.querySelector("#username").value;
    const errorMsg = document.getElementById("error-msg");
    errorMsg.innerHTML = "";

    if (!email) {
      errorMsg.innerHTML = "Email Cannot be Empty";
      errorMsg.style.color = "red";
    } else if (!password) {
      errorMsg.innerHTML = "Password Cannot be Empty";
      errorMsg.style.color = "red";
    } else if (!username) {
      errorMsg.innerHTML = "Username Cannot be Empty";
      errorMsg.style.color = "red";
    } else {
      const data = {
        username: username,
        email: email,
        password: password,
      };

      async function fetchData() {
        try {
          const response = await fetch("http://localhost:5885/store", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            const result = await response.json();
            console.log("data posted: ", result);
          } else {
            const errorData = await response.json();
            console.error("Server response error: ", errorData);
            throw new Error("Data not posted");
          }
        } catch (error) {
          console.error("Fetch error: ", error);
        }
      }

      fetchData();
    }
  }

  function login(event) {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const loginErr = document.getElementById("login-error");
    loginErr.innerHTML = "";

    if (!email) {
      loginErr.innerHTML = "Email Cannot be Empty";
      loginErr.style.color = "red";
    } else if (!password) {
      loginErr.innerHTML = "Password Cannot be Empty";
      loginErr.style.color = "red";
    } else {
      const data = {
        email: email,
        password: password,
      };

      async function postData() {
        try {
          const response = await fetch("http://localhost:5885/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });

          const result = await response.json();

          if (response.ok && result.redirect) {
            loginErr.innerHTML = result.Message;
            window.location.assign("./ProfileManage.html");
          } else {
            loginErr.innerHTML = result.Message;
          }
        } catch (error) {
          console.error("Fetch error: ", error);
        }
      }

      postData();
    }
  }
});
