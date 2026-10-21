// =========================================
// HRGENIUS FRONTEND AUTHENTICATION
// =========================================

const AUTH_API = "http://localhost:5000/api/auth";


// =========================================
// LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const remember =
            document.getElementById("remember").checked;

        const loginMessage =
            document.getElementById("loginMessage");


        // Basic validation
        if (!email || !password) {

            loginMessage.textContent =
                "Please enter email and password.";

            return;
        }


        // Show loading message
        loginMessage.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(`${AUTH_API}/login`, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })

                });


            const data =
                await response.json();


            // Login failed
            if (!response.ok) {

                loginMessage.textContent =
                    data.error || "Login failed.";

                return;
            }


            // Store authentication data
            if (remember) {

                localStorage.setItem(
                    "hrgeniusToken",
                    data.token
                );

                localStorage.setItem(
                    "hrgeniusUser",
                    JSON.stringify(data.user)
                );

            } else {

                sessionStorage.setItem(
                    "hrgeniusToken",
                    data.token
                );

                sessionStorage.setItem(
                    "hrgeniusUser",
                    JSON.stringify(data.user)
                );

            }


            // Keep compatibility with old frontend checks
            localStorage.setItem(
                "hrgeniusLoggedIn",
                "true"
            );


            loginMessage.textContent =
                "Login successful. Opening dashboard...";


            // Redirect
            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 500);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to HRGenius server.";

        }

    });

}


// =========================================
// FORGOT PASSWORD
// =========================================

function forgotPassword(event) {

    if (event) {
        event.preventDefault();
    }

    const loginMessage =
        document.getElementById("loginMessage");

    if (loginMessage) {

        loginMessage.textContent =
            "Please contact the HR administrator to reset your password.";

    }

}


// =========================================
// LOGOUT
// =========================================

function logoutUser() {

    localStorage.removeItem("hrgeniusToken");
    localStorage.removeItem("hrgeniusUser");
    localStorage.removeItem("hrgeniusLoggedIn");

    sessionStorage.removeItem("hrgeniusToken");
    sessionStorage.removeItem("hrgeniusUser");

    window.location.href =
        "index.html";

}