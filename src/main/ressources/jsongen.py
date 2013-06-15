
import os
import random
import uuid

nodelist = []
class Node:

	def __init__(self, name, uuid):
		self.name = name
		self.uuid= uuid
		self.children = []
		#on doit respecter le ration tel que v:p >= 1 jamais plus de ressources virtuelle que de physique

		#self.ratio = self.pDiskSpace / self.vDiskSpace
		#self.pCPU = random.randint(20,100)#nb CPU
		#self.vCPU = self.pCPU - random.randint(1,10)#nb CPU
		#equi = self.pCPU - random.randint(1,self.pCPU)
		#if(equi >= self.pCPU):
		#	equi = self.pCPU - random.randint(1,self.pCPU)
		#self.vCPU = equi
		#self.pRAM = random.randint(1,20)#Go
		#self.vRAM = random.randint(1,20)#Go
		#self.pDiskSpace = random.randint(100,10000)#Go
		#self.vDiskSpace = random.randint(100,10000)#Go
		self.CPU = 0
		self.RAM = 0
		self.DiskSpace = 0
		self.ratioCPU= 0
		self.ratioRAM=0
		self.ratioDiskSpace=0
		self.nodeType= ""
		self.constraints = []
		
class NodeConstraint:

	def __init__(self,  name, id, nodes):
		self.name=name
		self.id = id
		self.nodes= nodes
		
		
class VMConstraint:

	def __init__(self, name, id, vms):
		self.name=name
		self.id=id
		self.vms=vms
		

class Ban_fence:
	def __init__(self, name, id, vms, nodes):
		self.name = name
		self.id = id
		self.vms = vms
		self.nodes = nodes

class Ressource_capacity:
	def __init__(self, name, id, nodes, rc, amount):
		self.name = name
		self.id = id
		self.nodes = nodes
		self.rc = rc
		self.amount = amount

class Running_capacity:
	def __init__(self, name, id, nodes, amount):
		self.name = name
		self.id = id
		self.nodes = nodes
		self.amount = amount

class Preserve:
	def __init__(self, name, id, vms, rc, amount):
		self.name = name
		self.id = id
		self.vms = vms
		self.rc = rc
		self.amount = amount

class Split:
	def __init__(self, name, id, vms):
		self.name = name
		self.id = id
		self.vms = vms

class Among:
	def __init__(self, name, id, vm, parts):
		self.name = name
		self.id = id
		self.vm = vm
		self.parts = parts

class SplitAmong:
	def __init__(self, name, id, vparts, pparts):
		self.name = name
		self.id = id
		self.vparts = vparts
		self.pparts = pparts


def findRandomNode(node, nodeType):
	finalNode= node
	while(finalNode.nodeType!=nodeType and len(finalNode.children)>0):
		finalNode= finalNode.children[random.randint(0, len(finalNode.children)-1)]
	global myvar 
	
	
	if(finalNode.nodeType!= nodeType or finalNode.name =='free'):
		#print(finalNode.nodeType)
		finalNode = findRandomNode(node, nodeType) 
	
	return finalNode
	
def findUniqueNode(node, nodeType):
	global nodelist
	n = findRandomNode(node, nodeType)
	while(n in nodelist):
		n = findRandomNode(node, nodeType)
	
	nodelist.append(n)
	return n


	
def makeConstraints():
	nbNC = random.randint(1, 20)
	nbVMC = random.randint(1, 20)
	nbBan_fence = random.randint(1, 10)
	nbRC = random.randint(1, 10);

	for i in range(nbVMC):
		name = "VMC" +str(i)
		id= random.choice([ "Gather", "Killed", "Lonely", "Ready", "Root", "Running", "SequentialVMTransitions", "Sleeping", "Spread"])
		vms=[]
		vms.append(findRandomNode(g5k, "vm"))
		again=1
		while(again!=0):
			vms.append(findRandomNode(g5k, "vm"))
			again =random.randint(0,5)
		constraints.append(VMConstraint(name, id, vms))

		
		
	for i in range(nbNC):
		name = "NC" +str(i)
		id= random.choice([ "Offline", "Online", "Quarantine"])
		nodes=[]
		nodes.append(findRandomNode(g5k, "node"))
		while(random.randint(0,5)!=0):
			nodes.append(findRandomNode(g5k, "node"))
		constraints.append(NodeConstraint(name, id, nodes))

	for i in range(nbBan_fence):
		id = random.choice([ "Ban", "Fence" ])
		name = id + str(i)
		vms = []
		nodes = []
		nodes.append(findRandomNode(g5k, "node"))
		while(random.randint(0,5)!=0):
			nodes.append(findRandomNode(g5k, "node"))

		vms.append(findRandomNode(g5k, "vm"))
		while(random.randint(0,5)!=0):
			vms.append(findRandomNode(g5k, "vm"))

		constraints.append(Ban_fence(name, id, vms, nodes))

	nbRC = random.randint(1, 10);
	for i in range(nbRC):
		id = random.choice([ "CumulatedResourceCapacity", "SingleResourceCapacity", "Overbook"])
		name = id + str(i)
		node = []
		amount = 0
		node.append(findRandomNode(g5k, "node"))
		while(random.randint(0,5)!=0):
			node.append(findRandomNode(g5k, "node"))
		rc = random.choice([ "CPU", "RAM", "DiskSpace"])
		if(id == "Overbook"):
			#amount = random.uniform(1, 10)
			char = str(random.randint(1,9)) + "."
			for j in range(3):
				char += str(random.randint(1,9))
			
			amount = char

		else:
			amount = random.randint(0, 100)
		constraints.append(Ressource_capacity(name, id, node, rc, amount))
	
	nbRC = random.randint(1, 10);

	for i in range(nbRC):
		id = random.choice([ "CumulatedRunningCapacity", "SingleRunningCapacity"])
		name = id + str(i)
		node = []
		node.append(findRandomNode(g5k, "node"))
		while(random.randint(0,5)!=0):
			node.append(findRandomNode(g5k, "node"))
		amount = random.randint(0, 100)
		constraints.append(Running_capacity(name, id, node, amount))

	nbRC = random.randint(1, 10);

	for i in range(nbRC):
		id = "Preserve"
		name = id + str(i)
		vm = []
		vm.append(findRandomNode(g5k, "vm"))
		while(random.randint(0,5)!=0):
			vm.append(findRandomNode(g5k, "vm"))
		rc = random.choice([ "CPU", "RAM", "DiskSpace"])
		amount = random.randint(0, 100)
		constraints.append(Preserve(name, id, vm, rc, amount))

	nbRC = random.randint(1, 10);

	for i in range(nbRC):
		id = "Split"
		name = id + str(i)
		vms = []
		vm = []
		vm.append(findUniqueNode(g5k, "vm"))
		while(random.randint(0, 6) != 0):
			vm.append(findUniqueNode(g5k, "vm"))
		vms.append(vm)
		vm = []
		while(random.randint(0,5)!=0):
			vm.append(findUniqueNode(g5k, "vm"))
			while(random.randint(0, 6) != 0):
				vm.append(findUniqueNode(g5k, "vm"))
			vms.append(vm)
			vm = []
		constraints.append(Split(name, id, vms))
		nodelist = []

	nbRC = random.randint(1, 10);

	for i in range(nbRC):
		id = "Among"
		name = id + str(i)
		node = []
		vm = []
		nodes = []
		vm.append(findUniqueNode(g5k, "vm"))
		while(random.randint(0,5)!=0):
			vm.append(findUniqueNode(g5k, "vm"))
		node.append(findUniqueNode(g5k, "node"))
		while(random.randint(0, 6) != 0):
			node.append(findUniqueNode(g5k, "node"))
		nodes.append(node)
		node = []
		nodelist = []
		while(random.randint(0,5)!=0):
			node.append(findUniqueNode(g5k, "node"))
			while(random.randint(0, 6) != 0):
				node.append(findUniqueNode(g5k, "node"))
			nodes.append(node)
			node = []
		constraints.append(Among(name, id, vm, nodes))
		nodelist = []

	nbRC = random.randint(1, 10);

	for i in range(nbRC):
		id = "SplitAmong"
		name = id + str(i)
		vm = []
		vms = []
		node = []
		nodes = []
		node.append(findUniqueNode(g5k, "node"))
		while(random.randint(0, 6) != 0):
			node.append(findUniqueNode(g5k, "node"))
		nodes.append(node)
		node = []
		while(random.randint(0,5)!=0):
			node.append(findUniqueNode(g5k, "node"))
			while(random.randint(0, 6) != 0):
				node.append(findUniqueNode(g5k, "node"))
			nodes.append(node)
			node = []
		nodelist = []
		vm.append(findUniqueNode(g5k, "vm"))
		while(random.randint(0, 6) != 0):
			vm.append(findUniqueNode(g5k, "vm"))
		vms.append(vm)
		vm = []
		while(random.randint(0,5)!=0):
			vm.append(findUniqueNode(g5k, "vm"))
			while(random.randint(0, 6) != 0):
				vm.append(findUniqueNode(g5k, "vm"))
			vms.append(vm)
			vm = []
		constraints.append(SplitAmong(name, id, vms, nodes))
		nodelist = []
		
def makeCluster(id, nb):


	cluster = Node(id,str(uuid.uuid4()) )
	#print(cluster.pCPU)
	for i in range(nb):
		node = Node(id + "-" + str(i+1), str(uuid.uuid4()))
		node.nodeType="node"

		node.ratioDiskSpace = random.randint(1,5)
		node.ratioRAM= random.randint(1,5)
		node.ratioCPU= random.randint(1,16)
		node.CPU =tmpCPU =  random.randint(1,32)
		node.RAM =tmpRAM= random.randint(1024,65536)
		node.DiskSpace= tmpDisk = random.randint(1000000,100000000)
		
		while(tmpCPU>=1.0/node.ratioCPU and tmpRAM>=1.0/node.ratioRAM and tmpDisk >=100000.0/node.ratioDiskSpace and len(node.children) < 20):
			uuidVM=str(uuid.uuid4())
			vm = Node(uuidVM,uuidVM)
			vm.nodeType="vm"
			#add random virtual ressources
			vm.RAM = random.randint(1,int(tmpRAM*node.ratioRAM))
			vm.DiskSpace = random.randint(100000, int(tmpDisk*node.ratioDiskSpace))
			vm.CPU= random.randint(1, int(tmpCPU* node.ratioCPU))

			#remove ressource of new vm at node
			tmpRAM = tmpRAM - vm.RAM*1.0/node.ratioRAM
			tmpDisk = tmpDisk - vm.DiskSpace*1.0 /node.ratioDiskSpace
			tmpCPU = tmpCPU - vm.CPU*1.0/ node.ratioCPU

			#add vm at node
			node.children.append(vm)
		#add space of free ressources
		if(tmpDisk >0 or tmpRAM>0 or tmpCPU>0):
			#add "vm" free
			free = Node("free", str(uuid.uuid4()))

			free.nodeType="vm"

			#add free ressources
			free.DiskSpace = tmpDisk * node.ratioDiskSpace
			free.RAM = tmpRAM * node.ratioRAM
			free.CPU = tmpCPU * node.ratioCPU
			free.nodeType="free"
			
			#node.children.append(free)



		cluster.children.append(node)
	return cluster


def printNode(root):
	if root.children != []:
		for i in range(len(root.children)):
			printNode(root.children[i])

def jsonGen(root) :


	
	json = '{ "name" : "' + root.name + '" '

	json +=', "UUID" : "' + str(root.uuid) + '"'

	if(root.name != "g5k"):
		if root.nodeType != "":
			json += ', "type": "' + root.nodeType + '"'
			json += ' ,"resources" : {'
			json +='"CPU" : ' + str(root.CPU) 
			json +=', "RAM" : ' + str(root.RAM) 
			json += ', "DiskSpace" :' + str(root.DiskSpace) + '}'


	if root.children != []:
		json += ', \n "children" : ['
		for i in range(len(root.children)):
			json += jsonGen(root.children[i]) + ', '
		json = json[:len(json)-2]
		json += '] \n'
	json += '}'

	return json

def constraintsGen():

	json = '\n\n { "name" : "constraints" ,\n'
	json += ' "list" : [ \n '
	numb = 0	
	for i in range(len(constraints)):
		numb += 1
		json += '{ "name" : "' + constraints[i].name + '" ,\n'
		json += '"id" : "' + constraints[i].id + '" , \n'

		if(type(constraints[i]) == VMConstraint):
			json += '"VMs" : [\n'
			json += '{ "name" : "VMs_' + str(numb) + '" ,\n'
			json += '"VMs": ['
			for j in range(len(constraints[i].vms)):
				json += '"' + constraints[i].vms[j].uuid + '"'
				if j != (len(constraints[i].vms) -1):
					json += ',\n'
			json += ']}]}'


		elif(type(constraints[i]) == NodeConstraint):
			json += '"Nodes" : [\n'
			json += '{ "name" : "Nodes_' + str(numb) + '" ,\n'
			json += '"Nodes": ['
			for j in range(len(constraints[i].nodes)):
				json += '"' + constraints[i].nodes[j].uuid + '"'
				if j != (len(constraints[i].nodes) -1):
					json += ',\n' 
			json += ']}]}'


		elif(type(constraints[i]) == Ban_fence):
			json += '"VMs" : [\n'
			json += '{ "name" : "VMs_' + str(numb) + '" ,\n'
			json += '"VMs": ['
			for j in range(len(constraints[i].vms)):
				json += '"' + constraints[i].vms[j].uuid + '"'
				if j != (len(constraints[i].vms) -1):
					json += ',\n'
			json += ']}],'

			json += '"Nodes" : [\n'
			json += '{ "name" : "Nodes_' + str(numb) + '" ,\n'
			json += '"Nodes": ['
			for j in range(len(constraints[i].nodes)):
				json += '"' + constraints[i].nodes[j].uuid + '"'
				if j != (len(constraints[i].nodes) -1):
					json += ',\n' 
			json += ']}]}'

		elif(type(constraints[i]) == Ressource_capacity):
			json += '"Nodes" : [\n'
			json += '{ "name" : "Nodes_' + str(numb) + '" ,\n'
			json += '"Nodes": ['
			for j in range(len(constraints[i].nodes)):
				json += '"' + constraints[i].nodes[j].uuid + '"'
				if j != (len(constraints[i].nodes) -1):
					json += ',\n' 
			json += ']}],'

			json += '"rcid" : "' + constraints[i].rc + '",\n'
			json += '"amount" : "' + str(constraints[i].amount) + '"'
			json += '}'

		elif(type(constraints[i]) == Running_capacity):
			json += '"Nodes" : [\n'
			json += '{ "name" : "Nodes_' + str(numb) + '" ,\n'
			json += '"Nodes": ['
			for j in range(len(constraints[i].nodes)):
				json += '"' + constraints[i].nodes[j].uuid + '"'
				if j != (len(constraints[i].nodes) -1):
					json += ',\n' 
			json += ']}],'
			json += '"amount" : "' + str(constraints[i].amount) + '"'
			json += '}'


		elif(type(constraints[i]) == Preserve):
			json += '"VMs" : [\n'
			json += '{ "name" : "VMs_' + str(numb) + '" ,\n'
			json += '"VMs": ['
			for j in range(len(constraints[i].vms)):
				json += '"' + constraints[i].vms[j].uuid + '"'
				if j != (len(constraints[i].vms) -1):
					json += ',\n'
			json += ']}],'
			json += '"rcid" : "' + constraints[i].rc + '",\n'
			json += '"amount" : "' + str(constraints[i].amount) + '"'
			json += '}'


		elif(type(constraints[i]) == Split):
			json += '"VMs" : [\n'
			for j in range(len(constraints[i].vms)):
				numb += 1
				json += '{ "name": "VMs_' + str(numb) + '" ,\n'
				json += '"VMs": ['
				for k in range(len(constraints[i].vms[j])):
					json += '"' + constraints[i].vms[j][k].uuid + '"'
					if k != (len(constraints[i].vms[j]) -1):
						json += ',\n'
				json += ']}'
				if j != (len(constraints[i].vms) -1):
					json += ',\n'
			json += ']}'
			


		elif(type(constraints[i]) == Among):
			json += '"VMs" : [\n'
			json += '{ "name" : "VMs_' + str(numb) + '" ,\n'
			json += '"VMs": ['
			for j in range(len(constraints[i].vm)):
				json += '"' + constraints[i].vm[j].uuid + '"'
				if j != (len(constraints[i].vm) -1):
					json += ',\n'
			json += ']}],'
			numb += 1
			json += '"Nodes" : [\n'
			for j in range(len(constraints[i].parts)):
				numb += 1
				json += '{ "name": "Nodes_' + str(numb) + '", \n'
				json += '"Nodes": ['
				for k in range(len(constraints[i].parts[j])):
					json += '"' + constraints[i].parts[j][k].uuid + '"'
					if k != (len(constraints[i].parts[j]) -1):
						json += ',\n'
				json += ']}'
				if j != (len(constraints[i].parts) -1):
					json += ',\n'
			json += ']}'


		elif(type(constraints[i]) == SplitAmong):
			json += '"VMs" : [\n'
			for j in range(len(constraints[i].vparts)):
				numb += 1
				json += '{ "name": "VMs_' + str(numb) + '" ,\n'
				json += '"VMs": ['
				for k in range(len(constraints[i].vparts[j])):
					json += '"' + constraints[i].vparts[j][k].uuid + '"'
					if k != (len(constraints[i].vparts[j]) -1):
						json += ',\n'
				json += ']}'
				if j != (len(constraints[i].vparts) -1):
					json += ',\n'
			json += '],'
			numb += 1
			json += '"Nodes" : [\n'
			for j in range(len(constraints[i].pparts)):
				numb += 1
				json += '{ "name": "nodes_' + str(numb) + '", \n'
				json += '"Nodes": ['
				for k in range(len(constraints[i].pparts[j])):
					json += '"' + constraints[i].pparts[j][k].uuid + '"'
					if k != (len(constraints[i].pparts[j]) -1):
						json += ',\n'
				json += ']}'
				if j != (len(constraints[i].pparts) -1):
					json += ',\n'
			json += ']}'
			
		if (i != len(constraints) -1):
			json += ', \n' 

	json += ']} \n '
	return json

g5k = Node("g5k", str(uuid.uuid4()))



g5k.children.append(Node("bordeaux", str(uuid.uuid4())))
g5k.children.append(Node("grenoble",str(uuid.uuid4())))
g5k.children.append(Node("lille", str(uuid.uuid4())))
g5k.children.append(Node("lyon", str(uuid.uuid4())))
g5k.children.append(Node("nancy", str(uuid.uuid4())))
g5k.children.append(Node("rennes", str(uuid.uuid4())))
g5k.children.append(Node("sophia", str(uuid.uuid4())))
g5k.children.append(Node("toulouse", str(uuid.uuid4())))

bordeaux = g5k.children[0]
grenoble = g5k.children[1]
lille = g5k.children[2]
lyon = g5k.children[3]
nancy = g5k.children[4]
rennes = g5k.children[5]
sophia = g5k.children[6]
toulouse = g5k.children[7]


bordeaux.children.append(makeCluster("bordeplage", 51))
bordeaux.children.append(makeCluster("bordereau", 93))
bordeaux.children.append(makeCluster("borderline", 10))

grenoble.children.append(makeCluster("adonis", 10))
grenoble.children.append(makeCluster("edel", 72))
grenoble.children.append(makeCluster("genepi", 34))

lille.children.append(makeCluster("chimint", 3))
lille.children.append(makeCluster("chirloute", 8))
lille.children.append(makeCluster("chicon", 2))
lille.children.append(makeCluster("chiqchint", 5))

lyon.children.append(makeCluster("sagittaire", 79))
lyon.children.append(makeCluster("taurus", 16))
lyon.children.append(makeCluster("orion", 4))
lyon.children.append(makeCluster("hercule", 4))
lyon.children.append(makeCluster("capricorne", 56))

nancy.children.append(makeCluster("graphene", 144))
nancy.children.append(makeCluster("grifon", 92))

rennes.children.append(makeCluster("parapluie", 40))
rennes.children.append(makeCluster("parapide", 25))
rennes.children.append(makeCluster("paradent", 64))

sophia.children.append(makeCluster("azur", 49))
sophia.children.append(makeCluster("helios", 56))
sophia.children.append(makeCluster("sol", 50))

toulouse.children.append(makeCluster("chocolatine", 51))
toulouse.children.append(makeCluster("chocapique", 93))

constraints= []
makeConstraints()
'''
for i in range(len(constraints)):
	print(constraints[i].name + " " + constraints[i].id + " " + str(constraints[i].satisfy))
	stri= "noeud associer: " 
	for j in range(len(constraints[i].nodes)):
		stri += constraints[i].nodes[j].name + " "
	print(stri)

for i in range(len(constraints)):
	for j in range(len(constraints[i].nodes)):
		constraints[i].nodes[j].constraints.append((constraints[i].name, constraints[i].id, constraints[i].satisfy))
	'''

def finalJSON(root):
	#return '{ \n "name" : "struct", "children" : [ \n' + jsonGen(root) + '\n, \n' + constraintsGen() + ']\n}'
	return '{  "struct" : \n' + jsonGen(root) + '\n, "const" : \n' + constraintsGen() + '\n}'
	#return constraintsGen()

mock = open("g5kMock.json", "w")
mock.write(finalJSON(g5k))
mock.close()



