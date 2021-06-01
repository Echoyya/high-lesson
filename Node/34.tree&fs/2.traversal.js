class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.left = null
    this.right = null
  }
}

class Tree {
  constructor() {
    this.root = null
  }
  add(element) {
    if (this.root === null) {
      return this.root = new Node(element)
    }
    let currentNode = this.root
    let parent;
    let compare;
    while (currentNode) {
      compare = currentNode.element < element
      parent = currentNode
      if (compare) {
        currentNode = currentNode.right
      } else {
        currentNode = currentNode.left
      }
    }
    let node = new Node(element)
    if (compare) {
      parent.right = node
    } else {
      parent.left = node
    }
  }
  // 先序遍历(先访问根节点、前序遍历左子树、前序遍历右子树)
  preorderTraversal() {
    function traversal(node) {
      if (node === null) {
        return
      }
      console.log(node.element); // 先访问根节点
      traversal(node.left) // 在访问左子树
      traversal(node.right) // 在访问右子树
    }
    traversal(this.root)
  }
  // 中序遍历 (中序遍历左子树、根节点、中序遍历右子树) 中序遍历默认从小到大或者从大到小。
  inorderTraversal() {
    function traversal(node) {
      if (node === null) {
        return
      }
      traversal(node.left)
      console.log(node.element);
      traversal(node.right)
    }
    traversal(this.root)
  }
  // 后续遍历 (后序遍历左子树、后续遍历右子树、根节点)
  postorderTraversal() {
    function traversal(node) {
      if (node === null) {
        return
      }
      traversal(node.left)
      traversal(node.right)
      console.log(node.element);
    }
    traversal(this.root)
  }
  // 层序遍历 (从上到下，从左到右依次访问每一个节点)
  levelorderTraversal(cb) {
    let stack = [this.root]
    let index = 0;
    let currentNode;
    while (currentNode = stack[index++]) {
      cb(currentNode)
      if (currentNode.left) {
        stack.push(currentNode.left)
      }
      if (currentNode.right) {
        stack.push(currentNode.right)
      }
    }
  }
  // 翻转二叉树   原二叉树镜面
  invertTree() {
    let stack = [this.root]
    let index = 0;
    let currentNode;
    while (currentNode = stack[index++]) {
      console.log(currentNode.element);
      let temp = currentNode.right
      currentNode.right = currentNode.left
      currentNode.left = temp
      if (currentNode.left) {
        stack.push(currentNode.left)
      }
      if (currentNode.right) {
        stack.push(currentNode.right)
      }
    }
  }
  invertTree2() {
    function invertTree(currentNode) {
      if(currentNode === null){
        return
      }
      console.log(currentNode.element);
      let temp = currentNode.right
      currentNode.right = currentNode.left
      currentNode.left = temp
      invertTree(currentNode.left)
      invertTree(currentNode.right)
    }
    invertTree(this.root)
  }
}

let tree = new Tree();

[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item)
})
// console.dir(tree, {
//   depth: 100
// });
// tree.preorderTraversal();      // 先：10,8,6,19,15,22,20
// tree.inorderTraversal();       // 中：6,8,10,15,19,20,22
// tree.postorderTraversal();     // 后：6,8,15,20,22,19,10
// tree.levelorderTraversal();    // 层：10,8,19,6,15,22,20

// tree.levelorderTraversal((node) => {
  //   node.element *= 2
  // });
  
// tree.invertTree();    // 翻：10,19,8,22,15,6,20 反转后的层序遍历
tree.invertTree2();    // 翻：10,19,8,22,15,6,20 反转后的先序遍历
