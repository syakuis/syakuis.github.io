var app = angular.module('app', [
'ngRoute',
'ngCookies',
'ngResource',
'ngSanitize',

'ui.bootstrap',
'toastr',
'dialogs.main',
'pascalprecht.translate',
'dialogs.default-translations',
'ngClipboard',

'GeneratorControllers'
]);

app.config(['$routeProvider', '$locationProvider', 'toastrConfig', 'dialogsProvider', '$translateProvider', 'ngClipProvider',
	function($routeProvider, $locationProvider , toastrConfig, dialogsProvider, $translateProvider, ngClipProvider) {
		 ngClipProvider.setPath("./bower_components/zeroclipboard/dist/ZeroClipboard.swf");

		// toastr config
		angular.extend(toastrConfig, {
			allowHtml: true,
			closeButton: true,
			closeHtml: '<button>&times;</button>',
			containerId: 'toast-container',
			extendedTimeOut: 1000,
			iconClasses: {
				error: 'toast-error',
				info: 'toast-info',
				success: 'toast-success',
				warning: 'toast-warning'
			},
			messageClass: 'toast-message',
			positionClass: 'toast-top-right',
			tapToDismiss: true,
			timeOut: 3000,
			titleClass: 'toast-title',
			toastClass: 'toast'
		});

		// dialogs config
		dialogsProvider.useBackdrop('static');
		//dialogsProvider.useEscClose(false);
		//dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');
		//dialogsProvider.useClass('modal-backdrop');

		$translateProvider.translations('ko-KR', {
			DIALOGS_ERROR : "오류 ",
			DIALOGS_ERROR_MSG : " 알 수 없는 오류가 발생했습니다. ",
			DIALOGS_CLOSE : "닫기",
			DIALOGS_PLEASE_WAIT : " 잠시 기다려주십시오 ",
			DIALOGS_PLEASE_WAIT_ELIPS : " 기다려주십시오 ... ",
			DIALOGS_PLEASE_WAIT_MSG : " 작업이 완료되기를 기다리세요.",
			DIALOGS_PERCENT_COMPLETE : "% 완료",
			DIALOGS_NOTIFICATION : " 알림 ",
			DIALOGS_NOTIFICATION_MSG : "알 수 없는 응용 프로그램입니다. ",
			DIALOGS_CONFIRMATION : " 확인 ",
			DIALOGS_CONFIRMATION_MSG : " 확인을 눌러주세요. ",
			DIALOGS_OK : "확인",
			DIALOGS_YES : "예",
			DIALOGS_NO : "아니오"
		});

		$translateProvider.preferredLanguage('ko-KR');


		// route
		$routeProvider.
			when('/', {
				templateUrl : './partials/generator/generator.html',
				controller : 'Generator'
			}).

			otherwise({
				redirectTo : '/'
			});

		/*$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});*/
	}
]);


app.run(['$rootScope',
	function($rootScope) {
	}
]);




