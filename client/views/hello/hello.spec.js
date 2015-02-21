'use strict';

describe('Controller: HelloCtrl', function () {

  beforeEach(module('qodex'));

  var HelloCtrl;

  beforeEach(inject(function ($controller) {
    HelloCtrl = $controller('HelloCtrl', {});
  }));

  it('should ...', function () {
    expect(1).toBe(1);
  });

});
