import glob
import os.path

FOLDERS = ['backdrop', 'character', 'item', 'other'] #Change folders here when adding new folder.

FOLDER1 = "C:/Users/jiajunl2/Documents/AliceAdventure2018/AliceAdventure/app/Assets/"
FOLDER2 = '/*.png'

def makestring(filelist):
    for i in filelist:
        i = i.replace("C:/Users/jiajunl2/Documents/AliceAdventure2018/AliceAdventure/app/", "../../")
        i = i.replace('\\', "/")

        filename = os.path.basename(i).replace('_',' ')
        filename = filename.capitalize()
        filename = filename[0:-4]

        result_string = "{name:\'" + filename +"\', src:\'" + i +"\'},"
        print (result_string)


for each_folder in FOLDERS:
    this_filelist = glob.glob(FOLDER1 + each_folder + FOLDER2)
    print('\n---' + each_folder + '---')
    makestring(this_filelist)
