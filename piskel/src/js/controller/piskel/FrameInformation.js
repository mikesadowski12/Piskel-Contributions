(function () {
  var ns = $.namespace('pskl.controller.piskel');
  var frameWidth;
  var frameHeight;

  ns.FrameInformation = function () {};
  
  ns.FrameInformation.prototype.init  = function () {
    this.frameWidth = 0;
    this.frameHeight = 0;
  };

  ns.FrameInformation.prototype.setFrameHeight = function (height) {
    this.frameHeight = height;
  };

  ns.FrameInformation.prototype.setFrameWidth = function (width) {
    this.frameWidth = width;
  };

  ns.FrameInformation.prototype.getFrameHeight = function () {
    return this.frameHeight;
  };

  ns.FrameInformation.prototype.getFrameWidth = function () {
    return this.frameWidth;
  };
})();
