// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
var e=async(e,t={})=>{Array.isArray(t)&&(t=t[0]);const a=document.createElement("a");a.download=t.fileName||"Untitled",a.href=URL.createObjectURL(e),a.addEventListener("click",(()=>{setTimeout((()=>URL.revokeObjectURL(a.href)),3e4)})),a.click()};export{e as default};
