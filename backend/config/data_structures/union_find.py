class UnionFind:
    def __init__(self):
        # parent[x] = parent of x
        # rank[x] = tree rank
        # size[x] = size of the component whose root is x
        self.parent = {}
        self.rank = {}
        self.size = {}

    def add(self, x):
        # ensure an element exists in the structure
        if x not in self.parent:
            self.parent[x] = x
            self.rank[x] = 0
            self.size[x] = 1

    def find(self, x):
        # path-compressed find
        if x not in self.parent:
            self.add(x)
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        # union by rank + update size
        root_a = self.find(a)
        root_b = self.find(b)

        if root_a == root_b:
            return False

        if self.rank[root_a] < self.rank[root_b]:
            self.parent[root_a] = root_b
            self.size[root_b] += self.size[root_a]
        elif self.rank[root_a] > self.rank[root_b]:
            self.parent[root_b] = root_a
            self.size[root_a] += self.size[root_b]
        else:
            self.parent[root_b] = root_a
            self.rank[root_a] += 1
            self.size[root_a] += self.size[root_b]

        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)

    def component_size(self, x):
        root = self.find(x)
        return self.size[root]

    def get_components(self):
        # returns {root_uid: [uids in that cluster]}
        groups = {}
        for element in self.parent.keys():
            root = self.find(element)
            groups.setdefault(root, []).append(element)
        return groups