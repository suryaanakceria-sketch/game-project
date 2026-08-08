/* =========================================================
   BLACK OPS // FPS ARENA
   SCRIPT.JS
   GAME UI + GAME STATE + PLAYER SYSTEM
   ========================================================= */


/* =========================================================
   01. GLOBAL GAME OBJECT
   ========================================================= */

window.GameUI = {

    initialized: false,

    state: "menu",

    paused: false,

    gameRunning: false,

    reloading: false,

    matchTime: 600,

    health: 100,

    ammo: 30,

    reserveAmmo: 120,

    kills: 0,

    score: 0,

    shots: 0,

    hits: 0,

    enemies: 5,

    currentWeapon: "PHANTOM-X",

    reloadTimer: null,

    matchTimer: null,

    loadingTimer: null,

    fireTimer: null,

    elements: {},


    /* =====================================================
       02. INITIALIZATION
       ===================================================== */

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        console.log(
            "[GAME UI] Initializing..."
        );

        this.cacheElements();

        this.bindEvents();

        this.loadSettings();

        this.startLoading();

    },


    /* =====================================================
       03. CACHE DOM ELEMENTS
       ===================================================== */

    cacheElements() {

        this.elements = {

            /* Main screens */

            mainMenu:
                document.getElementById(
                    "main-menu"
                ),

            instructions:
                document.getElementById(
                    "instructions-screen"
                ),

            settings:
                document.getElementById(
                    "settings-screen"
                ),

            gameWorld:
                document.getElementById(
                    "game-world"
                ),

            pauseMenu:
                document.getElementById(
                    "pause-menu"
                ),

            gameOver:
                document.getElementById(
                    "game-over-screen"
                ),

            loadingScreen:
                document.getElementById(
                    "loading-screen"
                ),


            /* Loading */

            loadingProgress:
                document.getElementById(
                    "loading-progress"
                ),

            loadingPercent:
                document.getElementById(
                    "loading-percent"
                ),


            /* Buttons */

            startGame:
                document.getElementById(
                    "start-game"
                ),

            howToPlay:
                document.getElementById(
                    "how-to-play"
                ),

            settingsButton:
                document.getElementById(
                    "settings-button"
                ),

            closeInstructions:
                document.getElementById(
                    "close-instructions"
                ),

            closeSettings:
                document.getElementById(
                    "close-settings"
                ),

            resumeGame:
                document.getElementById(
                    "resume-game"
                ),

            restartGame:
                document.getElementById(
                    "restart-game"
                ),

            exitGame:
                document.getElementById(
                    "exit-game"
                ),

            playAgain:
                document.getElementById(
                    "play-again"
                ),

            backToMenu:
                document.getElementById(
                    "back-to-menu"
                ),


            /* Player */

            healthFill:
                document.getElementById(
                    "health-fill"
                ),

            healthValue:
                document.getElementById(
                    "health-value"
                ),


            /* Match */

            matchTimer:
                document.getElementById(
                    "match-timer"
                ),

            playerScore:
                document.getElementById(
                    "player-score"
                ),

            enemyScore:
                document.getElementById(
                    "enemy-score"
                ),


            /* Weapon */

            weaponName:
                document.getElementById(
                    "weapon-name"
                ),

            ammoCurrent:
                document.getElementById(
                    "ammo-current"
                ),

            ammoReserve:
                document.getElementById(
                    "ammo-reserve"
                ),


            /* Effects */

            crosshair:
                document.getElementById(
                    "crosshair"
                ),

            hitMarker:
                document.getElementById(
                    "hit-marker"
                ),

            damageIndicator:
                document.getElementById(
                    "damage-indicator"
                ),

            killFeed:
                document.getElementById(
                    "kill-feed"
                ),


            /* Objective */

            objectiveText:
                document.getElementById(
                    "objective-text"
                ),


            /* Reload */

            reloadIndicator:
                document.getElementById(
                    "reload-indicator"
                ),

            reloadProgress:
                document.getElementById(
                    "reload-progress"
                ),


            /* Results */

            resultStatus:
                document.getElementById(
                    "result-status"
                ),

            resultTitle:
                document.getElementById(
                    "result-title"
                ),

            finalScore:
                document.getElementById(
                    "final-score"
                ),

            finalKills:
                document.getElementById(
                    "final-kills"
                ),

            finalAccuracy:
                document.getElementById(
                    "final-accuracy"
                ),


            /* Settings */

            graphicsQuality:
                document.getElementById(
                    "graphics-quality"
                ),

            mouseSensitivity:
                document.getElementById(
                    "mouse-sensitivity"
                ),

            masterVolume:
                document.getElementById(
                    "master-volume"
                ),


            /* Mobile */

            mobileFire:
                document.getElementById(
                    "mobile-fire"
                ),

            mobileReload:
                document.getElementById(
                    "mobile-reload"
                ),

            mobileJump:
                document.getElementById(
                    "mobile-jump"
                ),

            joystick:
                document.getElementById(
                    "joystick"
                ),

            joystickKnob:
                document.getElementById(
                    "joystick-knob"
                )

        };

    },


    /* =====================================================
       04. EVENT LISTENERS
       ===================================================== */

    bindEvents() {

        const e = this.elements;


        /* ================================================
           MAIN MENU
        ================================================= */

        e.startGame?.addEventListener(
            "click",
            () => {

                this.startGame();

            }
        );


        e.howToPlay?.addEventListener(
            "click",
            () => {

                this.showInstructions();

            }
        );


        e.settingsButton?.addEventListener(
            "click",
            () => {

                this.showSettings();

            }
        );


        /* ================================================
           INSTRUCTIONS
        ================================================= */

        e.closeInstructions?.addEventListener(
            "click",
            () => {

                this.showMainMenu();

            }
        );


        /* ================================================
           SETTINGS
        ================================================= */

        e.closeSettings?.addEventListener(
            "click",
            () => {

                this.saveSettings();

                this.showMainMenu();

            }
        );


        e.mouseSensitivity?.addEventListener(
            "input",
            () => {

                const value =
                    Number(
                        e.mouseSensitivity.value
                    );

                if (
                    window.GAME_CONFIG &&
                    window.GAME_CONFIG.player
                ) {

                    window.GAME_CONFIG.player.sensitivity =
                        value;

                }

            }
        );


        /* ================================================
           PAUSE
        ================================================= */

        e.resumeGame?.addEventListener(
            "click",
            () => {

                this.resumeGame();

            }
        );


        e.restartGame?.addEventListener(
            "click",
            () => {

                this.restartGame();

            }
        );


        e.exitGame?.addEventListener(
            "click",
            () => {

                this.exitToMenu();

            }
        );


        /* ================================================
           GAME OVER
        ================================================= */

        e.playAgain?.addEventListener(
            "click",
            () => {

                this.startGame();

            }
        );


        e.backToMenu?.addEventListener(
            "click",
            () => {

                this.exitToMenu();

            }
        );


        /* ================================================
           KEYBOARD
        ================================================= */

        document.addEventListener(
            "keydown",
            (event) => {

                this.handleKeyboard(
                    event
                );

            }
        );


        /* ================================================
           MOUSE
        ================================================= */

        document.addEventListener(
            "mousedown",
            (event) => {

                if (
                    event.button === 0
                ) {

                    this.handleFire();

                }

            }
        );


        /* ================================================
           MOBILE FIRE
        ================================================= */

        e.mobileFire?.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                this.handleFire();

            },
            {
                passive: false
            }
        );


        /* ================================================
           MOBILE RELOAD
        ================================================= */

        e.mobileReload?.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                this.reload();

            },
            {
                passive: false
            }
        );


        /* ================================================
           MOBILE JUMP
        ================================================= */

        e.mobileJump?.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                this.jump();

            },
            {
                passive: false
            }
        );


        /* ================================================
           JOYSTICK
        ================================================= */

        this.setupJoystick();

    },


    /* =====================================================
       05. LOADING SYSTEM
       ===================================================== */

    startLoading() {

        let progress = 0;

        const updateLoading =
            () => {

                progress +=
                    Math.random() * 8 + 3;

                if (progress >= 100) {

                    progress = 100;

                }

                if (
                    this.elements.loadingProgress
                ) {

                    this.elements.loadingProgress.style.width =
                        `${progress}%`;

                }

                if (
                    this.elements.loadingPercent
                ) {

                    this.elements.loadingPercent.textContent =
                        `${Math.floor(progress)}%`;

                }

                if (progress >= 100) {

                    clearInterval(
                        this.loadingTimer
                    );

                    setTimeout(
                        () => {

                            this.finishLoading();

                        },
                        500
                    );

                }

            };


        this.loadingTimer =
            setInterval(
                updateLoading,
                120
            );

    },


    finishLoading() {

        if (
            this.elements.loadingScreen
        ) {

            this.elements.loadingScreen.classList.add(
                "loaded"
            );

        }

        this.showMainMenu();

    },


    /* =====================================================
       06. SCREEN MANAGEMENT
       ===================================================== */

    hideAllScreens() {

        const screens = [

            this.elements.mainMenu,

            this.elements.instructions,

            this.elements.settings

        ];


        screens.forEach(
            screen => {

                if (!screen) {
                    return;
                }

                screen.classList.add(
                    "hidden"
                );

            }
        );

    },


    showMainMenu() {

        this.hideAllScreens();

        this.elements.mainMenu?.classList.remove(
            "hidden"
        );

        this.state = "menu";

        this.paused = false;

        this.stopMatchTimer();

        this.elements.pauseMenu?.classList.add(
            "hidden"
        );

        this.elements.gameOver?.classList.add(
            "hidden"
        );

        if (
            this.elements.gameWorld
        ) {

            this.elements.gameWorld.classList.add(
                "hidden"
            );

        }

    },


    showInstructions() {

        this.hideAllScreens();

        this.elements.instructions?.classList.remove(
            "hidden"
        );

        this.state = "instructions";

    },


    showSettings() {

        this.hideAllScreens();

        this.elements.settings?.classList.remove(
            "hidden"
        );

        this.state = "settings";

    },


    /* =====================================================
       07. START GAME
       ===================================================== */

    startGame() {

        console.log(
            "[GAME] Starting match..."
        );


        this.resetGame();


        this.hideAllScreens();


        this.elements.gameWorld?.classList.remove(
            "hidden"
        );


        this.state = "playing";

        this.gameRunning = true;

        this.paused = false;


        this.elements.pauseMenu?.classList.add(
            "hidden"
        );


        this.elements.gameOver?.classList.add(
            "hidden"
        );


        this.updateAllHUD();


        this.startMatchTimer();


        /*
         * Beritahu engine bahwa
         * permainan dimulai.
         */

        if (
            window.GameEngine &&
            typeof window.GameEngine.start ===
            "function"
        ) {

            window.GameEngine.start();

        }


        /*
         * Minta pointer lock.
         */

        this.requestPointerLock();

    },


    /* =====================================================
       08. RESET GAME
       ===================================================== */

    resetGame() {

        this.matchTime = 600;

        this.health = 100;

        this.ammo = 30;

        this.reserveAmmo = 120;

        this.kills = 0;

        this.score = 0;

        this.shots = 0;

        this.hits = 0;

        this.enemies = 5;

        this.reloading = false;


        if (
            window.GAME_CONFIG
        ) {

            const config =
                window.GAME_CONFIG;

            if (config.player) {

                config.player.health =
                    100;

            }

            if (config.weapon) {

                config.weapon.ammo =
                    30;

                config.weapon.reserveAmmo =
                    120;

            }

            if (config.match) {

                config.match.score =
                    0;

                config.match.kills =
                    0;

                config.match.shots =
                    0;

                config.match.hits =
                    0;

            }

        }


        this.updateAllHUD();

    },


    /* =====================================================
       09. MATCH TIMER
       ===================================================== */

    startMatchTimer() {

        this.stopMatchTimer();


        this.matchTimer =
            setInterval(
                () => {

                    if (
                        !this.gameRunning ||
                        this.paused
                    ) {

                        return;

                    }


                    this.matchTime--;


                    this.updateTimer();


                    if (
                        this.matchTime <= 0
                    ) {

                        this.endGame(
                            false
                        );

                    }

                },
                1000
            );

    },


    stopMatchTimer() {

        if (
            this.matchTimer
        ) {

            clearInterval(
                this.matchTimer
            );

            this.matchTimer = null;

        }

    },


    updateTimer() {

        if (
            !this.elements.matchTimer
        ) {

            return;

        }


        const minutes =
            Math.floor(
                this.matchTime / 60
            );


        const seconds =
            this.matchTime % 60;


        this.elements.matchTimer.textContent =

            `${String(minutes).padStart(2, "0")}:` +

            `${String(seconds).padStart(2, "0")}`;

    },


    /* =====================================================
       10. PAUSE
       ===================================================== */

    pauseGame() {

        if (
            !this.gameRunning ||
            this.state !== "playing"
        ) {

            return;

        }


        this.paused = true;

        this.state = "paused";


        this.elements.pauseMenu?.classList.remove(
            "hidden"
        );


        if (
            document.pointerLockElement
        ) {

            document.exitPointerLock();

        }


        if (
            window.GameEngine &&
            typeof window.GameEngine.pause ===
            "function"
        ) {

            window.GameEngine.pause();

        }

    },


    /* =====================================================
       11. RESUME
       ===================================================== */

    resumeGame() {

        if (
            !this.gameRunning
        ) {

            return;

        }


        this.paused = false;

        this.state = "playing";


        this.elements.pauseMenu?.classList.add(
            "hidden"
        );


        if (
            window.GameEngine &&
            typeof window.GameEngine.resume ===
            "function"
        ) {

            window.GameEngine.resume();

        }


        this.requestPointerLock();

    },


    /* =====================================================
       12. RESTART
       ===================================================== */

    restartGame() {

        this.stopMatchTimer();


        if (
            window.GameEngine &&
            typeof window.GameEngine.reset ===
            "function"
        ) {

            window.GameEngine.reset();

        }


        this.startGame();

    },


    /* =====================================================
       13. EXIT TO MENU
       ===================================================== */

    exitToMenu() {

        this.stopMatchTimer();


        this.gameRunning = false;

        this.paused = false;


        if (
            document.pointerLockElement
        ) {

            document.exitPointerLock();

        }


        if (
            window.GameEngine &&
            typeof window.GameEngine.stop ===
            "function"
        ) {

            window.GameEngine.stop();

        }


        this.showMainMenu();

    },


    /* =====================================================
       14. KEYBOARD
       ===================================================== */

    handleKeyboard(event) {

        const key =
            event.key.toLowerCase();


        /* ================================================
           ESC
        ================================================= */

        if (
            key === "escape"
        ) {

            if (
                this.state === "playing"
            ) {

                this.pauseGame();

            }

            else if (
                this.state === "paused"
            ) {

                this.resumeGame();

            }

            return;

        }


        /* ================================================
           RELOAD
        ================================================= */

        if (
            key === "r"
        ) {

            if (
                this.state === "playing"
            ) {

                this.reload();

            }

            return;

        }


        /* ================================================
           JUMP
        ================================================= */

        if (
            event.code === "Space"
        ) {

            if (
                this.state === "playing"
            ) {

                event.preventDefault();

                this.jump();

            }

        }

    },


    /* =====================================================
       15. FIRE SYSTEM
       ===================================================== */

    handleFire() {

        if (
            !this.gameRunning ||
            this.paused ||
            this.state !== "playing"
        ) {

            return;

        }


        if (
            this.reloading
        ) {

            return;

        }


        if (
            this.ammo <= 0
        ) {

            this.playEmptySound();

            return;

        }


        this.fireWeapon();

    },


    fireWeapon() {

        if (
            this.ammo <= 0
        ) {

            return;

        }


        this.ammo--;

        this.shots++;


        this.updateAmmo();


        /*
         * Kirim event tembakan
         * ke engine.js.
         */

        let hit = false;


        if (
            window.GameEngine &&
            typeof window.GameEngine.shoot ===
            "function"
        ) {

            hit =
                window.GameEngine.shoot();

        }


        /*
         * Engine dapat mengembalikan
         * true jika mengenai enemy.
         */

        if (hit === true) {

            this.registerHit();

        }


        /*
         * Auto reload
         */

        if (
            this.ammo <= 0 &&
            this.reserveAmmo > 0
        ) {

            setTimeout(
                () => {

                    this.reload();

                },
                150
            );

        }

    },


    /* =====================================================
       16. REGISTER HIT
       ===================================================== */

    registerHit() {

        this.hits++;

        this.showHitMarker();


        /*
         * Hit score
         */

        this.score += 10;


        this.updateScore();

    },


    /* =====================================================
       17. KILL SYSTEM
       ===================================================== */

    registerKill(
        enemyName = "ENEMY"
    ) {

        this.kills++;

        this.score += 100;

        this.enemies--;


        this.updateScore();


        this.showKillFeed(
            `YOU  ›  ${enemyName}`
        );


        /*
         * Jika semua enemy mati
         */

        if (
            this.enemies <= 0
        ) {

            this.endGame(
                true
            );

        }

    },


    /* =====================================================
       18. RELOAD
       ===================================================== */

    reload() {

        if (
            !this.gameRunning ||
            this.paused ||
            this.state !== "playing"
        ) {

            return;

        }


        if (
            this.reloading
        ) {

            return;

        }


        if (
            this.ammo >= 30
        ) {

            return;

        }


        if (
            this.reserveAmmo <= 0
        ) {

            return;

        }


        this.reloading = true;


        const reloadTime = 1500;


        this.elements.reloadIndicator?.classList.remove(
            "hidden"
        );


        this.elements.reloadProgress.style.width =
            "0%";


        const startTime =
            performance.now();


        const animateReload =
            (currentTime) => {

                if (
                    !this.reloading
                ) {

                    return;

                }


                const elapsed =
                    currentTime -
                    startTime;


                const progress =
                    Math.min(
                        elapsed /
                        reloadTime,
                        1
                    );


                if (
                    this.elements.reloadProgress
                ) {

                    this.elements.reloadProgress.style.width =
                        `${progress * 100}%`;

                }


                if (
                    progress < 1
                ) {

                    requestAnimationFrame(
                        animateReload
                    );

                }

                else {

                    this.finishReload();

                }

            };


        requestAnimationFrame(
            animateReload
        );

    },


    /* =====================================================
       19. FINISH RELOAD
       ===================================================== */

    finishReload() {

        const magazineSize = 30;


        const missing =
            magazineSize -
            this.ammo;


        const amount =
            Math.min(
                missing,
                this.reserveAmmo
            );


        this.ammo += amount;

        this.reserveAmmo -= amount;


        this.reloading = false;


        this.elements.reloadIndicator?.classList.add(
            "hidden"
        );


        this.updateAmmo();

    },


    /* =====================================================
       20. PLAYER DAMAGE
       ===================================================== */

    damagePlayer(
        amount = 10
    ) {

        if (
            !this.gameRunning ||
            this.paused
        ) {

            return;

        }


        this.health -= amount;


        this.health =
            Math.max(
                0,
                this.health
            );


        this.updateHealth();

        this.showDamageEffect();


        if (
            this.health <= 0
        ) {

            this.playerDeath();

        }

    },


    /* =====================================================
       21. PLAYER DEATH
       ===================================================== */

    playerDeath() {

        this.gameRunning = false;


        this.stopMatchTimer();


        if (
            window.GameEngine &&
            typeof window.GameEngine.playerDeath ===
            "function"
        ) {

            window.GameEngine.playerDeath();

        }


        setTimeout(
            () => {

                this.endGame(
                    false
                );

            },
            500
        );

    },


    /* =====================================================
       22. JUMP
       ===================================================== */

    jump() {

        if (
            !this.gameRunning ||
            this.paused
        ) {

            return;

        }


        if (
            window.GameEngine &&
            typeof window.GameEngine.jump ===
            "function"
        ) {

            window.GameEngine.jump();

        }

    },


    /* =====================================================
       23. GAME OVER
       ===================================================== */

    endGame(
        victory = false
    ) {

        if (
            this.state === "gameover"
        ) {

            return;

        }


        this.gameRunning = false;

        this.paused = false;

        this.state = "gameover";


        this.stopMatchTimer();


        if (
            document.pointerLockElement
        ) {

            document.exitPointerLock();

        }


        if (
            window.GameEngine &&
            typeof window.GameEngine.stop ===
            "function"
        ) {

            window.GameEngine.stop();

        }


        const accuracy =
            this.shots > 0
                ? Math.round(
                    (this.hits /
                    this.shots) *
                    100
                )
                : 0;


        if (
            victory
        ) {

            this.elements.resultStatus.textContent =
                "MISSION COMPLETE";

            this.elements.resultTitle.textContent =
                "VICTORY";

        }

        else {

            this.elements.resultStatus.textContent =
                "MISSION FAILED";

            this.elements.resultTitle.textContent =
                "DEFEAT";

        }


        this.elements.finalScore.textContent =
            this.score;


        this.elements.finalKills.textContent =
            this.kills;


        this.elements.finalAccuracy.textContent =
            `${accuracy}%`;


        this.elements.gameOver?.classList.remove(
            "hidden"
        );

    },


    /* =====================================================
       24. UPDATE HEALTH
       ===================================================== */

    updateHealth() {

        const percentage =
            Math.max(
                0,
                Math.min(
                    this.health,
                    100
                )
            );


        if (
            this.elements.healthFill
        ) {

            this.elements.healthFill.style.width =
                `${percentage}%`;

        }


        if (
            this.elements.healthValue
        ) {

            this.elements.healthValue.textContent =
                Math.ceil(
                    percentage
                );

        }


        /*
         * Change health bar appearance
         */

        if (
            this.elements.healthFill
        ) {

            if (
                percentage <= 25
            ) {

                this.elements.healthFill.style.background =
                    "#ff2020";

            }

            else if (
                percentage <= 50
            ) {

                this.elements.healthFill.style.background =
                    "#ff7b00";

            }

            else {

                this.elements.healthFill.style.background =
                    "#ff2a2a";

            }

        }

    },


    /* =====================================================
       25. UPDATE AMMO
       ===================================================== */

    updateAmmo() {

        if (
            this.elements.ammoCurrent
        ) {

            this.elements.ammoCurrent.textContent =
                this.ammo;

        }


        if (
            this.elements.ammoReserve
        ) {

            this.elements.ammoReserve.textContent =
                this.reserveAmmo;

        }


        /*
         * Low ammo warning
         */

        if (
            this.elements.ammoCurrent
        ) {

            if (
                this.ammo <= 5
            ) {

                this.elements.ammoCurrent.style.color =
                    "#ff2a2a";

            }

            else {

                this.elements.ammoCurrent.style.color =
                    "";

            }

        }

    },


    /* =====================================================
       26. UPDATE SCORE
       ===================================================== */

    updateScore() {

        if (
            this.elements.playerScore
        ) {

            this.elements.playerScore.textContent =
                this.score;

        }


        if (
            this.elements.enemyScore
        ) {

            this.elements.enemyScore.textContent =
                this.enemies;

        }

    },


    /* =====================================================
       27. UPDATE ALL HUD
       ===================================================== */

    updateAllHUD() {

        this.updateHealth();

        this.updateAmmo();

        this.updateScore();

        this.updateTimer();


        if (
            this.elements.weaponName
        ) {

            this.elements.weaponName.textContent =
                this.currentWeapon;

        }


        if (
            this.elements.objectiveText
        ) {

            this.elements.objectiveText.textContent =

                this.enemies > 0

                    ? "ELIMINATE ALL ENEMIES"

                    : "MISSION COMPLETE";

        }

    },


    /* =====================================================
       28. HIT MARKER
       ===================================================== */

    showHitMarker() {

        if (
            !this.elements.hitMarker
        ) {

            return;

        }


        this.elements.hitMarker.classList.remove(
            "hidden"
        );


        /*
         * Restart animation
         */

        this.elements.hitMarker.style.animation =
            "none";


        void this.elements.hitMarker.offsetWidth;


        this.elements.hitMarker.style.animation =
            "hitMarker 0.2s ease";


        clearTimeout(
            this.hitMarkerTimer
        );


        this.hitMarkerTimer =
            setTimeout(
                () => {

                    this.elements.hitMarker.classList.add(
                        "hidden"
                    );

                },
                180
            );

    },


    /* =====================================================
       29. DAMAGE EFFECT
       ===================================================== */

    showDamageEffect() {

        if (
            !this.elements.damageIndicator
        ) {

            return;

        }


        this.elements.damageIndicator.classList.remove(
            "active"
        );


        void this.elements.damageIndicator.offsetWidth;


        this.elements.damageIndicator.classList.add(
            "active"
        );

    },


    /* =====================================================
       30. KILL FEED
       ===================================================== */

    showKillFeed(
        message
    ) {

        if (
            !this.elements.killFeed
        ) {

            return;

        }


        const element =
            document.createElement(
                "div"
            );


        element.className =
            "kill-message";


        element.textContent =
            message;


        this.elements.killFeed.appendChild(
            element
        );


        /*
         * Maksimum 5 pesan
         */

        while (
            this.elements.killFeed.children.length >
            5
        ) {

            this.elements.killFeed.firstChild.remove();

        }


        setTimeout(
            () => {

                element.remove();

            },
            4000
        );

    },


    /* =====================================================
       31. POINTER LOCK
       ===================================================== */

    requestPointerLock() {

        const canvas =
            document.getElementById(
                "game-canvas"
            );


        if (
            !canvas
        ) {

            return;

        }


        /*
         * Pointer lock hanya dilakukan
         * setelah interaksi user.
         */

        try {

            if (
                document.pointerLockElement !==
                canvas
            ) {

                canvas.requestPointerLock?.();

            }

        }

        catch (
            error
        ) {

            console.warn(
                "[POINTER LOCK]",
                error
            );

        }

    },


    /* =====================================================
       32. SETTINGS
       ===================================================== */

    saveSettings() {

        const settings = {

            graphics:
                this.elements.graphicsQuality?.value
                || "medium",

            sensitivity:
                this.elements.mouseSensitivity?.value
                || "0.8",

            volume:
                this.elements.masterVolume?.value
                || "70"

        };


        try {

            localStorage.setItem(
                "black_ops_settings",
                JSON.stringify(
                    settings
                )
            );

        }

        catch (
            error
        ) {

            console.warn(
                "[SETTINGS] Cannot save",
                error
            );

        }

    },


    loadSettings() {

        try {

            const saved =
                localStorage.getItem(
                    "black_ops_settings"
                );


            if (
                !saved
            ) {

                return;

            }


            const settings =
                JSON.parse(
                    saved
                );


            if (
                settings.graphics &&
                this.elements.graphicsQuality
            ) {

                this.elements.graphicsQuality.value =
                    settings.graphics;

            }


            if (
                settings.sensitivity &&
                this.elements.mouseSensitivity
            ) {

                this.elements.mouseSensitivity.value =
                    settings.sensitivity;

            }


            if (
                settings.volume &&
                this.elements.masterVolume
            ) {

                this.elements.masterVolume.value =
                    settings.volume;

            }

        }

        catch (
            error
        ) {

            console.warn(
                "[SETTINGS] Cannot load",
                error
            );

        }

    },


    /* =====================================================
       33. MOBILE JOYSTICK
       ===================================================== */

    setupJoystick() {

        const joystick =
            this.elements.joystick;


        const knob =
            this.elements.joystickKnob;


        if (
            !joystick ||
            !knob
        ) {

            return;

        }


        let active = false;


        const moveJoystick =
            (clientX, clientY) => {

                const rect =
                    joystick.getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                let x =
                    clientX -
                    centerX;


                let y =
                    clientY -
                    centerY;


                const maxDistance =
                    rect.width / 2 -
                    knob.offsetWidth / 2;


                const distance =
                    Math.sqrt(
                        x * x +
                        y * y
                    );


                if (
                    distance >
                    maxDistance
                ) {

                    const angle =
                        Math.atan2(
                            y,
                            x
                        );


                    x =
                        Math.cos(angle) *
                        maxDistance;


                    y =
                        Math.sin(angle) *
                        maxDistance;

                }


                knob.style.transform =
                    `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)`;


                /*
                 * Kirim input movement
                 * ke engine.js.
                 */

                if (
                    window.GameEngine &&
                    typeof window.GameEngine.setMobileMovement ===
                    "function"
                ) {

                    window.GameEngine.setMobileMovement(
                        x / maxDistance,
                        y / maxDistance
                    );

                }

            };


        joystick.addEventListener(
            "touchstart",
            event => {

                active = true;

                const touch =
                    event.touches[0];

                moveJoystick(
                    touch.clientX,
                    touch.clientY
                );

            },
            {
                passive: true
            }
        );


        joystick.addEventListener(
            "touchmove",
            event => {

                if (!active) {
                    return;
                }

                const touch =
                    event.touches[0];

                moveJoystick(
                    touch.clientX,
                    touch.clientY
                );

            },
            {
                passive: true
            }
        );


        joystick.addEventListener(
            "touchend",
            () => {

                active = false;


                knob.style.transform =
                    "translate(-50%, -50%)";


                if (
                    window.GameEngine &&
                    typeof window.GameEngine.setMobileMovement ===
                    "function"
                ) {

                    window.GameEngine.setMobileMovement(
                        0,
                        0
                    );

                }

            }
        );

    },


    /* =====================================================
       34. EMPTY WEAPON
       ===================================================== */

    playEmptySound() {

        /*
         * Sound system akan ditambahkan
         * pada tahap audio.
         */

        console.log(
            "[WEAPON] EMPTY"
        );


        if (
            this.elements.ammoCurrent
        ) {

            this.elements.ammoCurrent.style.transform =
                "scale(1.15)";


            setTimeout(
                () => {

                    this.elements.ammoCurrent.style.transform =
                        "";

                },
                100
            );

        }

    },


    /* =====================================================
       35. DEBUG FUNCTIONS
       ===================================================== */

    debugDamage() {

        this.damagePlayer(
            10
        );

    },


    debugKill() {

        this.registerKill(
            "TARGET"
        );

    },


    debugAmmo() {

        this.ammo = 0;

        this.updateAmmo();

    },


    /* =====================================================
       36. DESTROY
       ===================================================== */

    destroy() {

        this.stopMatchTimer();


        if (
            this.loadingTimer
        ) {

            clearInterval(
                this.loadingTimer
            );

        }


        this.gameRunning = false;

        this.initialized = false;

    }

};


/* =========================================================
   GLOBAL KEYBOARD DEBUG
   ========================================================= */

window.addEventListener(
    "keydown",
    event => {

        /*
         * F6 = debug damage
         */

        if (
            event.key === "F6"
        ) {

            window.GameUI.debugDamage();

        }


        /*
         * F7 = debug kill
         */

        if (
            event.key === "F7"
        ) {

            window.GameUI.debugKill();

        }


        /*
         * F8 = empty magazine
         */

        if (
            event.key === "F8"
        ) {

            window.GameUI.debugAmmo();

        }

    }
);


/* =========================================================
   ENGINE BRIDGE
   ========================================================= */

/*
 * Fungsi ini digunakan engine.js
 * untuk memberikan damage kepada player.
 */

window.damagePlayer =
    function(
        amount
    ) {

        if (
            window.GameUI
        ) {

            window.GameUI.damagePlayer(
                amount
            );

        }

    };


/*
 * Fungsi ini digunakan engine.js
 * ketika enemy terbunuh.
 */

window.enemyKilled =
    function(
        enemyName
    ) {

        if (
            window.GameUI
        ) {

            window.GameUI.registerKill(
                enemyName
            );

        }

    };


/*
 * Fungsi ini digunakan engine.js
 * ketika player mengenai target.
 */

window.playerHit =
    function() {

        if (
            window.GameUI
        ) {

            window.GameUI.registerHit();

        }

    };


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "%c BLACK OPS // FPS ARENA ",
    "background:#050607;color:#ff2a2a;font-size:16px;font-weight:bold;padding:8px;"
);

console.log(
    "%c GameUI loaded successfully.",
    "color:#8a9297;"
);

console.log(
    "%c F6 = Damage | F7 = Kill | F8 = Empty Ammo",
    "color:#697176;"
);
