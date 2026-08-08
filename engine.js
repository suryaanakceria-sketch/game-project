```javascript
/* =========================================================
   BLACK OPS // FPS ARENA
   ENGINE.JS
   PHASE 2 — THREE.JS 3D FPS ENGINE
   ========================================================= */


/* =========================================================
   01. GAME ENGINE
   ========================================================= */

const GameEngine = {

    /* -----------------------------------------------------
       CORE
       ----------------------------------------------------- */

    scene: null,
    camera: null,
    renderer: null,

    container: null,

    clock: null,

    running: false,
    paused: false,

    initialized: false,

    /* -----------------------------------------------------
       PLAYER
       ----------------------------------------------------- */

    player: {

        height: 1.7,

        speed: 5.5,

        sprintSpeed: 8,

        jumpForce: 6.5,

        gravity: 18,

        velocityY: 0,

        grounded: true,

        health: 100,

        armor: 100,

        radius: 0.35

    },


    /* -----------------------------------------------------
       CAMERA
       ----------------------------------------------------- */

    cameraData: {

        yaw: 0,

        pitch: 0,

        sensitivity: 0.0022,

        maxPitch:
            Math.PI / 2 - 0.08,

        recoil: 0,

        shake: 0

    },


    /* -----------------------------------------------------
       MOVEMENT
       ----------------------------------------------------- */

    keys: {

        forward: false,

        backward: false,

        left: false,

        right: false,

        sprint: false

    },


    /* -----------------------------------------------------
       WEAPON
       ----------------------------------------------------- */

    weapon: {

        name: "M4A1",

        mode: "AUTO",

        damage: 34,

        fireRate: 95,

        magazineSize: 30,

        ammo: 30,

        reserve: 120,

        reloadTime: 1.7,

        lastShot: 0,

        reloading: false,

        reloadTimer: 0,

        recoil: 0,

        muzzleFlash: 0

    },


    /* -----------------------------------------------------
       WORLD
       ----------------------------------------------------- */

    world: {

        floor: null,

        walls: [],

        obstacles: [],

        lights: []

    },


    /* -----------------------------------------------------
       ENEMIES
       ----------------------------------------------------- */

    enemies: [],

    enemyCount: 6,

    kills: 0,

score: 0,

wave: 1,

waveEnemies: 5,

waveActive: false,

waveCompleted: false,

waveDelay: 3,

waveTimer: 0,


    /* -----------------------------------------------------
       TEMP OBJECTS
       ----------------------------------------------------- */

    bullets: [],

    particles: [],


    /* =====================================================
       02. INIT
       ===================================================== */

    init() {

        if (this.initialized) {

            return;

        }


        this.container =
            document.getElementById(
                "game-world"
            );


        if (!this.container) {

            console.error(
                "Game world not found."
            );

            return;

        }


        /* -------------------------------------------------
           Scene
           ------------------------------------------------- */

        this.scene =
            new THREE.Scene();


        this.scene.background =
            new THREE.Color(
                0x050608
            );


        this.scene.fog =
            new THREE.Fog(
                0x080b0d,
                18,
                60
            );


        /* -------------------------------------------------
           Camera
           ------------------------------------------------- */

        this.camera =
            new THREE.PerspectiveCamera(
                75,
                window.innerWidth /
                window.innerHeight,
                0.05,
                100
            );


        this.camera.position.set(
            3,
            this.player.height,
            3
        );


        /* -------------------------------------------------
           Renderer
           ------------------------------------------------- */

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                powerPreference:
                    "high-performance"

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.shadowMap.enabled =
            true;


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        this.container.appendChild(
            this.renderer.domElement
        );


        /* -------------------------------------------------
           Clock
           ------------------------------------------------- */

        this.clock =
            new THREE.Clock();


        /* -------------------------------------------------
           Build world
           ------------------------------------------------- */

        this.createLights();

        this.createFloor();

        this.createArena();

        this.createObstacles();

        this.createEnemies();

        this.createWeaponModel();


        /* -------------------------------------------------
           Events
           ------------------------------------------------- */

        this.bindEvents();


        this.initialized =
            true;


        console.log(
            "BLACK OPS 3D ENGINE READY"
        );

    },


    /* =====================================================
       03. LIGHTING
       ===================================================== */

    createLights() {

        /* -------------------------------------------------
           Ambient
           ------------------------------------------------- */

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                0.45
            );


        this.scene.add(
            ambient
        );


        /* -------------------------------------------------
           Main directional light
           ------------------------------------------------- */

        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                1.4
            );


        sun.position.set(
            10,
            18,
            5
        );


        sun.castShadow =
            true;


        sun.shadow.mapSize.width =
            2048;

        sun.shadow.mapSize.height =
            2048;


        sun.shadow.camera.left =
            -30;

        sun.shadow.camera.right =
            30;

        sun.shadow.camera.top =
            30;

        sun.shadow.camera.bottom =
            -30;


        this.scene.add(
            sun
        );


        this.world.lights.push(
            sun
        );


        /* -------------------------------------------------
           Red arena lights
           ------------------------------------------------- */

        const redLight1 =
            new THREE.PointLight(
                0xff2020,
                12,
                14
            );


        redLight1.position.set(
            4,
            4,
            -4
        );


        this.scene.add(
            redLight1
        );


        const redLight2 =
            new THREE.PointLight(
                0xff2020,
                10,
                12
            );


        redLight2.position.set(
            -8,
            3,
            7
        );


        this.scene.add(
            redLight2
        );


        this.world.lights.push(
            redLight1,
            redLight2
        );

    },


    /* =====================================================
       04. FLOOR
       ===================================================== */

    createFloor() {

        const geometry =
            new THREE.PlaneGeometry(
                40,
                40
            );


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x15191c,

                roughness:
                    0.85,

                metalness:
                    0.15

            });


        const floor =
            new THREE.Mesh(
                geometry,
                material
            );


        floor.rotation.x =
            -Math.PI / 2;


        floor.receiveShadow =
            true;


        this.scene.add(
            floor
        );


        this.world.floor =
            floor;


        /* -------------------------------------------------
           Floor grid
           ------------------------------------------------- */

        const grid =
            new THREE.GridHelper(
                40,
                40,
                0x44484c,
                0x222629
            );


        grid.position.y =
            0.01;


        this.scene.add(
            grid
        );

    },


    /* =====================================================
       05. ARENA
       ===================================================== */

    createArena() {

        const wallMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x252b2f,

                roughness:
                    0.7,

                metalness:
                    0.3

            });


        /* -------------------------------------------------
           North wall
           ------------------------------------------------- */

        this.createWall(
            0,
            2,
            -20,
            40,
            4,
            1,
            wallMaterial
        );


        /* -------------------------------------------------
           South wall
           ------------------------------------------------- */

        this.createWall(
            0,
            2,
            20,
            40,
            4,
            1,
            wallMaterial
        );


        /* -------------------------------------------------
           East wall
           ------------------------------------------------- */

        this.createWall(
            20,
            2,
            0,
            1,
            4,
            40,
            wallMaterial
        );


        /* -------------------------------------------------
           West wall
           ------------------------------------------------- */

        this.createWall(
            -20,
            2,
            0,
            1,
            4,
            40,
            wallMaterial
        );

    },


    /* =====================================================
       06. CREATE WALL
       ===================================================== */

    createWall(
        x,
        y,
        z,
        width,
        height,
        depth,
        material
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        mesh.position.set(
            x,
            y,
            z
        );


        mesh.castShadow =
            true;


        mesh.receiveShadow =
            true;


        this.scene.add(
            mesh
        );


        this.world.walls.push(
            mesh
        );


        return mesh;

    },


    /* =====================================================
       07. OBSTACLES
       ===================================================== */

    createObstacles() {

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x30363a,

                roughness:
                    0.75,

                metalness:
                    0.25

            });


        const objects = [

            {
                x: 0,
                y: 1,
                z: -7,
                w: 5,
                h: 2,
                d: 2
            },

            {
                x: 7,
                y: 1,
                z: -3,
                w: 2,
                h: 2,
                d: 5
            },

            {
                x: -7,
                y: 1,
                z: 3,
                w: 2,
                h: 2,
                d: 5
            },

            {
                x: 3,
                y: 1,
                z: 7,
                w: 6,
                h: 2,
                d: 2
            },

            {
                x: -4,
                y: 1,
                z: -1,
                w: 3,
                h: 2,
                d: 3
            }

        ];


        for (
            const object of objects
        ) {

            const geometry =
                new THREE.BoxGeometry(
                    object.w,
                    object.h,
                    object.d
                );


            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );


            mesh.position.set(
                object.x,
                object.y,
                object.z
            );


            mesh.castShadow =
                true;


            mesh.receiveShadow =
                true;


            this.scene.add(
                mesh
            );


            this.world.obstacles.push(
                mesh
            );

        }

    },


    /* =====================================================
       08. ENEMIES
       ===================================================== */

    createEnemies() {

    spawnWave() {

    this.waveActive = true;
    this.waveCompleted = false;

    const count =
        this.waveEnemies +
        (this.wave - 1) * 2;

    const positions = [

        [-12, 0, -12],
        [10, 0, -12],
        [13, 0, 4],
        [-12, 0, 10],
        [8, 0, 12],
        [-5, 0, -13],
        [15, 0, -8],
        [-15, 0, 5],
        [4, 0, -15],
        [-3, 0, 14]

    ];

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const position =
            positions[
                i % positions.length
            ];

        this.createEnemy(
            position[0],
            position[1],
            position[2],
            i
        );

    }

    this.updateWaveHUD();

},

    this.enemies = [];

    this.spawnWave();

},


        positions.forEach(
            (position, index) => {

                this.createEnemy(
                    position[0],
                    position[1],
                    position[2],
                    index
                );

            }
        );

    },


    /* =====================================================
       09. CREATE ENEMY
       ===================================================== */

    createEnemy(
        x,
        y,
        z,
        id
    ) {

        const group =
            new THREE.Group();


        /* -------------------------------------------------
           Body
           ------------------------------------------------- */

        const bodyGeometry =
            new THREE.BoxGeometry(
                0.9,
                1.2,
                0.55
            );


        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x202529,

                roughness:
                    0.65,

                metalness:
                    0.3

            });


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );


        body.position.y =
            1.05;


        body.castShadow =
            true;


        group.add(
            body
        );


        /* -------------------------------------------------
           Head
           ------------------------------------------------- */

        const headGeometry =
            new THREE.SphereGeometry(
                0.32,
                16,
                16
            );


        const headMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x343a3e,

                roughness:
                    0.6

            });


        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );


        head.position.y =
            1.9;


        head.castShadow =
            true;


        group.add(
            head
        );


        /* -------------------------------------------------
           Red visor
           ------------------------------------------------- */

        const visorGeometry =
            new THREE.BoxGeometry(
                0.45,
                0.08,
                0.08
            );


        const visorMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xff2020

            });


        const visor =
            new THREE.Mesh(
                visorGeometry,
                visorMaterial
            );


        visor.position.set(
            0,
            1.91,
            -0.29
        );


        group.add(
            visor
        );


        /* -------------------------------------------------
           Weapon
           ------------------------------------------------- */

        const weaponGeometry =
            new THREE.BoxGeometry(
                1.1,
                0.12,
                0.12
            );


        const weaponMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x090b0c,

                metalness:
                    0.7,

                roughness:
                    0.35

            });


        const weapon =
            new THREE.Mesh(
                weaponGeometry,
                weaponMaterial
            );


        weapon.position.set(
            0.65,
            1.15,
            -0.25
        );


        weapon.rotation.z =
            -0.1;


        group.add(
            weapon
        );


        /* -------------------------------------------------
           Group
           ------------------------------------------------- */

        group.position.set(
            x,
            y,
            z
        );


        this.scene.add(
            group
        );


        const enemy = {

            id,

            mesh:
                group,

            health:
                100,

            maxHealth:
                100,

            speed:
                1.2,

            attackDistance:
                10,

            attackTimer:
                0,

            attackCooldown:
                1.5,

            alive:
                true,

            hitTimer:
                0

        };


        group.userData.enemy =
            enemy;


        this.enemies.push(
            enemy
        );

    },


    /* =====================================================
       10. WEAPON MODEL
       ===================================================== */

    createWeaponModel() {

        const group =
            new THREE.Group();


        /* -------------------------------------------------
           Main receiver
           ------------------------------------------------- */

        const receiverGeometry =
            new THREE.BoxGeometry(
                0.85,
                0.25,
                0.22
            );


        const receiverMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x111518,

                metalness:
                    0.8,

                roughness:
                    0.3

            });


        const receiver =
            new THREE.Mesh(
                receiverGeometry,
                receiverMaterial
            );


        receiver.position.z =
            -0.45;


        group.add(
            receiver
        );


        /* -------------------------------------------------
           Barrel
           ------------------------------------------------- */

        const barrelGeometry =
            new THREE.CylinderGeometry(
                0.055,
                0.055,
                0.75,
                12
            );


        const barrelMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x090b0d,

                metalness:
                    0.9,

                roughness:
                    0.25

            });


        const barrel =
            new THREE.Mesh(
                barrelGeometry,
                barrelMaterial
            );


        barrel.rotation.x =
            Math.PI / 2;


        barrel.position.z =
            -0.92;


        group.add(
            barrel
        );


        /* -------------------------------------------------
           Grip
           ------------------------------------------------- */

        const gripGeometry =
            new THREE.BoxGeometry(
                0.18,
                0.5,
                0.18
            );


        const grip =
            new THREE.Mesh(
                gripGeometry,
                receiverMaterial
            );


        grip.position.set(
            0.1,
            -0.28,
            -0.35
        );


        grip.rotation.x =
            -0.15;


        group.add(
            grip
        );


        /* -------------------------------------------------
           Magazine
           ------------------------------------------------- */

        const magazineGeometry =
            new THREE.BoxGeometry(
                0.22,
                0.5,
                0.18
            );


        const magazine =
            new THREE.Mesh(
                magazineGeometry,
                receiverMaterial
            );


        magazine.position.set(
            0,
            -0.28,
            -0.45
        );


        group.add(
            magazine
        );


        /* -------------------------------------------------
           Position weapon
           ------------------------------------------------- */

        group.position.set(
            0.48,
            -0.48,
            -0.85
        );


        group.rotation.y =
            -0.03;


        this.camera.add(
            group
        );


        this.weaponModel =
            group;


        /* -------------------------------------------------
           Muzzle light
           ------------------------------------------------- */

        const muzzleLight =
            new THREE.PointLight(
                0xff8800,
                0,
                5
            );


        muzzleLight.position.set(
            0,
            0,
            -1.3
        );


        group.add(
            muzzleLight
        );


        this.muzzleLight =
            muzzleLight;

    },


    /* =====================================================
       11. INPUT EVENTS
       ===================================================== */

    bindEvents() {

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                this.handleKeyDown(
                    event
                );

            }
        );


        document.addEventListener(
            "keyup",
            event => {

                this.handleKeyUp(
                    event
                );

            }
        );


        document.addEventListener(
            "mousemove",
            event => {

                if (
                    !this.running ||
                    this.paused
                ) {

                    return;

                }


                if (
                    document.pointerLockElement !==
                    this.renderer.domElement
                ) {

                    return;

                }


                this.cameraData.yaw -=
                    event.movementX *
                    this.cameraData.sensitivity;


                this.cameraData.pitch -=
                    event.movementY *
                    this.cameraData.sensitivity;


                this.cameraData.pitch =
                    THREE.MathUtils.clamp(
                        this.cameraData.pitch,
                        -this.cameraData.maxPitch,
                        this.cameraData.maxPitch
                    );

            }
        );


        document.addEventListener(
            "mousedown",
            event => {

                if (
                    event.button !== 0
                ) {

                    return;

                }


                if (
                    !this.running ||
                    this.paused
                ) {

                    return;

                }


                this.shoot();

            }
        );


        document.addEventListener(
            "pointerlockchange",
            () => {

                const locked =
                    document.pointerLockElement ===
                    this.renderer.domElement;


                if (
                    !locked &&
                    this.running
                ) {

                    this.pause();

                }

            }
        );

    },


    /* =====================================================
       12. KEY DOWN
       ===================================================== */

    handleKeyDown(
        event
    ) {

        switch (
            event.code
        ) {

            case "KeyW":

                this.keys.forward =
                    true;

                break;


            case "KeyS":

                this.keys.backward =
                    true;

                break;


            case "KeyA":

                this.keys.left =
                    true;

                break;


            case "KeyD":

                this.keys.right =
                    true;

                break;


            case "ShiftLeft":

            case "ShiftRight":

                this.keys.sprint =
                    true;

                break;


            case "Space":

                this.jump();

                break;


            case "KeyR":

                this.reload();

                break;


            case "Escape":

                if (
                    this.running
                ) {

                    this.pause();

                }

                break;

        }

    },


    /* =====================================================
       13. KEY UP
       ===================================================== */

    handleKeyUp(
        event
    ) {

        switch (
            event.code
        ) {

            case "KeyW":

                this.keys.forward =
                    false;

                break;


            case "KeyS":

                this.keys.backward =
                    false;

                break;


            case "KeyA":

                this.keys.left =
                    false;

                break;


            case "KeyD":

                this.keys.right =
                    false;

                break;


            case "ShiftLeft":

            case "ShiftRight":

                this.keys.sprint =
                    false;

                break;

        }

    },


    /* =====================================================
       14. RESIZE
       ===================================================== */

    resize() {

        if (
            !this.camera ||
            !this.renderer
        ) {

            return;

        }


        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    },


    /* =====================================================
       15. START
       ===================================================== */

    start() {

        if (
            !this.initialized
        ) {

            this.init();

        }


        this.running =
            true;


        this.paused =
            false;


        this.playerReset();


        this.clock.start();


        this.requestPointerLock();


        this.lastTime =
            performance.now();


        this.animate();


        this.updateHUD();


        console.log(
            "MISSION STARTED"
        );

    },


    /* =====================================================
       16. RESET PLAYER
       ===================================================== */

    playerReset() {

        this.camera.position.set(
            0,
            this.player.height,
            5
        );


        this.cameraData.yaw =
            0;


        this.cameraData.pitch =
            0;


        this.player.velocityY =
            0;


        this.player.grounded =
            true;


        this.player.health =
            100;


        this.player.armor =
            100;


        this.weapon.ammo =
            this.weapon.magazineSize;


        this.weapon.reserve =
            120;


        this.kills =
            0;


        this.score =
            0;


        this.enemies.forEach(
            enemy => {

                enemy.health =
                    enemy.maxHealth;

                enemy.alive =
                    true;

                enemy.mesh.visible =
                    true;

            }
        );

    },


    /* =====================================================
       17. POINTER LOCK
       ===================================================== */

    requestPointerLock() {

        if (
            !this.renderer
        ) {

            return;

        }


        this.renderer.domElement
            .requestPointerLock?.();

    },


    /* =====================================================
       18. PAUSE
       ===================================================== */

    pause() {

        if (
            !this.running
        ) {

            return;

        }


        this.paused =
            true;


        document
            .getElementById(
                "pause-screen"
            )
            ?.classList
            .remove(
                "hidden"
            );

    },


    /* =====================================================
       19. RESUME
       ===================================================== */

    resume() {

        this.paused =
            false;


        document
            .getElementById(
                "pause-screen"
            )
            ?.classList
            .add(
                "hidden"
            );


        this.clock.getDelta();


        this.requestPointerLock();

    },


    /* =====================================================
       20. MOVEMENT
       ===================================================== */

    updateMovement(
        delta
    ) {

        if (
            this.paused
        ) {

            return;

        }


        let forward =
            0;

        let strafe =
            0;


        if (
            this.keys.forward
        ) {

            forward +=
                1;

        }


        if (
            this.keys.backward
        ) {

            forward -=
                1;

        }


        if (
            this.keys.right
        ) {

            strafe +=
                1;

        }


        if (
            this.keys.left
        ) {

            strafe -=
                1;

        }


        const length =
            Math.sqrt(
                forward *
                forward +
                strafe *
                strafe
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
            this.keys.sprint
                ? this.player.sprintSpeed
                : this.player.speed;


        const move =
            speed *
            delta;


        const direction =
            new THREE.Vector3();


        this.camera.getWorldDirection(
            direction
        );


        direction.y =
            0;


        direction.normalize();


        const right =
            new THREE.Vector3();


        right.crossVectors(
            direction,
            new THREE.Vector3(
                0,
                1,
                0
            )
        );


        right.normalize();


        const movement =
            new THREE.Vector3();


        movement.addScaledVector(
            direction,
            forward *
            move
        );


        movement.addScaledVector(
            right,
            strafe *
            move
        );


        this.tryMove(
            movement.x,
            movement.z
        );

    },


    /* =====================================================
       21. COLLISION MOVEMENT
       ===================================================== */

    tryMove(
        dx,
        dz
    ) {

        const nextX =
            this.camera.position.x +
            dx;


        const nextZ =
            this.camera.position.z +
            dz;


        if (
            !this.checkCollision(
                nextX,
                this.camera.position.z
            )
        ) {

            this.camera.position.x =
                nextX;

        }


        if (
            !this.checkCollision(
                this.camera.position.x,
                nextZ
            )
        ) {

            this.camera.position.z =
                nextZ;

        }

    },


    /* =====================================================
       22. COLLISION CHECK
       ===================================================== */

    checkCollision(
        x,
        z
    ) {

        const radius =
            this.player.radius;


        const playerBox =
            new THREE.Box3();


        playerBox.min.set(
            x - radius,
            0,
            z - radius
        );


        playerBox.max.set(
            x + radius,
            this.player.height,
            z + radius
        );


        const objects = [
            ...this.world.walls,
            ...this.world.obstacles
        ];


        for (
            const object of objects
        ) {

            const box =
                new THREE.Box3()
                    .setFromObject(
                        object
                    );


            if (
                playerBox.intersectsBox(
                    box
                )
            ) {

                return true;

            }

        }


        return false;

    },


    /* =====================================================
       23. GRAVITY
       ===================================================== */

    updateGravity(
        delta
    ) {

        if (
            this.player.grounded
        ) {

            return;

        }


        this.player.velocityY -=
            this.player.gravity *
            delta;


        this.camera.position.y +=
            this.player.velocityY *
            delta;


        if (
            this.camera.position.y <=
            this.player.height
        ) {

            this.camera.position.y =
                this.player.height;


            this.player.velocityY =
                0;


            this.player.grounded =
                true;

        }

    },


    /* =====================================================
       24. JUMP
       ===================================================== */

    jump() {

        if (
            !this.player.grounded ||
            this.paused
        ) {

            return;

        }


        this.player.grounded =
            false;


        this.player.velocityY =
            this.player.jumpForce;

    },


    /* =====================================================
       25. ENEMY UPDATE
       ===================================================== */

    updateEnemies(
        delta
    ) {

        const playerPosition =
            this.camera.position;


        for (
            const enemy of this.enemies
        ) {

            if (
                !enemy.alive
            ) {

                continue;

            }


            const position =
                enemy.mesh.position;


            const direction =
                new THREE.Vector3(
                    playerPosition.x -
                    position.x,

                    0,

                    playerPosition.z -
                    position.z
                );


            const distance =
                direction.length();


            if (
                distance >
                1.8 &&
                distance <
                30
            ) {

                direction.normalize();


                const speed =
                    enemy.speed *
                    delta;


                const nextX =
                    position.x +
                    direction.x *
                    speed;


                const nextZ =
                    position.z +
                    direction.z *
                    speed;


                if (
                    !this.checkEnemyCollision(
                        enemy,
                        nextX,
                        position.z
                    )
                ) {

                    position.x =
                        nextX;

                }


                if (
                    !this.checkEnemyCollision(
                        enemy,
                        position.x,
                        nextZ
                    )
                ) {

                    position.z =
                        nextZ;

                }

            }


            /* ---------------------------------------------
               Look at player
               --------------------------------------------- */

            enemy.mesh.lookAt(
                playerPosition.x,
                1,
                playerPosition.z
            );


            /* ---------------------------------------------
               Attack
               --------------------------------------------- */

            if (
                distance <=
                enemy.attackDistance
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


            /* ---------------------------------------------
               Hit flash
               --------------------------------------------- */

            if (
                enemy.hitTimer > 0
            ) {

                enemy.hitTimer -=
                    delta;

            }

        }

    },


    /* =====================================================
       26. ENEMY COLLISION
       ===================================================== */

    checkEnemyCollision(
        currentEnemy,
        x,
        z
    ) {

        const radius =
            0.45;


        for (
            const enemy of this.enemies
        ) {

            if (
                enemy === currentEnemy ||
                !enemy.alive
            ) {

                continue;

            }


            const dx =
                enemy.mesh.position.x -
                x;


            const dz =
                enemy.mesh.position.z -
                z;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dz * dz
                );


            if (
                distance <
                radius * 2
            ) {

                return true;

            }

        }


        return this.checkCollision(
            x,
            z
        );

    },


    /* =====================================================
       27. ENEMY ATTACK
       ===================================================== */

    enemyAttack(
        enemy
    ) {

        if (
            !enemy.alive
        ) {

            return;

        }


        const origin =
            enemy.mesh.position.clone();


        origin.y =
            1.4;


        const target =
            this.camera.position.clone();


        const direction =
            new THREE.Vector3()
                .subVectors(
                    target,
                    origin
                )
                .normalize();


        const raycaster =
            new THREE.Raycaster(
                origin,
                direction,
                0,
                30
            );


        const objects = [
            ...this.world.walls,
            ...this.world.obstacles
        ];


        const hits =
            raycaster.intersectObjects(
                objects,
                false
            );


        if (
            hits.length > 0
        ) {

            return;

        }


        if (
            Math.random() <
            0.55
        ) {

            this.damagePlayer(
                8
            );

        }

    },


    /* =====================================================
       28. DAMAGE PLAYER
       ===================================================== */

    damagePlayer(
        amount
    ) {

        if (
            !this.running
        ) {

            return;

        }


        let damage =
            amount;


        if (
            this.player.armor >
            0
        ) {

            const absorbed =
                Math.min(
                    this.player.armor,
                    Math.floor(
                        damage *
                        0.5
                    )
                );


            this.player.armor -=
                absorbed;


            damage -=
                absorbed;

        }


        this.player.health -=
            damage;


        this.player.health =
            Math.max(
                0,
                this.player.health
            );


        this.showDamageEffect();


        this.updateHUD();


        if (
            this.player.health <=
            0
        ) {

            this.gameOver();

        }

    },


    /* =====================================================
       29. SHOOT
       ===================================================== */

    shoot() {

        if (
            this.weapon.reloading
        ) {

            return;

        }


        const now =
            performance.now();


        if (
            now -
            this.weapon.lastShot <
            this.weapon.fireRate
        ) {

            return;

        }


        if (
            this.weapon.ammo <= 0
        ) {

            this.reload();

            return;

        }


        this.weapon.lastShot =
            now;


        this.weapon.ammo--;


        this.weapon.muzzleFlash =
            0.08;


        this.weapon.recoil =
            0.08;


        this.cameraData.recoil =
            0.035;


        this.createMuzzleFlash();


        /* -------------------------------------------------
           Raycast
           ------------------------------------------------- */

        const direction =
            new THREE.Vector3();


        this.camera.getWorldDirection(
            direction
        );


        const raycaster =
            new THREE.Raycaster(
                this.camera.position,
                direction,
                0,
                100
            );


        const enemyMeshes = [];


        this.enemies.forEach(
            enemy => {

                if (
                    enemy.alive
                ) {

                    enemy.mesh.traverse(
                        object => {

                            if (
                                object.isMesh
                            ) {

                                object.userData.enemy =
                                    enemy;

                                enemyMeshes.push(
                                    object
                                );

                            }

                        }
                    );

                }

            }
        );


        const hits =
            raycaster.intersectObjects(
                [
                    ...enemyMeshes,
                    ...this.world.walls,
                    ...this.world.obstacles
                ],
                true
            );


        if (
            hits.length > 0
        ) {

            const hit =
                hits[0];


            const enemy =
                hit.object.userData.enemy;


            if (
                enemy &&
                enemy.alive
            ) {

                this.damageEnemy(
                    enemy,
                    this.weapon.damage
                );


                this.showHitMarker();

            }

        }


        this.updateHUD();

    },


    /* =====================================================
       30. DAMAGE ENEMY
       ===================================================== */

    damageEnemy(
        enemy,
        damage
    ) {

        enemy.health -=
            damage;


        enemy.hitTimer =
            0.15;


        if (
            enemy.health <=
            0
        ) {

            this.killEnemy(
                enemy
            );

        }

    },


    /* =====================================================
       31. KILL ENEMY
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


        enemy.mesh.visible =
            false;


        this.kills++;


        this.score +=
            100;


        this.showKillFeed(
            `HOSTILE ${enemy.id + 1} ELIMINATED`
        );


        this.updateHUD();


        if (
            this.enemies.every(
                item =>
                    !item.alive
            )
        ) {

            this.victory();

        }

    },


    /* =====================================================
       32. RELOAD
       ===================================================== */

    reload() {

        if (
            this.weapon.reloading
        ) {

            return;

        }


        if (
            this.weapon.ammo >=
            this.weapon.magazineSize
        ) {

            return;

        }


        if (
            this.weapon.reserve <=
            0
        ) {

            return;

        }


        this.weapon.reloading =
            true;


        this.weapon.reloadTimer =
            0;


        const reloadText =
            document.getElementById(
                "reload-text"
            );


        if (
            reloadText
        ) {

            reloadText.textContent =
                "RELOADING";

        }

    },


    /* =====================================================
       33. UPDATE WEAPON
       ===================================================== */

    updateWeapon(
        delta
    ) {

        if (
            this.weapon.reloading
        ) {

            this.weapon.reloadTimer +=
                delta;


            if (
                this.weapon.reloadTimer >=
                this.weapon.reloadTime
            ) {

                const needed =
                    this.weapon.magazineSize -
                    this.weapon.ammo;


                const amount =
                    Math.min(
                        needed,
                        this.weapon.reserve
                    );


                this.weapon.ammo +=
                    amount;


                this.weapon.reserve -=
                    amount;


                this.weapon.reloading =
                    false;


                this.weapon.reloadTimer =
                    0;


                const reloadText =
                    document.getElementById(
                        "reload-text"
                    );


                if (
                    reloadText
                ) {

                    reloadText.textContent =
                        "";

                }

            }

        }


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


        this.cameraData.recoil =
            Math.max(
                0,
                this.cameraData.recoil -
                delta * 2
            );


        if (
            this.weaponModel
        ) {

            this.weaponModel.position.y =
                -0.48 +
                this.weapon.recoil;


            this.weaponModel.rotation.x =
                this.weapon.recoil *
                0.5;

        }


        if (
            this.muzzleLight
        ) {

            this.muzzleLight.intensity =
                this.weapon.muzzleFlash >
                0
                    ? 8
                    : 0;

        }

    },


    /* =====================================================
       34. MUZZLE FLASH
       ===================================================== */

    createMuzzleFlash() {

        if (
            !this.muzzleLight
        ) {

            return;

        }


        this.muzzleLight.intensity =
            12;


        const flashGeometry =
            new THREE.SphereGeometry(
                0.09,
                8,
                8
            );


        const flashMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffaa33

            });


        const flash =
            new THREE.Mesh(
                flashGeometry,
                flashMaterial
            );


        flash.position.set(
            0,
            0,
            -1.35
        );


        this.weaponModel.add(
            flash
        );


        setTimeout(
            () => {

                this.weaponModel.remove(
                    flash
                );


                flash.geometry.dispose();

                flash.material.dispose();

            },
            50
        );

    },


    /* =====================================================
       35. CAMERA
       ===================================================== */

    updateCamera() {

        this.camera.rotation.order =
            "YXZ";


        this.camera.rotation.y =
            this.cameraData.yaw;


        this.camera.rotation.x =
            this.cameraData.pitch;


        this.camera.rotation.z =
            0;

    },


    /* =====================================================
       36. ANIMATION
       ===================================================== */

    animate() {

        if (
            !this.running
        ) {

            return;

        }


        requestAnimationFrame(
            () =>
                this.animate()
        );


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            );


        if (
            !this.paused
        ) {

            this.updateMovement(
                delta
            );


            this.updateGravity(
                delta
            );


            this.updateEnemies(
                delta
            );


            this.updateWeapon(
                delta
            );


            this.updateCamera();

        }


        this.renderer.render(
            this.scene,
            this.camera
        );

    },


    /* =====================================================
       37. HUD
       ===================================================== */

    updateHUD() {

        const healthValue =
            document.getElementById(
                "health-value"
            );


        const healthFill =
            document.getElementById(
                "health-fill"
            );


        const armorValue =
            document.getElementById(
                "armor-value"
            );


        const ammoCurrent =
            document.getElementById(
                "ammo-current"
            );


        const ammoReserve =
            document.getElementById(
                "ammo-reserve"
            );


        const scoreValue =
            document.getElementById(
                "score-value"
            );


        const kills =
            document.getElementById(
                "result-kills"
            );


        if (
            healthValue
        ) {

            healthValue.textContent =
                Math.ceil(
                    this.player.health
                );

        }


        if (
            healthFill
        ) {

            healthFill.style.width =
                `${this.player.health}%`;

        }


        if (
            armorValue
        ) {

            armorValue.textContent =
                Math.ceil(
                    this.player.armor
                );

        }


        if (
            ammoCurrent
        ) {

            ammoCurrent.textContent =
                this.weapon.ammo;

        }


        if (
            ammoReserve
        ) {

            ammoReserve.textContent =
                this.weapon.reserve;

        }


        if (
            scoreValue
        ) {

            scoreValue.textContent =
                String(
                    this.score
                ).padStart(
                    6,
                    "0"
                );

        }


        if (
            kills
        ) {

            kills.textContent =
                this.kills;

        }

    },


    /* =====================================================
       38. HIT MARKER
       ===================================================== */

    showHitMarker() {

        const marker =
            document.getElementById(
                "hit-marker"
            );


        if (
            !marker
        ) {

            return;

        }


        marker.classList.remove(
            "active"
        );


        void marker.offsetWidth;


        marker.classList.add(
            "active"
        );

    },


    /* =====================================================
       39. DAMAGE EFFECT
       ===================================================== */

    showDamageEffect() {

        let overlay =
            document.querySelector(
                ".damage-overlay"
            );


        if (
            !overlay
        ) {

            overlay =
                document.createElement(
                    "div"
                );


            overlay.className =
                "damage-overlay";


            document
                .getElementById(
                    "game"
                )
                ?.appendChild(
                    overlay
                );

        }


        overlay.classList.remove(
            "active"
        );


        void overlay.offsetWidth;


        overlay.classList.add(
            "active"
        );

    },


    /* =====================================================
       40. KILL FEED
       ===================================================== */

    showKillFeed(
        message
    ) {

        const feed =
            document.getElementById(
                "kill-feed"
            );


        if (
            !feed
        ) {

            return;

        }


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "kill-message";


        item.textContent =
            message;


        feed.appendChild(
            item
        );


        setTimeout(
            () => {

                item.remove();

            },
            3000
        );

    },


    /* =====================================================
       41. GAME OVER
       ===================================================== */

    gameOver() {

        this.running =
            false;


        document.exitPointerLock?.();


        const screen =
            document.getElementById(
                "game-over-screen"
            );


        const title =
            document.getElementById(
                "result-title"
            );


        const description =
            document.getElementById(
                "result-description"
            );


        const score =
            document.getElementById(
                "result-score"
            );


        if (
            title
        ) {

            title.textContent =
                "MISSION FAILED";

        }


        if (
            description
        ) {

            description.textContent =
                "ALL OPERATIVES LOST.";

        }


        if (
            score
        ) {

            score.textContent =
                String(
                    this.score
                ).padStart(
                    6,
                    "0"
                );

        }


        screen?.classList.remove(
            "hidden"
        );

    },


    /* =====================================================
       42. VICTORY
       ===================================================== */

    victory() {

        this.running =
            false;


        document.exitPointerLock?.();


        const screen =
            document.getElementById(
                "game-over-screen"
            );


        const title =
            document.getElementById(
                "result-title"
            );


        const description =
            document.getElementById(
                "result-description"
            );


        const score =
            document.getElementById(
                "result-score"
            );


        if (
            title
        ) {

            title.textContent =
                "MISSION COMPLETE";

        }


        if (
            description
        ) {

            description.textContent =
                "ALL HOSTILE TARGETS ELIMINATED.";

        }


        if (
            score
        ) {

            score.textContent =
                String(
                    this.score
                ).padStart(
                    6,
                    "0"
                );

        }


        screen?.classList.remove(
            "hidden"
        );

    }

};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        GameEngine.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.GameEngine =
    GameEngine;


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "%c BLACK OPS 3D ENGINE ",
    "background:#ff3030;color:#fff;font-weight:bold;padding:6px;"
);
```
