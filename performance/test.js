// Macro Queue：script, s1, s2, s3

// Micro Queue：p1, p2, p3

// p1,s1,p2,p3,s2,s3

// tick 1: script, p1
// tick 2: s1, p2, p3
// tick 3: s2
// tick 4: s3

setTimeout(function Macro1() {
  console.log("s1");
  Promise.resolve().then(function micro2() {
    console.log("p2");
  });

  Promise.resolve().then(function micro3() {
    console.log("p3");
  });
});

Promise.resolve().then(function micro1() {
  console.log("p1");
  setTimeout(function Macro2() {
    console.log("s2");
  });
  setTimeout(function Macro3() {
    console.log("s3");
  });
});
