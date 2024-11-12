


const UploadFile=async (file)=> {
    const url=`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`;
    
 const formdata=new FormData();
 formdata.append('file',file);
 formdata.append('upload_preset',"whatsapp_clone");

 const response= await fetch(url,{
    method:"POST",
    body:formdata
 })
 if (!response.ok) {
    throw new Error('Upload failed');
}
 const  responsedata= await response.json();

 return responsedata;
}

export default UploadFile
