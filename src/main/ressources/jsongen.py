
import os
import random
import uuid

class Node:

	def __init__(self, name):
		self.name = name
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

def makeCluster(id, nb):
	cluster = Node(id)
	#print(cluster.pCPU)
	for i in range(nb):
		node = Node(id + "-" + str(i+1))
		node.ratio = 0.1
		node.pCPU =  random.randint(1,4)
		node.pRAM = random.randint(1,100)
		node.pDiskSpace = random.randint(100,10000)
		tmp = node.pDiskSpace
		#for x in range(10):
		while(tmp>10 or len(node.children) < 20):
			#node.children.append(Node("VM" + str(x+1)))
			vm = Node("uuid" + str(uuid.uuid4()))
			print(str(tmp))
			rand = random.randint(10,tmp)
			#print("boucle1 " + str(tmp) + ' ' + str(rand))
			while(tmp < rand and tmp > 10):
				rand = random.randint(10,tmp)
			#	print("boucle2 " + str(tmp) + ' ' + str(rand))

			#print("sortieB2")	
			vm.vDiskSpace = rand
			tmp = tmp - rand



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
			#root.vCPU = random.randint(1,tmp)

			#root.vRAM = float(tmp2 * ratio)
			#root.vRAM = random.randint(1,100)
			#tmp4 += root.vRAM
			#if(tmp4 >= root.pRAM):
				#ressources libre
			#	root.vRAM = 0
			#	root.vDiskSpace = 0

			#else:
			#root.vDiskSpace = int(tmp3 * ratio)
			#rcs free

			json +=', "vCPU" : ' + str(root.vCPU) 
			json +=', "vRAM" : ' + str(root.vRAM) 
			json += ', "vDiskSpace" :' + str(root.vDiskSpace)
			#json += ', "uuid" :' + str(root.uuid)
		elif root.children[0].children == []:
			json +=', "pCPU" : ' + str(root.pCPU)
			#print(root.pCPU)
			json +=', "pRAM" : ' + str(root.pRAM) 
			json += ', "pDiskSpace" :' + str(root.pDiskSpace)
	if root.children != []:
		json += ', \n "children" : ['
		for i in range(len(root.children)):
			json += jsonGen(root.children[i]) + ', '
			#print(root.children[i].vCPU)
		json = json[:len(json)-2]
		json += '] \n'
	json += '}'
	return json





g5k = Node("g5k")


g5k.children.append(Node("bordeaux"))
g5k.children.append(Node("grenoble"))
g5k.children.append(Node("lille"))
g5k.children.append(Node("lyon"))
g5k.children.append(Node("nancy"))
g5k.children.append(Node("rennes"))
g5k.children.append(Node("sophia"))
g5k.children.append(Node("toulouse"))

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



