// 实现：在实现一个算法的时候，首先要进行一个抽象，抽象成一个数组，数组，和需要查找的值，返回index和-1。在进行下一轮的思考

// 二分查找：需要保证数组是有序的

function bsearch(A, x) {
  let l = 0, // 查找范围的左边界
    r = A.length - 1, // 查找范围的右边界
    guess // 猜想位置，可以先不赋值
  while (l <= r) { // 循环的维持条件，l <= r表示查找范围中还有元素
    guess = Math.floor((l + r) / 2)
    // 循环不变式，guess等于 l,r的中间位置
    // l:查找范围左  r：查找范围右
    if (A[guess] === x) return guess // 如果猜想位置是查找元素，就返回这个位置 
    else if (A[guess] > x) r = guess - 1 // 如果猜想位置的元素大于查找元素，那么更新右边界，查找范围在左边
    else l = guess + 1 // 如果猜想位置的元素小于查找元素，那么更新左边界，查找范围在右边
    // 新的循环不变式
    // l:新查找范围左  r：新查找范围右
  }
  return -1;
}

const A = [3, 5, 19, 22, 25, 33, 45, 47, 57, 66, 71, 78]
console.log(bsearch(A, 88));
console.log(bsearch(A, 68));
console.log(bsearch(A, 22));
