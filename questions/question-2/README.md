# Question 2

Considering the following ES5 code in a page that has ten buttons:

```Javascript
(function(){
  for (var i = 0, l = 10; i < l; i++) {
    document.getElementById('button-' + i).onclick = function () {
      console.log('Line %s', i);
    };
  }
})();
```

What is the bug in this code? Explain how to fix it in both plain ES5 and ES6+.

# Answer

**Details**
- The problem with the solution above is that the variable `i` will always return the last index. 
- The variable `i` becomes a global variable due to hoisting as `var` keyword was used, so it will always get the last iteration value.  
- The resulting output will be printed as `‘Line %s”, 10` due to this. 
- To resolve this with the same code method / structure as above, we can use closures to ensure the variables are scoped and have the function use private variables.

*ES5 Solution*

```Javascript
var l = [...Array(10).keys()]

l.forEach(function (_, i) {
  document.getElementById('button-' + i).onclick = function () {
    console.log('Line %s', i)
  }
})
```

**Explanation**
1. For this solution, first we use the spread operator and fill the Array with keys with the length of N(N being 10). 
2. Then we use the `forEach` method to iterate through the Array. 
3. Finally, `onclick` function is then assigned with each item index (although the value is returned first, since we’re using index in the original method, this solution skips the value with underscore and uses the idx or index instead).

*ES6 Solution*

```Javascript
const l = [...Array(10).keys()]

for (let i of l) {
  document.getElementById('button-' + i).onclick = () => {
    console.log('Line %s', i)
  }
}
```

**Explanation**
1. For this solution, we declare the `l` variable as const and use the same spread operator as the ES5 solution above (we use const instead of let as `l` is never re-assigned). 
2. Then we use `for-of` loop method introduced in ES6 and iterate through each item. 
3. Finally, `onclick` function is appended via arrow function to the button element.

[Back to Main](../../README.md)