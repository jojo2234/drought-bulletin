import os
import sys
import xlrd

book = xlrd.open_workbook('provascript4.xls')
numsht = book.nsheets
print("\tSheets number: " + str(numsht))
sht = book.sheet_by_index(0)
print("\tOperating on sheet: " + sht.name)
a = 0 #Id precipitazione giornaliera
csv_file = open("pluvosta71.csv", "w")
stringa = ""
for x in range(11,sht.nrows):
    for y in range(2,72):
        a+=1
        if(str(sht.cell(x,y).value) == "None" or str(sht.cell(x,y).value) == "-9999"):
            vals = 0
        else:
            vals = sht.cell(x,y).value
            #Questo file ha anno mese e giorno separati in questordine
        stringa += str(a)+";"+str(sht.cell(x,3).value)+"/"+str(sht.cell(x,2).value)+"/"+str(sht.cell(x,1).value)+";"+str(vals)+";"+str(sht.cell(2,y).value)+"\n"
csv_file.write(stringa)
csv_file.close()