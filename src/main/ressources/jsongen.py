
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
		self.pCPU = 0
		self.pRAM = 0
		self.pDiskSpace = 0
		self.vCPU = 0
		self.vRAM = 0
		self.vDiskSpace = 0
		self.ratioCPU= 0
		self.ratioRAM=0
		self.ratioDiskSpace=0
		


def makeCluster(id, nb):
	cluster = Node(id,str(uuid.uuid4()) )
	#print(cluster.pCPU)
	for i in range(nb):
		node = Node(id + "-" + str(i+1), str(uuid.uuid4()))
		node.ratioDiskSpace = random.randint(1,5)
		node.ratioRAM= random.randint(1,5)
		node.ratioCPU= random.randint(1,16)
		node.pCPU =tmpCPU =  random.randint(1,32)
		node.pRAM =tmpRAM= random.randint(1024,65536)
		node.pDiskSpace= tmpDisk = random.randint(1000000,100000000)
		
		while(tmpCPU>=1.0/node.ratioCPU and tmpRAM>=1.0/node.ratioRAM and tmpDisk >=100000.0/node.ratioDiskSpace and len(node.children) < 20):
			vm = Node(str(uuid.uuid4()), str(uuid.uuid4()))
			#add random virtual ressources
			vm.vRAM = random.randint(1,int(tmpRAM*node.ratioRAM))
			vm.vDiskSpace = random.randint(100000, int(tmpDisk*node.ratioDiskSpace))
			vm.vCPU= random.randint(1, int(tmpCPU* node.ratioCPU))
			#remove ressource of new vm at node
			tmpRAM = tmpRAM - vm.vRAM*1.0/node.ratioRAM
			tmpDisk = tmpDisk - vm.vDiskSpace*1.0 /node.ratioDiskSpace
			tmpCPU = tmpCPU - vm.vCPU*1.0/ node.ratioCPU

			#add vm at node
			node.children.append(vm)
		#add space of free ressources
		if(tmpDisk >0 or tmpRAM>0 or tmpCPU>0):
			#add "vm" free
			free = Node("free", str(uuid.uuid4()))
			#add free ressources
			free.vDiskSpace = tmpDisk * node.ratioDiskSpace
			free.vRAM = tmpRAM * node.ratioRAM
			free.vCPU = tmpCPU * node.ratioCPU
			
			node.children.append(free)



		cluster.children.append(node)
	return cluster


def printNode(root):
	if root.children != []:
		for i in range(len(root.children)):
			printNode(root.children[i])

def jsonGen(root) :


	
	json = '{ "name" : "' + root.name + '" '
	if(root.name != "g5k"):
		if root.children == []:

			json +=', "CPU" : ' + str(root.vCPU) 
			json +=', "RAM" : ' + str(root.vRAM) 
			json += ', "DiskSpace" :' + str(root.vDiskSpace)
		elif root.children[0].children == []:
			json +=', "CPU" : ' + str(root.pCPU)
			json +=', "RAM" : ' + str(root.pRAM) 
			json += ', "DiskSpace" :' + str(root.pDiskSpace)
			json +=', "rCPU" : ' + str(root.ratioCPU)
			json +=', "rRAM" : ' + str(root.ratioRAM)
			json +=', "rDisk" : ' + str(root.ratioDiskSpace)
			



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


mock = open("g5kMock.json", "w")
mock.write(jsonGen(g5k))
mock.close()



