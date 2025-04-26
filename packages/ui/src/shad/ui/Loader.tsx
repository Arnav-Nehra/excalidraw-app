import {TailSpin } from "react-loader-spinner";
export const Loader = ()=>{
return( <div><TailSpin
  visible={true}
  height="20"
  width="20"
  color="#4fa94d"
  ariaLabel="tail-spin-loading"
  radius="1"
  wrapperStyle={{}}
  wrapperClass=""
  /></div>
)}