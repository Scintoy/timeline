all: js css

js:
	cat source/js/jquery-min.js > compiled/js/timeline.js
	cat source/js/jquery.event.drag-2.2.js >> compiled/js/timeline.js
	cat source/js/underscore-min.js >> compiled/js/timeline.js
	cat source/js/timeline.js >> compiled/js/timeline.js

css:
	lessc source/less/timeline.less > compiled/css/timeline.css
