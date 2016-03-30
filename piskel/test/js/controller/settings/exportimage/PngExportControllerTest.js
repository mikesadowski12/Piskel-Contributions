describe("PngExportController", function() {
  it("padded zeros works correctly", function() {
    var zeroPadding1 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(3, 100);
    var zeroPadding2 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(3, 54);
    var zeroPadding3 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(3, 1);
    var zeroPadding4 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(6, 1234);
    var zeroPadding5 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(1, 9);
    var zeroPadding6 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(2, 1);
    var zeroPadding7 = pskl.controller.settings.exportimage.PngExportController.prototype.getPaddedZeros_(2, 12);

    expect(zeroPadding1).toBe('');
    expect(zeroPadding2).toBe('0');
    expect(zeroPadding3).toBe('00');
    expect(zeroPadding4).toBe('00');
    expect(zeroPadding5).toBe('');
    expect(zeroPadding6).toBe('0');
    expect(zeroPadding7).toBe('');
  });
});
