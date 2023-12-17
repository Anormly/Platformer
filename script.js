//VARS

//HTML vars
let heroImg = window.document.querySelector('#hero-img');
let spritePosition = 0;
let imgBlock = window.document.querySelector('#img-block')
let imgBlockPosition = 0;
let canvas = window.document.querySelector('#canvas')
let fsBtn = window.document.querySelector('#fsBtn')
let info = window.document.querySelector("#info");
let backgroundCanvas = window.document.querySelector('#img-background');
let finalTimerText = window.document.querySelector('#final-timer-text');
let restartBtn = window.document.querySelector('#restartBtn');



//Movement Vars
let jump = false;
let hit = false;
let fall = false;
let heroX = Math.floor((Number.parseInt(imgBlock.style.left) + 32) / 32);
let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom) / 32);
let heroStep = 3;

//Arrays
let tileArray = [];
let objectsArray = [];
let enemiesArray = [];
let f1WallArray = [[-2, -1], [15, 32], [42, 53], [64, 74], [92, 105], [119, 129]];
let f2WallArray = [[54, 63]];

//Hero lives
let maxLives = 8;
let lives = 8;
let heartsArray = [];

//CollisionCheck
let isRightSideBlocked = false;
let isLeftSideBlocked = false;
let wasHeroHit = false;
let isWallRight = false;
let isWallLeft = false;

//Animation
let timer = null
let x = 0;
let dir = "right";



//FUNCTIONS

const moveWorldLeft = () => {
    objectsArray.map((element) => {
        element.style.left = `${Number.parseInt(element.style.left) - 32}px`;
    });
    tileArray.map(elem => {
        elem[0] = elem[0] - 1;
    });
    enemiesArray.map(elem => elem.moveLeft());
    f1WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    })
    f2WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    })
}

const moveWorldRight = () => {
    objectsArray.map((element) => {
        element.style.left = `${Number.parseInt(element.style.left) + 32}px`;
    });
    tileArray.map(elem => {
        elem[0] = elem[0] + 1;
    });
    enemiesArray.map(elem => elem.moveRight());
    f1WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    })
    f2WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    })
}

const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(imgBlock.style.left) + 32) / 32);
    heroY = Math.floor(Number.parseInt(imgBlock.style.bottom) / 32);
}

const checkFalling = () => {
    updateHeroXY();
    let isFalling = true;
    for (let i = 0; i < tileArray.length; i++) {
        if ((tileArray[i][0] == heroX) && (tileArray[i][1]) == heroY) {
            isFalling = false;
        }
    }
    if (isFalling) {
        fall = true;
    }
    else {
        fall = false;
    }
}

const checkRightWallCollide = () => {
    isWallRight = false;
    isWallLeft = false;
    if (heroY === 0) {
        f1WallArray.map(elem => {
            if (heroX == elem[0] - 2) {
                isWallRight = true;
            }
        })
    } else if (heroY === 4) {
        f2WallArray.map(elem => {
            if (heroX == elem[0] - 2) {
                isWallRight = true;
            }
        })
    }
}

const checkLeftWallCollide = () => {
    isWallRight = false;
    isWallLeft = false;
    if (heroY === 0) {
        f1WallArray.map(elem => {
            if (heroX == elem[1]) {
                isWallLeft = true;
            }
        })
    } else if (heroY === 4) {
        f2WallArray.map(elem => {
            if (heroX == elem[1]) {
                isWallLeft = true;
            }
        })
    }
}

const rightHandler = () => {
    if (!fall) {
        if (!isRightSideBlocked && !isWallRight) {
            heroImg.style.transform = "scale(1,1)";
            dir = "right";
            spritePosition = spritePosition + 1;
            imgBlockPosition = imgBlockPosition + 1;
            if (spritePosition > 7) {
                spritePosition = 0;
            }
            heroImg.style.left = `-${spritePosition * 64}px`;
            heroImg.style.top = '-64px';
            imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            checkFalling();
            wasHeroHit = false;
            moveWorldLeft();
            checkRightWallCollide();
        }
    } else {
        fallHandler();
    }
}

const leftHandler = () => {
    if (!fall) {
        if (!isLeftSideBlocked && !isWallLeft) {
            heroImg.style.transform = "scale(-1,1)";
            dir = "left";
            spritePosition = spritePosition - 1;
            imgBlockPosition = imgBlockPosition - 1;
            if (spritePosition < 7) {
                spritePosition = 13;
            }
            heroImg.style.left = `-${spritePosition * 64}px`;
            heroImg.style.top = '-64px';
            imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            checkFalling();
            wasHeroHit = false;
            moveWorldRight();
            checkLeftWallCollide();
        }
    }
    else {
        fallHandler();
    }
}

const idleHandler = () => {
    checkFalling();
    switch (dir) {
        case "right": {
            heroImg.style.transform = "scale(1,1)";
            if (spritePosition > 6) {
                spritePosition = 0;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = "scale(-1,1)";
            if (spritePosition > 12) {
                spritePosition = 6;
            }
            break;
        }
        default: break;
    }
    spritePosition = spritePosition + 1;
    heroImg.style.left = `-${spritePosition * 64}px`;
    heroImg.style.top = '0px';
}

const jumpHandler = () => {
    isWallRight = false;
    isWallLeft = false;
    switch (dir) {
        case "right": {
            heroImg.style.transform = "scale(1,1)";
            if (spritePosition > 2) {
                spritePosition = 0;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) + 160}px`;
                imgBlockPosition = imgBlockPosition + 15;
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            }
            moveWorldLeft();
            break;
        }
        case "left": {
            heroImg.style.transform = "scale(-1,1)";
            if (spritePosition > 11) {
                spritePosition = 9;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) + 160}px`;
                imgBlockPosition = imgBlockPosition - 15;
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            }
            moveWorldRight();
            break;
        }
        default: break;
    }
    spritePosition = spritePosition + 1;
    heroImg.style.left = `-${spritePosition * 64}px`;
    heroImg.style.top = '-256px';
}

const hitHandler = () => {
    switch (dir) {
        case "right": {
            heroImg.style.transform = "scale(1,1)";
            if (spritePosition > 2) {
                spritePosition = 0;
                hit = false;
                wasHeroHit = true;
            }
            spritePosition = spritePosition + 1;
            break;
        }
        case "left": {
            heroImg.style.transform = "scale(-1,1)";
            if (spritePosition < 11) {
                spritePosition = 13;
                hit = false;
                wasHeroHit = true;
            }
            spritePosition = spritePosition - 1;
            break;
        }
        default: break;
    }
    heroImg.style.left = `-${spritePosition * 64}px`;
    heroImg.style.top = '-128px';
}

const fallHandler = () => {
    heroImg.style.top = "-320px";
    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) - 16}px`;
    checkFalling();
}

const createTile = (x, y) => {
    let tile = window.document.createElement('img');
    tile.src = 'assets/1 Tiles/Tile_02.png';
    tile.style.position = 'absolute';
    tile.style.left = `${x * 32}px`;
    tile.style.bottom = `${y * 32}px`;
    canvas.appendChild(tile);
    objectsArray.push(tile);
    tileArray.push([x, y]);
}

const createBlackTile = (x, y) => {
    let tileBlack = window.document.createElement('img');
    tileBlack.src = 'assets/1 Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = `${x * 32}px`;
    tileBlack.style.bottom = `${y * 32}px`;
    canvas.appendChild(tileBlack);
    objectsArray.push(tileBlack);
}

const createTilesPlatform = (startX, endX, floor) => {
    for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
        createTile(x_pos, floor);
    }
}

const createBlackTilesBlock = (startX, endX, floor) => {
    for (let y_pos = 0; y_pos < floor; y_pos++) {
        for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
            createBlackTile(x_pos, y_pos);
        }
    }
}


const addHearts = () => {

    for (let i = 0; i < maxLives; i++) {
        let emptyHeart = new EmptyHeart(i);
        let fullHeart = new FullHeart(i);
        heartsArray.push(fullHeart);
    }
}

const updateHearts = () => {
    if (lives <= 0) {
        finalTimerText.innerText = 'Game Over';
        imgBlock.style.display = 'none';
    }
    for (let i = 0; i < lives; i++) {
        heartsArray[i].img.style.display = 'block';
    }
    for (let i = lives; i < maxLives; i++) {
        heartsArray[i].img.style.display = 'none';
    }

}

const createBackImg = (i) => {
    let img = window.document.createElement('img');
    img.src = "assets/2 Background/Day/Background.png";
    img.style.position = 'absolute';
    img.style.left = `${i * window.screen.width - 64}px`;
    img.style.bottom = '32px';
    img.style.width = `${window.screen.width}px`;
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}

const addBackGroundImages = () => {
    for (let i = 0; i < 3; i++) {
        createBackImg(i);
    }
}

const addEnemies = () => {
    let enemy1 = new Enemy1(9, 9, 'Найдена первая цифра пароля - "1"');
    let enemy2 = new Enemy6(19, 5);
    let enemy3 = new Enemy5(44, 5, 'Найдена вторая цифра пароля - "1"');
    let enemy4 = new Enemy2(65, 5);
    let enemy5 = new Enemy1(79, 1, 'Найдена третья цифра пароля - "4"');
    let enemy6 = new Enemy6(93, 5);
    let enemy7 = new Enemy2(100, 9, 'Найдена четвертая цифра пароля - "7"\n\nСкорее ищи рычаг, у тебя 15 секунд!', true);
}

const buildLevel = () => {
    let floor1 = 0;
    let floor2 = 4;
    let floor3 = 8;

    addDecorationElements(floor1 + 1, floor2 + 1, floor3 + 1);

    //1 FLOOR
    createTilesPlatform(-9, -1, 18);
    createTilesPlatform(0, 14, floor1);
    createTilesPlatform(33, 41, floor1);
    createTilesPlatform(76, 91, floor1);
    createTilesPlatform(106, 145, floor1);

    //2 FLOOR
    createTilesPlatform(15, 32, floor2);
    createTilesPlatform(42, 53, floor2);
    createTilesPlatform(64, 75, floor2);
    createTilesPlatform(92, 105, floor2);


    //3 FLOOR
    createTilesPlatform(8, 20, floor3);
    createTilesPlatform(54, 63, floor3);
    createTilesPlatform(75, 87, floor3);
    createTilesPlatform(99, 111, floor3);

    //WALLS
    createBlackTilesBlock(-9, -1, 18);
    createBlackTilesBlock(15, 32, floor2);
    createBlackTilesBlock(42, 53, floor2);
    createBlackTilesBlock(64, 75, floor2);
    createBlackTilesBlock(92, 105, floor2);

    createBlackTilesBlock(54, 63, floor3);

    addEnemies();
}

const createImgEl = (src, x, y) => {
    let img = window.document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = `${x * 32}px`;
    img.style.bottom = `${y * 32}px`;
    img.style.transform = 'scale(2,2) translate(-25%, -25%)';
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}

const addDecorationElements = (f1, f2, f3) => {
    let basePath = 'assets/3 Objects/';
    //Tree
    createImgEl(basePath + 'Other/Tree4.png', 4, f1);
    createImgEl(basePath + 'Other/Tree2.png', 35, f1);
    createImgEl(basePath + 'Other/Tree3.png', 78, f1);
    createImgEl(basePath + 'Other/Tree4.png', 108, f1);
    createImgEl(basePath + 'Other/Tree1.png', 65, f2);
    //Stone
    createImgEl(basePath + 'Stones/6.png', 10, f1);
    createImgEl(basePath + 'Stones/4.png', 111, f1);
    createImgEl(basePath + 'Stones/4.png', 38, f1);
    createImgEl(basePath + 'Stones/6.png', 102, f3);
    //Ramp
    createImgEl(basePath + 'Other/Ramp1.png', 22, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 26, f2);
    createImgEl(basePath + 'Other/Ramp1.png', 95, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 99, f2);
    createImgEl(basePath + 'Other/Ramp1.png', 45, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 49, f2);
    //Bushes
    createImgEl(basePath + 'Bushes/17.png', 84, f1);
    createImgEl(basePath + 'Bushes/17.png', 19, f3);
    createImgEl(basePath + 'Bushes/17.png', 50, f2);
    createImgEl(basePath + 'Bushes/17.png', 69, f2);
    createImgEl(basePath + 'Bushes/17.png', 100, f2);
    //Fountain
    createImgEl(basePath + 'Fountain/2.png', 116, f1);
    //Box
    createImgEl(basePath + 'Other/Box.png', 84, f1);
    createImgEl(basePath + 'Other/Box.png', 48, f2);
    createImgEl(basePath + 'Other/Box.png', 14, f3);
    createImgEl(basePath + 'Other/Box.png', 104, f3);
}
const idleAnimation = () => {
    timer = setInterval(() => {
        if (jump) {
            jumpHandler();
        }
        else if (hit) {
            hitHandler();
        }
        else if (fall) {
            fallHandler();
        }
        else {
            idleHandler();
        }
    }, 130)
}
const addStartScreen = () => {
    let div = window.document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = 0;
    div.style.bottom = 0;
    div.style.width = '100%';
    div.style.height = '100vh';
    div.style.backgroundColor = '#38002c';
    div.style.display = 'grid';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    canvas.appendChild(div);
    let btn = window.document.createElement('button');
    btn.innerText = 'PLAY';
    btn.style.fontFamily = "'Press Start 2P', cursive";
    btn.style.fontSize = '30pt';
    btn.style.backgroundColor = '#8babbf';
    btn.style.color = '#38002c';
    btn.style.padding = '20pt 30pt';
    btn.style.border = 'none';
    btn.onclick = () => {
        div.style.display = 'none';
        fsBtn.src = 'images/cancel.png'
        canvas.requestFullscreen();
        let cutscene = new Cutscene([
            'Так-так, приём!\n\nВражеская организация тебя поймала\n\nОни хотят протестировать на тебе их новую разработку',
            'Тебя подключили виртуальный мир\n\nПо сути, сейчас ты находишься в виртуальном плену\n\nИменно поэтому мы искали тебя так долго\n\nТак здесь заключено твоё сознание, организация не оставила не локации никаких предметов, будь то огнестрельное оружие или аптечки, поэтому уничтожать врагов тебе придётся в ближнем бою',
            'Сейчас я постараюсь тебе помочь\n\nОтсюда можно сбежать - дверь, ведущая к выходу, находится в конце этой локации за фонтаном\n\nНо открыть её будет непросто',
            'Сначала тебе нужно узнать пароль\n\nОн состояит из 4 цифр, каждая находится внутри охраняемых ящиков\n\nПотом тебе нужно найти рычаг, добежать до двери, ввести пароль и активировать рычаг',
            'Но тут есть небольшая проблема, организация спрятала рычаг на другой локации\n\nИ просто так ты его активировать не сможешь\n\nОднако решение есть',
            'Я могу взломать систему этого виртуального мира и достать рычаг\n\nНо он не будет не этой локации вечно\n\nпосле нахождения пароля у тебя будет 30 секунд, потом меня обнаружат\n\nНо запомни, тебе нужно найти 4 цифру последней (она почти в конце локации)\n\nДело в том, что я не буду знать, нашел ты остальные цифры или нет, я лишь узнаю что ты нашел последнюю, и перенесу на эту локацию рычаг',
            'Сейчас я проведу небольшой инструктаж и нужно будет приступать к делу\n\nЧтобы бежать в сторону, нажми A (влево) или D (вправо)\n\nЧтобы прыгнуть, нажми W, а чтобы ударить, нажми Space\n\nИ аккуратнее с танкоботами, они могут стрелять',
            'Удачи тебе\n\nНадеюсь, у тебя получится выбраться',
        ]);
    }
    div.appendChild(btn);
}

//EVENT LISTENERS


window.addEventListener('keydown', (event) => {
    if (!event.repeat) {
        clearInterval(timer);
        timer = setInterval(() => {
            if (event.code === 'KeyD') {
                dir = 'right';
                rightHandler();
            } else if (event.code === 'KeyA') {
                dir = 'left';
                leftHandler();
            }
        }, 130);
    }
});
window.addEventListener('keyup', (event) => {
    if (event.code === 'KeyW') jump = true;
    if (event.code === 'Space') hit = true;
    clearInterval(timer);
    idleAnimation();
});


fsBtn.onclick = () => {
    if (window.document.fullscreen) {
        fsBtn.src = 'images/fullscreen.png'
        window.document.exitFullscreen();
    }
    else {
        fsBtn.src = 'images/cancel.png'
        canvas.requestFullscreen();
    }
}
restartBtn.onclick = () => {
    window.document.location.reload();
}

//Classes

class Enemy {

    ATTACK = 'attack';
    DEATH = 'death';
    HURT = 'hurt';
    IDLE = 'idle';
    WALK = 'walk';


    state;
    animateWasChanged;

    startX;
    posX;
    posY;
    img;
    block;
    blocksize;
    spritePos;
    spriteMaxPos;
    timr;
    dir;
    stop;
    lives;
    isLast

    sourcePath
    constructor(x, y, src, message = '', isLast = false) {
        this.message = message;
        this.posX = x + this.getRandomOffset(6);
        this.startX = x;
        this.posY = y;
        this.blockSize = 48;
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.sourcePath = src;
        this.dir = 1;
        this.stop = false;
        this.lives = 30;
        this.isLast = isLast;

        this.state = this.IDLE;
        this.animateWasChanged = false;

        this.createImg();
        enemiesArray.push(this);
        this.lifeCycle();

    }

    createImg() {
        this.block = window.document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.left = `${this.posX * 32}px`;
        this.block.style.bottom = `${this.posY * 32}px`;
        this.block.style.width = `${this.blockSize}px`;
        this.block.style.height = `${this.blockSize}px`;
        this.block.style.overflow = 'hidden';

        this.img = window.document.createElement('img');
        this.img.src = 'Idle.png';
        this.img.style.position = 'absolute';
        this.img.style.left = `0px`;
        this.img.style.bottom = `0px`;
        this.img.style.width = `${this.blockSize * 4}px`;
        this.img.style.height = `${this.blockSize}px`;

        this.block.appendChild(this.img);
        canvas.appendChild(this.block);
    }
    checkHurt() {
        if (wasHeroHit) {
            if (this.lives <= 10) {
                wasHeroHit = false;
                this.changeAnimation(this.DEATH);
            }
            else {
                wasHeroHit = false;
                this.changeAnimation(this.HURT);
                this.showHurt();
                this.lives -= 10;
            }
        }
    }
    lifeCycle() {
        this.timr = setInterval(() => {
            if (this.animateWasChanged) {
                this.animateWasChanged = false;
                switch (this.state) {
                    case this.ATTACK: {
                        this.setAttack();
                        break;
                    }
                    case this.DEATH: {
                        this.setDeath();
                        break;
                    }
                    case this.HURT: {
                        this.setHurt();
                        break;
                    }
                    case this.IDLE: {
                        this.setIdle();
                        break;
                    }
                    case this.WALK: {
                        this.setWalk();
                        break;
                    }
                    default: break;
                }
            }
            this.spritePos++;
            this.checkCollide();
            if (!this.stop) {
                this.move();
            } else {
                if (this.state != this.DEATH) {
                    if (this.state != this.HURT) {
                        this.changeAnimation(this.ATTACK);
                    }
                }
            }
            this.animate();
        }, 150);
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
            if (this.state === this.ATTACK) {
                lives--;
                updateHearts();
            }
            if (this.state === this.HURT) {
                this.changeAnimation(this.ATTACK);
                if (this.dir > 0) this.spritePos = 1;
            }
            if (this.state === this.DEATH) {
                clearInterval(this.timr);
                isLeftSideBlocked = false;
                isRightSideBlocked = false;
                if (this.dir > 0) this.spritePos = 5;
                if (this.message) {
                    new Cutscene([this.message]);
                    if (this.isLast) {
                        new Lever();
                    }
                }
            }
        }
        this.img.style.left = `-${this.spritePos * this.blockSize}px`;
    }

    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.img.style.width = `${6 * 48}px`;
        this.spriteMaxPos = 5;
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.img.style.width = `${6 * 48}px`;
        this.spriteMaxPos = 5;
    }
    setHurt() {
        this.img.src = this.sourcePath + 'Hurt.png';
        this.img.style.width = `${2 * 48}px`;
        this.spriteMaxPos = 1;
    }
    setIdle() {
        this.img.src = this.sourcePath + 'Idle.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 3;
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.img.style.width = `${6 * 48}px`;
        this.spriteMaxPos = 5;
    }
    changeAnimation(stateStr) {
        this.state = stateStr;
        this.animateWasChanged = true;
    }
    move() {
        this.changeAnimation(this.WALK);
        if (this.posX > (this.startX + 5)) {
            this.dir *= -1;
            this.img.style.transform = "scale(-1,1)";
        }
        else if (this.posX <= this.startX) {
            this.dir = Math.abs(this.dir);
            this.img.style.transform = "scale(1,1)";
        }
        this.posX += this.dir / 8;
        this.block.style.left = `${this.posX * 32}px`
    }
    checkCollide() {
        if (heroY == this.posY - 1) {
            if (heroX == this.posX - 0.5) {
                this.checkHurt();
                this.stop = true;
                isRightSideBlocked = true;
            } else if (heroX == (this.posX + 1)) {
                this.checkHurt();
                this.stop = true;
                isLeftSideBlocked = true;
            } else {
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                this.stop = false;
            }
        }
        else {
            isRightSideBlocked = false;
            isLeftSideBlocked = false;
            this.stop = false;
        }
    }
    showHurt() {
        let pos = 0;
        let text = window.document.createElement('p');
        text.innerText = '-10';
        text.style.position = 'absolute';
        text.style.left = `${(this.dir < 0) ? Number.parseInt(this.block.style.left) + 50 : Number.parseInt(this.block.style.left) + 10}px`;
        text.style.bottom = `${Number.parseInt(this.block.style.bottom) + 32}px`;
        text.style.fontFamily = "'Bungee Spice', sans-serif";
        let hurtTimer = setInterval(() => {
            text.style.bottom = `${Number.parseInt(text.style.bottom) + 10}px`;
            if (pos > 2) {
                clearInterval(hurtTimer);
                text.style.display = 'none';
            }
            pos++;
        }, 50);
        canvas.appendChild(text);
    }

    moveRight() {
        this.startX = this.startX + 1;
        this.posX = this.posX + 1;
        if (this.stop || this.state === this.DEATH) {
            this.block.style.left = `${Number.parseInt(this.block.style.left) + 32}px`;
        }
    };
    moveLeft() {
        this.startX = this.startX - 1;
        this.posX = this.posX - 1;
        if (this.stop || this.state === this.DEATH) {
            this.block.style.left = `${Number.parseInt(this.block.style.left) - 32}px`;
        }
    };

    getRandomOffset(max) {
        let rand = Math.floor(Math.random() * max);
        return rand;
    }
}

class Enemy1 extends Enemy {
    constructor(x, y, mess) {
        super(x, y, 'enemies/1/', mess);
    }
}

class Enemy2 extends Enemy {
    constructor(x, y, mess, isLast) {
        super(x, y, 'enemies/2/', mess, isLast);
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.img.style.width = `${9 * 48}px`;
        this.spriteMaxPos = 8;
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.img.style.width = `${6 * 48}px`;
        this.spriteMaxPos = 5;
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.img.style.width = `${6 * 48}px`;
        this.spriteMaxPos = 4;
    }
}

class Enemy5 extends Enemy {
    constructor(x, y, mess) {
        super(x, y, 'enemies/5/', mess);
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 3;
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 2;
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 3;
    }
}

class Enemy6 extends Enemy {
    bullet;
    isShoot;
    bulletX;
    constructor(x, y, mess) {
        super(x, y, 'enemies/6/', mess);
        this.bullet = window.document.createElement('img');
        this.bullet.src = this.sourcePath + 'Ball1.png';
        this.bullet.style.position = 'absolute';
        this.bullet.style.left = `${this.block.style.left}px`;
        this.bullet.style.display = 'none';
        this.bullet.style.bottom = `${Number.parseInt(this.block.style.bottom) + 16}px`;
        canvas.appendChild(this.bullet);
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 3;
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 2;
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.img.style.width = `${4 * 48}px`;
        this.spriteMaxPos = 3;
    }
    checkCollide() {
        if (heroY + 1 == this.posY) {
            this.stop = true;
            if (heroX > this.posX) {
                this.dir = 1;
                this.img.style.transform = 'scale(1,1)';
            } else {
                this.img.style.transfrom = 'scale(-1,1)';
                this.dir = -1;

            }
            if (heroX == this.posX) {
                this.checkHurt();
                isRightSideBlocked = true;
            } else if (heroX == (this.posX + 3)) {
                this.checkHurt();
                isLeftSideBlocked = true;
            } else {
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                this.changeAnimation(this.WALK);
            }
        }
        else {
            isRightSideBlocked = false;
            isLeftSideBlocked = false;
            this.stop = false;
            this.changeAnimation(this.WALK);
        }
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
            if (this.state === this.ATTACK) {
                if (!this.isShoot) this.shoot();
            }
            if (this.state === this.HURT) {
                this.changeAnimation(this.ATTACK);
                if (this.dir > 0) this.spritePos = 1;
            }
            if (this.state === this.DEATH) {
                clearInterval(this.timr);
                isLeftSideBlocked = false;
                isRightSideBlocked = false;
                if (this.dir > 0) this.spritePos = 5;
            }
        }
        if (this.isShoot && this.state === this.ATTACK) {
            this.bulletFunc();
        }
        else {
            this.bullet.style.display = 'none';
        }
        this.img.style.left = `-${this.spritePos * this.blockSize}px`;
    }
    shoot() {
        this.isShoot = true;
        this.bullet.style.display = 'block';
        (this.dir > 0) ? this.bulletX = this.posX + 1 : this.bulletX = this.posX;
    }
    bulletFunc() {
        (this.dir > 0) ? this.bulletX += 1 : this.bulletX -= 1;
        this.bullet.style.left = `${this.bulletX * 32}px`;
        if (Math.floor(this.bulletX) === heroX && this.posY === heroY + 1) {
            this.isShoot = false;
            this.bullet.style.display = 'none';
            lives -= 0.5;
            updateHearts();
        }
        if (this.dir > 0) {
            if (this.bulletX > (this.posX + 6)) {
                this.isShoot = false;
                this.bullet.style.display = 'none';
            }
        } else {
            if (this.bulletX < (this.posX - 5)) {
                this.isShoot = false;
                this.bullet.style.display = 'none';
            }
        }
    }
}

class Heart {
    img;
    x;
    constructor(x, src) {
        this.x = x;
        this.img = window.document.createElement('img');
        this.img.src = src;
        this.img.style.position = 'absolute';
        this.img.style.left = `${this.x * 32}px`;
        this.img.style.bottom = ((window.screen.height / 32) - 2) * 32;
        this.img.style.width = '32px';
        this.img.style.height = '32px';

        canvas.appendChild(this.img);
    }
}

class EmptyHeart extends Heart {
    constructor(x) {
        super(x, 'assets/hearts/empty_heart.png');
    }
}

class FullHeart extends Heart {
    constructor(x) {
        super(x, 'assets/hearts/full_heart.png');
    }
}

class Lever {
    leverImg;
    x;
    y;
    updateTimer;
    finalTimer;
    time;
    dir;
    opacity;
    fountainImg;
    constructor() {
        this.x = heroX - 20;
        this.y = heroY + 1;
        this.fountainImg = objectsArray.filter(elem => elem.outerHTML.split('"')[1] === 'assets/3 Objects/Fountain/2.png')[0];
        this.leverImg = window.document.createElement('img');
        this.leverImg.src = 'images/lever.png';
        this.leverImg.style.position = 'absolute';
        this.leverImg.style.left = `${this.x * 32}px`;
        this.leverImg.style.bottom = `${this.y * 32}px`;
        this.leverImg.style.width = '32px';
        this.leverImg.style.height = '32px';
        canvas.appendChild(this.leverImg);
        enemiesArray.push(this);

        this.time = 30;
        this.dir = true;
        this.opacity = 1;
        this.updateTimer = setInterval(() => {
            if (heroX === this.x + 1 && (heroY + 1) === this.y) {
                this.leverImg.style.display = 'none';
                clearInterval(this.updateTimer);
                new Cutscene(['Скорее беги к фонтану!']);
            }
            this.animate();
        }, 80);
        this.finalTimer = setInterval(() => {
            if (this.time <= 0) {
                finalTimerText.innerText = 'Game Over';
                clearInterval(this.finalTimer);
            }
            else {
                finalTimerText.innerText = `${this.time}`;
                this.time--;
                if (heroX === Number.parseInt(this.fountainImg.style.left) / 32) {
                    new Terminal();
                    clearInterval(this.finalTimer);
                };
            }
        }, 1000)
    }
    moveLeft() {
        this.leverImg.style.left = `${Number.parseInt(this.leverImg.style.left) - 32}px`;
        this.x -= 1;
    }
    moveRight() {
        this.leverImg.style.left = `${Number.parseInt(this.leverImg.style.left) + 32}px`;
        this.x += 1;
    }
    animate() {
        (this.dir) ? this.opacity += 0.5 : this.opacity -= 0.5;
        this.leverImg.style.opacity = `${1 / this.opacity}`;
        if (this.opacity <= 0 || this.opacity >= 5) this.dir = !this.dir;
    }

}

class Cutscene {
    text;
    block;
    p;
    nextButton;
    skipButton;
    page;
    timer;
    constructor(text) {
        this.page = 0;
        this.text = text;
        this.block = window.document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.bottom = '10vh';
        this.block.style.left = '10%';
        this.block.style.width = '80%';
        this.block.style.height = '80vh';
        this.block.style.backgroundColor = '#38002c';
        this.block.style.border = '5px solid #8babbf';
        this.appendP();
        this.appendNextButton();
        this.appendSkipButton();
        this.setText(this.text[this.page]);
        canvas.appendChild(this.block);
    }
    appendP() {
        this.p = window.document.createElement('p');
        this.p.style.position = 'absolute';
        this.p.style.left = '10%';
        this.p.style.top = '4vh';
        this.p.style.width = '80%';
        this.p.style.color = '#8babbf';
        this.p.style.fontSize = '8pt';
        this.p.style.lineHeight = '1.5';
        this.p.style.fontFamily = "'Press Start 2P', cursive";
        this.p.onclick = () => {
            this.nextButton.style.display = 'block';
            clearInterval(this.timer);
            this.p.innerText = this.text[this.page];
        }
        this.block.appendChild(this.p);
    }
    appendNextButton() {
        this.nextButton = window.document.createElement('button');
        this.setButtonStyle(this.nextButton, 'Next');
        this.nextButton.style.right = '0px';
        this.nextButton.style.display = 'none';
        this.nextButton.onclick = () => {
            if (this.page < this.text.length - 1) {
                this.page++;
                this.setText(this.text[this.page]);
                this.nextButton.style.display = 'none';
            }
            else {
                this.block.style.display = 'none';
            }
        }
        this.block.appendChild(this.nextButton);
    }
    appendSkipButton() {
        this.skipButton = window.document.createElement('button');
        this.setButtonStyle(this.skipButton, 'Skip');
        this.skipButton.style.left = '0px';
        this.skipButton.onclick = () => {
            this.block.style.display = 'none';
        }
        this.block.appendChild(this.skipButton);
    }
    setButtonStyle(button, title) {
        button.style.position = 'absolute';
        button.style.bottom = '0px';
        button.style.background = '#8babbf';
        button.style.color = '#38002c';
        button.innerText = title;
        button.style.fontSize = '20pt';
        button.style.margin = '10pt';
        button.style.padding = '10pt';
        button.style.border = 'none';
        button.style.fontFamily = "'Press Start 2P', cursive";
    }
    setText(text) {
        if (this.page === this.text.length - 1) this.nextButton.innerText = 'Go';
        let innerText = '';
        let targetText = text;
        let pos = 0;
        this.timer = setInterval(() => {
            if (pos <= targetText.length - 1) {
                innerText += targetText[pos];
                this.p.innerText = innerText;
                pos++;
            }
            else {
                clearInterval(this.timer);
                this.nextButton.style.display = 'block';
            }
        }, 20);
    }
}

class Terminal extends Cutscene {
    btnBlock;
    mainStrLength;
    password;

    constructor() {
        let text = 'Скорее вводи пароль:';
        super([text]);
        this.password = '1147';
        this.mainStrLength = text.length;
        this.btnBlock = window.document.createElement('div');
        this.btnBlock.style.position = 'absolute';
        this.btnBlock.style.left = '33%';
        this.btnBlock.style.bottom = '10vh';
        this.btnBlock.style.width = '33%';
        this.block.appendChild(this.btnBlock);
        this.skipButton.innerText = 'Clear';
        this.nextButton.innerText = 'Enter';
        this.createNumButtons();
        this.skipButton.onclick = () => {
            if (this.p.innerText.length > this.mainStrLength) {
                let str = '';
                for (let i = 0; i < this.p.innerText.length - 1; i++) {
                    str += this.p.innerText[i];
                }
                this.p.innerText = str;
            }
        }
        this.nextButton.onclick = () => {
            if (this.p.innerText.length === this.mainStrLength + 4) {
                let str = '';
                for (let i = this.p.innerText.length - 4; i < this.p.innerText.length; i++) {
                    str += this.p.innerText[i];
                }

                if (str === this.password) {
                    this.block.style.display = 'none';
                    finalTimerText.innerText = 'You Win!';
                    imgBlock.style.display = 'none';
                }
                else {
                    this.p.innerText = 'Пароль неверный, попробуй еще раз :';
                    this.mainStrLength = this.p.innerText.length;
                }
            }

        }
    }
    createNumButtons() {
        for (let i = 1; i <= 9; i++) {
            let btn = window.document.createElement('button');
            this.setButtonStyle(btn, `${i}`);
            btn.style.left =
                (i <= 3)
                    ? `${(i - 1) * 33}%`
                    : (i <= 6)
                        ? `${(i - 4) * 33}%`
                        : `${(i - 7) * 33}%`;
            btn.style.bottom =
                (i <= 3)
                    ? '36vh'
                    : (i <= 6)
                        ? '18vh'
                        : '0px';
            btn.onclick = (event) => {
                if (this.p.innerText.length < this.mainStrLength + 4) {
                    this.p.innerText += event.target.innerText;

                }
            }
            this.btnBlock.appendChild(btn);
        }
    }
}



const start = () => {
    addBackGroundImages();
    idleAnimation();
    buildLevel();
    addHearts();
    updateHearts();
    addStartScreen();
}


start();