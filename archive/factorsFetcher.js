// factorsFetcher.js
export async function fetchFactors() {
    try {
       const response = await fetch("./factors.json");
       if (!response.ok) {
          throw new Error("Network response was not ok");
       }
       const factors = await response.json();
       return factors;
    } catch (error) {
       console.error("Failed to load factors:", error);
       return {};
    }
 }
 