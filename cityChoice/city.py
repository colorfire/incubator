#!/usr/bin/python

import sqlite3
import string

def connectdb():
    cx = sqlite3.connect("db_weather.db")
    cu = cx.cursor()
    cu.execute("select * from provinces")
    provinces = cu.fetchall()
    content = []
    for p in provinces:
        item = []
        citys = cu.execute("select * from citys where province_id = %s" % (p[0]-1))
        cs = []
        for c in citys:
            city = c[2].encode("utf-8")
            if string.find(city, '.') < 1:
                # eg. [[[1,"beijing"], [[10100101,"beijing"],[...]],[[2,"shanghai"],[101010102,"shanghai"]...]
                cs.append([c[3].encode("utf-8"), c[2]])
        item.append([str(p[0]),p[1]])
        item.append(cs)
        content.append(item)
    print content
    # should shell print file.

if __name__ == '__main__':
    connectdb()