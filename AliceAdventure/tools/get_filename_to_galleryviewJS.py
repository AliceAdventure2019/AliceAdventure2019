import glob
import os.path

FOLDERS = ['backdrop', 'character', 'container', 'entrance', 'key', 'other'] #Change folders here when adding new folder.

FOLDER1 = "C:/Programs/AliceAdventure2019/AliceAdventure/app/Assets/"
FOLDER2 = '/*.png'

def makestring(filelist):
    for i in filelist:
        i = i.replace("C:/Programs/AliceAdventure2019/AliceAdventure/app/", "../../")
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
