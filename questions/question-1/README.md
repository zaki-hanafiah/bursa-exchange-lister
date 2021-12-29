# Question 1

You've been tasked with identifying a string that contains the word "ironman" (case insensitive). You've written the following code:

```Javascript
function validateString(str) {
  if (!str.toLowerCase().indexOf('ironman')) {
    throw new Error('String does not contain ironman');
  }
}
```

QA has come to you and said that this works great for strings like "I love ironman", but an exception is generated for strings like "Ironman is awesome!", which should not happen.
Explain why this occurs, and show how you would solve this issue (you must use indexOf() in your answer)

# Answer

**Details**
 - This is because `indexOf` is returning the integer `0` due to the position of the word (“Ironman” is at the beginning). 
 - `0` if numerical, is considered a false boolean, thus failing the condition check in the solution above although the word “Ironman” exists in the string. 
 - The correct way to check if the string does not contain ironman is by changing the condition to check if `indexOf` returns `-1` which indicates that no match is found in the string.

*Correct Code below:*

```Javascript
function validateString(str) {
    if (str.toLowerCase().indexOf('ironman') === -1) {
        throw new Error('String does not contain ironman');
    }    
}
```

[Back to Main](../../README.md)