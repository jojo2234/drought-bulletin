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
for x in range(10,sht.nrows):
    for y in range(3,72):
        a+=1
        if(str(sht.cell(x,y).value) == "None" or str(sht.cell(x,y).value) == "-9999" or str(sht.cell(x,y).value) == "" or str(sht.cell(x,y).value) == "-9999.0"):
            vals = 0
        else:
            vals = sht.cell(x,y).value
            #Questo file ha anno mese e giorno separati in questordine
            idSta = sht.cell(1,y).value
            if(idSta == None or idSta==""):
                idSta = 0
            stringa += str(a)+";"+str(int(sht.cell(x,2).value))+"/"+str(int(sht.cell(x,1).value))+"/"+str(int(sht.cell(x,0).value))+";"+str(vals)+";"+str(int(idSta))+"\n"
csv_file.write(stringa)
csv_file.close()