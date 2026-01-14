// Hook to manage authentication state

// import { useRouter } from "@tanstack/react-router";
// import { useEffect, useState } from "react";

// function useAuth() {
//   const router = useRouter();
//   const [user, setUser] = useState<null>(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       setUser(user);
//       router.invalidate();
//     });

//     return unsubscribe;
//   }, []);

//   return user;
// }
