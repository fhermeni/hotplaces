
import os
import random
import uuid

nodelist = []
class Node:

	def __init__(self, name, uuid, nodeType="Site"):
		self.name = name
		self.uuid= uuid
		self.children = []
		self.CPU = 0
		self.RAM = 0
		self.DiskSpace = 0
		self.ratioCPU= 0
		self.ratioRAM=0
		self.ratioDiskSpace=0
		self.nodeType= nodeType
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

	while(n in nodelist and len(node.children) != len(nodelist) ):
		n = findRandomNode(node, nodeType)

	if len(node.children) == len(nodelist):
		print("Overbooked")
		#return None
	nodelist.append(n)
	return n

def getRandChild():
	prof = random.randint(0, 2)
	child = g5k
	for j in range(prof):
		child = child.children[random.randint(0, len(child.children)-1)]
	return child
	
def makeConstraints():
	nbNC = random.randint(1, 20)
	nbVMC = random.randint(1, 20)
	nbBan_fence = random.randint(1, 10)
	nbRC = random.randint(1, 10);
	global nodelist

	for i in range(nbVMC):
		child = getRandChild()

		name = "VMC" +str(i)
		id= random.choice([ "Gather", "Killed", "Lonely", "Ready", "Root", "Running", "SequentialVMTransitions", "Sleeping", "Spread"])
		vms=[]
		vms.append(findUniqueNode(child, "vm"))
		again=1
		while(again!=0) and (len(nodelist) < len(child.children)):
			vms.append(findUniqueNode(child, "vm"))
			again =random.randint(0,5)
		constraints.append(VMConstraint(name, id, vms))
		nodelist = []


	
		
	for i in range(nbNC):
		child = getRandChild()
		name = "NC" +str(i)
		id= random.choice([ "Offline", "Online", "Quarantine"])
		nodes=[]
		nodes.append(findUniqueNode(child, "node"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			nodes.append(findUniqueNode(child, "node"))
		constraints.append(NodeConstraint(name, id, nodes))
		nodelist = []

	
	for i in range(nbBan_fence):
		child = getRandChild()
		id = random.choice([ "Ban", "Fence" ])
		name = id + str(i)
		vms = []
		nodes = []
		nodes.append(findUniqueNode(child, "node"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			nodes.append(findUniqueNode(child, "node"))
		nodelist = []

		vms.append(findUniqueNode(child, "vm"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			vms.append(findUniqueNode(child, "vm"))

		constraints.append(Ban_fence(name, id, vms, nodes))
		nodelist = []

	
	nbRC = random.randint(1, 10);
	for i in range(nbRC):
		child = getRandChild()
		id = random.choice([ "CumulatedResourceCapacity", "SingleResourceCapacity", "Overbook"])
		name = id + str(i)
		node = []
		amount = 0
		node.append(findUniqueNode(child, "node"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			node.append(findUniqueNode(child, "node"))
		rc = random.choice([ "CPU", "RAM", "DiskSpace"])
		if(id == "Overbook"):
			char = str(random.randint(1,9)) + "."
			for j in range(3):
				char += str(random.randint(1,9))
			
			amount = char
		else:
			amount = random.randint(0, 100)
		constraints.append(Ressource_capacity(name, id, node, rc, amount))
		nodelist = []

	
	nbRC = random.randint(1, 10);

	for i in range(nbRC):
		child = getRandChild()
		id = random.choice([ "CumulatedRunningCapacity", "SingleRunningCapacity"])
		name = id + str(i)
		node = []
		node.append(findUniqueNode(child, "node"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			node.append(findUniqueNode(child, "node"))
		amount = random.randint(0, 100)
		constraints.append(Running_capacity(name, id, node, amount))
		nodelist = []

	
	nbRC = random.randint(1, 10);
	for i in range(nbRC):
		child = getRandChild()
		id = "Preserve"
		name = id + str(i)
		vm = []
		vm.append(findUniqueNode(child, "vm"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			vm.append(findUniqueNode(child, "vm"))
		rc = random.choice([ "CPU", "RAM", "DiskSpace"])
		amount = random.randint(0, 100)
		constraints.append(Preserve(name, id, vm, rc, amount))
		nodelist = []

	
	nbRC = random.randint(1, 10);
	for i in range(nbRC):
		child = getRandChild()
		id = "Split"
		name = id + str(i)
		vms = []
		vm = []
		vm.append(findUniqueNode(child, "vm"))
		while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
			vm.append(findUniqueNode(child, "vm"))
		vms.append(vm)
		vm = []
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			vm.append(findUniqueNode(child, "vm"))
			while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
				vm.append(findUniqueNode(child, "vm"))
			vms.append(vm)
			vm = []
		constraints.append(Split(name, id, vms))
		nodelist = []

	
	nbRC = random.randint(1, 10);
	for i in range(nbRC):
		child = getRandChild()
		id = "Among"
		name = id + str(i)
		node = []
		vm = []
		nodes = []
		vm.append(findUniqueNode(child, "vm"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			vm.append(findUniqueNode(child, "vm"))
		
		node = []
		nodelist = []
		#child = getRandChild()
		node.append(findUniqueNode(child, "node"))
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			node.append(findUniqueNode(child, "node"))
			while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
				node.append(findUniqueNode(child, "node"))
			nodes.append(node)
			node = []
		constraints.append(Among(name, id, vm, nodes))
		nodelist = []

	
	nbRC = random.randint(1, 10);
	for i in range(nbRC):
		child = getRandChild()
		id = "SplitAmong"
		name = id + str(i)
		vm = []
		vms = []
		node = []
		nodes = []
		node.append(findUniqueNode(child, "node"))
		while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
			node.append(findUniqueNode(child, "node"))
		nodes.append(node)
		node = []
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			node.append(findUniqueNode(child, "node"))
			while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
				node.append(findUniqueNode(child, "node"))
			nodes.append(node)
			node = []
		nodelist = []
		vm.append(findUniqueNode(child, "vm"))
		while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
			vm.append(findUniqueNode(child, "vm"))
		vms.append(vm)
		vm = []
		while(random.randint(0,5)!=0 and (len(nodelist) < len(child.children))):
			vm.append(findUniqueNode(child, "vm"))
			while(random.randint(0, 6) != 0 and (len(nodelist) < len(child.children))):
				vm.append(findUniqueNode(child, "vm"))
			vms.append(vm)
			vm = []
		constraints.append(SplitAmong(name, id, vms, nodes))
		nodelist = []
		
def makeCluster(id, nb):


	cluster = Node(id,str(uuid.uuid4()), "Cluster" )
	#print(cluster.pCPU)
	for i in range(nb):
		node = Node(id + "-" + str(i+1), str(uuid.uuid4()))
		node.nodeType="node"
		node.CPU =tmpCPU =  random.randint(1,32)
		node.RAM =tmpRAM= random.randint(1024,65536)
		node.DiskSpace= tmpDisk = random.randint(1000000,100000000)
		nbVms = random.randint(1, 20)
		cpucons = 0
		ramcons = 0
		diskcons = 0


		for j in range(nbVms):
			uuidVM=str(uuid.uuid4())
			vm = Node(uuidVM,uuidVM)
			vm.nodeType="vm"
			#add random virtual ressources

			vm.RAM = random.randint(512, 8192)
			vm.CPU = random.randint(1, 8)
			vm.DiskSpace = random.randint(2000, 100000)
			'''
			else:
				r = int(tmpRAM * random.random())
				if r > 1 :
					vm.RAM = random.randint(1,r)
				else:
					vm.RAM = 0

				r = int(tmpDisk * random.random())
				if r > 1:
					vm.DiskSpace = random.randint(1, r)
				else :
					vm.DiskSpace = 0
				
				r = r = int(tmpCPU * random.random())
				if r > 2:
					vm.CPU= random.randint(1, r)
				else:
					vm.CPU = 1
			'''
			

			#remove ressource of new vm at node
			tmpRAM = tmpRAM - vm.RAM
			tmpDisk = tmpDisk - vm.DiskSpace
			tmpCPU = tmpCPU - vm.CPU

			cpucons += vm.CPU
			ramcons += vm.RAM
			diskcons += vm.DiskSpace
			#add vm at node
			node.children.append(vm)

		if dice(1, 20):
			node.CPU = cpucons - random.randint(0, cpucons)
		else:
			node.CPU = cpucons + random.randint(0, cpucons)

		if dice(1, 20):
			node.RAM = ramcons - random.randint(0, ramcons)
		else:
			node.RAM = ramcons + random.randint(0, ramcons)

		if dice(1, 20):
			node.DiskSpace = diskcons - random.randint(0, diskcons)
		else:
			node.DiskSpace = diskcons + random.randint(0, diskcons)


		cluster.children.append(node)
	return cluster

def dice(num, denum):
	i = random.randint(1, denum)
	return i <= num

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

# no = findRandomNode(g5k, "node")
# print(no.name)

mock = open("g5kMock.json", "w")
mock.write(finalJSON(g5k))
mock.close()



