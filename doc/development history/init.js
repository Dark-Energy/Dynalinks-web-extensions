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





���� ������ ������ ����������� ������ ���� ���������. �� ��������� ��������, ���������� �� ������ �� ������. ��� �������� � ������� �������

browser.runtime.onInstalled.addListener(test_install);

���� ����� � ��� ����. ������ ����� ������ ������� ����������� ������.

������� ��������� �������� ��� ������ ���������� � ����������. � ����� ������ ��� �������� � ������ ������

My_Dynalinks_Extension.check_is_first();


� ������ �� ���������  ����� ���������, ������ �� ������ ����������. ����� ��� ����� ��������. 
var My_Dynalinks_Extension = {};
My_Dynalinks_Extension.App = null;
My_Dynalinks_Extension.key_name = "Dynalinks_Data";

My_Dynalinks_Extension �������� ��������� �������.

create_testing_data �������� ������ ���� ��������� �������� ������ � ���������� ��.

create_empty_data ���������� ��������� ������ ������

write_testing_data ���������� � storage �������� ���� ������ ������, ������ ��������. 

���������� �� ������, ��� ���������� �� ����������� � �� ���� ������ ������������.
My_Dynalinks_Extension.installed = false;


check_is_first ����� �������. �� �������, ���� ���������� ��� ����������� (this.installed === true).


��������� �������� ��������� �����

check_read_write 

������� ������ ������ �� ���������. ����������� ������ ����� ������������ �� �������� � 

check_data

���� ����� ������ ���������, ��� ���������� ������

1) �� ������
2) �������� ������ ������ ��� ������ Dynalinks_Data
3) �������� �����-�� �������� ������,� ����� ������ �������� ����� key_name ������ ��������� � �������� (Dynalinks_Data, �.�. ��� ���� ������)

����� ������ ��������� ������� � ����������� ������ �������� ������ (��� ������).

����� ���������, ��� �� ��������� �������� ������. 

�� ���� ������ ��������� �����������. ���������� work_is_done.

�� ������ ����� ����:

1) ������������� installed � true,
2) �������� ������� ready, ��� ������, ��������� ��������� � ��� ������ � ������. ������������ ��� ������ ����������� ���������������� �����.


=========

� ����, ��� ����������� �������� ������ ����������� �� �����. �� ����� �� ���������� �� � Dynalinks, ������� ���� � proxy? ���� �� ����� ���������� �������� ������.


� ����� � ����� �������� ���� ����������������, ��� ������� �������� � ����� �������� ��������. � ����������� ��� ����� 

       browser.runtime.sendMessage({init:"yes"}).then(null, null);
       
�� ������� ��������� �� ������        

firefox sendmessage Error: Could not establish connection. Receiving end does not exist.

����� � ����� �� ��� ������, ����� �������� ����������:

1) You are sending a message to a tab and navigate it before it can receive the message. That doesn't make much sense.
2) The message may be arriving on the new page, which is not set up to receive the message.
