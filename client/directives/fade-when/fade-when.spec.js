'use strict';

describe('Directive: fade-when', function () {

  beforeEach(module('qodex', 'templates'));

  var element, scope;

  beforeEach(inject(function($compile, $rootScope){
    scope = $rootScope.$new();
    element = angular.element('<fade-when></fade-when>');
    element = $compile(element)(scope);
    scope.$apply();
  }));

  it('should ...', function () {
    expect(1).toBe(1);
  });
});
