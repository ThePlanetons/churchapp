// import axios from "axios";
// import { useToast } from "@/hooks/use-toast";

// // Set up Axios instance
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // Your base URL here
//   // timeout: 10000, // Optional: Set a timeout for requests
// });

// const { toast } = useToast();

// // Request Interceptor - Add Authorization header before sending the request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Get the token from localStorage, context, or any other store
//     const token = localStorage.getItem("access_token"); // Assuming the token is stored in localStorage

//     if (token) {
//       // If a token exists, add the Authorization header to the request
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config; // Return the modified config object
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Handle successful response
//     return response;
//   },
//   (error) => {

//     // Check if the error was caused by no response from the server (network error)
//     if (error.request) {
//       console.error("No response received. The server might be unreachable.");

//       // Display a toast or handle the error however you need
//       toast({
//         variant: "destructive",
//         title: "Network Error",
//         description: "The server is not responding. Please check your network or API status.",
//       });
//     }

//     // Return the error so that it can be handled further in your app if needed
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



// axiosInstance.ts
import axios from "axios";

const createAxiosInstance = (toast: any) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Your base URL here
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      // Get the token from localStorage, context, or any other store
      const token = localStorage.getItem("access_token"); // Assuming the token is stored in localStorage

      if (token) {
        // If a token exists, add the Authorization header to the request
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config; // Return the modified config object
    },
    (error) => {
      // Handle request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Handle successful response
      return response;
    },
    (error) => {
      // Check if the error was caused by no response from the server (network error)
      if (error.request) {
        console.error("No response received. The server might be unreachable.");

        // Display a toast or handle the error
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "The server is not responding. Please check your network or API status.",
        });
      }

      // Handling 401 Unauthorized with specific messages
      if (error.response) {
        const { status, data } = error.response;

        // Handling 401 Unauthorized with specific messages
        if (status === 401) {
          // {
          //   "detail": "Authorization header must contain two space-delimited values",
          //   "code": "bad_authorization_header"
          // }
          if (data.code === "bad_authorization_header") {
            toast({
              variant: "destructive",
              title: "Error",
              description: "bad_authorization_header",
            });
          } else if (data.code === "token_not_valid") {
            // {
            //   "detail": "Given token not valid for any token type",
            //   "code": "token_not_valid",
            //   "messages": [
            //     {
            //       "token_class": "AccessToken",
            //       "token_type": "access",
            //       "message": "Token is invalid or expired"
            //     }
            //   ]
            // }
            toast({
              variant: "destructive",
              title: "Error",
              description: "Token is invalid or expired",
            });
          } else {
            // {"detail":"Authentication credentials were not provided."}
            toast({
              variant: "destructive",
              title: "Error",
              description: data.detail,
            });
          }
        }
      }

      // Return the error so that it can be handled further in your app if needed
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;