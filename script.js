"use strict";

/* =========================================================
   Drpatrick GPA Calc
   Complete Application Logic
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "drpatrick_gpa_calc_data";
const THEME_KEY = "drpatrick_gpa_theme";


/* =========================================================
   GRADE SYSTEM
========================================================= */

const gradePoints = {

    "A": 4.00,
    "A-": 3.70,

    "B+": 3.30,
    "B": 3.00,
    "B-": 2.70,

    "C+": 2.30,
    "C": 2.00,
    "C-": 1.70,

    "D": 1.00,
    "F": 0.00

};


/* =========================================================
   APPLICATION STATE
========================================================= */

let subjects = [];

let subjectCounter = 0;


/* =========================================================
   DOM
========================================================= */

const subjectsContainer =
    document.getElementById("subjectsContainer");

const emptyState =
    document.getElementById("emptyState");

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const calculateBtn =
    document.getElementById("calculateBtn");

const resetBtn =
    document.getElementById("resetBtn");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const gpaResult =
    document.getElementById("gpaResult");

const gpaMessage =
    document.getElementById("gpaMessage");

const gpaPercentage =
    document.getElementById("gpaPercentage");

const subjectsCount =
    document.getElementById("subjectsCount");

const totalHours =
    document.getElementById("totalHours");

const totalPoints =
    document.getElementById("totalPoints");

const gpaCircle =
    document.querySelector(".gpa-circle");

const semesterGPA =
    document.getElementById("semesterGPA");

const cumulativeGPA =
    document.getElementById("cumulativeGPA");

const combinedHours =
    document.getElementById("combinedHours");

const combinedPoints =
    document.getElementById("combinedPoints");

const previousGPA =
    document.getElementById("previousGPA");

const previousHours =
    document.getElementById("previousHours");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    loadTheme();

    loadData();

    renderSubjects();

    updateStatistics();

    calculateGPA(false);

}


/* =========================================================
   EVENTS
========================================================= */

addSubjectBtn.addEventListener(
    "click",
    () => {

        addSubject();

    }
);


emptyAddBtn.addEventListener(
    "click",
    () => {

        addSubject();

    }
);


calculateBtn.addEventListener(
    "click",
    () => {

        calculateGPA(true);

    }
);


resetBtn.addEventListener(
    "click",
    () => {

        resetCalculator();

    }
);


themeToggle.addEventListener(
    "click",
    () => {

        toggleTheme();

    }
);


/* =========================================================
   PREVIOUS GPA INPUTS
========================================================= */

previousGPA.addEventListener(
    "input",
    () => {

        saveData();

        calculateGPA(false);

    }
);


previousHours.addEventListener(
    "input",
    () => {

        saveData();

        calculateGPA(false);

    }
);


/* =========================================================
   ADD SUBJECT
========================================================= */

function addSubject(
    name = "",
    hours = "",
    grade = ""
) {

    subjectCounter++;

    const subject = {

        id:
            Date.now() +
            subjectCounter,

        name,

        hours,

        grade

    };


    subjects.push(subject);


    renderSubjects();


    updateStatistics();


    saveData();


    /*
       Scroll to new subject
    */

    setTimeout(
        () => {

            const cards =
                subjectsContainer.querySelectorAll(
                    ".subject-card"
                );


            const lastCard =
                cards[cards.length - 1];


            if (lastCard) {

                lastCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        },
        100
    );


    showToast(
        "تمت إضافة مادة جديدة",
        "✓"
    );

}


/* =========================================================
   DELETE SUBJECT
========================================================= */

function deleteSubject(id) {

    subjects =
        subjects.filter(
            subject =>
                subject.id !== id
        );


    renderSubjects();


    updateStatistics();


    calculateGPA(false);


    saveData();


    showToast(
        "تم حذف المادة",
        "✓"
    );

}


/* =========================================================
   UPDATE SUBJECT
========================================================= */

function updateSubject(
    id,
    property,
    value
) {

    const subject =
        subjects.find(
            item =>
                item.id === id
        );


    if (!subject) {

        return;

    }


    if (
        property === "hours"
    ) {

        const number =
            parseFloat(value);


        subject.hours =
            Number.isFinite(number)
                ? number
                : "";

    } else {

        subject[property] =
            value;

    }


    saveData();


    updateStatistics();


    calculateGPA(false);

}


/* =========================================================
   RENDER SUBJECTS
========================================================= */

function renderSubjects() {

    const oldCards =
        subjectsContainer.querySelectorAll(
            ".subject-card"
        );


    oldCards.forEach(
        card => card.remove()
    );


    if (
        subjects.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    subjects.forEach(
        (
            subject,
            index
        ) => {

            const card =
                createSubjectCard(
                    subject,
                    index
                );


            subjectsContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE SUBJECT CARD
========================================================= */

function createSubjectCard(
    subject,
    index
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "subject-card";


    card.dataset.id =
        subject.id;


    /* -----------------------------------------
       NAME
    ----------------------------------------- */

    const nameGroup =
        document.createElement(
            "div"
        );


    nameGroup.className =
        "field-group";


    const nameLabel =
        document.createElement(
            "label"
        );


    nameLabel.textContent =
        "اسم المادة";


    const nameInput =
        document.createElement(
            "input"
        );


    nameInput.type =
        "text";


    nameInput.placeholder =
        "مثال: Anatomy";


    nameInput.value =
        subject.name;


    nameInput.autocomplete =
        "off";


    nameInput.addEventListener(
        "input",
        event => {

            updateSubject(
                subject.id,
                "name",
                event.target.value
            );

        }
    );


    nameGroup.appendChild(
        nameLabel
    );


    nameGroup.appendChild(
        nameInput
    );


    /* -----------------------------------------
       HOURS
    ----------------------------------------- */

    const hoursGroup =
        document.createElement(
            "div"
        );


    hoursGroup.className =
        "field-group";


    const hoursLabel =
        document.createElement(
            "label"
        );


    hoursLabel.textContent =
        "عدد الساعات";


    const hoursInput =
        document.createElement(
            "input"
        );


    hoursInput.type =
        "number";


    hoursInput.min =
        "0.5";


    hoursInput.max =
        "30";


    hoursInput.step =
        "0.5";


    hoursInput.placeholder =
        "مثال: 3";


    hoursInput.value =
        subject.hours;


    hoursInput.addEventListener(
        "input",
        event => {

            updateSubject(
                subject.id,
                "hours",
                event.target.value
            );

        }
    );


    hoursGroup.appendChild(
        hoursLabel
    );


    hoursGroup.appendChild(
        hoursInput
    );


    /* -----------------------------------------
       GRADE
    ----------------------------------------- */

    const gradeGroup =
        document.createElement(
            "div"
        );


    gradeGroup.className =
        "field-group";


    const gradeLabel =
        document.createElement(
            "label"
        );


    gradeLabel.textContent =
        "التقدير";


    const gradeSelect =
        document.createElement(
            "select"
        );


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value =
        "";


    defaultOption.textContent =
        "اختر التقدير";


    gradeSelect.appendChild(
        defaultOption
    );


    Object.entries(
        gradePoints
    ).forEach(
        (
            [grade, points]
        ) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                grade;


            option.textContent =
                `${grade} — ${points.toFixed(2)}`;


            if (
                subject.grade === grade
            ) {

                option.selected =
                    true;

            }


            gradeSelect.appendChild(
                option
            );

        }
    );


    gradeSelect.addEventListener(
        "change",
        event => {

            updateSubject(
                subject.id,
                "grade",
                event.target.value
            );

        }
    );


    gradeGroup.appendChild(
        gradeLabel
    );


    gradeGroup.appendChild(
        gradeSelect
    );


    /* -----------------------------------------
       DELETE
    ----------------------------------------- */

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-subject";


    deleteButton.innerHTML =
        "🗑️";


    deleteButton.title =
        "حذف المادة";


    deleteButton.setAttribute(
        "aria-label",
        "حذف المادة"
    );


    deleteButton.addEventListener(
        "click",
        () => {

            deleteSubject(
                subject.id
            );

        }
    );


    /* -----------------------------------------
       CARD ASSEMBLY
    ----------------------------------------- */

    card.appendChild(
        nameGroup
    );


    card.appendChild(
        hoursGroup
    );


    card.appendChild(
        gradeGroup
    );


    card.appendChild(
        deleteButton
    );


    return card;

}


/* =========================================================
   GPA CALCULATION
========================================================= */

function calculateGPA(
    showNotification = false
) {

    let semesterHours = 0;

    let semesterPoints = 0;

    let validSubjects = 0;


    subjects.forEach(
        subject => {

            const hours =
                parseFloat(
                    subject.hours
                );


            const points =
                gradePoints[
                    subject.grade
                ];


            if (
                Number.isFinite(hours) &&
                hours > 0 &&
                typeof points === "number"
            ) {

                semesterHours +=
                    hours;


                semesterPoints +=
                    hours * points;


                validSubjects++;

            }

        }
    );


    let semesterGpaValue = 0;


    if (
        semesterHours > 0
    ) {

        semesterGpaValue =
            semesterPoints /
            semesterHours;

    }


    /* -----------------------------------------
       PREVIOUS DATA
    ----------------------------------------- */

    let oldGPA =
        parseFloat(
            previousGPA.value
        );


    let oldHours =
        parseFloat(
            previousHours.value
        );


    if (
        !Number.isFinite(oldGPA) ||
        oldGPA < 0
    ) {

        oldGPA = 0;

    }


    if (
        !Number.isFinite(oldHours) ||
        oldHours < 0
    ) {

        oldHours = 0;

    }


    /*
       GPA cannot exceed 4
    */

    oldGPA =
        Math.min(
            oldGPA,
            4
        );


    /* -----------------------------------------
       PREVIOUS QUALITY POINTS
    ----------------------------------------- */

    const oldPoints =
        oldGPA *
        oldHours;


    /* -----------------------------------------
       CUMULATIVE
    ----------------------------------------- */

    const combinedCreditHours =
        oldHours +
        semesterHours;


    const combinedQualityPoints =
        oldPoints +
        semesterPoints;


    let cumulativeValue = 0;


    if (
        combinedCreditHours > 0
    ) {

        cumulativeValue =
            combinedQualityPoints /
            combinedCreditHours;

    }


    cumulativeValue =
        Math.min(
            cumulativeValue,
            4
        );


    /* -----------------------------------------
       UPDATE UI
    ----------------------------------------- */

    semesterGPA.textContent =
        semesterGpaValue.toFixed(2);


    cumulativeGPA.textContent =
        cumulativeValue.toFixed(2);


    combinedHours.textContent =
        formatNumber(
            combinedCreditHours
        );


    combinedPoints.textContent =
        combinedQualityPoints.toFixed(2);


    /*
       Main GPA becomes cumulative GPA
       if previous data exists.
    */

    const mainGPA =
        combinedCreditHours > 0
            ? cumulativeValue
            : 0;


    setMainGPA(
        mainGPA
    );


    if (
        showNotification
    ) {

        if (
            validSubjects === 0
        ) {

            showToast(
                "أدخل الساعات والتقديرات للمواد",
                "!"
            );

        } else {

            showToast(
                "تم حساب المعدل بنجاح",
                "✓"
            );

        }

    }


    saveData();


    return {

        semesterGPA:
            semesterGpaValue,

        cumulativeGPA:
            cumulativeValue,

        semesterHours,

        semesterPoints,

        combinedCreditHours,

        combinedQualityPoints

    };

}


/* =========================================================
   MAIN GPA
========================================================= */

function setMainGPA(
    gpa
) {

    const safeGPA =
        Math.max(
            0,
            Math.min(
                4,
                Number(gpa) || 0
            )
        );


    gpaResult.textContent =
        safeGPA.toFixed(2);


    const percentage =
        Math.round(
            (safeGPA / 4) * 100
        );


    gpaPercentage.textContent =
        `${percentage}%`;


    updateGPACircle(
        safeGPA
    );


    updateGPAMessage(
        safeGPA
    );

}


/* =========================================================
   GPA CIRCLE
========================================================= */

function updateGPACircle(
    gpa
) {

    if (!gpaCircle) {

        return;

    }


    const degree =
        (gpa / 4) * 360;


    gpaCircle.style.background =
        `
        conic-gradient(
            rgba(255,255,255,.95)
            ${degree}deg,

            rgba(255,255,255,.12)
            ${degree}deg
        )
        `;

}


/* =========================================================
   GPA MESSAGE
========================================================= */

function updateGPAMessage(
    gpa
) {

    let message;


    if (
        gpa === 0
    ) {

        message =
            "أضف المواد لحساب المعدل";


    } else if (
        gpa >= 3.7
    ) {

        message =
            "ممتاز جدًا! أداء أكاديمي رائع 🔥";


    } else if (
        gpa >= 3.3
    ) {

        message =
            "ممتاز! استمر على هذا المستوى 👏";


    } else if (
        gpa >= 3.0
    ) {

        message =
            "جيد جدًا! يمكنك الوصول للأعلى 💪";


    } else if (
        gpa >= 2.7
    ) {

        message =
            "جيد! استمر في تحسين مستواك 📚";


    } else if (
        gpa >= 2.0
    ) {

        message =
            "حاول تحسين مستواك في المواد القادمة 💡";


    } else {

        message =
            "لا تستسلم، يمكنك تحسين معدلك ❤️";

    }


    gpaMessage.textContent =
        message;

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    subjectsCount.textContent =
        subjects.length;


    let hours = 0;

    let points = 0;


    subjects.forEach(
        subject => {

            const h =
                parseFloat(
                    subject.hours
                );


            const p =
                gradePoints[
                    subject.grade
                ];


            if (
                Number.isFinite(h) &&
                h > 0
            ) {

                hours += h;


                if (
                    typeof p ===
                    "number"
                ) {

                    points +=
                        h * p;

                }

            }

        }
    );


    totalHours.textContent =
        formatNumber(
            hours
        );


    totalPoints.textContent =
        points.toFixed(2);

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(
    number
) {

    if (
        Number.isInteger(number)
    ) {

        return String(number);

    }


    return Number(number)
        .toFixed(1)
        .replace(
            /\.0$/,
            ""
        );

}


/* =========================================================
   RESET
========================================================= */

function resetCalculator() {

    const confirmed =
        confirm(
            "هل أنت متأكد من حذف جميع البيانات؟"
        );


    if (!confirmed) {

        return;

    }


    subjects = [];

    subjectCounter = 0;


    previousGPA.value =
        "";

    previousHours.value =
        "";


    localStorage.removeItem(
        STORAGE_KEY
    );


    renderSubjects();


    updateStatistics();


    calculateGPA(false);


    showToast(
        "تمت إعادة تعيين الحاسبة",
        "✓"
    );

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {

    try {

        const data = {

            subjects,

            previousGPA:
                previousGPA.value,

            previousHours:
                previousHours.value

        };


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );


    } catch (error) {

        console.error(
            "Storage Error:",
            error
        );

    }

}


/* =========================================================
   LOAD DATA
========================================================= */

function loadData() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            return;

        }


        const data =
            JSON.parse(
                saved
            );


        if (
            Array.isArray(
                data.subjects
            )
        ) {

            subjects =
                data.subjects;

        }


        if (
            data.previousGPA !==
            undefined
        ) {

            previousGPA.value =
                data.previousGPA;

        }


        if (
            data.previousHours !==
            undefined
        ) {

            previousHours.value =
                data.previousHours;

        }


        subjectCounter =
            subjects.length;


    } catch (error) {

        console.error(
            "Load Error:",
            error
        );

        subjects = [];

    }

}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.toggle(
            "dark-mode"
        );


    localStorage.setItem(
        THEME_KEY,
        isDark
            ? "dark"
            : "light"
    );


    updateThemeUI(
        isDark
    );

}


/* =========================================================
   LOAD THEME
========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    const isDark =
        savedTheme === "dark" ||
        (
            savedTheme === null &&
            prefersDark
        );


    if (isDark) {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }


    updateThemeUI(
        isDark
    );

}


/* =========================================================
   UPDATE THEME UI
========================================================= */

function updateThemeUI(
    isDark
) {

    if (
        !themeIcon ||
        !themeText
    ) {

        return;

    }


    if (isDark) {

        themeIcon.textContent =
            "☀️";

        themeText.textContent =
            "الوضع الفاتح";

    } else {

        themeIcon.textContent =
            "🌙";

        themeText.textContent =
            "الوضع الداكن";

    }

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    message,
    icon = "✓"
) {

    if (!toast) {

        return;

    }


    toastMessage.textContent =
        message;


    toastIcon.textContent =
        icon;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   AUTO SAVE
========================================================= */

setInterval(
    () => {

        saveData();

    },
    5000
);


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           Ctrl + Enter
           Calculate GPA
        */

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            calculateGPA(true);

        }


        /*
           Ctrl + D
           Toggle Dark Mode
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            toggleTheme();

        }

    }
);