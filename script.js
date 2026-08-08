```javascript
/* =========================================================
   BLACK OPS // FPS ARENA
   SCRIPT.JS
   UI + GAME CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    const screens = {

        loading:
            $("#loading-screen"),

        menu:
            $("#main-menu"),

        game:
            $("#game"),

        pause:
            $("#pause-screen"),

        result:
            $("#game-over-screen")

    };


    const buttons = {

        deploy:
            $("#deploy-btn"),

        resume:
            $("#resume-btn"),

        restart:
            $("#restart-btn"),

        menu:
            $("#menu-btn")

    };


    /* =====================================================
       GAME STATE
       ===================================================== */

    const GameState = {

        current: "LOADING",

        missionTime: 0,

        maxMissionTime: 300,

        timerRunning: false,

        initialized: false,

        mobile: false

    };


    /* =====================================================
       UTILITY
       ===================================================== */

    function showScreen(screen) {

        Object.values(screens).forEach(
            element => {

                if (element) {

                    element.classList.add(
                        "hidden"
                    );

                }

            }
        );


        if (screen) {

            screen.classList.remove(
                "hidden"
            );

        }

    }


    function delay(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }


    /* =====================================================
       LOADING SYSTEM
       ===================================================== */

    async function startLoading() {

        showScreen(
            screens.loading
        );


        const progress =
            $("#loading-progress");


        const percentage =
            $("#loading-percentage");


        const status =
            $("#loading-status");


        const messages = [

            "INITIALIZING COMBAT SYSTEM",

            "LOADING ARENA",

            "INITIALIZING WEAPON SYSTEM",

            "SYNCING TARGET DATABASE",

            "CALIBRATING HUD",

            "ESTABLISHING SECURE LINK",

            "SYSTEM READY"

        ];


        for (
            let i = 0;
            i <= 100;
            i++
        ) {

            if (progress) {

                progress.style.width =
                    `${i}%`;

            }


            if (percentage) {

                percentage.textContent =
                    `${i}%`;

            }


            if (status) {

                const index =
                    Math.min(
                        messages.length - 1,
                        Math.floor(
                            i /
                            (100 /
                            messages.length)
                        )
                    );


                status.textContent =
                    messages[index];

            }


            await delay(
                15 + Math.random() * 25
            );

        }


        await delay(500);


        GameState.current =
            "MENU";


        showScreen(
            screens.menu
        );

    }


    /* =====================================================
       DEPLOY
       ===================================================== */

    async function deploy() {

        if (
            GameState.current ===
            "PLAYING"
        ) {

            return;

        }


        GameState.current =
            "PLAYING";


        GameState.missionTime =
            0;


        GameState.timerRunning =
            true;


        if (
            screens.menu
        ) {

            screens.menu.classList.add(
                "hidden"
            );

        }


        if (
            screens.result
        ) {

            screens.result.classList.add(
                "hidden"
            );

        }


        if (
            screens.pause
        ) {

            screens.pause.classList.add(
                "hidden"
            );

        }


        if (
            screens.game
        ) {

            screens.game.classList.remove(
                "hidden"
            );

        }


        /* ---------------------------------------------
           Start engine
           --------------------------------------------- */

        if (
            window.GameEngine
        ) {

            if (
                !GameEngine.initialized
            ) {

                GameEngine.init();

            }


            GameEngine.start();

        }


        updateGameUI();

    }


    /* =====================================================
       RESUME
       ===================================================== */

    function resumeGame() {

        if (
            GameState.current !==
            "PAUSED"
        ) {

            return;

        }


        GameState.current =
            "PLAYING";


        GameState.timerRunning =
            true;


        if (
            screens.pause
        ) {

            screens.pause.classList.add(
                "hidden"
            );

        }


        if (
            window.GameEngine
        ) {

            GameEngine.resume();

        }

    }


    /* =====================================================
       PAUSE
       ===================================================== */

    function pauseGame() {

        if (
            GameState.current !==
            "PLAYING"
        ) {

            return;

        }


        GameState.current =
            "PAUSED";


        GameState.timerRunning =
            false;


        if (
            screens.pause
        ) {

            screens.pause.classList.remove(
                "hidden"
            );

        }


        if (
            window.GameEngine
        ) {

            GameEngine.pause();

        }

    }


    /* =====================================================
       RESTART
       ===================================================== */

    function restartGame() {

        if (
            screens.result
        ) {

            screens.result.classList.add(
                "hidden"
            );

        }


        if (
            screens.pause
        ) {

            screens.pause.classList.add(
                "hidden"
            );

        }


        GameState.missionTime =
            0;


        GameState.timerRunning =
            true;


        GameState.current =
            "PLAYING";


        if (
            screens.game
        ) {

            screens.game.classList.remove(
                "hidden"
            );

        }


        if (
            window.GameEngine
        ) {

            GameEngine.start();

        }


        updateGameUI();

    }


    /* =====================================================
       BACK TO MENU
       ===================================================== */

    function backToMenu() {

        GameState.current =
            "MENU";


        GameState.timerRunning =
            false;


        if (
            screens.game
        ) {

            screens.game.classList.add(
                "hidden"
            );

        }


        if (
            screens.pause
        ) {

            screens.pause.classList.add(
                "hidden"
            );

        }


        if (
            screens.result
        ) {

            screens.result.classList.add(
                "hidden"
            );

        }


        if (
            screens.menu
        ) {

            screens.menu.classList.remove(
                "hidden"
            );

        }


        document.exitPointerLock?.();

    }


    /* =====================================================
       GAME TIMER
       ===================================================== */

    function updateTimer() {

        if (
            !GameState.timerRunning
        ) {

            return;

        }


        GameState.missionTime +=
            1;


        if (
            GameState.missionTime >=
            GameState.maxMissionTime
        ) {

            GameState.timerRunning =
                false;

            return;

        }


        updateGameUI();

    }


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(seconds) {

        const minutes =
            Math.floor(
                seconds / 60
            );


        const remaining =
            seconds % 60;


        return (
            String(minutes)
                .padStart(2, "0") +
            ":" +
            String(remaining)
                .padStart(2, "0")
        );

    }


    /* =====================================================
       GAME UI
       ===================================================== */

    function updateGameUI() {

        const timer =
            $("#mission-timer");


        const kills =
            $("#kills-value");


        const score =
            $("#score-value");


        const ammo =
            $("#ammo-current");


        const reserve =
            $("#ammo-reserve");


        const health =
            $("#health-value");


        const armor =
            $("#armor-value");


        if (timer) {

            timer.textContent =
                formatTime(
                    GameState.missionTime
                );

        }


        if (
            window.GameEngine
        ) {

            if (kills) {

                kills.textContent =
                    GameEngine.kills;

            }


            if (score) {

                score.textContent =
                    String(
                        GameEngine.score
                    ).padStart(
                        6,
                        "0"
                    );

            }


            if (ammo) {

                ammo.textContent =
                    GameEngine.weapon.ammo;

            }


            if (reserve) {

                reserve.textContent =
                    GameEngine.weapon.reserve;

            }


            if (health) {

                health.textContent =
                    Math.ceil(
                        GameEngine.player.health
                    );

            }


            if (armor) {

                armor.textContent =
                    Math.ceil(
                        GameEngine.player.armor
                    );

            }

        }

    }


    /* =====================================================
       ENGINE → UI MONITOR
       ===================================================== */

    function monitorEngine() {

        if (
            window.GameEngine &&
            GameState.current ===
            "PLAYING"
        ) {

            updateGameUI();

        }


        requestAnimationFrame(
            monitorEngine
        );

    }


    /* =====================================================
       PAUSE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.code ===
                "Escape"
            ) {

                if (
                    GameState.current ===
                    "PLAYING"
                ) {

                    pauseGame();

                }

                else if (
                    GameState.current ===
                    "PAUSED"
                ) {

                    resumeGame();

                }

            }

        }
    );


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    if (
        buttons.deploy
    ) {

        buttons.deploy.addEventListener(
            "click",
            deploy
        );

    }


    if (
        buttons.resume
    ) {

        buttons.resume.addEventListener(
            "click",
            resumeGame
        );

    }


    if (
        buttons.restart
    ) {

        buttons.restart.addEventListener(
            "click",
            restartGame
        );

    }


    if (
        buttons.menu
    ) {

        buttons.menu.addEventListener(
            "click",
            backToMenu
        );

    }


    /* =====================================================
       CLICK GAME → POINTER LOCK
       ===================================================== */

    if (
        screens.game
    ) {

        screens.game.addEventListener(
            "click",
            event => {

                if (
                    GameState.current !==
                    "PLAYING"
                ) {

                    return;

                }


                if (
                    event.target.closest(
                        "button"
                    )
                ) {

                    return;

                }


                if (
                    window.GameEngine &&
                    GameEngine.renderer
                ) {

                    GameEngine
                        .renderer
                        .domElement
                        .requestPointerLock?.();

                }

            }
        );

    }


    /* =====================================================
       MOBILE DETECTION
       ===================================================== */

    function detectMobile() {

        GameState.mobile =
            /Android|iPhone|iPad|iPod/i
                .test(
                    navigator.userAgent
                );


        if (
            GameState.mobile
        ) {

            document.body.classList.add(
                "mobile-device"
            );

        }

    }


    /* =====================================================
       MOBILE CONTROLS
       ===================================================== */

    function setupMobileControls() {

        const mobileButtons =
            $$(".mobile-control");


        mobileButtons.forEach(
            button => {

                const key =
                    button.dataset.key;


                button.addEventListener(
                    "touchstart",
                    event => {

                        event.preventDefault();


                        simulateKey(
                            key,
                            true
                        );

                    },
                    {
                        passive: false
                    }
                );


                button.addEventListener(
                    "touchend",
                    event => {

                        event.preventDefault();


                        simulateKey(
                            key,
                            false
                        );

                    },
                    {
                        passive: false
                    }
                );

            }
        );

    }


    function simulateKey(
        key,
        pressed
    ) {

        if (
            !window.GameEngine
        ) {

            return;

        }


        switch (
            key
        ) {

            case "forward":

                GameEngine.keys.forward =
                    pressed;

                break;


            case "backward":

                GameEngine.keys.backward =
                    pressed;

                break;


            case "left":

                GameEngine.keys.left =
                    pressed;

                break;


            case "right":

                GameEngine.keys.right =
                    pressed;

                break;


            case "sprint":

                GameEngine.keys.sprint =
                    pressed;

                break;


            case "jump":

                if (
                    pressed
                ) {

                    GameEngine.jump();

                }

                break;


            case "shoot":

                if (
                    pressed
                ) {

                    GameEngine.shoot();

                }

                break;


            case "reload":

                if (
                    pressed
                ) {

                    GameEngine.reload();

                }

                break;

        }

    }


    /* =====================================================
       RESULT SCREEN OBSERVER
       ===================================================== */

    function monitorResultScreen() {

        if (
            !window.GameEngine
        ) {

            return;

        }


        if (
            !GameEngine.running &&
            GameState.current ===
            "PLAYING"
        ) {

            GameState.current =
                "RESULT";


            GameState.timerRunning =
                false;


            if (
                screens.result
            ) {

                screens.result.classList.remove(
                    "hidden"
                );

            }

        }


        requestAnimationFrame(
            monitorResultScreen
        );

    }


    /* =====================================================
       GAME ENGINE EVENT PATCH
       ===================================================== */

    const originalGameOver =
        window.GameEngine?.gameOver;


    if (
        window.GameEngine &&
        originalGameOver
    ) {

        GameEngine.gameOver =
            function () {

                originalGameOver.call(
                    this
                );


                GameState.current =
                    "RESULT";


                GameState.timerRunning =
                    false;

            };

    }


    const originalVictory =
        window.GameEngine?.victory;


    if (
        window.GameEngine &&
        originalVictory
    ) {

        GameEngine.victory =
            function () {

                originalVictory.call(
                    this
                );


                GameState.current =
                    "RESULT";


                GameState.timerRunning =
                    false;

            };

    }


    /* =====================================================
       TAB VISIBILITY
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                GameState.current ===
                "PLAYING"
            ) {

                pauseGame();

            }

        }
    );


    /* =====================================================
       PREVENT CONTEXT MENU
       ===================================================== */

    document.addEventListener(
        "contextmenu",
        event => {

            if (
                GameState.current ===
                "PLAYING"
            ) {

                event.preventDefault();

            }

        }
    );


    /* =====================================================
       PREVENT SPACE SCROLL
       ===================================================== */

    window.addEventListener(
        "keydown",
        event => {

            if (
                [
                    "Space",
                    "ArrowUp",
                    "ArrowDown",
                    "ArrowLeft",
                    "ArrowRight"
                ].includes(
                    event.code
                )
            ) {

                event.preventDefault();

            }

        },
        {
            passive: false
        }
    );


    /* =====================================================
       STARTUP
       ===================================================== */

    function initialize() {

        detectMobile();

        setupMobileControls();

        startLoading();

        monitorEngine();

        monitorResultScreen();

        GameState.initialized =
            true;

        console.log(
            "%c BLACK OPS SCRIPT READY ",
            "background:#ff3030;color:white;font-weight:bold;padding:6px;"
        );

    }


    /* =====================================================
       TIMER LOOP
       ===================================================== */

    setInterval(
        updateTimer,
        1000
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    initialize();


    /* =====================================================
       GLOBAL CONTROLLER
       ===================================================== */

    window.BlackOpsGame = {

        deploy,

        pause: pauseGame,

        resume: resumeGame,

        restart: restartGame,

        menu: backToMenu,

        state: GameState

    };

});
```
