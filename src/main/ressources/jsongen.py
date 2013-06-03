
import os
import random
import uuid


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
		self.satisfy= bool(random.randint(0,1))
		
class VMConstraint:

	def __init__(self, name, id, vms):
		self.name=name
		self.id=id
		self.nodes=vms
		self.satisfy= bool(random.randint(0,1))

def findRandomNode(node, nodeType):
	finalNode= node
	while(finalNode.nodeType!=nodeType and len(finalNode.children)>0):
		finalNode= finalNode.children[random.randint(0, len(finalNode.children)-1)]
	
	
	if(finalNode.nodeType!= nodeType or finalNode.name =='free'):
		print(finalNode.nodeType)
		finalNode = findRandomNode(node, nodeType) 
	
	return finalNode
	
	
def makeConstraints():
	nbNC = random.randint(1, 20)
	nbVMC = random.randint(1, 20)
	for i in range(nbVMC):
		name = "VMC" +str(i)
		id= random.choice([ "Among", "Gather", "Killed", "Lonely", "Ready", "Root", "Running", "SequentialVMTransitions", "Sleeping", "Split", "Spread"])
		vms=[]
		while(random.randint(0,5)!=0):
			vms.append(findRandomNode(g5k, "vm"))
		constraints.append(VMConstraint(name, id, vms))
		
		
	for i in range(nbNC):
		name = "NC" +str(i)
		id= random.choice([ "Offline", "Online", "Quarantine"])
		nodes=[]
		while(random.randint(0,5)!=0):
			nodes.append(findRandomNode(g5k, "node"))
		constraints.append(NodeConstraint(name, id, nodes))
	


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
			vm = Node(str(uuid.uuid4()), str(uuid.uuid4()))
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
			
			node.children.append(free)



		cluster.children.append(node)
	return cluster


def printNode(root):
	if root.children != []:
		for i in range(len(root.children)):
			printNode(root.children[i])

def jsonGen(root) :


	
	json = '{ "name" : "' + root.name + '" '
	json +=', "UUID" : ' + str(root.uuid)
	if(root.name != "g5k"):
		if root.children == []:

			json +=', "CPU" : ' + str(root.CPU) 
			json +=', "RAM" : ' + str(root.RAM) 
			json += ', "DiskSpace" :' + str(root.DiskSpace)
			json += ', "constraints" : ['
			for i in range(len(root.constraints)):
				json+= '{ "name" : ' + root.constraints[i][0] + ', "satisfy" : ' +  str(root.constraints[i][2]) + '}, '
			json += '] '
		elif root.children[0].children == []:
			json +=', "CPU" : ' + str(root.CPU)
			json +=', "RAM" : ' + str(root.RAM) 
			json += ', "DiskSpace" :' + str(root.DiskSpace)
			json +=', "rCPU" : ' + str(root.ratioCPU)
			json +=', "rRAM" : ' + str(root.ratioRAM)
			json +=', "rDisk" : ' + str(root.ratioDiskSpace)
			json += ', "constraints" : ['
			for i in range(len(root.constraints)):
				json+= '{ "name" : ' + root.constraints[i][0] + ', "satisfy" : ' +  str(root.constraints[i][2]) + '}, '
			json += '] '
			



	if root.children != []:
		json += ', \n "children" : ['
		for i in range(len(root.children)):
			json += jsonGen(root.children[i]) + ', '
		json = json[:len(json)-2]
		json += '] \n'
	json += '}'
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
for i in range(len(constraints)):
	print(constraints[i].name + " " + constraints[i].id + " " + str(constraints[i].satisfy))
	stri= "noeud associer: " 
	for j in range(len(constraints[i].nodes)):
		stri += constraints[i].nodes[j].name + " "
	print(stri)

for i in range(len(constraints)):
	for j in range(len(constraints[i].nodes)):
		constraints[i].nodes[j].constraints.append((constraints[i].name, constraints[i].id, constraints[i].satisfy))
	
	

mock = open("g5kMock.json", "w")
mock.write(jsonGen(g5k))
mock.close()



