const availableResources = {
  wood: {
    name: "wood",
    imageSrc: "./assets/wood.png",
  },
  stone: {
    name: "stone",
    imageSrc: "./assets/rock.png",
  },
};
export class Resources {
  constructor(game, ctx, posX, posY) {
    this.game = game;
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.resourceObj = {};
    this.container = document.querySelector(".RESOURCES-UI");

    for (let resourceKey in availableResources) {
      const resource = availableResources[resourceKey];
      this.resourceObj[resource.name] = {
        quantity: 0,
        image: new Image(),
      };
      this.resourceObj[resource.name].image.src = resource.imageSrc;
    }
    for (let resourceKey in this.resourceObj) {
      const resource = this.resourceObj[resourceKey];
      let container = document.createElement("div");
      container.classList.add("resource-container");
      let image = document.createElement("img");
      image.src = resource.image.src;
      image.classList.add("resource-image");
      let quantity = document.createElement("span");
      quantity.classList.add("resource-quantity");
      quantity.innerText = resource.quantity;
      container.appendChild(image);
      container.appendChild(quantity);
      this.container.appendChild(container);
    }
  }

  draw() {
    let container = this.container.querySelectorAll(".resource-container");
    let k = 0;
    //make an iteration for cahnging the inner text of span elements
    for (let resourceKey in this.resourceObj) {
      const resource = this.resourceObj[resourceKey];
      container[k].querySelector(".resource-quantity").innerText =
        resource.quantity;
      container[k].querySelector(".resource-quantity").width =
        this.resourceObj[resourceKey].image.width;
      container[k].querySelector(".resource-quantity").height =
        this.resourceObj[resourceKey].image.height;
      k++;
    }
  }
}
