/* =========================================================
   BLACK OPS // FPS ARENA
   ENGINE.JS
   FPS ENGINE - CANVAS RAYCASTER
   ========================================================= */

window.GameEngine = {

    /* =====================================================
       01. ENGINE STATE
    ===================================================== */

    initialized: false,
    running: false,
    paused: false,

    canvas: null,
    ctx: null,

    width: 0,
    height: 0,

    lastTime: 0,

    keys: {},

    mouseX: 0,
    mouseY: 0,

    pointerLocked: false,

    mobileX: 0,
    mobileY: 0,

    /* =====================================================
       02. PLAYER
    ===================================================== */

    player: {

        x: 3.5,
        y: 3.5,

        angle: 0,

        height: 0,

        verticalVelocity: 0,

        speed: 3.2,

        radius: 0.22,

        eyeHeight: 0.55,

        grounded: true,

        health: 100

    },

    /* =====================================================
       03. CAMERA
    ===================================================== */

    camera: {

        fov: Math.PI / 3,

        viewDistance: 20,

        shake: 0,

        recoil: 0

    },

    /* =====================================================
       04. WORLD
    ===================================================== */

    map: [

        "################",
        "#..............#",
        "#..##..........#",
        "#..............#",
        "#......##......#",
        "#..............#",
        "#..............#",
        "#....####......#",
        "#..............#",
        "#......##......#",
        "#..............#",
        "#..........##..#",
        "#..............#",
        "#..............#",
        "#..............#",
        "################"

    ],

    tileSize: 1,

    /* =====================================================
       05. ENEMIES
    ===================================================== */

    enemies: [],

    enemyId: 0,

    maxEnemies: 5,

    /* =====================================================
       06. WEAPON
    ===================================================== */

    weapon: {

        damage: 25,

        fireRate: 120,

        lastShot: 0,

        muzzleFlash: 0,

        recoil: 0,

        range: 20

    },

    /* =====================================================
       07. INPUT
    ===================================================== */

    input: {

        forward: false,

        backward: false,

        left: false,

        right: false,

        jump: false

    },

    /* =====================================================
       08. INIT
    ===================================================== */

    init() {

        if (this.initialized) {

            return;

        }

        this.canvas =
            document.getElementById(
                "game-canvas"
            );

        if (!this.canvas) {

            console.error(
                "[ENGINE] Canvas not found."
            );

            return;

        }

        this.ctx =
            this.canvas.getContext(
                "2d"
            );

        this.initialized = true;

        this.resize();

        this.bindEvents();

        this.generateEnemies();

        console.log(
            "[ENGINE] Initialized."
        );

    },

    /* =====================================================
       09. RESIZE
    ===================================================== */

    resize() {

        if (!this.canvas) {

            return;

        }

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        this.width =
            window.innerWidth;

        this.height =
            window.innerHeight;

        this.canvas.width =
            this.width * dpr;

        this.canvas.height =
            this.height * dpr;

        this.canvas.style.width =
            `${this.width}px`;

        this.canvas.style.height =
            `${this.height}px`;

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    },

    /* =====================================================
       10. EVENTS
    ===================================================== */

    bindEvents() {

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );

        window.addEventListener(
            "keydown",
            event => {

                this.keys[
                    event.code
                ] = true;

                this.handleKeyDown(
                    event
                );

            }
        );

        window.addEventListener(
            "keyup",
            event => {

                this.keys[
                    event.code
                ] = false;

            }
        );

        document.addEventListener(
            "mousemove",
            event => {

                if (
                    !this.pointerLocked
                ) {

                    return;

                }

                this.player.angle +=
                    event.movementX *
                    this.getSensitivity();

            }
        );

        document.addEventListener(
            "pointerlockchange",
            () => {

                this.pointerLocked =
                    document.pointerLockElement ===
                    this.canvas;

            }
        );

        this.canvas.addEventListener(
            "click",
            () => {

                if (
                    this.running &&
                    !this.paused
                ) {

                    this.requestPointerLock();

                }

            }
        );

    },

    /* =====================================================
       11. KEY DOWN
    ===================================================== */

    handleKeyDown(event) {

        if (
            event.code === "Space"
        ) {

            if (
                this.running &&
                !this.paused
            ) {

                this.jump();

            }

        }

    },

    /* =====================================================
       12. SENSITIVITY
    ===================================================== */

    getSensitivity() {

        if (
            window.GAME_CONFIG &&
            window.GAME_CONFIG.player
        ) {

            return (
                Number(
                    window.GAME_CONFIG.player.sensitivity
                ) || 0.8
            ) * 0.002;

        }

        return 0.0016;

    },

    /* =====================================================
       13. POINTER LOCK
    ===================================================== */

    requestPointerLock() {

        if (
            this.canvas &&
            document.pointerLockElement !==
            this.canvas
        ) {

            this.canvas.requestPointerLock?.();

        }

    },

    /* =====================================================
       14. START
    ===================================================== */

    start() {

        if (!this.initialized) {

            this.init();

        }

        this.running = true;

        this.paused = false;

        this.reset();

        this.spawnEnemies();

        this.lastTime =
            performance.now();

        requestAnimationFrame(
            this.loop.bind(this)
        );

        console.log(
            "[ENGINE] Game started."
        );

    },

    /* =====================================================
       15. STOP
    ===================================================== */

    stop() {

        this.running = false;

        this.paused = false;

        this.enemies = [];

        this.resetPlayer();

    },

    /* =====================================================
       16. PAUSE
    ===================================================== */

    pause() {

        this.paused = true;

    },

    /* =====================================================
       17. RESUME
    ===================================================== */

    resume() {

        this.paused = false;

        this.lastTime =
            performance.now();

    },

    /* =====================================================
       18. RESET
    ===================================================== */

    reset() {

        this.resetPlayer();

        this.weapon.lastShot = 0;

        this.weapon.muzzleFlash = 0;

        this.weapon.recoil = 0;

        this.camera.shake = 0;

        this.camera.recoil = 0;

        this.generateEnemies();

    },

    /* =====================================================
       19. RESET PLAYER
    ===================================================== */

    resetPlayer() {

        this.player.x = 3.5;

        this.player.y = 3.5;

        this.player.angle = 0;

        this.player.height = 0;

        this.player.verticalVelocity = 0;

        this.player.grounded = true;

        this.player.health = 100;

    },

    /* =====================================================
       20. GAME LOOP
    ===================================================== */

    loop(currentTime) {

        if (!this.running) {

            return;

        }

        const delta =
            Math.min(
                (currentTime -
                    this.lastTime) /
                    1000,
                0.05
            );

        this.lastTime =
            currentTime;

        if (!this.paused) {

            this.update(
                delta
            );

        }

        this.render();

        requestAnimationFrame(
            this.loop.bind(this)
        );

    },

    /* =====================================================
       21. UPDATE
    ===================================================== */

    update(delta) {

        this.updateInput();

        this.updatePlayer(
            delta
        );

        this.updateEnemies(
            delta
        );

        this.updateWeapon(
            delta
        );

    },

    /* =====================================================
       22. INPUT
    ===================================================== */

    updateInput() {

        this.input.forward =
            !!this.keys["KeyW"];

        this.input.backward =
            !!this.keys["KeyS"];

        this.input.left =
            !!this.keys["KeyA"];

        this.input.right =
            !!this.keys["KeyD"];

    },

    /* =====================================================
       23. PLAYER MOVEMENT
    ===================================================== */

    updatePlayer(delta) {

        let forward = 0;
        let strafe = 0;

        if (
            this.input.forward
        ) {

            forward += 1;

        }

        if (
            this.input.backward
        ) {

            forward -= 1;

        }

        if (
            this.input.right
        ) {

            strafe += 1;

        }

        if (
            this.input.left
        ) {

            strafe -= 1;

        }

        if (
            this.mobileY !== 0 ||
            this.mobileX !== 0
        ) {

            forward =
                -this.mobileY;

            strafe =
                this.mobileX;

        }

        const length =
            Math.sqrt(
                forward * forward +
                strafe * strafe
            );

        if (
            length > 0
        ) {

            forward /=
                length;

            strafe /=
                length;

        }

        const speed =
            this.player.speed *
            delta;

        const sin =
            Math.sin(
                this.player.angle
            );

        const cos =
            Math.cos(
                this.player.angle
            );

        const moveX =
            (
                cos * forward -
                sin * strafe
            ) * speed;

        const moveY =
            (
                sin * forward +
                cos * strafe
            ) * speed;

        this.movePlayer(
            moveX,
            moveY
        );

        this.updateGravity(
            delta
        );

    },

    /* =====================================================
       24. MOVE PLAYER + COLLISION
    ===================================================== */

    movePlayer(
        dx,
        dy
    ) {

        const nextX =
            this.player.x +
            dx;

        const nextY =
            this.player.y +
            dy;

        if (
            !this.isWall(
                nextX,
                this.player.y
            )
        ) {

            this.player.x =
                nextX;

        }

        if (
            !this.isWall(
                this.player.x,
                nextY
            )
        ) {

            this.player.y =
                nextY;

        }

    },

    /* =====================================================
       25. WALL CHECK
    ===================================================== */

    isWall(
        x,
        y
    ) {

        const mapX =
            Math.floor(
                x
            );

        const mapY =
            Math.floor(
                y
            );

        if (
            mapY < 0 ||
            mapY >= this.map.length ||
            mapX < 0 ||
            mapX >= this.map[0].length
        ) {

            return true;

        }

        return (
            this.map[mapY][mapX] ===
            "#"
        );

    },

    /* =====================================================
       26. GRAVITY
    ===================================================== */

    updateGravity(delta) {

        if (
            this.player.grounded
        ) {

            this.player.verticalVelocity =
                0;

            return;

        }

        this.player.verticalVelocity -=
            18 * delta;

        this.player.height +=
            this.player.verticalVelocity *
            delta;

        if (
            this.player.height <= 0
        ) {

            this.player.height = 0;

            this.player.verticalVelocity =
                0;

            this.player.grounded =
                true;

        }

    },

    /* =====================================================
       27. JUMP
    ===================================================== */

    jump() {

        if (
            !this.player.grounded
        ) {

            return;

        }

        this.player.grounded =
            false;

        this.player.verticalVelocity =
            7;

    },

    /* =====================================================
       28. MOBILE MOVEMENT
    ===================================================== */

    setMobileMovement(
        x,
        y
    ) {

        this.mobileX = x;

        this.mobileY = y;

    },

    /* =====================================================
       29. ENEMY GENERATION
    ===================================================== */

    generateEnemies() {

        this.enemies = [];

    },

    /* =====================================================
       30. SPAWN ENEMIES
    ===================================================== */

    spawnEnemies() {

        this.enemies = [];

        const spawnPoints = [

            {
                x: 11.5,
                y: 3.5
            },

            {
                x: 13.5,
                y: 6.5
            },

            {
                x: 5.5,
                y: 11.5
            },

            {
                x: 10.5,
                y: 13.5
            },

            {
                x: 13.5,
                y: 11.5
            }

        ];

        const count =
            Math.min(
                this.maxEnemies,
                spawnPoints.length
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const point =
                spawnPoints[i];

            this.enemies.push({

                id:
                    ++this.enemyId,

                x:
                    point.x,

                y:
                    point.y,

                health: 100,

                maxHealth: 100,

                speed:
                    0.7 +
                    Math.random() *
                    0.25,

                radius:
                    0.25,

                alive:
                    true,

                attackTimer:
                    0,

                attackCooldown:
                    1.5 +
                    Math.random(),

                rotation:
                    Math.random() *
                    Math.PI * 2,

                hitFlash:
                    0,

                deathTimer:
                    0

            });

        }

    },

    /* =====================================================
       31. ENEMY UPDATE
    ===================================================== */

    updateEnemies(delta) {

        for (
            const enemy of this.enemies
        ) {

            if (
                !enemy.alive
            ) {

                enemy.deathTimer +=
                    delta;

                continue;

            }

            enemy.hitFlash =
                Math.max(
                    0,
                    enemy.hitFlash -
                    delta
                );

            const dx =
                this.player.x -
                enemy.x;

            const dy =
                this.player.y -
                enemy.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            /*
             * Enemy bergerak mendekati player
             */

            if (
                distance > 1.8 &&
                distance < 15
            ) {

                const angle =
                    Math.atan2(
                        dy,
                        dx
                    );

                const moveSpeed =
                    enemy.speed *
                    delta;

                const moveX =
                    Math.cos(angle) *
                    moveSpeed;

                const moveY =
                    Math.sin(angle) *
                    moveSpeed;

                const nextX =
                    enemy.x +
                    moveX;

                const nextY =
                    enemy.y +
                    moveY;

                if (
                    !this.isWall(
                        nextX,
                        enemy.y
                    )
                ) {

                    enemy.x =
                        nextX;

                }

                if (
                    !this.isWall(
                        enemy.x,
                        nextY
                    )
                ) {

                    enemy.y =
                        nextY;

                }

            }

            /*
             * Enemy menyerang
             */

            if (
                distance < 7
            ) {

                enemy.attackTimer +=
                    delta;

                if (
                    enemy.attackTimer >=
                    enemy.attackCooldown
                ) {

                    enemy.attackTimer =
                        0;

                    this.enemyAttack(
                        enemy
                    );

                }

            }

        }

    },

    /* =====================================================
       32. ENEMY ATTACK
    ===================================================== */

    enemyAttack(
        enemy
    ) {

        const dx =
            this.player.x -
            enemy.x;

        const dy =
            this.player.y -
            enemy.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        /*
         * Basic line-of-sight
         */

        const angle =
            Math.atan2(
                dy,
                dx
            );

        if (
            !this.hasLineOfSight(
                enemy.x,
                enemy.y,
                this.player.x,
                this.player.y
            )
        ) {

            return;

        }

        const enemyAccuracy =
            0.55;

        if (
            Math.random() <
            enemyAccuracy
        ) {

            const damage =
                5 +
                Math.floor(
                    Math.random() * 6
                );

            if (
                typeof window.damagePlayer ===
                "function"
            ) {

                window.damagePlayer(
                    damage
                );

            }

        }

    },

    /* =====================================================
       33. LINE OF SIGHT
    ===================================================== */

    hasLineOfSight(
        x1,
        y1,
        x2,
        y2
    ) {

        const distance =
            Math.sqrt(
                (x2 - x1) ** 2 +
                (y2 - y1) ** 2
            );

        const steps =
            Math.ceil(
                distance * 8
            );

        for (
            let i = 0;
            i <= steps;
            i++
        ) {

            const t =
                i / steps;

            const x =
                x1 +
                (x2 - x1) * t;

            const y =
                y1 +
                (y2 - y1) * t;

            if (
                this.isWall(
                    x,
                    y
                )
            ) {

                return false;

            }

        }

        return true;

    },

    /* =====================================================
       34. SHOOTING
    ===================================================== */

    shoot() {

        const now =
            performance.now();

        if (
            now -
            this.weapon.lastShot <
            this.weapon.fireRate
        ) {

            return false;

        }

        this.weapon.lastShot =
            now;

        this.weapon.muzzleFlash =
            0.07;

        this.weapon.recoil =
            0.08;

        this.camera.shake =
            0.04;

        /*
         * Hit detection
         */

        const target =
            this.findTarget();

        if (
            target
        ) {

            this.damageEnemy(
                target,
                this.weapon.damage
            );

            return true;

        }

        return false;

    },

    /* =====================================================
       35. FIND TARGET
    ===================================================== */

    findTarget() {

        let closest = null;

        let closestDistance =
            Infinity;

        const playerAngle =
            this.player.angle;

        for (
            const enemy of this.enemies
        ) {

            if (
                !enemy.alive
            ) {

                continue;

            }

            const dx =
                enemy.x -
                this.player.x;

            const dy =
                enemy.y -
                this.player.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance >
                this.weapon.range
            ) {

                continue;

            }

            const angle =
                Math.atan2(
                    dy,
                    dx
                );

            let difference =
                angle -
                playerAngle;

            difference =
                Math.atan2(
                    Math.sin(difference),
                    Math.cos(difference)
                );

            /*
             * Target cone
             */

            const targetLimit =
                0.055;

            if (
                Math.abs(
                    difference
                ) >
                targetLimit
            ) {

                continue;

            }

            if (
                !this.hasLineOfSight(
                    this.player.x,
                    this.player.y,
                    enemy.x,
                    enemy.y
                )
            ) {

                continue;

            }

            if (
                distance <
                closestDistance
            ) {

                closest =
                    enemy;

                closestDistance =
                    distance;

            }

        }

        return closest;

    },

    /* =====================================================
       36. DAMAGE ENEMY
    ===================================================== */

    damageEnemy(
        enemy,
        amount
    ) {

        if (
            !enemy ||
            !enemy.alive
        ) {

            return;

        }

        enemy.health -=
            amount;

        enemy.hitFlash =
            0.15;

        if (
            enemy.health <= 0
        ) {

            this.killEnemy(
                enemy
            );

        }

    },

    /* =====================================================
       37. KILL ENEMY
    ===================================================== */

    killEnemy(
        enemy
    ) {

        if (
            !enemy.alive
        ) {

            return;

        }

        enemy.alive =
            false;

        enemy.health =
            0;

        enemy.deathTimer =
            0;

        if (
            typeof window.enemyKilled ===
            "function"
        ) {

            window.enemyKilled(
                `TARGET-${enemy.id}`
            );

        }

    },

    /* =====================================================
       38. WEAPON UPDATE
    ===================================================== */

    updateWeapon(delta) {

        this.weapon.muzzleFlash =
            Math.max(
                0,
                this.weapon.muzzleFlash -
                delta
            );

        this.weapon.recoil =
            Math.max(
                0,
                this.weapon.recoil -
                delta * 2
            );

        this.camera.shake =
            Math.max(
                0,
                this.camera.shake -
                delta * 2
            );

    },

    /* =====================================================
       39. RENDER
    ===================================================== */

    render() {

        if (
            !this.ctx
        ) {

            return;

        }

        this.clearScreen();

        this.renderSky();

        this.renderWalls();

        this.renderEnemies();

        this.renderWeapon();

        this.renderMuzzleFlash();

    },

    /* =====================================================
       40. CLEAR SCREEN
    ===================================================== */

    clearScreen() {

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

    },

    /* =====================================================
       41. SKY
    ===================================================== */

    renderSky() {

        const ctx =
            this.ctx;

        const horizon =
            this.height / 2;

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                horizon
            );

        sky.addColorStop(
            0,
            "#050709"
        );

        sky.addColorStop(
            0.55,
            "#11171b"
        );

        sky.addColorStop(
            1,
            "#252a2d"
        );

        ctx.fillStyle =
            sky;

        ctx.fillRect(
            0,
            0,
            this.width,
            horizon
        );

        const floor =
            ctx.createLinearGradient(
                0,
                horizon,
                0,
                this.height
            );

        floor.addColorStop(
            0,
            "#202427"
        );

        floor.addColorStop(
            1,
            "#050607"
        );

        ctx.fillStyle =
            floor;

        ctx.fillRect(
            0,
            horizon,
            this.width,
            this.height -
            horizon
        );

    },

    /* =====================================================
       42. WALL RENDER
    ===================================================== */

    renderWalls() {

        const ctx =
            this.ctx;

        const width =
            this.width;

        const height =
            this.height;

        const horizon =
            height / 2;

        const fov =
            this.camera.fov;

        const rayCount =
            Math.min(
                Math.floor(
                    width / 2
                ),
                900
            );

        const columnWidth =
            width /
            rayCount;

        for (
            let ray = 0;
            ray < rayCount;
            ray++
        ) {

            const cameraX =
                ray /
                rayCount;

            const rayAngle =
                this.player.angle -
                fov / 2 +
                fov * cameraX;

            const hit =
                this.castRay(
                    rayAngle
                );

            if (
                !hit
            ) {

                continue;

            }

            let distance =
                hit.distance;

            /*
             * Fisheye correction
             */

            const angleDifference =
                rayAngle -
                this.player.angle;

            distance *=
                Math.cos(
                    angleDifference
                );

            distance =
                Math.max(
                    distance,
                    0.01
                );

            const wallHeight =
                (
                    height /
                    distance
                ) *
                0.72;

            const top =
                horizon -
                wallHeight / 2;

            const bottom =
                horizon +
                wallHeight / 2;

            const brightness =
                Math.max(
                    0.12,
                    1 -
                    distance / 16
                );

            const base =
                hit.side
                    ? 70
                    : 95;

            const red =
                Math.floor(
                    base *
                    brightness
                );

            const green =
                Math.floor(
                    base *
                    brightness
                );

            const blue =
                Math.floor(
                    (base + 5) *
                    brightness
                );

            ctx.fillStyle =
                `rgb(${red},${green},${blue})`;

            ctx.fillRect(
                ray *
                columnWidth,
                top,
                columnWidth + 1,
                wallHeight
            );

            /*
             * Wall edge highlight
             */

            if (
                distance < 8
            ) {

                ctx.fillStyle =
                    `rgba(255,255,255,${0.02 * brightness})`;

                ctx.fillRect(
                    ray *
                    columnWidth,
                    top,
                    columnWidth + 1,
                    2
                );

            }

        }

        /*
         * Floor grid
         */

        this.renderFloorGrid();

    },

    /* =====================================================
       43. FLOOR GRID
    ===================================================== */

    renderFloorGrid() {

        const ctx =
            this.ctx;

        const horizon =
            this.height / 2;

        ctx.save();

        ctx.globalAlpha =
            0.08;

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth =
            1;

        for (
            let i = 1;
            i < 12;
            i++
        ) {

            const y =
                horizon +
                Math.pow(
                    i / 12,
                    1.7
                ) *
                (this.height -
                horizon);

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                this.width,
                y
            );

            ctx.stroke();

        }

        ctx.restore();

    },

    /* =====================================================
       44. RAYCAST
    ===================================================== */

    castRay(
        angle
    ) {

        const cos =
            Math.cos(
                angle
            );

        const sin =
            Math.sin(
                angle
            );

        let distance = 0;

        const step =
            0.025;

        while (
            distance <
            this.camera.viewDistance
        ) {

            distance +=
                step;

            const x =
                this.player.x +
                cos *
                distance;

            const y =
                this.player.y +
                sin *
                distance;

            if (
                this.isWall(
                    x,
                    y
                )
            ) {

                const mapX =
                    Math.floor(
                        x
                    );

                const mapY =
                    Math.floor(
                        y
                    );

                const offsetX =
                    x -
                    mapX;

                const offsetY =
                    y -
                    mapY;

                const side =
                    Math.min(
                        offsetX,
                        1 -
                        offsetX,
                        offsetY,
                        1 -
                        offsetY
                    ) < 0.03;

                return {

                    distance:
                        distance,

                    side:
                        side

                };

            }

        }

        return null;

    },

    /* =====================================================
       45. ENEMY RENDER
    ===================================================== */

    renderEnemies() {

        const ctx =
            this.ctx;

        const visibleEnemies =
            [];

        for (
            const enemy of this.enemies
        ) {

            if (
                !enemy.alive
            ) {

                continue;

            }

            const dx =
                enemy.x -
                this.player.x;

            const dy =
                enemy.y -
                this.player.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance >
                this.camera.viewDistance
            ) {

                continue;

            }

            const angle =
                Math.atan2(
                    dy,
                    dx
                );

            let relative =
                angle -
                this.player.angle;

            relative =
                Math.atan2(
                    Math.sin(relative),
                    Math.cos(relative)
                );

            if (
                Math.abs(relative) >
                this.camera.fov / 2
            ) {

                continue;

            }

            visibleEnemies.push({

                enemy,
                distance,
                relative

            });

        }

        /*
         * Render far enemies first
         */

        visibleEnemies.sort(
            (
                a,
                b
            ) =>
                b.distance -
                a.distance
        );


        for (
            const item of visibleEnemies
        ) {

            this.drawEnemy(
                item.enemy,
                item.distance,
                item.relative
            );

        }

    },

    /* =====================================================
       46. DRAW ENEMY
    ===================================================== */

    drawEnemy(
        enemy,
        distance,
        relativeAngle
    ) {

        const ctx =
            this.ctx;

        const width =
            this.width;

        const height =
            this.height;

        const horizon =
            height / 2;

        const fov =
            this.camera.fov;

        const screenX =
            width / 2 +
            (
                relativeAngle /
                fov
            ) *
            width;

        const size =
            (
                height /
                distance
            ) *
            0.45;

        const bodyWidth =
            size * 0.38;

        const bodyHeight =
            size * 0.68;

        const bodyTop =
            horizon -
            bodyHeight / 2;

        /*
         * Shadow
         */

        ctx.save();

        ctx.globalAlpha =
            Math.max(
                0.1,
                1 -
                distance / 18
            );

        /*
         * Enemy body
         */

        const hit =
            enemy.hitFlash >
            0;

        ctx.fillStyle =
            hit
                ? "#ffffff"
                : "#161b1f";

        ctx.fillRect(
            screenX -
            bodyWidth / 2,
            bodyTop,
            bodyWidth,
            bodyHeight
        );

        /*
         * Armor highlight
         */

        ctx.fillStyle =
            hit
                ? "#ffb0b0"
                : "#343b40";

        ctx.fillRect(
            screenX -
            bodyWidth * 0.32,
            bodyTop +
            bodyHeight * 0.15,
            bodyWidth * 0.64,
            bodyHeight * 0.08
        );

        /*
         * Head
         */

        const headSize =
            size * 0.20;

        ctx.fillStyle =
            hit
                ? "#ffffff"
                : "#22282c";

        ctx.beginPath();

        ctx.arc(
            screenX,
            bodyTop -
            headSize * 0.55,
            headSize / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
         * Red visor
         */

        ctx.fillStyle =
            "#ff2424";

        ctx.fillRect(
            screenX -
            headSize * 0.34,
            bodyTop -
            headSize * 0.62,
            headSize * 0.68,
            Math.max(
                2,
                headSize * 0.10
            )
        );

        /*
         * Weapon
         */

        ctx.fillStyle =
            "#090b0d";

        ctx.fillRect(
            screenX +
            bodyWidth * 0.25,
            bodyTop +
            bodyHeight * 0.28,
            bodyWidth * 0.75,
            Math.max(
                2,
                size * 0.055
            )
        );

        /*
         * Health bar
         */

        const healthWidth =
            bodyWidth * 1.4;

        const healthRatio =
            Math.max(
                0,
                enemy.health /
                enemy.maxHealth
            );

        ctx.fillStyle =
            "rgba(0,0,0,0.65)";

        ctx.fillRect(
            screenX -
            healthWidth / 2,
            bodyTop -
            size * 0.38,
            healthWidth,
            4
        );

        ctx.fillStyle =
            "#ff2a2a";

        ctx.fillRect(
            screenX -
            healthWidth / 2,
            bodyTop -
            size * 0.38,
            healthWidth *
            healthRatio,
            4
        );

        ctx.restore();

    },

    /* =====================================================
       47. WEAPON
    ===================================================== */

    renderWeapon() {

        const ctx =
            this.ctx;

        const width =
            this.width;

        const height =
            this.height;

        const recoil =
            this.weapon.recoil *
            100;

        const weaponWidth =
            Math.min(
                400,
                width * 0.36
            );

        const weaponHeight =
            weaponWidth * 0.48;

        const x =
            width / 2 -
            weaponWidth / 2;

        const y =
            height -
            weaponHeight +
            recoil;

        ctx.save();

        /*
         * Weapon shadow
         */

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            x +
            weaponWidth * 0.28,
            y +
            weaponHeight * 0.20,
            weaponWidth * 0.45,
            weaponHeight * 0.55
        );

        /*
         * Main body
         */

        ctx.fillStyle =
            "#151a1e";

        ctx.fillRect(
            x +
            weaponWidth * 0.20,
            y +
            weaponHeight * 0.15,
            weaponWidth * 0.60,
            weaponHeight * 0.42
        );

        /*
         * Weapon upper section
         */

        ctx.fillStyle =
            "#242b30";

        ctx.fillRect(
            x +
            weaponWidth * 0.28,
            y +
            weaponHeight * 0.08,
            weaponWidth * 0.45,
            weaponHeight * 0.13
        );

        /*
         * Barrel
         */

        ctx.fillStyle =
            "#090b0d";

        ctx.fillRect(
            x +
            weaponWidth * 0.70,
            y +
            weaponHeight * 0.25,
            weaponWidth * 0.27,
            weaponHeight * 0.08
        );

        /*
         * Magazine
         */

        ctx.fillStyle =
            "#101417";

        ctx.beginPath();

        ctx.moveTo(
            x +
            weaponWidth * 0.40,
            y +
            weaponHeight * 0.52
        );

        ctx.lineTo(
            x +
            weaponWidth * 0.55,
            y +
            weaponHeight * 0.52
        );

        ctx.lineTo(
            x +
            weaponWidth * 0.50,
            y +
            weaponHeight * 0.92
        );

        ctx.lineTo(
            x +
            weaponWidth * 0.43,
            y +
            weaponHeight * 0.92
        );

        ctx.closePath();

        ctx.fill();

        /*
         * Grip
         */

        ctx.fillStyle =
            "#0b0e10";

        ctx.fillRect(
            x +
            weaponWidth * 0.58,
            y +
            weaponHeight * 0.48,
            weaponWidth * 0.14,
            weaponHeight * 0.42
        );

        /*
         * Red accent
         */

        ctx.fillStyle =
            "#ff2a2a";

        ctx.fillRect(
            x +
            weaponWidth * 0.30,
            y +
            weaponHeight * 0.16,
            weaponWidth * 0.22,
            weaponHeight * 0.025
        );

        ctx.restore();

    },

    /* =====================================================
       48. MUZZLE FLASH
    ===================================================== */

    renderMuzzleFlash() {

        if (
            this.weapon.muzzleFlash <= 0
        ) {

            return;

        }

        const ctx =
            this.ctx;

        const width =
            this.width;

        const height =
            this.height;

        const centerX =
            width / 2;

        const centerY =
            height -
            height * 0.18;

        const size =
            30 +
            Math.random() *
            30;

        ctx.save();

        ctx.globalAlpha =
            this.weapon.muzzleFlash /
            0.07;

        ctx.fillStyle =
            "#ffb000";

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY -
            size
        );

        ctx.lineTo(
            centerX +
            size * 0.28,
            centerY -
            size * 0.25
        );

        ctx.lineTo(
            centerX +
            size,
            centerY
        );

        ctx.lineTo(
            centerX +
            size * 0.25,
            centerY +
            size * 0.2
        );

        ctx.lineTo(
            centerX,
            centerY +
            size
        );

        ctx.lineTo(
            centerX -
            size * 0.25,
            centerY +
            size * 0.2
        );

        ctx.lineTo(
            centerX -
            size,
            centerY
        );

        ctx.lineTo(
            centerX -
            size * 0.25,
            centerY -
            size * 0.25
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

    },

    /* =====================================================
       49. MOBILE JUMP BRIDGE
    ===================================================== */

    setJump() {

        this.jump();

    },

    /* =====================================================
       50. PLAYER DEATH
    ===================================================== */

    playerDeath() {

        this.running = false;

    }

};


/* =========================================================
   AUTO INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            window.GameEngine
        ) {

            window.GameEngine.init();

        }

    }
);


/* =========================================================
   ENGINE READY
   ========================================================= */

console.log(
    "%c BLACK OPS ENGINE ",
    "background:#050607;color:#ff2a2a;font-size:15px;font-weight:bold;padding:7px;"
);

console.log(
    "%c FPS renderer ready.",
    "color:#8a9297;"
);
