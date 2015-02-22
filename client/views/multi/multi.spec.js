'use strict';

describe('Controller: MultiCtrl', function () {

  beforeEach(module('qodex'));

  var MultiCtrl;

  beforeEach(inject(function ($controller) {
    MultiCtrl = $controller('MultiCtrl', {});
  }));

  it('should ...', function () {
    expect(1).toBe(1);
  });

});
