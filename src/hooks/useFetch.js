// import { useEffect, useState } from "react";

// export function useFetch(url) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const jsonData = await response.json();
//         setData(jsonData);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     }

//     fetchData();

//     // Cleanup function
//     return () => {
//       // Cleanup logic (if needed)
//     };
//   }, [url]); // Dependency array ensures that effect runs only when url changes

//   return { data, loading, error };
// }
