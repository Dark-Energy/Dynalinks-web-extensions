#!python3
import glob
import os


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
    

tsk = Task( [Input("./src-framework/", "*.js")], [ Output("./build/", 'framework.js') ])

