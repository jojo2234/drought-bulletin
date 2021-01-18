#Passata una cartella a questo script lui cercherà al suo interno i file excel ed estrarrà le stazioni meteorologiche
#Le inserirà in un file csv chiamato stazioni.csv da usare per aggiornare il database
#Se la stazione è già presente nel file csv o in memoria (altro file stessa esecuzione) allora non la ignora altrimenti la aggiunge
#Se il file csv non è presente lo crea dove si trova il programma
#C:\Users\Alex\Documents\GitHub\drought-bulletin\Data\PluvioData qui è dove si trovano i miei dati pluviometrici dove sono riportate le stazioni
#Per avviare il programma scrivere su cmd >python EstraiStazioniDaCartella.py [DirectoryConIFile]
import os
import sys
import xlrd
from openpyxl import load_workbook

def do_extractionfrom(directoryentry):
    if directoryentry.name.endswith('xlsx'):
        workbook = load_workbook(filename=directoryentry)
        nomiFogli = workbook.sheetnames
        numSh = len(nomiFogli)
        print("\tActive sheet: " + workbook.active.title)
        print("\tSheets number: " + str(numSh))
        for i in range(0,numSh):
            workbook.active = i
            print("\tOperating on sheet: " + workbook.active.title)
            foglio = workbook.active
            for x in range(0, foglio.max_row):
                for y in range(0, foglio.max_column):
                    print(foglio.cell(x,y).value)
            #for row in foglio.iter_rows(min_row=1,max_row=8,min_col=1,max_col=20):
            #    print(row.value) #Errato?
            #print("\n\t " + str(foglio["B3"].value))
        print("\n")
    elif directoryentry.name.endswith('xls'):
        book = xlrd.open_workbook(directoryentry)
        numsht = book.nsheets
        print("\tSheets number: " + str(numsht))
        for i in range(0,numsht):
            sht = book.sheet_by_index(i)
            print("\tOperating on sheet: " + sht.name)
            #for x in range(1,sht.nrows):
            #    for y in range(1,sht.ncols):
            #        print(sht.cell_value(x,y))
    else:
        print("\tFile not supported")

if(len(sys.argv) > 1):
    dire = sys.argv[1]
else:
    dire = input("\nDirectory where xlsx files are located: ")

assert os.path.exists(dire), "Directory doesn't exist!"
print("\nSelected directory is: " + dire)
print("\nProcessing files: ")
with os.scandir(dire) as entries:
    for entry in entries:
        print("\n --- " + entry.name)
        do_extractionfrom(entry)