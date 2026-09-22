import { mk } from "./helper";

const p = mk("prefix-sums");

export const prefixSums = [
  p("find-pivot-index", "Find Pivot Index", "prefix-sum", "easy", 20, ["array-traversal"]),
  p("range-sum-query-immutable", "Range Sum Query - Immutable", "prefix-sum", "easy", 20, ["array-traversal"]),
  p("contiguous-array", "Contiguous Array", "prefix-sum", "medium", 40, ["hash-map"]),
  p("continuous-subarray-sum", "Continuous Subarray Sum", "prefix-sum", "medium", 40, ["hash-map"]),
  p("path-sum-iii", "Path Sum III", "prefix-sum", "medium", 45, ["tree-traversal"]),
  p("product-of-array-except-self", "Product of Array Except Self", "prefix-sum", "medium", 35, ["array-traversal"]),
  p("range-sum-query-2d-immutable", "Range Sum Query 2D - Immutable", "prefix-sum", "medium", 40, ["array-traversal"]),
  p("subarray-sum-equals-k", "Subarray Sum Equals K", "prefix-sum", "medium", 35, ["hash-map"]),
  p("subarray-sums-divisible-by-k", "Subarray Sums Divisible by K", "prefix-sum", "medium", 40, ["hash-map"]),
];
