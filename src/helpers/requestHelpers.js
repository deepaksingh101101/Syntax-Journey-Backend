import  axios  from "axios";


const api=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    // baseURL:"https://43c1-2405-201-d03f-61ee-bce8-a669-5154-76a.ngrok-free.app",
    timeout:5000,
})


api.interceptors.request.use(function (config) {
  let access=JSON.parse(localStorage.getItem("user"))?.accessToken

  config.headers["Authorization"] = `Bearer ${access}`;


  return config;
}, function (error){
  // Do something with request error
  return Promise.reject(error);
});



// Add a response interceptor
api.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, async (error)=> {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log(error)

  return Promise.reject(error)
  

});



export const getApi=(method, url)=>{
  return api({
    method: method,
    url: url
    
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });
}

export const postApi = (method, url, data) => {
    return api({
      method: method,
      url: url,
       data
    }).then((response) => {
      return response;
    }).catch((error) => {
      return error;
    });
  }
  export const patchApi = (method, url, data) => {
    return api({
      method: method,
      url: url,
       data
    }).then((response) => {
      return response;
    }).catch((error) => {
      return error;
    })
  }
  
export const deleteApi=(method, url, data)=>{
  return api({
    method: method,
    url: url,
     data
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });
}
const putApi=()=>{

}


export async function uploadImage(url, data, config = {}) {
  return api
    // .post(url, { ...data }, { ...config })
    .post(url, data , { ...config })
    .then(response => response.data)
}