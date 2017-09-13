#!python3

try:
    s =input()
    f = open("test", "w", encoding="utf-8")
    f.write(s)
    f.close()
finally:
    