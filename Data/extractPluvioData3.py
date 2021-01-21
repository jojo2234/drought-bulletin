import os
import sys
import xlrd

book = xlrd.open_workbook('provascript3.xls')
numsht = book.nsheets
print("\tSheets number: " + str(numsht))
sht = book.sheet_by_index(0)
print("\tOperating on sheet: " + sht.name)
idStaz = 9900000 #Perchè nel file excel mancano gli ID
a = 0 #Id precipitazione giornaliera
csv_file = open("pluvosta143.csv", "w")
stringa = ""
for x in range(9,sht.nrows):
    idStaz = 9900000 #Per ogni riga viene resettato
    for y in range(2,144):
        idStaz += 1 #Viene incrementato per ogni colonna
        a+=1
        if(str(sht.cell(x,y).value) == "None" or str(sht.cell(x,y).value) == "-9999"):
            vals = 0
        else:
            vals = sht.cell(x,y).value
        stringa += str(a)+";"+str(xlrd.xldate_as_tuple(sht.cell(x,1).value,book.datemode))+";"+str(vals)+";"+str(idStaz)+"\n"
csv_file.write(stringa)
csv_file.close()