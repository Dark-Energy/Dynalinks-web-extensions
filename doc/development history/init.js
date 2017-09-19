First trying read data fromm storage

browser.storage.local.get("Dynalinks_Data").then ( success, fail);

then or fail, or success

success bring data

data may by {}, empty
it's fail
data.Dynalinks_Data may by empty or undefined
it's fail
data.key_name may not be truth value
it's fail





Этот модуль должен запускаться раньеш всех остальных. Он выполняет проверку, содержатся ли данные на машине. Это делается с помощью события

browser.runtime.onInstalled.addListener(test_install);

хотя можно и без него. Просто самое первая команда выполняется первой.

Функция запускает проверку что данные существуют и правильные. В нашем случае это сводится к вызову метода

My_Dynalinks_Extension.check_is_first();


В начале мы объявляем  некую структуру, похожу на объект приложения. Пусть это будет прототип. 
var My_Dynalinks_Extension = {};
My_Dynalinks_Extension.App = null;
My_Dynalinks_Extension.key_name = "Dynalinks_Data";

My_Dynalinks_Extension содержит несколько методов.

create_testing_data включает внутри себя структуру тестовых данных и возвращает их.

create_empty_data возвращает структуру пустых данных

write_testing_data записывает в storage тестовые либо пустые данные, обычно тестовые. 

Изначально мы ставим, что приложение не установлено и им пока нельзя пользоваться.
My_Dynalinks_Extension.installed = false;


check_is_first очень простой. Он выходит, если приложение уже установлено (this.installed === true).


Настоящую проверку выполняет метод

check_read_write 

который читает данные из хранилища. Прочитанные данные затем оптравляются на проверку в 

check_data

Этот метод должен проверить, что полученные данные

1) не пустые
2) содержат объект данных под именем Dynalinks_Data
3) содержат какие-то истинные данные,в нашем случае значение ключа key_name должно совпадать с заданным (Dynalinks_Data, т.е. имя базы данных)

Тогда данные считаются плохими и выполняется запись тестовых данных (или пустых).

Иначе считается, что мы прочитали реальные данные. 

На этом работа считается завершённой. Вызывается work_is_done.

Он делает очень мало:

1) устанавливает installed в true,
2) вызывает событие ready, что значит, инициаиця закончена и все готовы к работе. Теоретически оно должно рассылаться заинтересованным лицам.


=========

Я вижу, что прочитанные реальные данные оказыюватся не нужны. Не лучше ли отправлять их в Dynalinks, который живёт в proxy? Туда же можно оптравлять тестовые данные.


В конце я хотел сообщить всем заинтересованным, что провека окончена и можно начинать работать. Я использовал для этого 

       browser.runtime.sendMessage({init:"yes"}).then(null, null);
       
Но получил сообщение об ошибке        

firefox sendmessage Error: Could not establish connection. Receiving end does not exist.

Поиск в гугле не дал ничего, кроме нелепого бормотания:

1) You are sending a message to a tab and navigate it before it can receive the message. That doesn't make much sense.
2) The message may be arriving on the new page, which is not set up to receive the message.
