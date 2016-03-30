(function () {
  var ns = $.namespace('pskl.controller.settings.exportimage');

  var URL_MAX_LENGTH = 60;

  ns.PngExportController = function (piskelController) {
    this.piskelController = piskelController;
  };

  pskl.utils.inherit(ns.PngExportController, pskl.controller.settings.AbstractSettingController);

  ns.PngExportController.prototype.init = function () {
    this.pngFilePrefixInput = document.querySelector('.zip-prefix-name');
    this.pngFilePrefixInput.value = 'sprite_';

    this.splitByLayersCheckbox =  document.querySelector('.zip-split-layers-checkbox');

    var downloadButton = document.querySelector('.png-download-button');
    this.addEventListener(downloadButton, 'click', this.onPngDownloadButtonClick_);

    var zipButton = document.querySelector('.zip-generate-button');
    this.addEventListener(zipButton, 'click', this.onZipButtonClick_);
  };

  ns.PngExportController.prototype.onPngDownloadButtonClick_ = function (evt) {
    var fileName = this.getPiskelName_() + '.png';

    var outputCanvas = this.getFramesheetAsCanvas();

    var scalingFactor = pskl.UserSettings.get(pskl.UserSettings.EXPORT_SCALING);
    if (scalingFactor > 1) {
      var width = outputCanvas.width * scalingFactor;
      var height = outputCanvas.height * scalingFactor;
      outputCanvas = pskl.utils.ImageResizer.resize(outputCanvas, width, height, false);
    }

    pskl.utils.BlobUtils.canvasToBlob(outputCanvas, function(blob) {
      pskl.utils.FileUtils.downloadAsFile(blob, fileName);
    });
  };

  ns.PngExportController.prototype.onZipButtonClick_ = function () {
    var zip = new window.JSZip();

    if (this.splitByLayersCheckbox.checked) {
      this.splittedExport_(zip);
    } else {
      this.mergedExport_(zip);
    }

    var fileName = this.getPiskelName_() + '.zip';

    var blob = zip.generate({
      type : 'blob'
    });

    pskl.utils.FileUtils.downloadAsFile(blob, fileName);
  };

  ns.PngExportController.prototype.getPaddedZeros_ = function(maxDigitLength, currentNum) {
    var digitLength = parseInt(0);
    var tempCount = parseInt(currentNum);
    while (parseInt(tempCount) > 0) {
      tempCount = parseInt(tempCount / 10);
      digitLength++;
    }
    var numZeros = maxDigitLength - digitLength;
    var zeroPadding = '';
    while (numZeros > 0) {
      zeroPadding += '0';
      numZeros--;
    }
    return(zeroPadding);
  };

  ns.PngExportController.prototype.mergedExport_ = function (zip) {
    var tempFrameCount = parseInt(this.piskelController.getFrameCount());
    var maxDigitLength = 0;
    while (parseInt(tempFrameCount) > 0) {
      tempFrameCount = parseInt(tempFrameCount / 10);
      maxDigitLength++;
    }
    for (var i = 0; i < this.piskelController.getFrameCount(); i++) {
      var frame = this.piskelController.getFrameAt(i);
      var canvas = this.getFrameAsCanvas_(frame);
      var basename = this.pngFilePrefixInput.value;
      var zeroPadding = this.getPaddedZeros_(maxDigitLength, (i+1));
      var filename = basename + zeroPadding + (i + 1) + '.png';
      zip.file(filename, pskl.utils.CanvasUtils.getBase64FromCanvas(canvas) + '\n', {base64: true});
    }
  };

  ns.PngExportController.prototype.splittedExport_ = function (zip) {
    var tempFrameCount = parseInt(this.piskelController.getFrameCount());
    var maxDigitLength = 0;
    while (parseInt(tempFrameCount) > 0) {
      tempFrameCount = parseInt(tempFrameCount / 10);
      maxDigitLength++;
    }
    var layers = this.piskelController.getLayers();
    var layersCount = 0;
    for (layersCount = 0; this.piskelController.hasLayerAt(layersCount); layersCount++) {}
    var maxLayerDigitLength = 0;
    while (parseInt(layersCount) > 0) {
      layersCount = parseInt(layersCount / 10);
      maxLayerDigitLength++;
    }
    for (var j = 0; this.piskelController.hasLayerAt(j); j++) {
      var layer = this.piskelController.getLayerAt(j);
      for (var i = 0; i < this.piskelController.getFrameCount(); i++) {
        var frame = layer.getFrameAt(i);
        var canvas = this.getFrameAsCanvas_(frame);
        var basename = this.pngFilePrefixInput.value;
        var zeroPaddingFrame = this.getPaddedZeros_(maxDigitLength, (i+1));
        var zeroPaddingLayer = this.getPaddedZeros_(maxLayerDigitLength, (j+1));
        var filename = 'l' + zeroPaddingLayer + (j + 1) + '_' + basename + zeroPaddingFrame + (i + 1) + '.png';
        zip.file(filename, pskl.utils.CanvasUtils.getBase64FromCanvas(canvas) + '\n', {base64: true});
      }
    }
  };

  ns.PngExportController.prototype.getFrameAsCanvas_ = function (frame) {
    var canvasRenderer = new pskl.rendering.CanvasRenderer(frame, 1);
    canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
    return canvasRenderer.render();
  };

  ns.PngExportController.prototype.getPiskelName_ = function () {
    return this.piskelController.getPiskel().getDescriptor().name;
  };

  ns.PngExportController.prototype.getFramesheetAsCanvas = function () {
    var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
    return renderer.renderAsCanvas();
  };

  ns.PngExportController.prototype.updateStatus_ = function (imageUrl, error) {
    if (imageUrl) {
      var linkTpl = '<a class="image-link" href="{{link}}" target="_blank">{{shortLink}}</a>';
      var linkHtml = pskl.utils.Template.replace(linkTpl, {
        link : imageUrl,
        shortLink : this.shorten_(imageUrl, URL_MAX_LENGTH, '...')
      });
      this.uploadStatusContainerEl.innerHTML = 'Your image is now available at: ' + linkHtml;
    } else {
      this.uploadStatusContainerEl.innerHTML = 'Your image could not be uploaded to an HTTP address';
    }
  };

  ns.PngExportController.prototype.shorten_ = function (url, maxLength, suffix) {
    if (url.length > maxLength) {
      url = url.substring(0, maxLength);
      url += suffix;
    }
    return url;
  };
})();
