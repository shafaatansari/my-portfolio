// ===============================
// PORTFOLIO JAVASCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // Typing Animation
    // ===============================

    const typingElement = document.getElementById("typing");

    const words = [
        "Cyber Expert",
        "Student",
        "Web Developer"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {

        if (!typingElement) return;

        const currentWord = words[wordIndex];

        if (!isDeleting) {

            typingElement.textContent =
                currentWord.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentWord.length) {

                isDeleting = true;

                setTimeout(typeEffect, 1500);
                return;
            }

        } else {

            typingElement.textContent =
                currentWord.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {

                isDeleting = false;

                wordIndex++;

                if (wordIndex >= words.length) {
                    wordIndex = 0;
                }
            }
        }

        setTimeout(
            typeEffect,
            isDeleting ? 55 : 100
        );
    }

    typeEffect();


    // ===============================
    // Theme Toggle
    // ===============================

    const themeBtn = document.getElementById("themeBtn");

    // Check saved theme
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");

        if (themeBtn) {
            themeBtn.textContent = "☀️";
        }
    } else {
        document.body.classList.remove("light");

        if (themeBtn) {
            themeBtn.textContent = "🌙";
        }
    }

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("light");

            const isLight =
                document.body.classList.contains("light");

            themeBtn.textContent =
                isLight ? "☀️" : "🌙";

            localStorage.setItem(
                "portfolio-theme",
                isLight ? "light" : "dark"
            );

        });
    }


    // ===============================
    // Mobile Menu
    // ===============================

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("active");

            const isOpen =
                navLinks.classList.contains("active");

            menuBtn.textContent =
                isOpen ? "✕" : "☰";

        });

        document
            .querySelectorAll(".nav-links a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navLinks.classList.remove("active");

                    menuBtn.textContent = "☰";

                });

            });
    }


    // ===============================
    // Scroll Reveal
    // ===============================

    const revealElements =
        document.querySelectorAll(".reveal");

    function revealOnScroll() {

        revealElements.forEach(element => {

            const elementTop =
                element.getBoundingClientRect().top;

            const windowHeight =
                window.innerHeight;

            if (elementTop < windowHeight - 100) {

                element.classList.add("active");

            }

        });
    }

    window.addEventListener(
        "scroll",
        revealOnScroll,
        { passive: true }
    );

    revealOnScroll();


    // ===============================
    // Back To Top
    // ===============================

    const topBtn =
        document.getElementById("topBtn");

    if (topBtn) {

        function handleTopButton() {

            if (window.scrollY > 500) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }
        }

        window.addEventListener(
            "scroll",
            handleTopButton,
            { passive: true }
        );

        topBtn.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

        handleTopButton();
    }


    // ===============================
    // Contact Form
    // ===============================

    const contactForm =
        document.getElementById("contactForm");

    const formStatus =
        document.getElementById("formStatus");

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const name =
                    document.getElementById("name")?.value.trim();

                const email =
                    document.getElementById("email")?.value.trim();

                const message =
                    document.getElementById("message")?.value.trim();

                if (!name || !email || !message) {

                    if (formStatus) {
                        formStatus.textContent =
                            "Please fill all fields.";
                    }

                    return;
                }

                if (formStatus) {
                    formStatus.textContent =
                        "Sending...";
                }

                try {

                    const response = await fetch(
                        "http://localhost:5000/send-message",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                message
                            })
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            "Server error"
                        );
                    }

                    const data =
                        await response.json();

                    if (data.success) {

                        if (formStatus) {
                            formStatus.textContent =
                                "Message sent successfully!";
                        }

                        contactForm.reset();

                    } else {

                        if (formStatus) {
                            formStatus.textContent =
                                data.message ||
                                "Message could not be sent.";
                        }
                    }

                } catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );

                    if (formStatus) {
                        formStatus.textContent =
                            "Unable to send message. Please try again later.";
                    }
                }
            }
        );
    }


    // ===============================
    // Current Year
    // ===============================

    const yearElement =
        document.getElementById("year");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();
    }


    // ===============================
    // Smooth Navigation
    // ===============================

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });

});
