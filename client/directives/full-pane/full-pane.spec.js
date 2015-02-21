'use strict';

describe('Directive: full-pane', function () {

  beforeEach(module('qodex', 'templates'));

  var element, scope;

  beforeEach(inject(function($compile, $rootScope){
    scope = $rootScope.$new();
    element = angular.element('<full-pane></full-pane>');
    element = $compile(element)(scope);
    scope.$apply();
  }));

  it('should ...', function () {
    expect(1).toBe(1);
  });
});
