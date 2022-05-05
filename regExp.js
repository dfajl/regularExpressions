//метод test and replace
{
	var str = 'EM7473184а98IN';
	console.log(/(\d)([A-ZА-Я]+)(\d)/i.test(str)); // true
	str = str.replace(/(\d)([A-ZА-Я]+)(\d)/i, '$1$3');
	console.log(str);

	let string = 'EM7473184а98IN';
	console.log(string.replace(/(\d)([A-ZА-Я]+)(\d)/i, '$1$3')); // EM747318498IN
}

// многострочный режим якорей
{
	let str = `1е место: Винни 1
    2е место: Пятачок 2
    3е место: Слонопотам 3`;

	console.log(str.match(/^\d/gm)); // 1, 2, 3 /это если все разбито на три строки
	// если поставить в одну строку, то смысл флага 'm' теряется. выводится только первая цифра

	let lastSymbol = str.match(/\d$/gm);
	console.log(lastSymbol); // [ '1', '2', '3' ]

	let lastSymbol1 = str.match(/\d\n/g);
	console.log(lastSymbol1); // [ '1\n', '2\n' ]

	// отличие якоря $ от \n - это то, что якоря не входят в результат, а перевод строки - входит
}

// граница слова
{
	let str = '11/22/63';
	console.log(str.match(/\b\d\d\b/g)); //[ '11', '22', '63' ]

	let str1 = '_ab_cd_ef_';
	console.log(str1.match(/\b\w\w\w\w\w\w\w\w\w\w\b/g)); //null
}

// функция для конвертера трек-номера в джасте
{
	{
		function trackStartCorrect() {
			let str = '4fEM747318498IN';
			if (!/^e/i.test(str) && !/^\d/.test(str)) {
				str = str.split('');
				str.splice(0, 1);
				return str.join('');
			}
			return str;
		}
		console.log(trackStartCorrect());
	}

	{
		function trackStartCorrect() {
			let str = 'а6EM74731г8498IN';
			if (str.match(/^[^eи\d]/i)) {
				str = str.split('');
				str.splice(0, 1);
				return str.join('');
			}
			return str;
		}
		console.log(trackStartCorrect());
	}
}

// Наборы и диапозоны
{
	console.log('Вуаля'.match(/В[уа]ля/)); // null
	console.log('Вуаля'.match(/В[уа]ля/g));
	// здесь дословно говорю коду, чтобы он искал "В", после которого идeт или "у" или "а", потом "ЛЯ"

	console.log('Топ хоп'.match(/[тх]оп/gi)); // [ 'Топ', 'хоп' ]

	let string = 'EM74731кнекрпопр8498IN';
	console.log(string.match(/([A-ZА-Я]+)/gi)); // ['EM', 'кнекрпопр', 'IN']
}

// квантификаторы (указывают число повторений)
{
	{
		//{n} -  точное количество
		let string = "I'm 35 years old";
		console.log(string.match(/\d{2}/)); // 35
	}

	{
		// {3,5} - диапазон от трех до пяти цифр в числе
		let string = '4 8 15 16 237 4254 35677 years old';
		console.log(string.match(/\d{3,5}/g)); // [ '237', '4254', '35677' ]
		console.log(string.match(/\d{3,}/g)); // [ '237', '4254', '35677' ]
		// верхнюю границу можно не указывать {3,} - это значит, что мне нужно любое число,  из 3х и более символов
	}

	{
		// '+' - один или выше. это короткое обозначение  для {1,}
		let string = '4 8 15 16 237 4254 35677 years old';
		console.log(string.match(/\d{3,}/g)); // [ '237', '4254', '35677' ]
	}

	{
		// "?" означает ноль или один. т.е. либо предшествующий перед ? символ есть или его нет. то есть, символ не обязателен. То же самое, что и {0,1}

		let str = 'Следует писать color или colour?';
		console.log(str.match(/colou?r/g)); // color, colour
	}

	{
		// '*' Означает «ноль или более». То же самое, что и {0,}. То есть символ может повторяться много раз или вообще отсутствовать.

		console.log('100 10 1'.match(/\d0*/g)); // 100, 10, 1
		console.log('100 10 1'.match(/\d0{0,}/g)); // [ '100', '10', '1' ]
		console.log('100 10 1'.match(/\d0+/g)); // 100, 10. потому что в отличие от верхнего выражения, символ
		// "+" требует наличия как минимум одного нуля
	}

	// регулярка для десятичных дробей /\d+\.\d+/g
	{
		console.log('0 1 12.345 7890'.match(/\d+\.\d+/g)); // 12.345
	}

	// регулярка для открывающего тега без атрибутов
	{
		console.log('<body> ... </body>'.match(/<[a-z]+>/gi)); // [ '<body>' ]
		/* Это регулярное выражение ищет символ '<', за которым идут одна или более букв латинского алфавита, а затем '>' */
	}

	// регулярка для тега, н-ер, <h1> или </h1>
	console.log('<h1>Привет!</h1>'.match(/<\/?[a-z][a-z0-9]*>/gi)); //[ '<h1>', '</h1>' ]
}

// жадные и ленивые квантификаторы
{
	console.log('123 456'.match(/\d+ \d+?/));
	// 123 4 - тут пример ленивого режима после пробела

	console.log('123 456'.match(/\d+ \d+/));
	// 123 456 - тут пример жадного режима после пробела

	{
		//жадный режим
		let regexp = /".+"/g;
		let str = 'a "witch" and her "broom" is one';
		console.log(str.match(regexp)); // "witch" and her "broom"

		/* Вот как я вижу ситуацию: движок находит первую кавычку. все правильно. потом ищет любой символ кроме начала новой строки один раз и более (т.к. там + стоит). и т.к. квантификатор по умолчанию жадный, он ищет ВСЕ символы, которые подходят под "."; и доходит до конца. но потом уже сам движок говорит, что квантификатор взял слишком много и отматывает назад, потому что ему под шаблон нужна закрывающая кавычка. */
	}

	{
		//ленивый режим
		let regexp = /".+?"/g;
		let str = 'a "witch" and her "broom" is one';
		console.log(str.match(regexp)); // [ '"witch"', '"broom"' ]

		/* Вот как я вижу ситуацию: движок находит первую кавычку. все правильно. потом ищет любой символ кроме начала новой строки один раз и более (т.к. там + стоит). и т.к. квантификатор  в ленивом режиме, движок будет останавливать его и проверять оставшуюся часть шаблона. т.е. квантификатор остановится на позиции "w, но движок заставит его идти дальше, потому что по шаблону нужна закрывающаяся кавычка. в итоге поиск дойдет до "witch" и остановится. но тут у шаблона стоит глобальный флаг, поэтому будет еще одно совпадение "broom" */
	}

	{
		// альтернативный подход для шаблонов выше
		let regexp = /"[^"]+"/g;
		let str = 'a "witch" and her "broom" is one';
		console.log(str.match(regexp)); // [ '"witch"', '"broom"' ]
	}

	{
		// еще примеры:
		let str = '...<a href="link" class="doc">...';
		let regexp = /<a href=".*" class="doc">/g;
		// Работает!
		console.log(str.match(regexp));
		// квантификатор не ленивый. все сработало
	}

	{
		let str =
			'...<a href="link1" class="doc">... <a href="link2" class="doc">...';
		let regexp = /<a href=".*" class="doc">/g;
		// Упс! Две ссылки в одном совпадении!
		console.log(str.match(regexp)); // [ '<a href="link1" class="doc">... <a href="link2" class="doc">' ]
		/* так как квантификатор жадный, то забирается слишком много символов
            <a href="....................................." class="doc">
            <a href="link1" class="doc">... <a href="link2" class="doc">
       */

		{
			//ленивый режим квантификатора может исправить дело
			let str =
				'...<a href="link1" class="doc">... <a href="link2" class="doc">...';
			let regexp = /<a href=".*?" class="doc">/g;
			console.log(str.match(regexp)); // [ '<a href="link1" class="doc">', '<a href="link2" class="doc">' ]
		}

		{
			let str =
				'...<a href="link1" class="wrong">... <p style="" class="doc">...';
			let regexp = /<a href=".*?" class="doc">/g;

			// Неправильное совпадение!
			console.log(str.match(regexp)); // <a href="link1" class="wrong">... <p style="" class="doc">
			/* несмотря на ленивый режим, регулярка делает так: ищется совпадение до <a href="link1". типа все нормально. квантификатор останавливается. но регулярке-то нужно найти оставшуюся часть шаблона. и она заставляет квантификатор идти до конца, пока регулярка не найдет   class="doc"> */
		}

		{
			// альтернативный вариант
			let str1 =
				'...<a href="link1" class="wrong">... <p style="" class="doc">...';
			let str2 =
				'...<a href="link1" class="doc">... <a href="link2" class="doc">...';
			let regexp = /<a href="[^"]*" class="doc">/g;

			// Работает!
			console.log(str1.match(regexp)); // совпадений нет, всё правильно
			console.log(str2.match(regexp)); // <a href="link1" class="doc">, <a href="link2" class="doc">
		}
	}
}

// скобочные группы
{
	console.log('Gogogo now!'.match(/(go)+/i)); // [ 'Gogogo', 'go']
	console.log('Gogogo now!'.match(/(go)+/gi)); // [ 'Gogogo' ]
	/* внимание: метод  match без флага глобальности вернет сначала выражение целиком, а под индексом 1 он вернет содержимое скобочной группы*/

	{
		let str = '<h1>Hello, world!</h1>';
		let tag = str.match(/<(.*?)>/);
		console.log(str.match(/<(.*)>/));

		console.log(tag[0]); // <h1>
		console.log(tag[1]); // h1
	}

	{
		// вложенные скобочные группы

		let str = '<span class="my">';
		let regexp = /<(([a-z]+)\s*([^>]*))>/;
		/* здесь скобочные группы применены для удобства вывода в массиве-результате
            нам может понадобиться:
            - Содержимое тега целиком: span class="my".
            - Название тега: span.
            - Атрибуты тега: class="my".
         
            самая первая скобочна группа (внешняя) отвечает за все выражение вцелом: <span class="my">
            вторая - ([a-z]+) - название тега = span
            третья - ([^>]*) - атрибут со значением = class="my"

            поэтому при выводе совпадения мы получим первым элементом массива тег и его атрибут - <span class="my">
            под индексом 1 мы получим значение первой скобоной группы = span class="my"
            под индексом 2 будет первая скобочная группа - название тега = span
            под индексом 3 будет вторая скобочная группа - атрибут со значением = class="my"
        
        */
	}

	{
		// необязательные скобочные группы

		// (z)? - это значит, что скобочная группа не обязательна
		let match = 'a'.match(/a(z)?(c)?/);

		console.log(match.length); // 3
		console.log(match[0]); // a (всё совпадение)
		console.log(match[1]); // undefined
		console.log(match[2]); // undefined
		/* несмотря на необязательность скобочной группы, в массиве под нее уготовлено место, но значение будет undefined */

		{
			let match = 'ac'.match(/a(z)?(c)?/);
			console.log(match); // [ 'ac', undefined, 'c',]
			console.log(match.length); // 3
			console.log(match[0]); // ac (всё совпадение)
			console.log(match[1]); // undefined, потому что для (z)? ничего нет
			console.log(match[2]); // c
		}
	}

	// метод matchAll
	{
		let str = '<h1> <h2>';
		let tags = str.match(/<(.*?)>/g);
		console.log(tags); // <h1>,<h2>

		let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);
		// results - не массив, а перебираемый объект
		console.log(results); // [object RegExp String Iterator]

		console.log(results[0]); // undefined (*)
		/* results - это не массив, а итерируемый объект. поэтому по индексам к нему не обратишься */

		results = Array.from(results);
		/*  превращаем в массив. Array.from принимает псевдомассив / итерируемый объект и делает из него настоящий массив и далее можем получить каждое совпадение со своей скобочной группой. т.е фишка в том, что мы получаем все совпадения, но не просто массивом, как при использовании без режима глобальности, а с доп сведениями. еще и со скобочными группами */

		console.log(results[0]); // [ '<h1>', 'h1', index: 0, input: '<h1> <h2>', groups: undefined ]
		console.log(results[1]); // [ '<h2>', 'h2', index: 5, input: '<h1> <h2>', groups: undefined ]

		// все описанное выше можно преобразовать при помощи деструктуризации
		{
			let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);
			let [tag1, tag2] = results;
			/* в правой части выражения выше может стоять любой итерируемый объект 
                то есть справа будет объект с двумя массивами внутри
                tag1 = [ '<h1>', 'h1', index: 0, input: '<h1> <h2>', groups: undefined ]
                tag2 = [ '<h2>', 'h2', index: 5, input: '<h1> <h2>', groups: undefined ]
            
            */

			console.log(tag1[0]); // <h1>
			console.log(tag1[1]); // h1
			console.log(tag1.index); // 0
			console.log(tag1.input); // <h1> <h2>

			console.log(tag2[0]); // <h2>
			console.log(tag2[1]); // h2
			console.log(tag2.index); // 5
			console.log(tag2.input); // <h1> <h2>
		}
	}
	/*  метод match не возвращает скобочные группы, если у регулярки есть флаг глобальности
        чтобы исправить это, мы можем использовать новый метод matchAll 
    */

	// именованные скобочные группы
	{
		let dateRegexp =
			/(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
		let str = '2019-04-30';
		console.log(str.match(dateRegexp)); // ['2019-04-30', '2019', '04', '30'];

		/* теперь мы можем обратиться к свойству groups в регулярном выражении и получить число/месяц/год */

		console.log(str.match(dateRegexp).groups.year); // 2019
	}

	// скобочные группы при замене
	{
		{
			var str = 'EM7473184аjhghgj98IN';
			console.log(str.match(/(\d)/i));
			console.log(/(\d)([A-ZА-Я]+)(\d)/i.test(str)); // true
			console.log(str.match(/(\d)([A-ZА-Я]+)(\d)/i)); // ['4а9', '4','а', '9', index: 8, input: 'EM7473184а98IN', groups: undefined]

			str = str.replace(/(\d)([A-ZА-Я]+)(\d)/i, '$1$3');
			/* т.е. здесь мы говорим движку: возьми совпадение ('4а9') и замени его на "скобочная группа 1, вырежи середину, скобочная группа 2"*/

			console.log(str);
		}

		{
			let str = 'Sarah Connor';
			let regexp = /(\w+) (\w+)/;

			console.log(str.replace(regexp, '$2 $1')); // Connor Sarah
			console.log(str); // Sarah Connor/ обрати внимане, что исходный массив не изменился, так как в переменную str ничего не перезаписано
		}

		{
			let regexp =
				/(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/g;
			let str = '2019-10-30, 2020-01-01';
			console.log(str.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)); // [ '2019-10-30', '2020-01-01' ]

			str = str.replace(regexp, '$<day>-$<month>-$<year>');
			console.log(str); // '30-10-2019, 01-01-2020'
		}
	}

	// исключение из запоминания
	{
		let str = 'Gogogo John!';
		let reg = /(go)+ (\w+)/i;
		let res = str.match(reg);
		console.log(res); // ['Gogogo John', 'go', 'John', index: 0, input: 'Gogogo John!', groups: undefined]

		// '?:' исключает go из запоминания. просто для того, чтобы не показывать эту группу в массиве результатов
		let string = 'Gogogo John!';
		let regexp = /(?:go)+ (\w+)/i;
		let result = string.match(regexp); // ['Gogogo John','John', index: 0,input: 'Gogogo John!',groups: undefined]
		/* как видно, скобочная группа (?:go)+ исключена из массива результатов  */

		console.log(result);
		console.log(result[0]); // Gogogo John (полное совпадение)
		console.log(result[1]); // John
		console.log(result.length); // 2 (больше в массиве элементов нет)
	}

	// обратная ссылка на скобочную группу по номеру или имени
	{
		let str = `He said: "She's the one!".`;
		let regexp = /['"](.*?)['"]/g;

		console.log(str.match(regexp)); // "She'
		/* Результат - не тот, который хотелось бы, потому что движок  нашел сначала открывающую двойную кавычку, потом лениво дошел до опострофа и посчитал его за кавычку. но это не то, что нам нужно. мы може заставить движок запомнить содержимое скобочной группы */
	}

	{
		let str = `He said: "She's the one!".`;
		let regexp = /(['"])(.*?)\1/g;
		console.log(str.match(regexp)); // "She's the one!"
	}
	/* Теперь работает! Движок регулярных выражений находит первую кавычку из шаблона (['"]) и запоминает её содержимое. Это первая скобочная группа. Далее в шаблоне \1 означает «найти то же самое, что в первой скобочной группе», а именно – аналогичную кавычку в нашем случае. */

	// можно сделать то же самое, но по имени скобочной группы
	{
		let str = `He said: "She's the one!".`;
		let regexp = /(?<quote>['"])(.*?)\k<quote>/g;
		console.log(str.match(regexp)); // "She's the one!"
	}
}

// альтернация (или) |
{
	let regexp = /html|css|java(script)?/gi;
	let str = 'Сначала появился язык Java, затем HTML, потом JavaScript';

	console.log(str.match(regexp)); // [ 'Java', 'HTML', 'JavaScript' ]
	/* т.е здесь идет поиск  html или css или java(script)? или, если есть флаг глобальности, то тогда все вхождения вместе*/

	// пример со временем
	{
		let regexp = /([01]\d|2[0-3]):[0-5]\d/g;
		/* разберем регулярку по пунктам:
            [01]\d - первый символ или 0 или 1, т.е 05 часов или, н-ер, 11 часов
            2[0-3] - вариант времени, н-ер, 23 часа
            | - обозначает или, т.е часы могут быть как 15 часов, так и 23 часа, так и 04 часа
            потом ищется знак двоеточия и затем любая цифра из диапозона минут (н-ер, 59 минут)
            первую часть выражения заключили в скобки, т.к. в противном случае альтернация применится к минутам [01]\d или 2[0-3]:[0-5]\d.
            т.е: Люблю (HTML|CSS) найдёт Люблю HTML или Люблю CSS
        */
		console.log('00:00 10:10 23:59 25:99 1:2'.match(regexp)); // 00:00,10:10,23:59
	}
}

// опережающие и ретроспективные проверки
{
	// опережающая позитивная проверка:  X(?=Y)
	// дословно: только то Х, за которым идет Y
	{
		let str = '1 индейка стоит 30€';
		console.log(str.match(/\d+(?=€)/)); // 30, число 1 проигнорировано, так как за ним НЕ следует €
	}

	// опережающая негативная проверка:  X(?!Y)
	// дословно: только то Х, за которым НЕ идет Y
	{
		let str = '1 индейка стоит 30€';
		console.log(str.match(/\d+(?!€)/)); // 1 (в этот раз проигнорирована цена)
	}

	// ретроспективная позитивная проверка
	// Позитивная ретроспективная проверка: (?<=Y)X, ищет совпадение с X при условии, что перед ним ЕСТЬ Y
	{
		let str = '1 индейка стоит $30';
		// знак доллара экранируем \$, так как это специальный символ и ищем число, перед которым есть знак доллара
		console.log(str.match(/(?<=\$)\d+/)); // 30, одинокое число игнорируется
	}

	// ретроспективные проверки и скобочные группы
	/* результат проверки (?=€) не будет включен в вывод результата, т.к. это всего лишь проверка. но иногда полезно выести еще и результат. для этого проверку надо обернуть в дополнительные скобки */
	{
		let str = '1 индейка стоит 30€';
		console.log(str.match(/\d+(?=€)/)); // 30. сама проверка не выводится в результат
	}

	{
		let str = '1 индейка стоит 30€';
		console.log(str.match(/\d+(?=(€))/));
		/* в отличие от примера выше, знак евро обернут в скобки. он включен в вывод результата */
		// ['30','€',index: 16,input: '1 индейка стоит 30€',groups: undefined]
	}
}

// регулярка для фильтров в онлайн-магазине
{
	// так и не понял, как работает эта регулярка
	let regExp = /\B(?=(\d{3})+(?!\d))/g;
	console.log('2100'.match(regExp));
	let newExpression = '210089'.replace(/\B(?=(\d{3})+(?!\d))/, ' ');
	console.log(newExpression);
}

// катастрофический возврат
{
	let regexp = /^\w+\s+\w$/;
	console.log('Auyuyu          g'.match(regexp));

	{
		let regexp = /^(\d+)*$/;

		let str = '012345678901234567890123456789!';

		// этот поиск будет выполняться очень, очень долго
		console.log(regexp.test(str));
	}
}

// поиск на заданной позиции. флаг 'y'
{
	let str = 'let varName = "value"';
	console.log(str.match(/\w+/)); // [ 'let', 'varName', 'value' ]
	/* Но нам надо найти именно имя переменной. оно находится на 4ой позиции. на помощь приходит флаг "у". данный флаг использует св-во regexp.lastIndex = 4; и ищет на указанной позиции, т.е. ни до 4 ни после поиск не идет. это существенно увеличивает производительность, в отличие от метода  regexp.exec(str) с глобальным флагом */

	let regexp = /\w+/y;
	regexp.lastIndex = 4;
	console.log(regexp.exec(str)); // varName (слово на позиции 4)
}

//Методы регулярок и строк
{
	// str.match(regExp)
	{
		let str = 'I love JavaScript';

		let result = str.match(/Java(Script)/);
		console.log(result);
		/* 
		несмотря на такой большой массив, его длинна всего лишь = 2. все далее - это свойства
			[
				'JavaScript',
				'Script',
				index: 7,
				input: 'I love JavaScript',
				groups: undefined
			] 	
		*/
		console.log(result[0]); // JavaScript (всё совпадение)
		console.log(result[1]); // Script (первые скобки)
		console.log(result.length); // 2

		// Дополнительная информация:
		console.log(result.index); // 7 (позиция совпадения)
		console.log(result.input); // I love JavaScript (исходная строка)
	}

	// str.matchAll(regexp)
	{
		/* Метод str.matchAll(regexp) – «новый, улучшенный» вариант метода str.match.

		Он используется, в первую очередь, для поиска всех совпадений вместе со скобочными группами.

		У него 3 отличия от match:

		- Он возвращает не массив, а перебираемый объект с результатами, обычный 	массив можно сделать при помощи Array.from.
		- Каждое совпадение возвращается в виде массива со скобочными группами (как str.match без флага g).
		- Если совпадений нет, то возвращается не null, а пустой перебираемый объект. */

		let str = '<h1>Hello, world!</h1>';
		let regexp = /<(.*?)>/g;
		let matchAll = str.matchAll(regexp);
		console.log(matchAll); // [object RegExp String Iterator], не массив, а перебираемый объект

		matchAll = Array.from(matchAll); // теперь массив

		let firstMatch = matchAll[0];
		console.log(matchAll);
		/* 
			[
				[
					'<h1>',
					'h1',
					index: 0,
					input: '<h1>Hello, world!</h1>',
					groups: undefined
				],
				[
					'</h1>',
					'/h1',
					index: 17,
					input: '<h1>Hello, world!</h1>',
					groups: undefined
				]
			]

		*/

		console.log(firstMatch[0]); // <h1>
		console.log(firstMatch[1]); // h1
		console.log(firstMatch.index); // 0
		console.log(firstMatch.input); // <h1>Hello, world!</h1>
	}

	//split
	{
		//Разбивает строку в массив по разделителю – регулярному выражению regexp или подстроке substr.

		//Обычно мы используем метод split со строками, вот так:
		console.log('12-34-56'.split('-')); // массив [12, 34, 56]

		//Но мы можем разделить по регулярному выражению аналогичным образом:
		console.log('12, 34,56'.split(/,\s*/)); // массив [12, 34, 56]
	}

	// str.search(regexp)
	/* Метод str.search(regexp) возвращает позицию первого совпадения с regexp в строке str или -1, если совпадения нет. */
	{
		let str = 'Я люблю JavaScript!';
		let regexp = /Java.+?/;
		console.log(str.search(regexp)); // 8
		console.log(str.match(regexp)); // JavaScript!

		// а в ленивом режиме будет JavaS:
		let strLazy = 'Я люблю JavaScript!';
		let regexpLazy = /Java.+?/;
		console.log(strLazy.match(regexpLazy)); //JavaS

		/*
		 	Важное ограничение: str.search умеет возвращать только позицию первого совпадения.
			Если нужны позиции других совпадений, то следует использовать другой метод, например, найти их все при помощи str.matchAll(regexp).
 		*/
	}
}
