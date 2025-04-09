export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function toDataURL(src, outputFormat = "image/png") {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      let dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL); // ✅ Return the Base64 string
    };
    img.onerror = (error) => reject(error);
    img.src = src;
  });
}
