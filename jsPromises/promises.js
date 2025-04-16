// // making promises
// const promise = new Promise((resolve, reject) => {
//     const success = false;

//     if(success) {
//         resolve("Resolved");
//     }
//     else {
//         reject("Rejected");
//     }
// })




// // consuming promises
// promise.then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error);
// })




// // Promises with setTimeout
// const delay = (ms) => {
//     return new Promise((resolve, reject) => {
//         reject("yoooo");
//     })
// }
// const delay = (ms) => {
//     return new Promise((resolve) => {
//         resolve("yoooo");
//     })
// }
// const delay = (ms) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     })
// }

// delay(2000).then((returnedData="default") => {
//     console.log("returned: ", returnedData);
//     console.log("2 seconds passed");
// }).catch((error) => {
//     console.log('catch block');
//     console.log(error);
// })




// // 5. Chaining Promises
// const user = {
//     id: 1,
//     name: "ssl",
//     posts: [1,2,3]
// }

// const fetchUser = () => new Promise((res, rej) => res(user));
// const fetchPosts = (id) => new Promise((res, rej) => res(user.posts)); // filter by user id
// const displayPost = (post) => new Promise((res, rej) => res(user.posts[post]));

// fetchUser()
//     .then((user) => {
//         console.log(Object.entries(user)); // [ [ 'id', 1 ], [ 'name', 'ssl' ], [ 'posts', [ 1, 2, 3 ] ] ]
//         return fetchPosts(user.id);
//     })
//     .then((posts) => {
//         console.log('posts: ', posts); // posts:  [ 1, 2, 3 ]
//         return displayPost(0);
//     })
//     .then((post) => {
//         console.log('post: ', post); // post:  1
//     })
//     .catch((error) => {
//         console.log(error);
//     })





// // 6. Promise Static Methods
// `Promise.all([])`
Promise.all([fetch1(), fetch2()]) // array of async ops
  .then(([res1, res2]) => console.log(res1, res2)) // array of resolvers
  .catch(console.error);


// Promise.race([])
// Returns the first settled promise (fulfilled or rejected).

// Promise.allSettled([])
// Waits for all to settle and gives result of each.

// can be used to send mutiple req's and get response if it is uncertain
// Promise.any([])
// Returns the first fulfilled one (ignores rejections).





// // 7. async/await – A Cleaner Way
// async function getData() {
//     try {
//       const res = await fetch("https://api.com/data");
//       const json = await res.json();
//       console.log(json);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   }
  



// // 8. Error Handling with try...catch
// async function safeCall() {
//     try {
//       const res = await riskyPromise();
//       console.log("Success:", res);
//     } catch (error) {
//       console.error("Caught:", error);
//     }
//   }

// For parallel execution:
// const [a, b] = await Promise.all([promise1(), promise2()]);



// // 🧩 9. Advanced Use Cases
// async function retry(fn, retries = 3) {
//     for (let i = 0; i < retries; i++) {
//       try {
//         return await fn();
//       } catch (err) {
//         if (i === retries - 1) throw err;
//       }
//     }
// }



//// 🛑 Timeout a Promise
// function withTimeout(promise, ms) {
//     const timeout = new Promise((_, reject) =>
//       setTimeout(() => reject("⏱ Timeout"), ms)
//     );
//     return Promise.race([promise, timeout]);
//   }



// ADVANCE:
const generateAllNotes = async () => {
    setLoading(true);
    const json = localStorage.getItem("roadmapJSON");
    if (!json) return;
  
    const roadmap = JSON.parse(json);
  
    const phaseEntries = Object.entries(roadmap);
  
    const notePromises = phaseEntries.map(async ([key, phase]) => {
      const res = await fetch("/api/generateNotes", {
        method: "POST",
        body: JSON.stringify({ phase }),
      });
      const data = await res.json();
      return {
        phaseKey: key,
        title: phase.name,
        notes: data.response,
      };
    });
  
    const allNotes = await Promise.all(notePromises);
  
    const finalNotesMarkdown = allNotes
      .map(({ title, notes }) => `## ${title}\n\n${notes}`)
      .join("\n\n");
  
    console.log("🎉 All Notes Generated:", finalNotesMarkdown);
    setGeneratedNotes(finalNotesMarkdown);
    setLoading(false);
  };