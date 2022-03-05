var app, graphics, container;
var mousedown = false, bubbles = [];
var displacementSprite, displacementFilter;
function init() {
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000,
        resizeTo: window,
        antialias: true
    });
    container = new PIXI.Container();
    graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
    app.stage.addChild(container);

    document.body.appendChild(app.view);
    for (var i = 0; i < 300; i++) {
        var bubble = new Bubble({
            x: Math.random() * app.screen.width,
            y: Math.random() * app.screen.height
        });
        container.addChild(bubble.sprite);
        bubbles.push(bubble);
    }
    displacement();
    addEvents();
}

function addEvents() {
    document.addEventListener("mousedown", function(e) {
        mousedown = true;
    });
    document.addEventListener("mouseup", function(e) {
        mousedown = false;
    });
    document.addEventListener("mousemove", function(e) {
        if (!mousedown) return false;
        var bubble = new Bubble({
            x: e.clientX,
            y: e.clientY
        });
        container.addChild(bubble.sprite);
        bubbles.push(bubble);
    }, false);
}

function displacement() {
    displacementSprite = PIXI.Sprite.from('https://res.cloudinary.com/dvxikybyi/image/upload/v1486634113/2yYayZk_vqsyzx.png');
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.padding = 0;

    displacementSprite.position = container.position;

    app.stage.addChild(displacementSprite);

    container.filters = [displacementFilter];

    displacementFilter.scale.x = 50;
    displacementFilter.scale.y = 50;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function removeBubble(_bubble) {
    var index = bubbles.indexOf(_bubble);
    bubbles.splice(index, 1);
    container.removeChildren(index, index+1);
}

function render() {
    for (var i = 0; i < bubbles.length; i++) {
        var bubble = bubbles[i];
        if (bubble.isDead()) removeBubble(bubble);
        else bubble.draw(graphics);
    }
    displacementSprite.x++;
    if (displacementSprite.x > displacementSprite.width) {
        displacementSprite.x = 0;
    }
}

var Bubble = function(args) {
    if (args === undefined) args = {};
    this.sprite = PIXI.Sprite.from('https://res.cloudinary.com/losrodriguez/image/upload/v1566328006/black_bubble_g9jolh.png');
    this.position = new Vector(args.x, args.y);
    this.init = function() {
        this.velocity = new Vector(Math.random() * 0.1 - 0.05, -0.01);
        this.acceleration = new Vector(Math.random() * 0.01 - 0.05, -0.01);
        this.pressure = new Vector(Math.random() * 0.1 - 0.05, -0.1);
        this.waterResistance = new Vector(Math.random() * 0.1 - 0.05, -0.1);
        this.scale = Math.random() * 0.5;
        this.mass = Math.random() * 0.1;
    		this.sprite.rotation = Math.random() * Math.PI;
        this.draw();
    }
    this.draw = function(_graphics) {
        this.update();
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.scale.set(this.scale);
    }
    this.applyForce = function(_force) {
        var f = _force.mult(this.mass);
        this.acceleration.addTo(f);
    }
    this.update = function() {
        this.applyForce(this.pressure);
        this.applyForce(this.waterResistance);
        this.velocity.addTo(this.acceleration);
        this.position.addTo(this.velocity);
        this.acceleration.mult(0);
        this.scale -= 0.005;
    }
    this.isDead = function()  {
        return (this.scale < 0.0);
    }
    this.init();
    return this;
}

init();
animate();