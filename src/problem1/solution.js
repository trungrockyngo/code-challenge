/**
 * Approach 1: Iterative Loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
var sum_to_n_a = function(n) {
    if (n <= 0) return 0;
    
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total += i;
    }
    return total;
};

/**
 * Approach 2: Mathematical Formula
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
var sum_to_n_b = function(n) {
    if (n <= 0) return 0;
    return (n * (n + 1)) / 2;
};

/**
 * Approach 3A: Functional Array Methods
 * Generates an array of length n and accumulates the sum using reduce.
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 **/
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return Array.from({ length: n }, (_, i) => i + 1)
        .reduce((sum, num) => sum + num, 0);
};
