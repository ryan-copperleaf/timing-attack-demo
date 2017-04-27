(function () {
	'use strict';

	function id(x) {
		return x;
	}

	function eq(a, b) {
		return a === b;
	}

	function compose(a, b) {
		return function (x) {
			return a(b(x));
		};
	}

	function gets(name) {
		return function (x) {
			return x[name];
		};
	}

	function partial(fn, arg) {
		return function () {
			var callArgs = [arg];

			for (var i = 0; i < arguments.length; i++) {
				callArgs.push(arguments[i]);
			}

			return fn.apply(null, callArgs);
		};
	}

	function map(fn, values) {
		var result = [];

		for (var i = 0; i < values.length; i++) {
			result.push(fn(values[i]));
		}

		return result;
	}

	var toArray = partial(map, id);

	function getCharacters(row) {
		return toArray(row.getElementsByClassName('character'));
	}

	var operands = map(getCharacters, document.getElementsByClassName('comparison-operand'));

	function compare() {
		var length = operands[0].length;

		function compareIndex(i, callback) {
			if (i === length) {
				// comparison successful!
				callback(true);
				return;
			}

			var matched = operands.every(compose(partial(eq, operands[0][i].value), compose(gets('value'), gets(i))));
			var matchClass = matched ? 'character-match' : 'character-mismatch';

			operands.forEach(function (operand) {
				operand[i].classList.add(matchClass);
			});

			if (matched) {
				setTimeout(function () {
					compareIndex(i + 1, callback);
				}, 500);
			} else {
				callback(false);
			}
		}

		operands.forEach(function (operand) {
			operand.forEach(function (character) {
				var cl = character.classList;
				cl.remove('character-match');
				cl.remove('character-mismatch');
			});
		});

		setTimeout(function () {
			compareIndex(0, function () {});
		}, 500);
	}

	var compareButton = document.getElementById('compare');
	compareButton.addEventListener('click', compare);

	document.addEventListener('input', function (e) {
		var next;

		if (e.target.classList.contains('character') && e.target.value && (next = e.target.nextElementSibling) && next.classList.contains('character')) {
			next.focus();
		}
	});
})();
