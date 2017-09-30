#!python3
import glob
import os

import fnmatch, os 


class Concator:

    def get_file_list(self, path, pattern):
        file_list = []
        valid_path = path
        if path[-1] != '/': 
            valid_path = valid_path + '/'
        for elem in os.listdir(path):
            if fnmatch.fnmatch(elem, pattern):
                file_list.append(valid_path + elem)
        return file_list
        
    def concat_files(self, filelist):
        text = ''
        for name in filelist:
            f = open(name, "r", encoding='utf-8')
            text = text + "\r\n" + f.read()
            f.close()
        return text
        
    def process_task(self, task):
        self.files = []
        self.task = task
        for i in task.inputs:
            files = self.get_file_list(i.pathname, i.template)
            self.files.extend(files)
            if not i.filelist is None:
                self.files.extend(i.filelist)
        text = self.concat_files(self.files)
        self.process_outputs(text)
        
    def process_outputs(self, text):
        for o in self.task.outputs:
            
            if not (os.path.exists(o.pathname)):
                print("make dir")
                os.makedirs(o.pathname)
                
            fname = os.path.join(o.pathname, o.filename)
            f = open(fname, "w", encoding='utf-8')
            f.write(text)
            f.close()
                    
    def process_task1(self, task):
        self.files = []
        for i in task.inputs:
            pattern = i.pathname + i.template
            print(pattern)
            files = glob.glob(pattern)
            print(files)
            self.files.extend(files)
        print(self.files)


class Input:
    pathname = '.'
    template = '*'
    filelist = None
    def __init__(self, path, template, filelist=None):
        self.pathname = path
        self.template = template
        self.filelist = filelist or None
        
    
class Output:
    pathname = './build/'
    filename = 'build.js'
    def __init__(self, path, fname):
        self.filename = fname
        self.pathname = path
    

class Task:
    outputs = list()
    inputs = list()
    def add_output(output):
        self.outputs.append(output)
    def add_input(input) :
        self.inputs.append(input)
    def __init__ (self, inputs, outputs):
        self.inputs = inputs
        self.outputs = outputs
    

tsk = Task( [Input("./src-framework/", "*.js")], [ Output("./src-framework/build/", 'framework.js') ])

cnc = Concator()
cnc.process_task(tsk)