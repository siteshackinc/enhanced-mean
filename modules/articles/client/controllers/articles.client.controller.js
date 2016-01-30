(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'articleResolve', 'Authentication'];

  function ArticlesController($scope, $state, article, Authentication) {
    var vm = this;

    // added for ui.bootstrap.datetimepicker
    $scope.isOpen = false;

    $scope.dateOptions = {
      showWeeks: false,
      startingDay: 1
    };

    $scope.openCalendar = function(e) {
      e.preventDefault();
      e.stopPropagation();

      $scope.isOpen = true;
    };

    $scope.summeroptions = {
      minHeight: 220,
      focus: false,
      toolbar: [
        ['style', ['style', 'bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link','picture','video','hr']],
        ['view', ['fullscreen', 'codeview']]
      ]
    };

    vm.article = article;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
