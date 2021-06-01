// 数组，栈，队列默认都是线型结构
// 常见的树形结构有：文件目录，DOM结构，路由配置等


// 一般从数组中检索数据的时间复杂度是O(n),如果数据有序，则可以采用二分查找的方式来检索数据，复杂度为:O(logn),
// 但是如果操作数组中的数据(增加、删除)默认数组会产生塌陷。时间复杂度为O(n)

// 二叉搜索树 :查询、增加、删除复杂度最坏为O(logn)，特性是当它的左子树不空，则左子树上所有结点的值均小于它的根结点的值，当右子树不空，则右子树上所有结点的值均大于它的根结点的值。

// 也称为：二叉查找树或二叉排序树

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
    let currentNode = this.root // 更新节点
    let parent; // 放在谁的身上
    let compare; // 放左还是右
    while (currentNode) {
      compare = currentNode.element < element
      parent = currentNode // 遍历前 先记录节点
      if (compare) { // 比当前节点大
        // 更新当前节点为当前节点的右节点
        currentNode = currentNode.right
      } else {
        // 更新当前节点为当前节点的左节点
        currentNode = currentNode.left
      }
    }
    let node = new Node(element)
    if (compare) {
      parent.right = node // parent 不为null 的前一个
    } else {
      parent.left = node
    }
    // if(currentNode.element < element){  // 比根节点大
    //   currentNode.right = new Node(element)
    // }else{    // 比根节点小
    //   currentNode.left = new Node(element)
    // }
  }
}

let tree = new Tree();

[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item)
})
console.dir(tree, {
  depth: 100
});